import { clamp } from './capabilities';

/*
 * Любой элемент внутри такого контейнера полностью исключается
 * из WebGL-шейдера. Это нужно для форм, чекбоксов и обычного текста.
 */
const SURFACE_IGNORE_SELECTOR =
    '[data-raf-shader-ignore="true"]';

const SURFACE_SELECTOR = [
    '[data-raf-glass-surface="mobile-drawer"]',
    '[data-raf-glass-surface="mobile-navigation-item"]',
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

function clearSurfaceState(element) {
    if (!(element instanceof HTMLElement)) {
        return;
    }

    element.classList.remove('raf-shader-surface');
    element.removeAttribute('data-raf-large-glass');
}

export function isActuallyVisible(element, rect) {
    if (!(element instanceof HTMLElement)) {
        return false;
    }

    if (rect.width < 42 || rect.height < 30) {
        return false;
    }

    if (
        rect.bottom < -32 ||
        rect.top > window.innerHeight + 32
    ) {
        return false;
    }

    if (
        rect.right < -32 ||
        rect.left > window.innerWidth + 32
    ) {
        return false;
    }

    const style = window.getComputedStyle(element);

    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity) > 0.02
    );
}

function surfaceKind(element) {
    if (
        element.matches(
            '[data-raf-glass-surface="mobile-navigation-item"]',
        )
    ) {
        return 0.64;
    }

    if (
        element.matches(
            '[data-raf-glass-surface="mobile-drawer"]',
        )
    ) {
        return 0.98;
    }

    if (element.matches('.raf-liquid-header-panel')) {
        return 0.96;
    }

    if (element.matches('.raf-nav-drop')) {
        return 0.82;
    }

    if (
        element.matches(
            '.raf-liquid-segment, [data-liquid-segment="true"]',
        )
    ) {
        return 0.72;
    }

    if (element.matches('.raf-liquid-button')) {
        return 0.56;
    }

    return 1;
}

export function collectSurfaces(maxSurfaces) {
    /*
     * Vaul, Radix и другие компоненты через Portal
     * могут находиться непосредственно внутри body.
     */
    const root = document;
    const unique = new Set();
    const candidates = [];

    /*
     * Сохраняем список ранее зарегистрированных поверхностей.
     * После нового сканирования с устаревших элементов будет
     * удалён класс raf-shader-surface.
     */
    const previouslyRegistered = new Set(
        root.querySelectorAll('.raf-shader-surface'),
    );

    /*
     * Сначала очищаем все элементы, которые явно исключены
     * из шейдера, включая всех их потомков.
     */
    root
        .querySelectorAll(
            `${SURFACE_IGNORE_SELECTOR}, ` +
            `${SURFACE_IGNORE_SELECTOR} *`,
        )
        .forEach((element) => {
            clearSurfaceState(element);
            previouslyRegistered.delete(element);
        });

    root
        .querySelectorAll(SURFACE_SELECTOR)
        .forEach((element) => {
            if (
                !(element instanceof HTMLElement) ||
                unique.has(element)
            ) {
                return;
            }

            unique.add(element);

            /*
             * Важное исправление:
             * элементы формы и всё внутри неё не могут стать
             * WebGL-поверхностью ни на ПК, ни на мобильных.
             */
            if (
                element.closest(SURFACE_IGNORE_SELECTOR)
            ) {
                clearSurfaceState(element);
                previouslyRegistered.delete(element);
                return;
            }

            const rect =
                element.getBoundingClientRect();

            if (!isActuallyVisible(element, rect)) {
                return;
            }

            const style =
                window.getComputedStyle(element);

            const explicitSurface = element.matches(
                '[data-raf-glass-surface="mobile-drawer"], ' +
                '[data-raf-glass-surface="mobile-navigation-item"], ' +
                '.raf-liquid-header-panel, ' +
                '.raf-nav-drop, ' +
                '.raf-liquid-segment, ' +
                '[data-liquid-segment="true"], ' +
                '.raf-liquid-button, ' +
                '.raf-liquid-card, ' +
                '.project-card',
            );

            const backdrop =
                style.backdropFilter ||
                style.webkitBackdropFilter ||
                'none';

            const radiusValue =
                Number.parseFloat(
                    style.borderTopLeftRadius,
                ) || 0;

            if (
                !explicitSurface &&
                (
                    backdrop === 'none' ||
                    radiusValue < 12
                )
            ) {
                return;
            }

            const radius = clamp(
                radiusValue || 18,
                8,
                96,
            );

            const kind = surfaceKind(element);
            const area = rect.width * rect.height;

            const largeCard =
                element.matches(
                    '.project-card, .raf-liquid-card',
                ) && area > 190000;

            let priority = 100;

            if (
                element.matches(
                    '[data-raf-glass-surface="mobile-drawer"]',
                )
            ) {
                priority += 1600;
            }

            if (
                element.matches(
                    '[data-raf-glass-surface="mobile-navigation-item"]',
                )
            ) {
                priority += 1100;
            }

            if (kind < 0.6) {
                priority += 360;
            } else if (kind < 0.8) {
                priority += 520;
            } else if (kind < 0.9) {
                priority += 620;
            } else if (
                element.matches(
                    '.raf-liquid-header-panel',
                )
            ) {
                priority += 900;
            } else {
                priority += 420;
            }

            priority -= Math.min(
                area / 6000,
                160,
            );

            candidates.push({
                element,
                rect,
                radius,
                kind,
                priority,
                largeCard,
            });
        });

    candidates.sort(
        (first, second) =>
            second.priority - first.priority,
    );

    /*
     * Класс шейдерной поверхности добавляется только
     * элементам, которые реально попали в лимит рендера.
     */
    const selectedCandidates =
        candidates.slice(0, maxSurfaces);

    const selectedElements = new Set(
        selectedCandidates.map(
            ({ element }) => element,
        ),
    );

    /*
     * Удаляем устаревшие классы с поверхностей, которые
     * больше не зарегистрированы или вышли за лимит.
     */
    previouslyRegistered.forEach((element) => {
        if (!selectedElements.has(element)) {
            clearSurfaceState(element);
        }
    });

    selectedCandidates.forEach(
        ({ element, largeCard }) => {
            element.classList.add(
                'raf-shader-surface',
            );

            element.toggleAttribute(
                'data-raf-large-glass',
                largeCard,
            );
        },
    );

    return selectedCandidates.map(
        ({
             element,
             rect,
             radius,
             kind,
             priority,
         }) => ({
            element,
            rect,
            radius,
            kind,
            priority,
        }),
    );
}