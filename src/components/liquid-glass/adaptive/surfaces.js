import { clamp } from './capabilities';

const SURFACE_SELECTOR = [
    '.raf-liquid-header-panel',
    '.raf-nav-drop',
    '.raf-liquid-segment',
    '[data-liquid-segment="true"]',
    '.raf-liquid-button',
    '.raf-liquid-card',
    '.project-card',
    '[class*="glass"]',
    '[class*="Glass"]',
    '[class*="card"]',
    '[class*="Card"]',
].join(',');

export function isActuallyVisible(element, rect) {
    if (!(element instanceof HTMLElement)) {
        return false;
    }

    if (rect.width < 42 || rect.height < 30) {
        return false;
    }

    if (rect.bottom < -32 || rect.top > window.innerHeight + 32) {
        return false;
    }

    if (rect.right < -32 || rect.left > window.innerWidth + 32) {
        return false;
    }

    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.02;
}

function surfaceKind(element) {
    if (element.matches('.raf-liquid-header-panel')) return 0.96;
    if (element.matches('.raf-nav-drop')) return 0.82;
    if (element.matches('.raf-liquid-segment, [data-liquid-segment="true"]')) return 0.72;
    if (element.matches('.raf-liquid-button')) return 0.56;
    return 1.0;
}

export function collectSurfaces(maxSurfaces) {
    const root = document.querySelector('#raf-liquid-root') || document.body;
    const unique = new Set();
    const candidates = [];

    root.querySelectorAll(SURFACE_SELECTOR).forEach((element) => {
        if (!(element instanceof HTMLElement) || unique.has(element)) {
            return;
        }

        unique.add(element);
        const rect = element.getBoundingClientRect();

        if (!isActuallyVisible(element, rect)) {
            return;
        }

        const style = window.getComputedStyle(element);
        const explicitSurface = element.matches(
            '.raf-liquid-header-panel, .raf-nav-drop, .raf-liquid-segment, '
            + '[data-liquid-segment="true"], .raf-liquid-button, '
            + '.raf-liquid-card, .project-card',
        );
        const backdrop = style.backdropFilter || style.webkitBackdropFilter || 'none';
        const radiusValue = Number.parseFloat(style.borderTopLeftRadius) || 0;

        if (!explicitSurface && (backdrop === 'none' || radiusValue < 12)) {
            return;
        }

        const radius = clamp(radiusValue || 18, 8, 96);
        const kind = surfaceKind(element);
        const area = rect.width * rect.height;
        const largeCard = element.matches('.project-card, .raf-liquid-card') && area > 190000;
        element.toggleAttribute('data-raf-large-glass', largeCard);
        element.classList.add('raf-shader-surface');

        let priority = 100;
        if (kind < 0.6) priority += 360;
        else if (kind < 0.8) priority += 520;
        else if (kind < 0.9) priority += 620;
        else if (element.matches('.raf-liquid-header-panel')) priority += 900;
        else priority += 420;
        priority -= Math.min(area / 6000, 160);

        candidates.push({ element, rect, radius, kind, priority });
    });

    candidates.sort((a, b) => b.priority - a.priority);
    return candidates.slice(0, maxSurfaces);
}
