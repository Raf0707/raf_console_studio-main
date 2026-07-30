'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

function nextFrame() {
    return new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
    });
}

async function waitForHydration() {
    await nextFrame();
    await nextFrame();
}

function getClassName(element) {
    if (!(element instanceof HTMLElement)) {
        return '';
    }

    return typeof element.className === 'string'
        ? element.className
        : element.getAttribute('class') || '';
}

function createWaterUnderlay() {
    const layer = document.createElement('span');
    layer.className = 'raf-water-underlay';
    layer.setAttribute('aria-hidden', 'true');
    return layer;
}

function addWaterLayer(element) {
    if (!(element instanceof HTMLElement)) {
        return;
    }

    if (
        element.querySelector(':scope > .raf-water-underlay')
    ) {
        return;
    }

    element.appendChild(createWaterUnderlay());
}

function addWaterRipple(target, event) {
    if (!(target instanceof HTMLElement)) {
        return;
    }

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');

    ripple.className = 'raf-water-ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    target.appendChild(ripple);

    window.setTimeout(() => {
        ripple.remove();
    }, 950);
}

function findHeaderPanel() {
    const header = document.querySelector('body header');

    if (!(header instanceof HTMLElement)) {
        return null;
    }

    return (
        Array.from(header.children).find(
            (element) =>
                element instanceof HTMLElement &&
                element.tagName === 'DIV' &&
                Boolean(element.querySelector('nav')),
        ) || null
    );
}

function removeOldHeaderWebGl() {
    const header = document.querySelector('body header');

    if (!(header instanceof HTMLElement)) {
        return;
    }

    header.classList.remove('raf-liquidglass-root');

    header.querySelectorAll('canvas').forEach((canvas) => {
        const style = canvas.getAttribute('style') || '';

        if (
            style.includes('z-index:-1') ||
            style.includes('z-index: -1')
        ) {
            canvas.remove();
        }
    });

    header
        .querySelectorAll('.raf-liquidglass-surface')
        .forEach((element) => {
            element.classList.remove('raf-liquidglass-surface');
            delete element.dataset.config;
        });
}

function enhanceHeader() {
    removeOldHeaderWebGl();

    const panel = findHeaderPanel();

    if (!panel) {
        return;
    }

    const nav = panel.querySelector('nav');

    /*
     * Header with the native SDF/SVG refraction pipeline owns its own
     * layers. Old liquid-glass classes must be removed so global CSS
     * cannot add a second blur or overwrite the optical rim.
     */
    if (
        panel.matches(
            '[data-raf-native-refraction="true"]',
        )
    ) {
        panel.classList.remove(
            'raf-liquid-header-panel',
        );

        if (nav instanceof HTMLElement) {
            nav.classList.remove(
                'raf-liquid-nav-items',
            );

            nav
                .querySelectorAll(
                    '.raf-nav-drop-slot, ' +
                    '.raf-nav-drop, ' +
                    '.raf-nav-drop-highlight, ' +
                    '.raf-nav-drop-caustic, ' +
                    '.raf-nav-drop-ripple',
                )
                .forEach((element) => {
                    element.classList.remove(
                        'raf-nav-drop-slot',
                        'raf-nav-drop',
                        'raf-nav-drop-highlight',
                        'raf-nav-drop-caustic',
                        'raf-nav-drop-ripple',
                    );
                });
        }

        return;
    }

    panel.classList.add('raf-liquid-header-panel');

    if (nav instanceof HTMLElement) {
        nav.classList.add('raf-liquid-nav-items');

        const dropSlot = Array.from(nav.children).find(
            (child) =>
                child instanceof HTMLElement &&
                child.getAttribute('aria-hidden') === 'true',
        );

        if (dropSlot instanceof HTMLElement) {
            dropSlot.classList.add('raf-nav-drop-slot');

            const drop = dropSlot.firstElementChild;

            if (drop instanceof HTMLElement) {
                drop.classList.add('raf-nav-drop');

                const children = Array.from(drop.children);
                children[0]?.classList.add('raf-nav-drop-highlight');
                children[1]?.classList.add('raf-nav-drop-caustic');
                children[2]?.classList.add('raf-nav-drop-ripple');
            }
        }
    }

    panel.querySelectorAll('button').forEach((button) => {
        button.classList.add('raf-liquid-header-button');

        const ariaLabel = button.getAttribute('aria-label') || '';
        const hasGlobe =
            Boolean(button.querySelector('svg.lucide-globe')) ||
            /language|english|русск/i.test(ariaLabel);

        if (hasGlobe) {
            button.classList.add('raf-liquid-globe-button');
        }
    });
}

