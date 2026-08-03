'use client';

import { useEffect } from 'react';

import { createRefractionMap } from './refraction-map';

const TRANSPARENT_PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const MAP_CACHE_LIMIT = 12;
const MAP_CACHE = new Map();

const ACTIVE_FILTERS = [
    {
        key: 'header',
        selector: '[data-raf-refraction-target="header-shell"]',
        filterId: 'raf-header-warp',
        imageId: 'raf-header-map',
        displacementId: 'raf-header-displacement',
        margin: 28,
        bandRatio: 0.48,
        profileShape: 3.2,
        edgePower: 1.16,
        bodyStrength: 0.16,
        normalStrength: 1.04,
        shoulderStrength: 0.24,
        shoulderPosition: 0.57,
        shoulderWidth: 0.19,
        bodyLensStrength: 0.2,
        bodyLensPower: 0.94,
        horizontalLensScale: 0.72,
        verticalLensScale: 1.12,
        mapMode: 'vertical-surface',
        edgeBand: 13,
        edgeStrength: 0.045,
        centerStrength: 0.064,
        centerPower: 1.08,
        verticalStrength: 0,
        verticalBendStrength: 0.62,
        verticalBendPower: 0.72,
        verticalEdgeStrength: 0.22,
        sideBendStrength: 0.058,
        scaleRatio: 0.92,
        minScale: 42,
        maxScale: 62,
    },
    {
        key: 'pill',
        selector: '[data-raf-refraction-target="navbar-pill"]',
        filterId: 'raf-navbar-pill-warp',
        imageId: 'raf-navbar-pill-map',
        displacementId: 'raf-navbar-pill-displacement',
        margin: 22,
        bandRatio: 0.5,
        profileShape: 2.8,
        edgePower: 1.08,
        bodyStrength: 0.22,
        normalStrength: 1.28,
        shoulderStrength: 0.34,
        shoulderPosition: 0.54,
        shoulderWidth: 0.17,
        bodyLensStrength: 0.34,
        bodyLensPower: 0.86,
        horizontalLensScale: 0.82,
        verticalLensScale: 1.16,
        scaleRatio: 1.18,
        minScale: 48,
        maxScale: 66,
    },
];

const clamp = (value, min, max) => (
    Math.min(max, Math.max(min, value))
);

function setHref(element, value) {
    element.setAttribute('href', value);
    element.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        value,
    );
}

function isAppleMobileDevice() {
    const userAgent = navigator.userAgent || '';
    const classicIos = /iPhone|iPad|iPod/i.test(userAgent);
    const modernIpad =
        navigator.platform === 'MacIntel'
        && navigator.maxTouchPoints > 1;

    return classicIos || modernIpad;
}

function shouldEnableRefraction() {
    const narrow = window.matchMedia('(max-width: 1099px)').matches;
    const finePointer = window.matchMedia(
        '(hover: hover) and (pointer: fine)',
    ).matches;
    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;
    const reducedTransparency = window.matchMedia(
        '(prefers-reduced-transparency: reduce)',
    ).matches;
    const saveData = navigator.connection?.saveData === true;
    const cores = navigator.hardwareConcurrency || 8;
    const memory = navigator.deviceMemory || 8;
    const lowPowerDevice = cores <= 4 || memory <= 4;

    return (
        !narrow
        && finePointer
        && !reducedMotion
        && !reducedTransparency
        && !saveData
        && !lowPowerDevice
        && !isAppleMobileDevice()
    );
}

function rememberMap(key, map) {
    if (MAP_CACHE.has(key)) {
        MAP_CACHE.delete(key);
    }

    MAP_CACHE.set(key, map);

    while (MAP_CACHE.size > MAP_CACHE_LIMIT) {
        const oldestKey = MAP_CACHE.keys().next().value;
        MAP_CACHE.delete(oldestKey);
    }
}

function getMap(config, width, height, radius) {
    const cacheKey = [
        config.key,
        width,
        height,
        Math.round(radius * 2) / 2,
    ].join(':');

    const cached = MAP_CACHE.get(cacheKey);
    if (cached) {
        MAP_CACHE.delete(cacheKey);
        MAP_CACHE.set(cacheKey, cached);
        return cached;
    }

    const map = createRefractionMap({
        width,
        height,
        radius,
        margin: config.margin,
        band: Math.max(8, height * config.bandRatio),
        profileShape: config.profileShape,
        edgePower: config.edgePower,
        bodyStrength: config.bodyStrength,
        normalStrength: config.normalStrength,
        shoulderStrength: config.shoulderStrength,
        shoulderPosition: config.shoulderPosition,
        shoulderWidth: config.shoulderWidth,
        bodyLensStrength: config.bodyLensStrength,
        bodyLensPower: config.bodyLensPower,
        horizontalLensScale: config.horizontalLensScale,
        verticalLensScale: config.verticalLensScale,
        mode: config.mapMode,
        edgeBand: config.edgeBand,
        edgeStrength: config.edgeStrength,
        centerStrength: config.centerStrength,
        centerPower: config.centerPower,
        verticalStrength: config.verticalStrength,
        verticalBendStrength: config.verticalBendStrength,
        verticalBendPower: config.verticalBendPower,
        verticalEdgeStrength: config.verticalEdgeStrength,
        sideBendStrength: config.sideBendStrength,
    });

    if (map) {
        rememberMap(cacheKey, map);
    }

    return map;
}

