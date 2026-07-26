'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import styles from './GlobalPointerEffects.module.css';

const DESKTOP_IDLE_DELAY = 220;
const HOVER_WAVE_DURATION = 2600;
const PRESS_WAVE_DURATION = 1100;

const LONG_PRESS_ARM_DELAY = 420;
const LONG_PRESS_CHARGE_DURATION = 520;
const TOUCH_MOVE_TOLERANCE = 14;

const PLASMA_POINT_COUNT = 11;
const PLASMA_FRAME_INTERVAL = 1000 / 30;
const PLASMA_FLOW_DURATION = 2800;
const PLASMA_FADE_DURATION = 280;

const TEXT_SELECTOR = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'span',
    'strong',
    'small',
    'label',
    'a',
    'button',
    'li',
].join(',');

function parseRgb(color) {
    if (!color) {
        return null;
    }

    const match = color.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i
    );

    if (!match) {
        return null;
    }

    return {
        red: Number(match[1]),
        green: Number(match[2]),
        blue: Number(match[3]),
    };
}

function channelToLinear(channel) {
    const normalized = channel / 255;

    return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow(
            (normalized + 0.055) / 1.055,
            2.4
        );
}

function getLuminance(rgb) {
    if (!rgb) {
        return 0;
    }

    return (
        channelToLinear(rgb.red) * 0.2126 +
        channelToLinear(rgb.green) * 0.7152 +
        channelToLinear(rgb.blue) * 0.0722
    );
}

function isTransparentColor(color) {
    return (
        !color ||
        color === 'transparent' ||
        color === 'rgba(0, 0, 0, 0)'
    );
}

function findVisibleBackground(element) {
    let currentElement = element;

    while (
        currentElement &&
        currentElement instanceof Element
        ) {
        const style =
            window.getComputedStyle(currentElement);

        if (
            !isTransparentColor(
                style.backgroundColor
            )
        ) {
            return style.backgroundColor;
        }

        currentElement =
            currentElement.parentElement;
    }

    return 'rgb(0, 0, 0)';
}

function resolveEffectColor(clientX, clientY) {
    const target = document.elementFromPoint(
        clientX,
        clientY
    );

    if (!(target instanceof Element)) {
        return '255, 255, 255';
    }

    const textElement =
        target.closest(TEXT_SELECTOR);

    if (textElement) {
        const textStyle =
            window.getComputedStyle(textElement);

        const textLuminance = getLuminance(
            parseRgb(textStyle.color)
        );

        if (textLuminance > 0.68) {
            return '78, 78, 78';
        }
    }

    const backgroundColor =
        findVisibleBackground(target);

    const backgroundLuminance =
        getLuminance(
            parseRgb(backgroundColor)
        );

    if (backgroundLuminance > 0.56) {
        return '82, 82, 82';
    }

    return '255, 255, 255';
}

function isTouchLikePointer(event) {
    return (
        event.pointerType === 'touch' ||
        event.pointerType === 'pen'
    );
}

function clamp(value, minimum, maximum) {
    return Math.min(
        maximum,
        Math.max(minimum, value)
    );
}

function smoothstep(edgeStart, edgeEnd, value) {
    const normalized = clamp(
        (value - edgeStart) /
        (edgeEnd - edgeStart),
        0,
        1
    );

    return (
        normalized *
        normalized *
        (3 - 2 * normalized)
    );
}

function createPlasmaProfile() {
    let accumulatedOffset = 0;

    return Array.from(
        { length: PLASMA_POINT_COUNT },
        (_, index) => {
            const progress =
                index /
                (PLASMA_POINT_COUNT - 1);

            const endpointFactor =
                Math.sin(Math.PI * progress);

            accumulatedOffset +=
                (Math.random() - 0.5) * 16;

            accumulatedOffset *= 0.72;

            return {
                baseOffset:
                    accumulatedOffset *
                    endpointFactor,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                secondaryPhase:
                    Math.random() *
                    Math.PI *
                    2,

                frequency:
                    0.0024 +
                    Math.random() * 0.002,

                secondaryFrequency:
                    0.004 +
                    Math.random() * 0.003,

                jitter:
                    2.2 +
                    Math.random() * 4.5,

                microJitter:
                    0.5 +
                    Math.random() * 1.8,
            };
        }
    );
}