function isSegmentContainer(element) {
    if (!(element instanceof HTMLElement)) {
        return false;
    }

    if (element.classList.contains('project-segment')) {
        return true;
    }

    const buttons = Array.from(element.children).filter(
        (child) => child instanceof HTMLButtonElement,
    );

    if (buttons.length < 2 || buttons.length > 8) {
        return false;
    }

    const containsSelectionState = buttons.some((button) => {
        const className = getClassName(button);

        return (
            button.hasAttribute('aria-pressed') ||
            button.hasAttribute('aria-selected') ||
            button.hasAttribute('data-state') ||
            /active|selected|bg-white|text-black/i.test(className)
        );
    });

    if (!containsSelectionState) {
        return false;
    }

    const style = window.getComputedStyle(element);
    const radius =
        Number.parseFloat(style.borderTopLeftRadius) || 0;

    return radius >= 14;
}

function getSegmentButtons(container) {
    if (!(container instanceof HTMLElement)) {
        return [];
    }

    return Array.from(container.children).filter(
        (child) => child instanceof HTMLButtonElement,
    );
}

function isReactActiveSegment(button) {
    if (!(button instanceof HTMLButtonElement)) {
        return false;
    }

    if (
        button.getAttribute('aria-pressed') === 'true' ||
        button.getAttribute('aria-selected') === 'true' ||
        button.getAttribute('data-state') === 'active'
    ) {
        return true;
    }

    const className = getClassName(button).toLowerCase();

    if (
        className.includes('inactive') ||
        className.includes('unselected')
    ) {
        return false;
    }

    return (
        className.includes('selected') ||
        className.includes('bg-white') ||
        className.includes('text-black') ||
        /(^|\s)[^\s]*active[^\s]*(\s|$)/.test(className)
    );
}

function resetOldSegmentStyles(button) {
    if (!(button instanceof HTMLButtonElement)) {
        return;
    }

    button.dataset.liquidSegmentButton = 'true';

    const stableStyles = {
        background: 'transparent',
        'background-color': 'transparent',
        'background-image': 'none',
        'box-shadow': 'none',
        transform: 'none',
        translate: 'none',
        scale: '1',
        top: '0',
        bottom: 'auto',
        'margin-top': '0',
        'margin-bottom': '0',
        'padding-top': '0',
        'padding-bottom': '0',
    };

    Object.entries(stableStyles).forEach(([property, value]) => {
        button.style.setProperty(property, value, 'important');
    });
}

const segmentImpactTimers = new WeakMap();

