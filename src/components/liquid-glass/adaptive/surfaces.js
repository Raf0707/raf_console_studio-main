import { clamp } from './capabilities';

/*
 * Любой элемент внутри такого контейнера полностью исключается
 * из WebGL-шейдера.
 */
const SURFACE_IGNORE_SELECTOR =
    '[data-raf-shader-ignore="true"]';

/*
 * Эти элементы являются шейдерными поверхностями явно.
 * Для них не требуется проверять CSS backdrop-filter.
 */
const EXPLICIT_SURFACE_SELECTOR = [
    '[data-raf-glass-surface="mobile-drawer"]',
    '[data-raf-glass-surface="mobile-navigation-item"]',
    '.raf-liquid-header-panel',
    '.raf-nav-drop',
    '.raf-liquid-segment',
    '[data-liquid-segment="true"]',
    '.raf-liquid-button',
    '.raf-liquid-card',
    '.project-card',
].join(',');

/*
 * Полный список потенциальных поверхностей.
 */
const SURFACE_SELECTOR = [
    EXPLICIT_SURFACE_SELECTOR,
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

function isIgnoredSurface(element) {
    return Boolean(
        element.closest(SURFACE_IGNORE_SELECTOR),
    );
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
    const opacity =
        Number.parseFloat(style.opacity) || 0;

    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        opacity > 0.02
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

    if (
        element.matches(
            '.raf-liquid-header-panel',
        )
    ) {
        return 0.96;
    }

    if (element.matches('.raf-nav-drop')) {
        return 0.82;
    }

    if (
        element.matches(
            '.raf-liquid-segment, ' +
            '[data-liquid-segment="true"]',
        )
    ) {
        return 0.72;
    }

    if (
        element.matches('.raf-liquid-button')
    ) {
        return 0.56;
    }

    return 1;
}

export function collectSurfaces(maxSurfaces) {
    /*
     * Некоторые компоненты создаются через Portal,
     * поэтому поиск выполняется по всему document.
     */
    const root = document;

    const unique = new Set();
    const candidates = [];
    const eligibleElements = new Set();

    /*
     * Запоминаем элементы, зарегистрированные на прошлом проходе.
     * Удаляем класс только у действительно устаревших элементов,
     * а не у тех, которые просто не попали в maxSurfaces.
     */
    const previouslyRegistered = new Set(
        root.querySelectorAll(
            '.raf-shader-surface',
        ),
    );

    /*
     * Немедленно очищаем всё, что явно исключено
     * через data-raf-shader-ignore.
     */
    root
        .querySelectorAll(
            `${SURFACE_IGNORE_SELECTOR}, ` +
            `${SURFACE_IGNORE_SELECTOR} *`,
        )
        .forEach((element) => {
            clearSurfaceState(element);
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
             * Форма, чекбокс и текст согласия
             * не регистрируются как WebGL-поверхности.
             */
            if (isIgnoredSurface(element)) {
                clearSurfaceState(element);
                return;
            }

            const alreadyRegistered =
                element.classList.contains(
                    'raf-shader-surface',
                );

            const rect =
                element.getBoundingClientRect();

            const style =
                window.getComputedStyle(element);

            const explicitSurface =
                element.matches(
                    EXPLICIT_SURFACE_SELECTOR,
                );

            const backdrop =
                style.backdropFilter ||
                style.webkitBackdropFilter ||
                'none';

            const hasBackdrop =
                Boolean(backdrop) &&
                backdrop !== 'none';

            const radiusValue =
                Number.parseFloat(
                    style.borderTopLeftRadius,
                ) || 0;

            /*
             * Радиус является стабильным признаком карточки.
             * Плоские текстовые элементы не должны становиться
             * отдельными шейдерными поверхностями.
             */
            if (
                !explicitSurface &&
                radiusValue < 12
            ) {
                clearSurfaceState(element);
                return;
            }

            /*
             * ВАЖНО:
             *
             * После регистрации класс .raf-shader-surface
             * устанавливает backdrop-filter: none.
             *
             * Поэтому уже зарегистрированный элемент нельзя
             * исключать только потому, что его computed backdrop
             * теперь равен none.
             */
            if (
                !explicitSurface &&
                !alreadyRegistered &&
                !hasBackdrop
            ) {
                clearSurfaceState(element);
                return;
            }

            eligibleElements.add(element);

            /*
             * Для приоритета используем layout-размеры.
             * offsetWidth/offsetHeight не меняются во время
             * hover-scale анимаций, поэтому порядок карточек
             * не скачет на каждом кадре.
             */
            const layoutWidth =
                element.offsetWidth || rect.width;

            const layoutHeight =
                element.offsetHeight || rect.height;

            const area =
                layoutWidth * layoutHeight;

            const largeCard =
                element.matches(
                    '.project-card, .raf-liquid-card',
                ) &&
                area > 190000;

            /*
             * CSS-класс получают все подходящие элементы.
             * maxSurfaces ограничивает только WebGL-отрисовку,
             * но не должен включать и выключать стили карточек.
             */
            element.classList.add(
                'raf-shader-surface',
            );

            element.toggleAttribute(
                'data-raf-large-glass',
                largeCard,
            );

            /*
             * Невидимые элементы сохраняют стабильный CSS-класс,
             * но в WebGL на текущем кадре не передаются.
             */
            if (
                !isActuallyVisible(element, rect)
            ) {
                return;
            }

            const radius = clamp(
                radiusValue || 18,
                8,
                96,
            );

            const kind =
                surfaceKind(element);

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
            });
        });

    /*
     * Очищаем только элементы, которые:
     *
     * 1. удалены из DOM;
     * 2. больше не соответствуют списку поверхностей;
     * 3. попали внутрь ignore-контейнера;
     * 4. перестали быть подходящей поверхностью.
     *
     * Не очищаем элементы только из-за maxSurfaces.
     */
    previouslyRegistered.forEach(
        (element) => {
            if (
                !element.isConnected ||
                isIgnoredSurface(element) ||
                !eligibleElements.has(element)
            ) {
                clearSurfaceState(element);
            }
        },
    );

    candidates.sort(
        (first, second) =>
            second.priority - first.priority,
    );

    /*
     * Лимит применяется только к WebGL.
     * CSS-состояние всех карточек остаётся стабильным.
     */
    const selectedCandidates =
        candidates.slice(
            0,
            Math.max(0, maxSurfaces),
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