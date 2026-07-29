'use client';

import { useEffect } from 'react';

import { MAX_SURFACES } from './adaptive/shader-source';
import { collectSurfaces } from './adaptive/surfaces';

export default function FallbackSurfaceRuntime() {
    useEffect(() => {
        let timer = null;
        let observer = null;

        const scan = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                if (
                    !document.documentElement.classList.contains(
                        'raf-glass-shader',
                    )
                ) {
                    collectSurfaces(MAX_SURFACES);
                }
            }, 48);
        };

        observer = new MutationObserver(scan);
        observer.observe(
            document.querySelector('#raf-liquid-root') || document.body,
            {
                childList: true,
                subtree: true,
            },
        );

        window.addEventListener('raf-glass-mode-change', scan);
        window.addEventListener('resize', scan, { passive: true });
        scan();

        return () => {
            window.clearTimeout(timer);
            observer?.disconnect();
            window.removeEventListener('raf-glass-mode-change', scan);
            window.removeEventListener('resize', scan);
        };
    }, []);

    return null;
}