function moveSegmentBubble(
    container,
    activeButton,
    { animateImpact = false } = {},
) {
    if (
        !(container instanceof HTMLElement) ||
        !(activeButton instanceof HTMLButtonElement)
    ) {
        return;
    }

    const buttons = getSegmentButtons(container);
    const activeIndex = buttons.indexOf(activeButton);

    if (activeIndex < 0) {
        return;
    }

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const inset = 3;

    container.style.setProperty(
        '--liquid-segment-left',
        `${buttonRect.left - containerRect.left + inset}px`,
    );

    container.style.setProperty(
        '--liquid-segment-top',
        `${buttonRect.top - containerRect.top + inset}px`,
    );

    container.style.setProperty(
        '--liquid-segment-width',
        `${Math.max(0, buttonRect.width - inset * 2)}px`,
    );

    container.style.setProperty(
        '--liquid-segment-height',
        `${Math.max(0, buttonRect.height - inset * 2)}px`,
    );

    /*
     * Индекс хранит только визуальное положение линзы.
     * Он не нажимает кнопку и не изменяет React-состояние.
     */
    container.dataset.liquidActiveIndex = String(activeIndex);

    buttons.forEach((button, index) => {
        resetOldSegmentStyles(button);

        button.dataset.liquidActive =
            index === activeIndex ? 'true' : 'false';
    });

    /*
     * Обычный вызов используется MutationObserver,
     * ResizeObserver и синхронизацией React.
     *
     * Он обновляет положение линзы, но не должен
     * прерывать уже запущенную анимацию капли.
     */
    if (!animateImpact) {
        return;
    }

    /*
     * Только новый пользовательский клик может
     * отменить предыдущую анимацию расплющивания.
     */
    const previousTimer = segmentImpactTimers.get(container);

    if (previousTimer !== undefined) {
        window.clearTimeout(previousTimer);
        segmentImpactTimers.delete(container);
    }

    /*
     * Перезапускаем CSS-анимацию даже при очень
     * быстрых повторных кликах.
     */
    delete container.dataset.liquidImpact;
    void container.offsetWidth;
    container.dataset.liquidImpact = 'true';

    const impactTimer = window.setTimeout(() => {
        segmentImpactTimers.delete(container);

        if (!container.isConnected) {
            return;
        }

        /*
         * Только заканчиваем визуальную деформацию.
         * Положение пузырька здесь не меняем.
         */
        delete container.dataset.liquidImpact;
    }, 840);

    segmentImpactTimers.set(container, impactTimer);
}

function syncSegmentContainer(container) {
    if (!isSegmentContainer(container)) {
        return;
    }

    const buttons = getSegmentButtons(container);

    if (buttons.length < 2) {
        return;
    }

    container.dataset.liquidSegment = 'true';
    container.classList.add('raf-liquid-segment');

    buttons.forEach((button) => {
        button.classList.add('raf-liquid-segment-button');
        resetOldSegmentStyles(button);
    });

    const savedIndex = Number.parseInt(
        container.dataset.liquidActiveIndex ?? '',
        10,
    );

    const savedActiveButton =
        Number.isInteger(savedIndex)
        && savedIndex >= 0
        && savedIndex < buttons.length
            ? buttons[savedIndex]
            : null;

    const reactActiveButton =
        buttons.find(isReactActiveSegment) ?? null;

    /*
     * Сохранённый индекс управляет только визуальным
     * положением пузырька.
     *
     * Он не вызывает click(), не меняет фильтры
     * и не управляет React-состоянием.
     */
    const activeButton =
        savedActiveButton
        ?? reactActiveButton
        ?? buttons[0]
        ?? null;

    if (activeButton) {
        moveSegmentBubble(container, activeButton);
    }
}

function syncAllSegments(root = document) {
    const candidates = new Set();

    if (
        root instanceof HTMLElement &&
        isSegmentContainer(root)
    ) {
        candidates.add(root);
    }

    const searchRoot = root instanceof Element ? root : document;

    searchRoot
        .querySelectorAll(
            '.project-segment, [data-liquid-segment="true"], div',
        )
        .forEach((element) => {
            if (isSegmentContainer(element)) {
                candidates.add(element);
            }
        });

    candidates.forEach(syncSegmentContainer);
}