function updateFilter(config, target) {
    if (!(target instanceof HTMLElement) || document.hidden) {
        return;
    }

    const width = Math.round(target.offsetWidth);
    const height = Math.round(target.offsetHeight);

    if (width < 8 || height < 8) {
        return;
    }

    const radius = Number.parseFloat(
        window.getComputedStyle(target).borderTopLeftRadius,
    ) || height * 0.5;

    const map = getMap(config, width, height, radius);
    if (!map) {
        return;
    }

    const filter = document.getElementById(config.filterId);
    const image = document.getElementById(config.imageId);
    const displacement = document.getElementById(config.displacementId);

    if (
        !(filter instanceof SVGElement)
        || !(image instanceof SVGElement)
        || !(displacement instanceof SVGElement)
    ) {
        return;
    }

    setHref(image, map.dataUrl);

    const x = -map.margin;
    const y = -map.margin;

    filter.setAttribute('x', String(x));
    filter.setAttribute('y', String(y));
    filter.setAttribute('width', String(map.width));
    filter.setAttribute('height', String(map.height));

    image.setAttribute('x', String(x));
    image.setAttribute('y', String(y));
    image.setAttribute('width', String(map.width));
    image.setAttribute('height', String(map.height));

    const scale = Math.round(
        clamp(
            height * config.scaleRatio,
            config.minScale,
            config.maxScale,
        ),
    );

    displacement.setAttribute('scale', String(scale));
    target.dataset.rafRefractionReady = 'true';
}

function scheduleIdle(callback) {
    if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(callback, { timeout: 180 });
        return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(callback, 16);
    return () => window.clearTimeout(id);
}

