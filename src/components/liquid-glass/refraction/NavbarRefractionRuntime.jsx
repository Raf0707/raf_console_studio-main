'use client';

import { useEffect } from 'react';

import { createRefractionMap } from './refraction-map';

const TRANSPARENT_PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const FILTERS = [
    {
        key: 'header',
        selector: '[data-raf-refraction-target="header-shell"]',
        filterId: 'raf-header-warp',
        imageId: 'raf-header-map',
        displacementId: 'raf-header-displacement',
        blurId: 'raf-header-softness',
        margin: 40,
        bandRatio: 0.5,
        profileShape: 3.45,
        edgePower: 1.22,
        bodyStrength: 0.2,
        normalStrength: 1.28,
        shoulderStrength: 0.34,
        shoulderPosition: 0.57,
        shoulderWidth: 0.18,
        bodyLensStrength: 0.24,
        bodyLensPower: 0.9,
        horizontalLensScale: 0.72,
        verticalLensScale: 1.18,
        scaleRatio: 0.82,
        minScale: 38,
        maxScale: 58,
        blur: 0.38,
    },
    {
        key: 'navbar',
        selector: '[data-raf-refraction-target="navbar-shell"]',
        filterId: 'raf-navbar-warp',
        imageId: 'raf-navbar-map',
        displacementId: 'raf-navbar-displacement',
        blurId: 'raf-navbar-softness',
        margin: 34,
        bandRatio: 0.52,
        profileShape: 3.15,
        edgePower: 1.14,
        bodyStrength: 0.24,
        normalStrength: 1.45,
        shoulderStrength: 0.42,
        shoulderPosition: 0.56,
        shoulderWidth: 0.17,
        bodyLensStrength: 0.34,
        bodyLensPower: 0.86,
        horizontalLensScale: 0.8,
        verticalLensScale: 1.22,
        scaleRatio: 1.36,
        minScale: 52,
        maxScale: 78,
        blur: 0.22,
    },
    {
        key: 'pill',
        selector: '[data-raf-refraction-target="navbar-pill"]',
        filterId: 'raf-navbar-pill-warp',
        imageId: 'raf-navbar-pill-map',
        displacementId: 'raf-navbar-pill-displacement',
        blurId: 'raf-navbar-pill-softness',
        margin: 28,
        bandRatio: 0.54,
        profileShape: 2.9,
        edgePower: 1.08,
        bodyStrength: 0.28,
        normalStrength: 1.62,
        shoulderStrength: 0.48,
        shoulderPosition: 0.54,
        shoulderWidth: 0.16,
        bodyLensStrength: 0.42,
        bodyLensPower: 0.82,
        horizontalLensScale: 0.84,
        verticalLensScale: 1.26,
        scaleRatio: 1.65,
        minScale: 58,
        maxScale: 86,
        blur: 0.14,
    },
    {
        key: 'mobileFab',
        selector: '[data-raf-refraction-target="mobile-fab"]',
        filterId: 'raf-mobile-fab-warp',
        imageId: 'raf-mobile-fab-map',
        displacementId: 'raf-mobile-fab-displacement',
        blurId: 'raf-mobile-fab-softness',
        margin: 28,
        bandRatio: 0.54,
        profileShape: 2.85,
        edgePower: 1.05,
        bodyStrength: 0.3,
        normalStrength: 1.68,
        shoulderStrength: 0.52,
        shoulderPosition: 0.53,
        shoulderWidth: 0.16,
        bodyLensStrength: 0.48,
        bodyLensPower: 0.8,
        horizontalLensScale: 0.92,
        verticalLensScale: 1.18,
        scaleRatio: 1.26,
        minScale: 62,
        maxScale: 78,
        blur: 0.12,
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

function updateFilter(config, target) {
    if (!(target instanceof HTMLElement)) {
        return;
    }

    const width = Math.round(target.offsetWidth);
    const height = Math.round(target.offsetHeight);

    if (width < 8 || height < 8) {
        return;
    }

    const radius = Number.parseFloat(
        window.getComputedStyle(target)
            .borderTopLeftRadius,
    ) || height * 0.5;

    const map = createRefractionMap({
        width,
        height,
        radius,
        margin: config.margin,
        band: Math.max(
            8,
            height * config.bandRatio,
        ),
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
    });

    if (!map) {
        return;
    }

    const filter = document.getElementById(
        config.filterId,
    );
    const image = document.getElementById(
        config.imageId,
    );
    const displacement = document.getElementById(
        config.displacementId,
    );
    const blur = document.getElementById(
        config.blurId,
    );

    if (
        !(filter instanceof SVGElement) ||
        !(image instanceof SVGElement) ||
        !(displacement instanceof SVGElement)
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

    displacement.setAttribute(
        'scale',
        String(scale),
    );

    blur?.setAttribute(
        'stdDeviation',
        String(config.blur),
    );

    target.dataset.rafRefractionReady = 'true';
}

function attachPointerSheen(element) {
    if (!(element instanceof HTMLElement)) {
        return () => {};
    }

    let frame = 0;
    let pointerX = element.offsetWidth * 0.5;
    let pointerY = 0;

    const write = () => {
        frame = 0;
        element.style.setProperty(
            '--raf-glass-pointer-x',
            `${pointerX}px`,
        );
        element.style.setProperty(
            '--raf-glass-pointer-y',
            `${pointerY}px`,
        );
    };

    const schedule = () => {
        if (frame !== 0) {
            return;
        }

        frame = window.requestAnimationFrame(write);
    };

    const handlePointerMove = (event) => {
        if (event.pointerType === 'touch') {
            return;
        }

        const rect = element.getBoundingClientRect();
        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
        schedule();
    };

    const handlePointerLeave = () => {
        pointerX = element.offsetWidth * 0.5;
        pointerY = 0;
        schedule();
    };

    element.addEventListener(
        'pointermove',
        handlePointerMove,
        { passive: true },
    );
    element.addEventListener(
        'pointerleave',
        handlePointerLeave,
        { passive: true },
    );

    write();

    return () => {
        if (frame !== 0) {
            window.cancelAnimationFrame(frame);
        }

        element.removeEventListener(
            'pointermove',
            handlePointerMove,
        );
        element.removeEventListener(
            'pointerleave',
            handlePointerLeave,
        );
    };
}

export default function NavbarRefractionRuntime() {
    useEffect(() => {
        let cancelled = false;
        let bindFrame = 0;
        let mutationObserver = null;

        const bindings = new Map();
        const sheenBindings = new Map();

        const disconnectBinding = (key) => {
            const binding = bindings.get(key);
            binding?.observer.disconnect();
            bindings.delete(key);
        };

        const bindFilter = (config) => {
            const target = document.querySelector(
                config.selector,
            );
            const current = bindings.get(config.key);

            if (current?.target === target) {
                return;
            }

            disconnectBinding(config.key);

            if (!(target instanceof HTMLElement)) {
                return;
            }

            let updateFrame = 0;
            let lastSize = '';

            const update = () => {
                updateFrame = 0;

                if (cancelled || !target.isConnected) {
                    return;
                }

                const size = `${target.offsetWidth}x${target.offsetHeight}`;

                if (
                    size === lastSize &&
                    target.dataset.rafRefractionReady === 'true'
                ) {
                    return;
                }

                lastSize = size;
                updateFilter(config, target);
            };

            const scheduleUpdate = () => {
                if (updateFrame !== 0) {
                    return;
                }

                updateFrame = window.requestAnimationFrame(
                    update,
                );
            };

            const observer = new ResizeObserver(
                scheduleUpdate,
            );

            observer.observe(target);
            bindings.set(config.key, {
                target,
                observer,
            });

            scheduleUpdate();
        };

        const bindSheen = () => {
            const currentElements = new Set(
                document.querySelectorAll(
                    '[data-raf-refraction-pointer="true"]',
                ),
            );

            sheenBindings.forEach((dispose, element) => {
                if (!currentElements.has(element)) {
                    dispose();
                    sheenBindings.delete(element);
                }
            });

            currentElements.forEach((element) => {
                if (
                    element instanceof HTMLElement &&
                    !sheenBindings.has(element)
                ) {
                    sheenBindings.set(
                        element,
                        attachPointerSheen(element),
                    );
                }
            });
        };

        const bindAll = () => {
            bindFrame = 0;

            if (cancelled) {
                return;
            }

            FILTERS.forEach(bindFilter);
            bindSheen();
        };

        const scheduleBind = () => {
            if (bindFrame !== 0) {
                return;
            }

            bindFrame = window.requestAnimationFrame(
                bindAll,
            );
        };

        mutationObserver = new MutationObserver(
            scheduleBind,
        );

        mutationObserver.observe(
            document.body,
            {
                childList: true,
                subtree: true,
            },
        );

        window.addEventListener(
            'resize',
            scheduleBind,
            { passive: true },
        );

        scheduleBind();

        return () => {
            cancelled = true;

            if (bindFrame !== 0) {
                window.cancelAnimationFrame(
                    bindFrame,
                );
            }

            mutationObserver?.disconnect();

            bindings.forEach(({ observer }) => {
                observer.disconnect();
            });
            bindings.clear();

            sheenBindings.forEach((dispose) => {
                dispose();
            });
            sheenBindings.clear();

            window.removeEventListener(
                'resize',
                scheduleBind,
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
                <filter
                    id="raf-header-warp"
                    filterUnits="userSpaceOnUse"
                    primitiveUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    colorInterpolationFilters="sRGB"
                >
                    <feImage
                        id="raf-header-map"
                        href={TRANSPARENT_PIXEL}
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        preserveAspectRatio="none"
                        result="map"
                    />
                    <feDisplacementMap
                        id="raf-header-displacement"
                        in="SourceGraphic"
                        in2="map"
                        scale="48"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="bent"
                    />
                    <feGaussianBlur
                        id="raf-header-softness"
                        in="bent"
                        stdDeviation="0.38"
                        result="softened"
                    />
                    <feColorMatrix
                        in="softened"
                        type="saturate"
                        values="0"
                        result="mono"
                    />
                    <feComponentTransfer in="mono">
                        <feFuncR type="gamma" amplitude="1.16" exponent="0.88" offset="-0.018" />
                        <feFuncG type="gamma" amplitude="1.16" exponent="0.88" offset="-0.018" />
                        <feFuncB type="gamma" amplitude="1.16" exponent="0.88" offset="-0.018" />
                    </feComponentTransfer>
                </filter>

                <filter
                    id="raf-navbar-warp"
                    filterUnits="userSpaceOnUse"
                    primitiveUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    colorInterpolationFilters="sRGB"
                >
                    <feImage
                        id="raf-navbar-map"
                        href={TRANSPARENT_PIXEL}
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        preserveAspectRatio="none"
                        result="map"
                    />
                    <feDisplacementMap
                        id="raf-navbar-displacement"
                        in="SourceGraphic"
                        in2="map"
                        scale="62"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="bent"
                    />
                    <feGaussianBlur
                        id="raf-navbar-softness"
                        in="bent"
                        stdDeviation="0.22"
                        result="softened"
                    />
                    <feColorMatrix
                        in="softened"
                        type="saturate"
                        values="0"
                        result="mono"
                    />
                    <feComponentTransfer in="mono">
                        <feFuncR type="gamma" amplitude="1.22" exponent="0.84" offset="-0.022" />
                        <feFuncG type="gamma" amplitude="1.22" exponent="0.84" offset="-0.022" />
                        <feFuncB type="gamma" amplitude="1.22" exponent="0.84" offset="-0.022" />
                    </feComponentTransfer>
                </filter>

                <filter
                    id="raf-navbar-pill-warp"
                    filterUnits="userSpaceOnUse"
                    primitiveUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    colorInterpolationFilters="sRGB"
                >
                    <feImage
                        id="raf-navbar-pill-map"
                        href={TRANSPARENT_PIXEL}
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        preserveAspectRatio="none"
                        result="map"
                    />
                    <feDisplacementMap
                        id="raf-navbar-pill-displacement"
                        in="SourceGraphic"
                        in2="map"
                        scale="68"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="bent"
                    />
                    <feGaussianBlur
                        id="raf-navbar-pill-softness"
                        in="bent"
                        stdDeviation="0.14"
                        result="softened"
                    />
                    <feColorMatrix
                        in="softened"
                        type="saturate"
                        values="0"
                        result="mono"
                    />
                    <feComponentTransfer in="mono">
                        <feFuncR type="gamma" amplitude="1.26" exponent="0.82" offset="-0.024" />
                        <feFuncG type="gamma" amplitude="1.26" exponent="0.82" offset="-0.024" />
                        <feFuncB type="gamma" amplitude="1.26" exponent="0.82" offset="-0.024" />
                    </feComponentTransfer>
                </filter>

                <filter
                    id="raf-mobile-fab-warp"
                    filterUnits="userSpaceOnUse"
                    primitiveUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    colorInterpolationFilters="sRGB"
                >
                    <feImage
                        id="raf-mobile-fab-map"
                        href={TRANSPARENT_PIXEL}
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        preserveAspectRatio="none"
                        result="map"
                    />
                    <feDisplacementMap
                        id="raf-mobile-fab-displacement"
                        in="SourceGraphic"
                        in2="map"
                        scale="70"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="bent"
                    />
                    <feGaussianBlur
                        id="raf-mobile-fab-softness"
                        in="bent"
                        stdDeviation="0.12"
                        result="softened"
                    />
                    <feColorMatrix
                        in="softened"
                        type="saturate"
                        values="0"
                        result="mono"
                    />
                    <feComponentTransfer in="mono">
                        <feFuncR type="gamma" amplitude="1.28" exponent="0.8" offset="-0.024" />
                        <feFuncG type="gamma" amplitude="1.28" exponent="0.8" offset="-0.024" />
                        <feFuncB type="gamma" amplitude="1.28" exponent="0.8" offset="-0.024" />
                    </feComponentTransfer>
                </filter>
            </defs>
        </svg>
    );
}