function enhanceButtons(root = document) {
    const searchRoot = root instanceof Element ? root : document;

    searchRoot.querySelectorAll('button, a').forEach((element) => {
        if (!(element instanceof HTMLElement)) {
            return;
        }

        if (
            element.closest('.raf-liquid-segment') ||
            element.closest('.raf-liquid-nav-items') ||
            element.closest('.project-card')
        ) {
            return;
        }

        const className = getClassName(element);
        const looksLikeButton =
            element.tagName === 'BUTTON' ||
            /button|action|trigger|submit|cta|bg-white|text-black/i.test(
                className,
            );

        if (!looksLikeButton) {
            return;
        }

        const rect = element.getBoundingClientRect();

        if (
            rect.width < 28 ||
            rect.height < 26 ||
            rect.height > 110
        ) {
            return;
        }

        element.classList.add('raf-liquid-button');

        const lightVariant =
            /bg-white|text-black|primary/i.test(className);

        element.classList.toggle(
            'raf-liquid-button--light',
            lightVariant,
        );
        element.classList.toggle(
            'raf-liquid-button--dark',
            !lightVariant,
        );

        addWaterLayer(element);
    });
}


function normalizeSegmentLabel(button) {
    if (!(button instanceof HTMLButtonElement)) {
        return '';
    }

    return (button.textContent || '')
        .trim()
        .toLocaleLowerCase('ru-RU')
        .replace(/\s+/g, ' ');
}

function isProjectsRootButton(button) {
    if (!(button instanceof HTMLButtonElement)) {
        return false;
    }

    const container =
        button.closest(
            [
                '.raf-liquid-segment',
                '[data-liquid-segment="true"]',
                '.project-segment',
            ].join(','),
        ) ?? button.parentElement;

    if (!(container instanceof HTMLElement)) {
        return false;
    }

    const labels = getSegmentButtons(container).map(
        normalizeSegmentLabel,
    );

    /*
     * Это главный переключатель страницы проектов
     * только в том случае, если в одном контейнере есть:
     *
     * Приложения + Сайты
     * Applications + Websites/Sites
     *
     * «Мобильные приложения + Сайты» из Студии
     * сюда намеренно не подходит.
     */
    const hasApplications = labels.some(
        (label) =>
            label === 'приложения'
            || label === 'applications',
    );

    const hasWebsites = labels.some(
        (label) =>
            label === 'сайты'
            || label === 'websites'
            || label === 'sites',
    );

    if (!hasApplications || !hasWebsites) {
        return false;
    }

    const selectedLabel = normalizeSegmentLabel(button);

    return (
        selectedLabel === 'приложения'
        || selectedLabel === 'applications'
        || selectedLabel === 'сайты'
        || selectedLabel === 'websites'
        || selectedLabel === 'sites'
    );
}

function findProjectsScope(element) {
    if (!(element instanceof HTMLElement)) {
        return document;
    }

    return (
        element.closest(
            '#raf-page-root, main, [data-projects-page], [class*="projects"]',
        )
        || document
    );
}