function createPlasmaPoints(profile, time) {
    const startX = 100;
    const startY = 112;
    const endX = 100;
    const endY = 6;

    return profile.map((point, index) => {
        const progress =
            index /
            (profile.length - 1);

        const envelope =
            Math.sin(Math.PI * progress);

        const largeMotion =
            Math.sin(
                time * point.frequency +
                point.phase
            ) * point.jitter;

        const smallMotion =
            Math.sin(
                time *
                point.secondaryFrequency +
                point.secondaryPhase
            ) * point.microJitter;

        const slowDrift =
            Math.sin(
                time * 0.00075 +
                point.secondaryPhase
            ) *
            2.5 *
            envelope;

        const randomLookingOffset =
            (
                point.baseOffset +
                largeMotion +
                smallMotion +
                slowDrift
            ) *
            envelope;

        return {
            x:
                startX +
                (endX - startX) * progress +
                randomLookingOffset,

            y:
                startY +
                (endY - startY) * progress,
        };
    });
}

function createSmoothPlasmaPath(points) {
    if (points.length < 2) {
        return '';
    }

    let path =
        `M ${points[0].x.toFixed(2)} ` +
        `${points[0].y.toFixed(2)}`;

    for (
        let index = 0;
        index < points.length - 1;
        index += 1
    ) {
        const previous =
            points[index - 1] ??
            points[index];

        const current = points[index];
        const next = points[index + 1];

        const following =
            points[index + 2] ??
            next;

        const controlOneX =
            current.x +
            (next.x - previous.x) / 6;

        const controlOneY =
            current.y +
            (next.y - previous.y) / 6;

        const controlTwoX =
            next.x -
            (following.x - current.x) / 6;

        const controlTwoY =
            next.y -
            (following.y - current.y) / 6;

        path +=
            ` C ${controlOneX.toFixed(2)} ` +
            `${controlOneY.toFixed(2)}, ` +
            `${controlTwoX.toFixed(2)} ` +
            `${controlTwoY.toFixed(2)}, ` +
            `${next.x.toFixed(2)} ` +
            `${next.y.toFixed(2)}`;
    }

    return path;
}