function attachFilter(config, target) {
    let frame = 0;
    let cancelIdle = null;
    let lastSize = '';
    let disposed = false;

    const performUpdate = () => {
        frame = 0;

        if (disposed || !target.isConnected || document.hidden) {
            return;
        }

        const size = `${target.offsetWidth}x${target.offsetHeight}`;
        if (
            size === lastSize
            && target.dataset.rafRefractionReady === 'true'
        ) {
            return;
        }

        lastSize = size;
        cancelIdle?.();
        cancelIdle = scheduleIdle(() => {
            cancelIdle = null;
            if (!disposed) {
                updateFilter(config, target);
            }
        });
    };

    const scheduleUpdate = () => {
        if (disposed || frame !== 0) {
            return;
        }

        frame = window.requestAnimationFrame(performUpdate);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(target);
    scheduleUpdate();

    return () => {
        disposed = true;
        resizeObserver.disconnect();
        cancelIdle?.();

        if (frame !== 0) {
            window.cancelAnimationFrame(frame);
        }

        delete target.dataset.rafRefractionReady;
    };
}

function attachPointerSheen(element) {
    let frame = 0;
    let rect = null;
    let pointerX = element.offsetWidth * 0.5;
    let pointerY = 0;

    const write = () => {
        frame = 0;
        element.style.setProperty('--raf-glass-pointer-x', `${pointerX}px`);
        element.style.setProperty('--raf-glass-pointer-y', `${pointerY}px`);
    };

    const schedule = () => {
        if (frame === 0) {
            frame = window.requestAnimationFrame(write);
        }
    };

    const refreshRect = () => {
        rect = element.getBoundingClientRect();
    };

    const handlePointerEnter = () => {
        refreshRect();
    };

    const handlePointerMove = (event) => {
        if (event.pointerType === 'touch') {
            return;
        }

        if (!rect) {
            refreshRect();
        }

        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
        schedule();
    };

    const handlePointerLeave = () => {
        rect = null;
        pointerX = element.offsetWidth * 0.5;
        pointerY = 0;
        schedule();
    };

    element.addEventListener('pointerenter', handlePointerEnter, {
        passive: true,
    });
    element.addEventListener('pointermove', handlePointerMove, {
        passive: true,
    });
    element.addEventListener('pointerleave', handlePointerLeave, {
        passive: true,
    });

    write();

    return () => {
        if (frame !== 0) {
            window.cancelAnimationFrame(frame);
        }

        element.removeEventListener('pointerenter', handlePointerEnter);
        element.removeEventListener('pointermove', handlePointerMove);
        element.removeEventListener('pointerleave', handlePointerLeave);
    };
}

function RefractionFilter({ id, imageId, displacementId }) {
    return (
        <filter
            id={id}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="10"
            height="10"
            colorInterpolationFilters="sRGB"
        >
            <feImage
                id={imageId}
                href={TRANSPARENT_PIXEL}
                x="0"
                y="0"
                width="10"
                height="10"
                preserveAspectRatio="none"
                result="map"
            />
            <feDisplacementMap
                id={displacementId}
                in="SourceGraphic"
                in2="map"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>
    );
}

export default function NavbarRefractionRuntime() {
    useEffect(() => {
        let disposed = false;
        let headerObserver = null;
        let delayedBind = 0;
        const disposers = [];

        const root = document.documentElement;

        const disposeBindings = () => {
            while (disposers.length > 0) {
                disposers.pop()?.();
            }
        };

        const setMode = (enabled) => {
            root.classList.toggle('raf-refraction-enabled', enabled);
            root.classList.toggle('raf-refraction-lite', !enabled);
        };

        const bind = () => {
            if (disposed) {
                return;
            }

            disposeBindings();

            const enabled = shouldEnableRefraction();
            setMode(enabled);

            if (!enabled) {
                document
                    .querySelectorAll('[data-raf-refraction-ready]')
                    .forEach((element) => {
                        delete element.dataset.rafRefractionReady;
                    });
                return;
            }

            ACTIVE_FILTERS.forEach((config) => {
                const target = document.querySelector(config.selector);
                if (target instanceof HTMLElement) {
                    disposers.push(attachFilter(config, target));
                }
            });

            document
                .querySelectorAll('[data-raf-refraction-pointer="true"]')
                .forEach((element) => {
                    if (element instanceof HTMLElement) {
                        disposers.push(attachPointerSheen(element));
                    }
                });
        };

        const scheduleBind = () => {
            if (delayedBind !== 0) {
                window.clearTimeout(delayedBind);
            }

            delayedBind = window.setTimeout(() => {
                delayedBind = 0;
                bind();
            }, 120);
        };

        const header = document.querySelector('header');
        if (header instanceof HTMLElement) {
            headerObserver = new MutationObserver(scheduleBind);
            headerObserver.observe(header, {
                childList: true,
                subtree: true,
            });
        }

        const mediaQueries = [
            window.matchMedia('(max-width: 1099px)'),
            window.matchMedia('(hover: hover) and (pointer: fine)'),
            window.matchMedia('(prefers-reduced-motion: reduce)'),
            window.matchMedia('(prefers-reduced-transparency: reduce)'),
        ];

        mediaQueries.forEach((query) => {
            query.addEventListener?.('change', scheduleBind);
        });

        window.addEventListener('resize', scheduleBind, { passive: true });
        document.addEventListener('visibilitychange', scheduleBind, {
            passive: true,
        });

        bind();

        return () => {
            disposed = true;
            disposeBindings();
            headerObserver?.disconnect();

            if (delayedBind !== 0) {
                window.clearTimeout(delayedBind);
            }

            mediaQueries.forEach((query) => {
                query.removeEventListener?.('change', scheduleBind);
            });

            window.removeEventListener('resize', scheduleBind);
            document.removeEventListener('visibilitychange', scheduleBind);
            root.classList.remove(
                'raf-refraction-enabled',
                'raf-refraction-lite',
            );
        };
    }, []);

    return (
        <svg
            aria-hidden="true"
            focusable="false"
            width="0"
            height="0"
            style={{
                position: 'absolute',
                width: 0,
                height: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <defs>
                <RefractionFilter
                    id="raf-header-warp"
                    imageId="raf-header-map"
                    displacementId="raf-header-displacement"
                />
                <RefractionFilter
                    id="raf-navbar-warp"
                    imageId="raf-navbar-map"
                    displacementId="raf-navbar-displacement"
                />
                <RefractionFilter
                    id="raf-navbar-pill-warp"
                    imageId="raf-navbar-pill-map"
                    displacementId="raf-navbar-pill-displacement"
                />
                <RefractionFilter
                    id="raf-mobile-fab-warp"
                    imageId="raf-mobile-fab-map"
                    displacementId="raf-mobile-fab-displacement"
                />
            </defs>
        </svg>
    );
}
