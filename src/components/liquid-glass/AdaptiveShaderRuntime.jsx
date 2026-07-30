'use client';

import { useEffect, useRef } from 'react';

import {
    modeSettings,
    parsePlatform,
    setRootMode,
} from './adaptive/capabilities';
import { createGpuRuntime } from './adaptive/gpu-runtime';
import { MAX_SURFACES } from './adaptive/shader-source';
import { collectSurfaces, isActuallyVisible } from './adaptive/surfaces';

export default function AdaptiveShaderRuntime() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!(canvas instanceof HTMLCanvasElement)) {
            return undefined;
        }

        let cancelled = false;
        let gpuRuntime = null;
        let animationFrame = null;
        let mutationObserver = null;
        let longTaskObserver = null;
        let recoveryTimer = null;
        let mode = 'uninitialized';
        let platform = parsePlatform();
        let shaderEligible = platform.shaderAllowed;
        let gpuLost = false;
        let needsSurfaceScan = true;
        let needsRectRefresh = true;
        let surfaces = [];
        const surfacesData = new Float32Array(MAX_SURFACES * 4);
        const surfacesMeta = new Float32Array(MAX_SURFACES * 4);
        let pointerX = window.innerWidth * 0.5;
        let pointerY = window.innerHeight * 0.35;
        let previousFrameTime = performance.now();
        let previousDrawTime = 0;
        let evaluationTime = previousFrameTime;
        let modeChangedAt = previousFrameTime;
        let warmupUntil = previousFrameTime + 4500;
        let ewmaFrame = 16.7;
        let jankFrames = 0;
        let sampledFrames = 0;
        let longTasks = 0;
        let stableWindows = 0;
        let badWindows = 0;
        let lastSurfaceScan = 0;

        const updateDiagnostics = (extra = {}) => {
            window.__RAF_GLASS_DIAGNOSTICS__ = {
                ...(window.__RAF_GLASS_DIAGNOSTICS__ || {}),
                platform: platform.platform,
                platformVersion: platform.version,
                platformReason: platform.reason,
                shaderEligible,
                gpuLost,
                averageFrameMs: Number(ewmaFrame.toFixed(2)),
                estimatedFps: Number((1000 / Math.max(ewmaFrame, 1)).toFixed(1)),
                ...extra,
            };
        };

        const applyMode = (nextMode, reason) => {
            if (mode === nextMode) {
                updateDiagnostics({ reason });
                return;
            }

            mode = nextMode;
            modeChangedAt = performance.now();
            stableWindows = 0;
            badWindows = 0;
            canvas.hidden = !mode.startsWith('shader');
            setRootMode(mode, {
                reason,
                gpuLost,
                shaderEligible,
                platform: platform.platform,
                platformVersion: platform.version,
                gpu: gpuRuntime?.gpu || null,
                gpuScore: gpuRuntime?.initial?.score ?? null,
                benchmarkMs: gpuRuntime ? Number(gpuRuntime.benchmarkMs.toFixed(2)) : null,
            });
            needsSurfaceScan = true;
            needsRectRefresh = true;
        };

        const degrade = (reason) => {
            if (mode === 'shader-high') applyMode('shader-medium', reason);
            else if (mode === 'shader-medium') applyMode('shader-low', reason);
            else if (mode === 'shader-low') applyMode('glass', reason);
            else if (mode === 'glass') applyMode('minimal', reason);
        };

        const upgrade = (reason) => {
            if (mode === 'minimal') {
                applyMode('glass', reason);
                return;
            }

            if (!shaderEligible || gpuLost || !gpuRuntime) {
                return;
            }

            if (mode === 'glass') applyMode('shader-low', reason);
            else if (mode === 'shader-low' && gpuRuntime.initial.score >= 6) {
                applyMode('shader-medium', reason);
            } else if (
                mode === 'shader-medium'
                && gpuRuntime.initial.score >= 10
                && !platform.isMobile
            ) {
                applyMode('shader-high', reason);
            }
        };

        const handleContextLost = (event) => {
            event.preventDefault();
            gpuLost = true;
            document.documentElement.classList.add('raf-gpu-lost');
            applyMode('glass', 'webgl-context-lost');
            updateDiagnostics({ gpuStatus: 'lost' });
        };

        const handleContextRestored = () => {
            gpuLost = false;
            document.documentElement.classList.remove('raf-gpu-lost');
            gpuRuntime?.destroy();
            gpuRuntime = null;
            window.setTimeout(() => {
                if (!cancelled) {
                    initializeGraphics('webgl-context-restored');
                }
            }, 220);
        };

        const initializeGraphics = (reason = 'initial-gpu-probe') => {
            if (!shaderEligible || cancelled) {
                applyMode('glass', platform.reason);
                return;
            }

            try {
                gpuRuntime?.destroy();
                gpuRuntime = createGpuRuntime(
                    canvas,
                    platform,
                    handleContextLost,
                    handleContextRestored,
                );
                gpuLost = false;
                document.documentElement.classList.remove('raf-gpu-lost');
                applyMode(
                    gpuRuntime.initial.mode,
                    `${reason}:${gpuRuntime.initial.reason}`,
                );
            } catch (error) {
                gpuRuntime = null;
                gpuLost = true;
                document.documentElement.classList.add('raf-gpu-lost');
                applyMode('glass', `${reason}:gpu-unavailable`);
                updateDiagnostics({
                    gpuError: error instanceof Error
                        ? error.message
                        : String(error),
                });
            }
        };

        const refreshSurfaceRects = (settings) => {
            if (needsSurfaceScan || performance.now() - lastSurfaceScan > 900) {
                surfaces = collectSurfaces(settings.maxSurfaces);
                lastSurfaceScan = performance.now();
                needsSurfaceScan = false;
            }

            surfacesData.fill(0);
            surfacesMeta.fill(0);

            const visible = [];
            for (const item of surfaces) {
                const rect = item.element.getBoundingClientRect();
                if (!isActuallyVisible(item.element, rect)) {
                    continue;
                }
                visible.push({ ...item, rect });
                if (visible.length >= settings.maxSurfaces) {
                    break;
                }
            }
            surfaces = visible;

            surfaces.forEach((item, index) => {
                const offset = index * 4;
                const hover =
                    pointerX >= item.rect.left
                    && pointerX <= item.rect.right
                    && pointerY >= item.rect.top
                    && pointerY <= item.rect.bottom;

                surfacesData[offset] = item.rect.left;
                surfacesData[offset + 1] = item.rect.top;
                surfacesData[offset + 2] = item.rect.width;
                surfacesData[offset + 3] = item.rect.height;
                surfacesMeta[offset] = item.radius;
                surfacesMeta[offset + 1] = item.element.hasAttribute(
                    'data-raf-large-glass',
                ) ? 0.82 : 1.0;
                surfacesMeta[offset + 2] = item.kind;
                surfacesMeta[offset + 3] = hover ? 1.0 : 0.0;
            });

            needsRectRefresh = false;
        };

        const resizeCanvas = (settings) => {
            const dpr = Math.min(window.devicePixelRatio || 1, settings.dprCap);
            const width = Math.max(1, Math.round(window.innerWidth * dpr));
            const height = Math.max(1, Math.round(window.innerHeight * dpr));

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                canvas.style.width = `${window.innerWidth}px`;
                canvas.style.height = `${window.innerHeight}px`;
                needsRectRefresh = true;
            }
        };

        const draw = (time) => {
            if (
                !gpuRuntime
                || !mode.startsWith('shader')
                || gpuRuntime.gl.isContextLost()
            ) {
                return;
            }

            const settings = modeSettings(mode);
            const minimumFrameInterval = 1000 / settings.fpsCap;
            if (time - previousDrawTime < minimumFrameInterval) {
                return;
            }
            previousDrawTime = time;

            resizeCanvas(settings);
            if (needsRectRefresh || needsSurfaceScan) {
                refreshSurfaceRects(settings);
            }

            const { gl, uniforms } = gpuRuntime;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.useProgram(gpuRuntime.program);
            gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
            gl.uniform2f(
                uniforms.viewport,
                window.innerWidth,
                window.innerHeight,
            );
            gl.uniform2f(uniforms.pointer, pointerX, pointerY);
            gl.uniform1f(uniforms.time, time * 0.001);
            gl.uniform1f(uniforms.scroll, window.scrollY || 0);
            gl.uniform1f(uniforms.strength, settings.strength);
            gl.uniform1i(uniforms.surfaceCount, surfaces.length);
            gl.uniform4fv(uniforms.surfaces, surfacesData);
            gl.uniform4fv(uniforms.surfaceMeta, surfacesMeta);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const evaluatePerformance = (time) => {
            if (time - evaluationTime < 2600) {
                return;
            }

            const jankRatio = sampledFrames > 0
                ? jankFrames / sampledFrames
                : 0;
            const shaderBad =
                ewmaFrame > 23.5
                || jankRatio > 0.095
                || longTasks >= 2;
            const cssBad =
                ewmaFrame > 30.5
                || jankRatio > 0.18
                || longTasks >= 4;
            const stable =
                ewmaFrame < 18.8
                && jankRatio < 0.035
                && longTasks === 0;

            updateDiagnostics({
                jankRatio: Number(jankRatio.toFixed(3)),
                longTasks,
                surfaceCount: surfaces.length,
            });

            if (time > warmupUntil) {
                if (mode.startsWith('shader') && shaderBad) {
                    badWindows += 1;
                    stableWindows = 0;
                    if (badWindows >= 2) {
                        degrade('adaptive-frame-jank');
                    }
                } else if (
                    (mode === 'glass' || mode === 'minimal')
                    && cssBad
                ) {
                    badWindows += 1;
                    stableWindows = 0;
                    if (badWindows >= 3) {
                        degrade('adaptive-css-jank');
                    }
                } else if (stable) {
                    stableWindows += 1;
                    badWindows = 0;
                    const cooldownPassed = time - modeChangedAt > 15000;
                    if (stableWindows >= 5 && cooldownPassed) {
                        upgrade('adaptive-stability-recovery');
                    }
                } else {
                    stableWindows = Math.max(0, stableWindows - 1);
                    badWindows = Math.max(0, badWindows - 1);
                }
            }

            evaluationTime = time;
            jankFrames = 0;
            sampledFrames = 0;
            longTasks = 0;
        };

        const frame = (time) => {
            if (cancelled) return;

            const delta = time - previousFrameTime;
            previousFrameTime = time;

            if (!document.hidden && delta > 0 && delta < 250) {
                ewmaFrame = ewmaFrame * 0.92 + delta * 0.08;
                sampledFrames += 1;
                if (delta > 34) jankFrames += 1;
            }

            if (!document.hidden) {
                draw(time);
                evaluatePerformance(time);
            }

            animationFrame = window.requestAnimationFrame(frame);
        };

        const handlePointerMove = (event) => {
            if (event.pointerType === 'touch') return;
            pointerX = event.clientX;
            pointerY = event.clientY;
            needsRectRefresh = true;
        };

        const handleScroll = () => {
            needsRectRefresh = true;
        };

        const handleResize = () => {
            needsSurfaceScan = true;
            needsRectRefresh = true;
        };

        const handleVisibility = () => {
            previousFrameTime = performance.now();
            warmupUntil = Math.max(
                warmupUntil,
                previousFrameTime + 1000,
            );
        };

        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        const handleReducedMotion = () => {
            if (reducedMotion.matches) {
                shaderEligible = false;
                applyMode('minimal', 'prefers-reduced-motion');
            } else {
                platform = parsePlatform();
                shaderEligible = platform.shaderAllowed;
                initializeGraphics('reduced-motion-disabled');
            }
        };

        document.addEventListener('pointermove', handlePointerMove, {
            passive: true,
        });
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility, {
            passive: true,
        });
        reducedMotion.addEventListener?.('change', handleReducedMotion);

        mutationObserver = new MutationObserver((mutations) => {
            const hasRelevantMutation = mutations.some((mutation) => {
                const target = mutation.target;

                if (!(target instanceof Element)) {
                    return true;
                }

                /*
                 * The Header/Navbar optical pipeline updates pointer sheen,
                 * SDF maps and pill DOM independently. None of those changes
                 * affect the procedural WebGL surface list, so rescanning on
                 * every pointer frame would waste work and cause flicker.
                 */
                if (
                    target.closest(
                        '[data-raf-native-refraction="true"]',
                    )
                ) {
                    return false;
                }

                return true;
            });

            if (!hasRelevantMutation) {
                return;
            }

            needsSurfaceScan = true;
            needsRectRefresh = true;
        });
        mutationObserver.observe(
            document.querySelector('#raf-liquid-root') || document.body,
            {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [
                    'class',
                    'style',
                    'hidden',
                    'aria-hidden',
                ],
            },
        );

        try {
            longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration >= 50) longTasks += 1;
                }
            });
            longTaskObserver.observe({ type: 'longtask', buffered: true });
        } catch {
            longTaskObserver = null;
        }

        if (reducedMotion.matches) {
            shaderEligible = false;
            applyMode('minimal', 'prefers-reduced-motion');
        } else {
            initializeGraphics();
        }

        recoveryTimer = window.setInterval(() => {
            if (cancelled || !shaderEligible || document.hidden) return;
            if (gpuRuntime?.gl && !gpuRuntime.gl.isContextLost()) return;
            initializeGraphics('gpu-watchdog-retry');
        }, 8000);

        animationFrame = window.requestAnimationFrame(frame);

        return () => {
            cancelled = true;
            window.cancelAnimationFrame(animationFrame);
            window.clearInterval(recoveryTimer);
            mutationObserver?.disconnect();
            longTaskObserver?.disconnect();
            gpuRuntime?.destroy();
            document.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener(
                'visibilitychange',
                handleVisibility,
            );
            reducedMotion.removeEventListener?.(
                'change',
                handleReducedMotion,
            );
            document.documentElement.classList.remove(
                'raf-glass-shader',
                'raf-glass-fallback',
                'raf-glass-minimal',
                'raf-gpu-lost',
            );
            delete document.documentElement.dataset.rafGlassMode;
            delete document.documentElement.dataset.rafShaderQuality;
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="raf-adaptive-shader-canvas"
            aria-hidden="true"
        />
    );
}