export default function GlobalPointerEffects() {
    const effectRootRef = useRef(null);

    const idleTimerRef = useRef(null);
    const waveIdRef = useRef(0);
    const waveTimersRef = useRef(new Map());
    const longPressTimerRef = useRef(null);
    const animationFrameRef = useRef(null);

    const plasmaAnimationFrameRef = useRef(null);
    const plasmaFadeTimerRef = useRef(null);
    const plasmaProfileRef = useRef(null);
    const plasmaFlowStartedAtRef = useRef(0);
    const plasmaLastFrameAtRef = useRef(0);
    const plasmaIsActiveRef = useRef(false);

    const plasmaOuterPathRef = useRef(null);
    const plasmaGlowPathRef = useRef(null);
    const plasmaCorePathRef = useRef(null);
    const plasmaParticleRef = useRef(null);
    const plasmaParticleHaloRef = useRef(null);
    const plasmaContactGlowRef = useRef(null);
    const plasmaContactSurfaceRef = useRef(null);

    const pointerDownRef = useRef(false);
    const activePointerIdRef = useRef(null);

    const lastPointerRef = useRef({
        x: 0,
        y: 0,
    });

    const pressOriginRef = useRef({
        x: 0,
        y: 0,
    });

    const [waves, setWaves] =
        useState([]);

    const [charging, setCharging] =
        useState(false);

    const [plasmaActive, setPlasmaActive] =
        useState(false);

    const [plasmaFading, setPlasmaFading] =
        useState(false);

    const clearIdleTimer = useCallback(() => {
        if (idleTimerRef.current !== null) {
            window.clearTimeout(
                idleTimerRef.current
            );

            idleTimerRef.current = null;
        }
    }, []);

    const clearAllWaveTimers = useCallback(() => {
        waveTimersRef.current.forEach((timerId) => {
            window.clearTimeout(timerId);
        });

        waveTimersRef.current.clear();
    }, []);

    const clearLongPressTimer =
        useCallback(() => {
            if (
                longPressTimerRef.current !==
                null
            ) {
                window.clearTimeout(
                    longPressTimerRef.current
                );

                longPressTimerRef.current =
                    null;
            }
        }, []);

    const updateEffectPosition =
        useCallback((clientX, clientY) => {
            const effectRoot =
                effectRootRef.current;

            if (!effectRoot) {
                return;
            }

            effectRoot.style.setProperty(
                '--effect-x',
                `${clientX}px`
            );

            effectRoot.style.setProperty(
                '--effect-y',
                `${clientY}px`
            );
        }, []);

    const schedulePositionUpdate =
        useCallback(
            (clientX, clientY) => {
                lastPointerRef.current = {
                    x: clientX,
                    y: clientY,
                };

                if (
                    animationFrameRef.current !==
                    null
                ) {
                    return;
                }

                animationFrameRef.current =
                    window.requestAnimationFrame(
                        () => {
                            animationFrameRef.current =
                                null;

                            const position =
                                lastPointerRef.current;

                            updateEffectPosition(
                                position.x,
                                position.y
                            );
                        }
                    );
            },
            [updateEffectPosition]
        );

    const updateEffectColor =
        useCallback((clientX, clientY) => {
            const effectRoot =
                effectRootRef.current;

            if (!effectRoot) {
                return;
            }

            const rgb = resolveEffectColor(
                clientX,
                clientY
            );

            effectRoot.style.setProperty(
                '--effect-rgb',
                rgb
            );
        }, []);

    const startWave = useCallback(
        (
            clientX,
            clientY,
            mode = 'hover'
        ) => {
            const waveId =
                waveIdRef.current + 1;

            waveIdRef.current = waveId;

            const duration =
                mode === 'press'
                    ? PRESS_WAVE_DURATION
                    : HOVER_WAVE_DURATION;

            const wave = {
                id: waveId,
                x: clientX,
                y: clientY,
                rgb: resolveEffectColor(
                    clientX,
                    clientY
                ),
                mode,
            };

            setWaves((currentWaves) => [
                ...currentWaves,
                wave,
            ]);

            const timerId =
                window.setTimeout(() => {
                    setWaves((currentWaves) =>
                        currentWaves.filter(
                            (currentWave) =>
                                currentWave.id !==
                                waveId
                        )
                    );

                    waveTimersRef.current.delete(
                        waveId
                    );
                }, duration);

            waveTimersRef.current.set(
                waveId,
                timerId
            );
        },
        []
    );

    const stopPlasmaAnimation =
        useCallback(() => {
            if (
                plasmaAnimationFrameRef.current !==
                null
            ) {
                window.cancelAnimationFrame(
                    plasmaAnimationFrameRef.current
                );

                plasmaAnimationFrameRef.current =
                    null;
            }
        }, []);

    const cancelPlasma = useCallback(() => {
        clearLongPressTimer();

        pointerDownRef.current = false;
        activePointerIdRef.current = null;

        setCharging(false);

        const wasActive =
            plasmaIsActiveRef.current;

        plasmaIsActiveRef.current = false;

        setPlasmaActive(false);
        stopPlasmaAnimation();

        if (plasmaFadeTimerRef.current !== null) {
            window.clearTimeout(
                plasmaFadeTimerRef.current
            );

            plasmaFadeTimerRef.current = null;
        }

        if (wasActive) {
            setPlasmaFading(true);

            plasmaFadeTimerRef.current =
                window.setTimeout(() => {
                    setPlasmaFading(false);

                    plasmaFadeTimerRef.current =
                        null;
                }, PLASMA_FADE_DURATION);
        } else {
            setPlasmaFading(false);
        }
    }, [
        clearLongPressTimer,
        stopPlasmaAnimation,
    ]);

    useEffect(() => {
        if (!plasmaActive) {
            return undefined;
        }

        plasmaProfileRef.current =
            createPlasmaProfile();

        plasmaFlowStartedAtRef.current =
            performance.now();

        plasmaLastFrameAtRef.current = 0;

        const renderPlasmaFrame = (time) => {
            if (!plasmaIsActiveRef.current) {
                return;
            }

            plasmaAnimationFrameRef.current =
                window.requestAnimationFrame(
                    renderPlasmaFrame
                );

            if (
                time -
                plasmaLastFrameAtRef.current <
                PLASMA_FRAME_INTERVAL
            ) {
                return;
            }

            plasmaLastFrameAtRef.current = time;

            const profile =
                plasmaProfileRef.current;

            if (!profile) {
                return;
            }

            const points =
                createPlasmaPoints(
                    profile,
                    time
                );

            const pathData =
                createSmoothPlasmaPath(points);

            const pathElements = [
                plasmaOuterPathRef.current,
                plasmaGlowPathRef.current,
                plasmaCorePathRef.current,
            ];

            pathElements.forEach((pathElement) => {
                if (pathElement) {
                    pathElement.setAttribute(
                        'd',
                        pathData
                    );
                }
            });

            const measurementPath =
                plasmaCorePathRef.current;

            if (!measurementPath) {
                return;
            }

            let totalLength = 0;

            try {
                totalLength =
                    measurementPath.getTotalLength();
            } catch {
                return;
            }

            if (!Number.isFinite(totalLength)) {
                return;
            }

            const elapsed =
                time -
                plasmaFlowStartedAtRef.current;

            const rawProgress =
                (
                    elapsed %
                    PLASMA_FLOW_DURATION
                ) /
                PLASMA_FLOW_DURATION;

            const flowingProgress = clamp(
                rawProgress -
                0.024 *
                Math.sin(
                    rawProgress *
                    Math.PI *
                    6
                ) -
                0.011 *
                Math.sin(
                    rawProgress *
                    Math.PI *
                    10 +
                    0.7
                ),
                0,
                1
            );

            const point =
                measurementPath.getPointAtLength(
                    totalLength *
                    flowingProgress
                );

            const particle =
                plasmaParticleRef.current;

            const particleHalo =
                plasmaParticleHaloRef.current;

            if (particle) {
                particle.setAttribute(
                    'cx',
                    point.x.toFixed(2)
                );

                particle.setAttribute(
                    'cy',
                    point.y.toFixed(2)
                );
            }

            if (particleHalo) {
                particleHalo.setAttribute(
                    'cx',
                    point.x.toFixed(2)
                );

                particleHalo.setAttribute(
                    'cy',
                    point.y.toFixed(2)
                );
            }

            const contactIntensity =
                smoothstep(
                    0.72,
                    0.98,
                    flowingProgress
                );

            const topPoint =
                points[points.length - 1];

            const contactGlow =
                plasmaContactGlowRef.current;

            if (contactGlow) {
                contactGlow.setAttribute(
                    'cx',
                    topPoint.x.toFixed(2)
                );

                contactGlow.setAttribute(
                    'cy',
                    topPoint.y.toFixed(2)
                );

                contactGlow.setAttribute(
                    'rx',
                    (
                        8 +
                        contactIntensity * 20
                    ).toFixed(2)
                );

                contactGlow.setAttribute(
                    'ry',
                    (
                        3 +
                        contactIntensity * 7
                    ).toFixed(2)
                );

                contactGlow.style.opacity =
                    String(
                        0.08 +
                        contactIntensity * 0.78
                    );
            }

            const contactSurface =
                plasmaContactSurfaceRef.current;

            if (contactSurface) {
                const halfWidth =
                    5 +
                    contactIntensity * 25;

                const contactPath =
                    `M ${(topPoint.x - halfWidth).toFixed(2)} ` +
                    `${(topPoint.y + 1.5).toFixed(2)} ` +
                    `Q ${topPoint.x.toFixed(2)} ` +
                    `${(topPoint.y - 4).toFixed(2)} ` +
                    `${(topPoint.x + halfWidth).toFixed(2)} ` +
                    `${(topPoint.y + 1.5).toFixed(2)}`;

                contactSurface.setAttribute(
                    'd',
                    contactPath
                );

                contactSurface.style.opacity =
                    String(
                        contactIntensity * 0.72
                    );
            }
        };

        plasmaAnimationFrameRef.current =
            window.requestAnimationFrame(
                renderPlasmaFrame
            );

        return () => {
            stopPlasmaAnimation();
        };
    }, [
        plasmaActive,
        stopPlasmaAnimation,
    ]);

    useEffect(() => {
        const handlePointerMove = (event) => {
            schedulePositionUpdate(
                event.clientX,
                event.clientY
            );

            if (event.pointerType === 'mouse') {
                clearIdleTimer();

                const idleX = event.clientX;
                const idleY = event.clientY;

                idleTimerRef.current =
                    window.setTimeout(() => {
                        const latest =
                            lastPointerRef.current;

                        const distance =
                            Math.hypot(
                                latest.x - idleX,
                                latest.y - idleY
                            );

                        if (distance <= 1.5) {
                            startWave(
                                latest.x,
                                latest.y,
                                'hover'
                            );
                        }

                        idleTimerRef.current =
                            null;
                    }, DESKTOP_IDLE_DELAY);
            }

            if (
                pointerDownRef.current &&
                event.pointerId ===
                activePointerIdRef.current
            ) {
                const deltaX =
                    event.clientX -
                    pressOriginRef.current.x;

                const deltaY =
                    event.clientY -
                    pressOriginRef.current.y;

                const distance = Math.hypot(
                    deltaX,
                    deltaY
                );

                if (
                    isTouchLikePointer(event) &&
                    distance >
                    TOUCH_MOVE_TOLERANCE
                ) {
                    cancelPlasma();
                }
            }
        };

        const handlePointerDown = (event) => {
            if (
                event.pointerType === 'mouse' &&
                event.button !== 0
            ) {
                return;
            }

            clearLongPressTimer();

            if (plasmaFadeTimerRef.current !== null) {
                window.clearTimeout(
                    plasmaFadeTimerRef.current
                );

                plasmaFadeTimerRef.current = null;
            }

            setPlasmaFading(false);

            schedulePositionUpdate(
                event.clientX,
                event.clientY
            );

            updateEffectPosition(
                event.clientX,
                event.clientY
            );

            updateEffectColor(
                event.clientX,
                event.clientY
            );

            pointerDownRef.current = true;

            activePointerIdRef.current =
                event.pointerId;

            pressOriginRef.current = {
                x: event.clientX,
                y: event.clientY,
            };

            startWave(
                event.clientX,
                event.clientY,
                'press'
            );

            setCharging(false);
            setPlasmaActive(false);
            plasmaIsActiveRef.current = false;

            longPressTimerRef.current =
                window.setTimeout(() => {
                    if (!pointerDownRef.current) {
                        return;
                    }

                    setCharging(true);

                    longPressTimerRef.current =
                        window.setTimeout(() => {
                            if (
                                !pointerDownRef.current
                            ) {
                                return;
                            }

                            plasmaIsActiveRef.current =
                                true;

                            setPlasmaFading(false);
                            setPlasmaActive(true);

                            longPressTimerRef.current =
                                null;
                        }, LONG_PRESS_CHARGE_DURATION);
                }, LONG_PRESS_ARM_DELAY);
        };

        const handlePointerUp = (event) => {
            if (
                activePointerIdRef.current !==
                null &&
                event.pointerId !==
                activePointerIdRef.current
            ) {
                return;
            }

            cancelPlasma();
        };

        const handlePointerCancel =
            handlePointerUp;

        const handleMouseLeave = () => {
            clearIdleTimer();
        };

        const handleWindowBlur = () => {
            clearIdleTimer();
            cancelPlasma();
        };

        window.addEventListener(
            'pointermove',
            handlePointerMove,
            { passive: true }
        );

        window.addEventListener(
            'pointerdown',
            handlePointerDown,
            { passive: true }
        );

        window.addEventListener(
            'pointerup',
            handlePointerUp,
            { passive: true }
        );

        window.addEventListener(
            'pointercancel',
            handlePointerCancel,
            { passive: true }
        );

        document.documentElement.addEventListener(
            'mouseleave',
            handleMouseLeave
        );

        window.addEventListener(
            'blur',
            handleWindowBlur
        );

        return () => {
            clearIdleTimer();
            clearAllWaveTimers();
            clearLongPressTimer();
            stopPlasmaAnimation();

            if (
                animationFrameRef.current !==
                null
            ) {
                window.cancelAnimationFrame(
                    animationFrameRef.current
                );
            }

            if (
                plasmaFadeTimerRef.current !==
                null
            ) {
                window.clearTimeout(
                    plasmaFadeTimerRef.current
                );
            }

            window.removeEventListener(
                'pointermove',
                handlePointerMove
            );

            window.removeEventListener(
                'pointerdown',
                handlePointerDown
            );

            window.removeEventListener(
                'pointerup',
                handlePointerUp
            );

            window.removeEventListener(
                'pointercancel',
                handlePointerCancel
            );

            document.documentElement.removeEventListener(
                'mouseleave',
                handleMouseLeave
            );

            window.removeEventListener(
                'blur',
                handleWindowBlur
            );
        };
    }, [
        cancelPlasma,
        clearAllWaveTimers,
        clearIdleTimer,
        clearLongPressTimer,
        schedulePositionUpdate,
        startWave,
        stopPlasmaAnimation,
        updateEffectColor,
        updateEffectPosition,
    ]);

    return (
        <div
            ref={effectRootRef}
            className={styles.effectRoot}
            aria-hidden="true"
        >
            {waves.map((wave) => (
                <div
                    key={wave.id}
                    className={styles.waveContainer}
                    style={{
                        '--wave-x': `${wave.x}px`,
                        '--wave-y': `${wave.y}px`,
                        '--wave-rgb': wave.rgb,
                    }}
                >
                    <span
                        className={styles.waveGlow}
                    />

                    {wave.mode === 'press' ? (
                        <span
                            className={styles.pressWave}
                        />
                    ) : (
                        <>
                            <span
                                className={styles.waveFirst}
                            />

                            <span
                                className={styles.waveSecond}
                            />

                            <span
                                className={styles.waveThird}
                            />
                        </>
                    )}
                </div>
            ))}

            {(
                charging ||
                plasmaActive ||
                plasmaFading
            ) && (
                <div
                    className={`
                        ${styles.plasmaContainer}
                        ${
                        plasmaActive
                            ? styles.plasmaContainerActive
                            : ''
                    }
                        ${
                        plasmaFading
                            ? styles.plasmaContainerFading
                            : ''
                    }
                    `}
                >
                    <span
                        className={styles.plasmaChargeTrack}
                    />

                    <span
                        className={styles.plasmaChargeFill}
                    />

                    <span
                        className={styles.plasmaCenter}
                    />

                    <svg
                        className={styles.plasmaLightning}
                        viewBox="0 0 200 120"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient
                                id="global-plasma-line-gradient"
                                x1="0"
                                y1="1"
                                x2="0"
                                y2="0"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="white"
                                    stopOpacity="0.24"
                                />

                                <stop
                                    offset="48%"
                                    stopColor="white"
                                    stopOpacity="0.7"
                                />

                                <stop
                                    offset="100%"
                                    stopColor="white"
                                    stopOpacity="1"
                                />
                            </linearGradient>

                            <filter
                                id="global-plasma-soft-blur"
                                x="-100%"
                                y="-100%"
                                width="300%"
                                height="300%"
                            >
                                <feGaussianBlur
                                    stdDeviation="4.5"
                                />
                            </filter>

                            <filter
                                id="global-plasma-particle-blur"
                                x="-200%"
                                y="-200%"
                                width="500%"
                                height="500%"
                            >
                                <feGaussianBlur
                                    stdDeviation="3.2"
                                />
                            </filter>

                            <filter
                                id="global-plasma-contact-blur"
                                x="-100%"
                                y="-300%"
                                width="300%"
                                height="700%"
                            >
                                <feGaussianBlur
                                    stdDeviation="5.5"
                                />
                            </filter>
                        </defs>

                        <path
                            ref={plasmaOuterPathRef}
                            className={styles.plasmaPathOuter}
                        />

                        <path
                            ref={plasmaGlowPathRef}
                            className={styles.plasmaPathGlow}
                        />

                        <path
                            ref={plasmaCorePathRef}
                            className={styles.plasmaPathCore}
                        />

                        <circle
                            ref={plasmaParticleHaloRef}
                            className={styles.plasmaParticleHalo}
                            r="8"
                        />

                        <circle
                            ref={plasmaParticleRef}
                            className={styles.plasmaParticle}
                            r="2.1"
                        />

                        <ellipse
                            ref={plasmaContactGlowRef}
                            className={styles.plasmaContactGlow}
                            cx="100"
                            cy="6"
                            rx="8"
                            ry="3"
                        />

                        <path
                            ref={plasmaContactSurfaceRef}
                            className={styles.plasmaContactSurface}
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}