function resetVisibleProjectSegments(rootButton) {
    if (!(rootButton instanceof HTMLButtonElement)) {
        return;
    }

    const rootContainer =
        rootButton.closest(
            [
                '.raf-liquid-segment',
                '[data-liquid-segment="true"]',
                '.project-segment',
            ].join(','),
        ) ?? rootButton.parentElement;

    if (!(rootContainer instanceof HTMLElement)) {
        return;
    }

    const rootLabels = getSegmentButtons(rootContainer).map(
        normalizeSegmentLabel,
    );

    const isRealProjectsSwitcher =
        rootLabels.some(
            (label) =>
                label === 'приложения'
                || label === 'applications',
        )
        && rootLabels.some(
            (label) =>
                label === 'сайты'
                || label === 'websites'
                || label === 'sites',
        );

    if (!isRealProjectsSwitcher) {
        return;
    }

    const selectedRootLabel = normalizeSegmentLabel(rootButton);
    const initialScope = findProjectsScope(rootButton);

    const isApplicationsSection =
        selectedRootLabel === 'приложения'
        || selectedRootLabel === 'applications';

    const isWebsitesSection =
        selectedRootLabel === 'сайты'
        || selectedRootLabel === 'websites'
        || selectedRootLabel === 'sites';

    if (!isApplicationsSection && !isWebsitesSection) {
        return;
    }

    let resetPass = 0;

    /*
     * Запоминаем уже реально нажатые кнопки,
     * чтобы один и тот же элемент не нажимался
     * несколько раз в рамках одного переключения.
     */
    const clickedButtons = new WeakSet();

    const getCurrentScope = () => {
        if (
            initialScope instanceof HTMLElement
            && initialScope.isConnected
        ) {
            return initialScope;
        }

        return (
            document.querySelector(
                '#raf-page-root, main, [data-projects-page]',
            )
            || document
        );
    };

    const resetContainerToFirstButton = (container) => {
        if (!(container instanceof HTMLElement)) {
            return;
        }

        const buttons = getSegmentButtons(container);
        const firstButton = buttons[0];

        if (!(firstButton instanceof HTMLButtonElement)) {
            return;
        }

        /*
         * Сначала синхронизируем только визуальную линзу.
         */
        container.dataset.liquidActiveIndex = '0';


        moveSegmentBubble(container, firstButton);

        /*
         * Затем обязательно меняем настоящее React-состояние.
         *
         * Нельзя ориентироваться только на визуальное состояние:
         * data-liquid-active управляет стеклянной линзой,
         * но не фильтрацией проектов.
         */
        if (
            !firstButton.disabled
            && !clickedButtons.has(firstButton)
        ) {
            clickedButtons.add(firstButton);
            firstButton.click();
        }
    };

    const resetAfterRender = () => {
        if (resetPass >= 5) {
            return;
        }

        resetPass += 1;

        const scope = getCurrentScope();

        const containers = Array.from(
            scope.querySelectorAll(
                [
                    '.project-segment',
                    '.raf-liquid-segment',
                    '[data-liquid-segment="true"]',
                ].join(','),
            ),
        ).filter((container) => {
            if (!(container instanceof HTMLElement)) {
                return false;
            }

            if (
                !container.isConnected
                || container.offsetParent === null
            ) {
                return false;
            }

            const buttons = getSegmentButtons(container);

            if (buttons.length < 2) {
                return false;
            }

            /*
             * Исключаем главный переключатель:
             * «Приложения / Сайты».
             */
            const labels = buttons.map(normalizeSegmentLabel);

            const isRootContainer = labels.some(
                (label) =>
                    label === 'приложения'
                    || label === 'applications',
            ) && labels.some(
                (label) =>
                    label === 'сайты'
                    || label === 'websites'
                    || label === 'sites',
            );

            return !isRootContainer;
        });

        /*
         * После перехода:
         *
         * Приложения:
         * 1-й дочерний контейнер -> Android
         * последний контейнер    -> Опубликованные
         *
         * Сайты:
         * единственный контейнер  -> Опубликованные
         *
         * Во всех случаях начальная кнопка — первая.
         */
        containers.forEach(resetContainerToFirstButton);

        window.requestAnimationFrame(() => {
            syncAllSegments(scope);
        });
    };

    /*
     * Первый проход выполняется уже после завершения
     * текущего click-события и React setState.
     *
     * Дополнительные проходы нужны на случай,
     * если вложенные SegmentButton создаются
     * во время следующего React-рендера.
     */
    queueMicrotask(resetAfterRender);
    window.requestAnimationFrame(resetAfterRender);
    window.setTimeout(resetAfterRender, 70);
    window.setTimeout(resetAfterRender, 170);
    window.setTimeout(resetAfterRender, 320);
}

export default function LiquidGlassRuntime() {
    const pathname = usePathname();
    const cursorRef = useRef(null);
    const cursorCoreRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        let observer = null;
        let resizeObserver = null;
        let scanTimer = null;
        let resizeTimer = null;
        let cursorStopTimer = null;
        let cursorFrame = null;
        let cursorEnabled = false;
        let cursorX = 0;
        let cursorY = 0;
        let previousCursorX = 0;
        let previousCursorY = 0;
        let cursorAngle = 0;
        let cursorStretch = 1;

        const enhanceProjectCards = (root = document) => {
            const searchRoot = root instanceof Element ? root : document;

            /*
             * Прозрачные карточки контента должны сохранять собственный
             * WebGL/CSS glass pipeline независимо от нового Navbar.
             *
             * CSS Modules добавляют хэш к именам классов, но сохраняют
             * исходную часть contactCard/developerCard, поэтому селекторы
             * ниже одинаково работают в RU/EN и после production build.
             */
            searchRoot
                .querySelectorAll(
                    [
                        '.project-card',
                        '[class*="contactCard"]',
                        '[class*="developerCard"]',

                        /* Privacy Policy — RU/EN CSS Modules. */
                        '[class*="PrivacyPolicy_hero"]',
                        '[class*="PrivacyPolicy_navigationCard"]',
                        '[class*="PrivacyPolicy_introduction"]',
                        '[class*="PrivacyPolicy_policySection"]',
                        '[class*="PrivacyPolicy_documentFooter"]',
                        '[class*="PrivacyPolicy_purposeCard"]',
                        '[class*="PrivacyPolicy_consentCard"]',
                        '[class*="PrivacyPolicy_serviceItem"]',
                        '[class*="PrivacyPolicy_worldCard"]',
                        '[class*="PrivacyPolicy_licenseCard"]',
                        '[class*="PrivacyPolicy_contactCard"]',
                        '[class*="PrivacyPolicy_notice"]',
                        '[class*="PrivacyPolicy_warningNotice"]',
                        '[class*="PrivacyPolicy_primaryNotice"]',
                        '[class*="PrivacyPolicy_updateCard"]',
                        '[class*="PrivacyPolicy_securityGrid"] > div',
                        '[class*="PrivacyPolicy_checkList"] > li',
                    ].join(','),
                )
                .forEach((card) => {
                    if (!(card instanceof HTMLElement)) {
                        return;
                    }

                    card.classList.add(
                        'raf-content-glass-card',
                    );

                    if (card.matches('.project-card')) {
                        /*
                         * Важно: внутрь React-карточки ничего не вставляется.
                         * Только классы и CSS-переменные — React безопасно
                         * удаляет и заменяет карточки при SegmentButton.
                         */
                        card.classList.add('raf-liquid-card');
                        card.style.setProperty('--raf-water-x', '16%');
                        card.style.setProperty('--raf-water-y', '24%');
                    }
                });
        };

        const scanInterface = (root = document) => {
            if (cancelled) {
                return;
            }

            enhanceHeader();
            syncAllSegments(root);
            enhanceButtons(root);
            enhanceProjectCards(root);
        };

        const scheduleInterfaceScan = (root = document) => {
            window.clearTimeout(scanTimer);
            scanTimer = window.setTimeout(() => {
                scanInterface(root);
            }, 36);
        };

        const updateCursorVisual = () => {
            const cursor = cursorRef.current;

            if (!(cursor instanceof HTMLElement) || !cursorEnabled) {
                return;
            }

            cursor.style.setProperty('--raf-cursor-x', `${cursorX}px`);
            cursor.style.setProperty('--raf-cursor-y', `${cursorY}px`);
            cursor.style.setProperty('--raf-cursor-angle', `${cursorAngle}rad`);
            cursor.style.setProperty(
                '--raf-cursor-stretch',
                String(cursorStretch),
            );

            cursorFrame = null;
        };

        const scheduleCursorVisual = () => {
            if (cursorFrame !== null) {
                return;
            }

            cursorFrame = window.requestAnimationFrame(updateCursorVisual);
        };

        const setCursorStopped = () => {
            const cursor = cursorRef.current;

            if (!(cursor instanceof HTMLElement)) {
                return;
            }

            cursor.classList.remove('raf-water-cursor--moving');
            cursorStretch = 1;
            scheduleCursorVisual();
        };

        const handlePointerMove = (event) => {
            if (cursorEnabled && event.pointerType !== 'touch') {
                const deltaX = event.clientX - previousCursorX;
                const deltaY = event.clientY - previousCursorY;
                const speed = Math.hypot(deltaX, deltaY);

                cursorX = event.clientX;
                cursorY = event.clientY;

                if (speed > 0.2) {
                    cursorAngle = Math.atan2(deltaY, deltaX);
                }

                cursorStretch = Math.min(1.72, 1 + speed * 0.026);

                previousCursorX = event.clientX;
                previousCursorY = event.clientY;

                const cursor = cursorRef.current;

                if (cursor instanceof HTMLElement) {
                    cursor.classList.add(
                        'raf-water-cursor--visible',
                        'raf-water-cursor--moving',
                    );
                }

                window.clearTimeout(cursorStopTimer);
                cursorStopTimer = window.setTimeout(
                    setCursorStopped,
                    86,
                );

                scheduleCursorVisual();
            }

            const target = event.target?.closest?.(
                [
                    '.project-card',
                    '.raf-liquid-button',
                    '.raf-liquid-segment-button',
                ].join(','),
            );

            if (!(target instanceof HTMLElement)) {
                return;
            }

            const rect = target.getBoundingClientRect();

            target.style.setProperty(
                '--raf-water-x',
                `${event.clientX - rect.left}px`,
            );
            target.style.setProperty(
                '--raf-water-y',
                `${event.clientY - rect.top}px`,
            );
        };

        const handlePointerDown = (event) => {
            if (cursorEnabled && event.pointerType !== 'touch') {
                const cursor = cursorRef.current;

                if (cursor instanceof HTMLElement) {
                    cursor.classList.remove(
                        'raf-water-cursor--pressing',
                    );

                    void cursor.offsetWidth;

                    cursor.classList.add(
                        'raf-water-cursor--visible',
                        'raf-water-cursor--pressing',
                    );
                }
            }

            const segmentButton = event.target?.closest?.(
                [
                    '.raf-liquid-segment-button',
                    '[data-liquid-segment-button="true"]',
                ].join(','),
            );

            if (segmentButton instanceof HTMLButtonElement) {
                const container =
                    segmentButton.closest(
                        [
                            '.raf-liquid-segment',
                            '[data-liquid-segment="true"]',
                            '.project-segment',
                        ].join(','),
                    ) ?? segmentButton.parentElement;

                if (!(container instanceof HTMLElement)) {
                    return;
                }

                const buttons = getSegmentButtons(container);
                const selectedIndex = buttons.indexOf(segmentButton);

                if (selectedIndex < 0) {
                    return;
                }

                /*
                 * Немедленная визуальная реакция.
                 * Настоящее состояние меняется собственным
                 * React onClick этой кнопки.
                 */
                container.dataset.liquidActiveIndex =
                    String(selectedIndex);

                moveSegmentBubble(container, segmentButton, {
                    animateImpact: true,
                });

                if (isProjectsRootButton(segmentButton)) {
                    resetVisibleProjectSegments(segmentButton);
                }

                return;
            }

            /*
             * Ripple добавляется только в обычные кнопки. В project-card
             * дочерние DOM-узлы не создаём, чтобы не конфликтовать с React.
             */
            const target = event.target?.closest?.('.raf-liquid-button');

            if (target instanceof HTMLElement) {
                addWaterRipple(target, event);
            }
        };

        const handlePointerUp = () => {
            const cursor = cursorRef.current;

            if (cursor instanceof HTMLElement) {
                window.setTimeout(() => {
                    cursor.classList.remove(
                        'raf-water-cursor--pressing',
                    );
                }, 500);
            }
        };

        const handlePointerLeave = () => {
            const cursor = cursorRef.current;

            if (cursor instanceof HTMLElement) {
                cursor.classList.remove(
                    'raf-water-cursor--visible',
                    'raf-water-cursor--moving',
                    'raf-water-cursor--pressing',
                );
            }
        };

        const handleResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                syncAllSegments();
            }, 160);
        };

        const initialize = async () => {
            await waitForHydration();

            if (cancelled) {
                return;
            }

            const finePointer = window.matchMedia(
                '(hover: hover) and (pointer: fine)',
            );

            cursorEnabled =
                finePointer.matches
                && !window.matchMedia(
                    '(prefers-reduced-motion: reduce)',
                ).matches;

            document.documentElement.classList.toggle(
                'raf-water-cursor-enabled',
                cursorEnabled,
            );

            scanInterface();

            observer = new MutationObserver((mutations) => {
                let interfaceChanged = false;

                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        const changedNodes = [
                            ...mutation.addedNodes,
                            ...mutation.removedNodes,
                        ];

                        if (
                            changedNodes.some(
                                (node) =>
                                    node instanceof HTMLElement &&
                                    !node.classList.contains('raf-water-underlay') &&
                                    !node.classList.contains('raf-water-ripple'),
                            )
                        ) {
                            interfaceChanged = true;
                        }
                    }

                    if (
                        mutation.type === 'attributes' &&
                        mutation.target instanceof HTMLButtonElement &&
                        mutation.target.closest(
                            '.raf-liquid-segment, [data-liquid-segment="true"]',
                        )
                    ) {
                        interfaceChanged = true;
                    }
                }

                if (interfaceChanged) {
                    scheduleInterfaceScan();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [
                    'class',
                    'aria-pressed',
                    'aria-selected',
                    'data-state',
                ],
            });

            resizeObserver = new ResizeObserver(() => {
                handleResize();
            });

            const pageRoot = document.querySelector('#raf-page-root');

            if (pageRoot instanceof HTMLElement) {
                resizeObserver.observe(pageRoot);
            }
        };

        document.addEventListener('pointermove', handlePointerMove, {
            passive: true,
        });
        document.addEventListener('pointerdown', handlePointerDown, {
            passive: true,
        });
        document.addEventListener('pointerup', handlePointerUp, {
            passive: true,
        });
        document.addEventListener('pointercancel', handlePointerUp, {
            passive: true,
        });
        document.documentElement.addEventListener(
            'pointerleave',
            handlePointerLeave,
            { passive: true },
        );
        window.addEventListener('resize', handleResize, {
            passive: true,
        });

        initialize();

        return () => {
            cancelled = true;

            window.clearTimeout(scanTimer);
            window.clearTimeout(resizeTimer);
            window.clearTimeout(cursorStopTimer);

            if (cursorFrame !== null) {
                window.cancelAnimationFrame(cursorFrame);
            }

            document.documentElement.classList.remove(
                'raf-water-cursor-enabled',
            );

            observer?.disconnect();
            resizeObserver?.disconnect();

            document.removeEventListener(
                'pointermove',
                handlePointerMove,
            );
            document.removeEventListener(
                'pointerdown',
                handlePointerDown,
            );
            document.removeEventListener(
                'pointerup',
                handlePointerUp,
            );
            document.removeEventListener(
                'pointercancel',
                handlePointerUp,
            );
            document.documentElement.removeEventListener(
                'pointerleave',
                handlePointerLeave,
            );
            window.removeEventListener('resize', handleResize);

            document
                .querySelectorAll('.raf-water-ripple')
                .forEach((element) => element.remove());
        };
    }, [pathname]);

    return (
        <span
            ref={cursorRef}
            className="raf-water-cursor"
            aria-hidden="true"
        >
            <span
                ref={cursorCoreRef}
                className="raf-water-cursor__core"
            />
            <span className="raf-water-cursor__highlight" />
            <span className="raf-water-cursor__ring" />
        </span>
    );
}