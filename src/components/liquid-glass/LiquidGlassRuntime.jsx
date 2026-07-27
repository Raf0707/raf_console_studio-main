'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const LIQUID_GLASS_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/@ybouane/liquidglass@1.0.3/dist/index.js';

const HEADER_CONFIG = {
  blurAmount: 0.07,
  refraction: 1.04,
  chromAberration: 0.018,
  edgeHighlight: 0.24,
  specular: 0.5,
  fresnel: 0.98,
  distortion: 0.022,
  cornerRadius: 28,
  zRadius: 22,
  opacity: 0.76,
  saturation: -0.12,
  brightness: 0.015,
  shadowOpacity: 0.2,
  shadowSpread: 15,
  shadowOffsetY: 4,
};

const PROJECT_CARD_CONFIG = {
  blurAmount: 0.11,
  refraction: 0.86,
  chromAberration: 0.02,
  edgeHighlight: 0.22,
  specular: 0.44,
  fresnel: 0.96,
  distortion: 0.03,
  cornerRadius: 32,
  zRadius: 25,
  opacity: 0.82,
  saturation: -0.16,
  brightness: 0.01,
  shadowOpacity: 0.27,
  shadowSpread: 15,
  shadowOffsetY: 5,
};

const CARD_CLASS_TOKENS = [
  'project-card',
  'glassPanel',
  'contactCard',
  'developerCard',
  'serviceCard',
  'aboutPanel',
  'privacyCard',
  'policyCard',
  'studioCard',
  'featureCard',
  'previewCard',
  'modeCard',
  'gameCard',
  'controlCard',
  'settingsCard',
  'formCard',
  'projectCard',
  'projects-filters',
  'projects-empty',
];

const CARD_EXCLUDE_TOKENS = [
  'cardContent',
  'cardTitle',
  'cardDescription',
  'cardValue',
  'cardShine',
  'cardReflection',
  'cardIcon',
  'cardArrow',
  'cardHeader',
  'cardBody',
  'cardFooter',
  'cardGlow',
  'cardNumber',
  'cardLabel',
  'cardImage',
  'cardMedia',
  'grid',
  'page',
  'hero',
  'contentSurface',
];

function supportsLiquidGlass() {
  if (typeof window === 'undefined') {
    return false;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }

  const canvas = document.createElement('canvas');
  const hasWebGL = Boolean(
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl'),
  );

  if (!hasWebGL) {
    return false;
  }

  const memory = Number(navigator.deviceMemory || 8);
  const cores = Number(navigator.hardwareConcurrency || 8);

  return memory >= 4 && cores >= 4;
}

function classText(element) {
  return typeof element.className === 'string'
    ? element.className
    : element.getAttribute('class') || '';
}

function containsToken(element, tokens) {
  const classes = classText(element);
  return tokens.some((token) => classes.includes(token));
}

function parseLuminance(color) {
  const match = color?.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    return 0;
  }

  const values = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  const [red = 0, green = 0, blue = 0] = values;
  return (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
}

function isVisible(element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return rect.width > 0
    && rect.height > 0
    && style.display !== 'none'
    && style.visibility !== 'hidden';
}

function findHeaderPanel(header) {
  return Array.from(header.children).find(
    (element) => element instanceof HTMLElement
      && element.tagName === 'DIV'
      && element.querySelector('nav'),
  );
}

function enhanceNavigation(header, trackedElements) {
  const panel = findHeaderPanel(header);
  const nav = header.querySelector('nav');

  if (panel) {
    panel.classList.add('raf-liquid-header-panel');
    trackedElements.add(panel);
  }

  if (!nav) {
    return;
  }

  nav.classList.add('raf-liquid-nav-items');
  trackedElements.add(nav);

  const dropSlot = Array.from(nav.children).find(
    (child) => child instanceof HTMLElement
      && child.getAttribute('aria-hidden') === 'true',
  );

  if (!dropSlot) {
    return;
  }

  dropSlot.classList.add('raf-nav-drop-slot');
  const drop = dropSlot.firstElementChild;

  if (!(drop instanceof HTMLElement)) {
    return;
  }

  drop.classList.add('raf-nav-drop');
  const [highlight, caustic, ripple] = Array.from(drop.children);
  highlight?.classList.add('raf-nav-drop-highlight');
  caustic?.classList.add('raf-nav-drop-caustic');
  ripple?.classList.add('raf-nav-drop-ripple');
}

function isSegmentRoot(element) {
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

  const hasSelectionState = buttons.some(
    (button) => button.hasAttribute('aria-pressed')
      || button.classList.contains('bg-white')
      || button.classList.contains('text-black'),
  );

  if (!hasSelectionState) {
    return false;
  }

  const radius = Number.parseFloat(
    window.getComputedStyle(element).borderTopLeftRadius,
  ) || 0;

  return radius >= 16;
}

function activateSegment(button) {
  const root = button.parentElement;
  if (!root?.classList.contains('raf-liquid-segment')) {
    return;
  }

  Array.from(root.children).forEach((child) => {
    if (child instanceof HTMLButtonElement) {
      child.classList.toggle(
        'raf-liquid-segment-button--active',
        child === button,
      );
    }
  });

  button.classList.remove('raf-segment-impact');
  void button.offsetWidth;
  button.classList.add('raf-segment-impact');

  window.setTimeout(() => {
    button.classList.remove('raf-segment-impact');
  }, 880);
}

function syncSegments(root = document) {
  const searchRoot = root instanceof Element ? root : document;
  const candidates = [
    ...(isSegmentRoot(searchRoot) ? [searchRoot] : []),
    ...searchRoot.querySelectorAll('.project-segment, div'),
  ];

  candidates.forEach((candidate) => {
    if (!isSegmentRoot(candidate)) {
      return;
    }

    candidate.classList.add('raf-liquid-segment');

    const buttons = Array.from(candidate.children).filter(
      (child) => child instanceof HTMLButtonElement,
    );

    buttons.forEach((button) => {
      button.classList.add('raf-liquid-segment-button');

      const active = button.getAttribute('aria-pressed') === 'true'
        || button.classList.contains('bg-white')
        || button.classList.contains('text-black');

      button.classList.toggle('raf-liquid-segment-button--active', active);
    });
  });
}

function createWaterUnderlay(element) {
  if (element.querySelector(':scope > .raf-water-underlay')) {
    return;
  }

  const underlay = document.createElement('span');
  underlay.className = 'raf-water-underlay';
  underlay.setAttribute('aria-hidden', 'true');
  element.appendChild(underlay);
}

function isCardCandidate(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (
    element.closest('header')
    || element.closest('.raf-liquid-segment')
    || element.classList.contains('raf-liquid-card')
    || containsToken(element, CARD_EXCLUDE_TOKENS)
  ) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  if (rect.width < 145 || rect.height < 84 || rect.height > 920) {
    return false;
  }

  const classes = classText(element);
  const style = window.getComputedStyle(element);
  const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
  const borderWidth = Number.parseFloat(style.borderTopWidth) || 0;
  const explicit = containsToken(element, CARD_CLASS_TOKENS);
  const semantic = element.tagName === 'ARTICLE'
    || (element.tagName === 'A' && rect.height >= 90)
    || classes.includes('backdrop-blur');

  return explicit || (semantic && radius >= 14 && borderWidth > 0);
}

function scanCards(root, trackedElements) {
  const searchRoot = root instanceof Element ? root : document;
  const candidates = [
    ...(isCardCandidate(searchRoot) ? [searchRoot] : []),
    ...searchRoot.querySelectorAll(
      'article, section, a, div, .project-card, .projects-filters, .projects-empty',
    ),
  ];

  candidates.forEach((candidate) => {
    if (!isCardCandidate(candidate)) {
      return;
    }

    candidate.classList.add('raf-liquid-card');
    createWaterUnderlay(candidate);
    trackedElements.add(candidate);
  });
}

function scanButtons(root, trackedElements) {
  const searchRoot = root instanceof Element ? root : document;
  const candidates = [
    ...(searchRoot.matches?.('button, a') ? [searchRoot] : []),
    ...searchRoot.querySelectorAll('button, a'),
  ];

  candidates.forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    if (
      element.closest('.raf-liquid-segment')
      || element.closest('.raf-liquid-nav-items')
      || element.classList.contains('raf-liquid-card')
      || element.classList.contains('raf-liquid-button')
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const classes = classText(element);
    const isButton = element.tagName === 'BUTTON';
    const looksLikeAction = /(button|action|trigger|install|submit|cta)/i.test(classes);

    if (
      (!isButton && !looksLikeAction)
      || rect.width < 30
      || rect.height < 28
      || rect.height > 96
    ) {
      return;
    }

    const style = window.getComputedStyle(element);
    const bright = classes.includes('bg-white')
      || classes.includes('text-black')
      || parseLuminance(style.backgroundColor) > 0.52;

    element.classList.add('raf-liquid-button');
    element.classList.toggle('raf-liquid-button--light', bright);
    element.classList.toggle('raf-liquid-button--dark', !bright);
    createWaterUnderlay(element);
    trackedElements.add(element);
  });
}

function addWaterRipple(target, event) {
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'raf-water-ripple';
  ripple.setAttribute('aria-hidden', 'true');
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 980);
}

export default function LiquidGlassRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const trackedElements = new Set();
    let cancelled = false;
    let pageInstance = null;
    let projectInstance = null;
    let projectRoot = null;
    let projectCards = [];
    let observer = null;
    let scanTimer = null;
    let projectTimer = null;
    let firstFrame = 0;
    let secondFrame = 0;

    document.documentElement.dataset.liquidGlass = supportsLiquidGlass()
      ? 'loading'
      : 'fallback';

    const scanDom = (root = document) => {
      const header = document.querySelector('#raf-liquid-root > header');
      if (header) {
        enhanceNavigation(header, trackedElements);
      }

      syncSegments(root);
      scanCards(root, trackedElements);
      scanButtons(root, trackedElements);
    };

    const scheduleScan = (root = document) => {
      window.clearTimeout(scanTimer);
      scanTimer = window.setTimeout(() => scanDom(root), 50);
    };

    const destroyProjectGlass = () => {
      projectInstance?.destroy();
      projectInstance = null;

      projectCards.forEach((card) => {
        card.classList.remove('raf-liquidglass-surface');
        delete card.dataset.config;
      });

      projectCards = [];
      projectRoot?.classList.remove('raf-liquidglass-root');
      projectRoot = null;
    };

    const initialize = async () => {
      scanDom();

      if (!supportsLiquidGlass()) {
        return;
      }

      try {
        await document.fonts?.ready;
        const { LiquidGlass } = await import(
          /* webpackIgnore: true */ LIQUID_GLASS_MODULE_URL
        );

        if (cancelled) {
          return;
        }

        const root = document.querySelector('#raf-liquid-root');
        const header = root?.querySelector(':scope > header');

        if (root instanceof HTMLElement && header instanceof HTMLElement) {
          root.classList.add('raf-liquidglass-root');
          header.classList.add('raf-liquidglass-surface');
          header.dataset.config = JSON.stringify(HEADER_CONFIG);

          pageInstance = await LiquidGlass.init({
            root,
            glassElements: [header],
          });

          const refreshHeader = () => {
            pageInstance?.markChanged();
          };

          window.addEventListener('scroll', refreshHeader, { passive: true });
          window.addEventListener('resize', refreshHeader, { passive: true });
          root._rafLiquidCleanup = () => {
            window.removeEventListener('scroll', refreshHeader);
            window.removeEventListener('resize', refreshHeader);
          };
        }

        const initializeProjectGlass = async () => {
          destroyProjectGlass();

          const grid = document.querySelector('.projects-grid');
          const cards = grid
            ? Array.from(grid.children).filter(
              (element) => element.classList?.contains('project-card'),
            )
            : [];

          if (!(grid instanceof HTMLElement) || cards.length === 0 || cancelled) {
            return;
          }

          grid.classList.add('raf-liquidglass-root');

          cards.forEach((card) => {
            card.classList.add('raf-liquidglass-surface', 'raf-liquid-card');
            card.dataset.config = JSON.stringify(PROJECT_CARD_CONFIG);
            createWaterUnderlay(card);
          });

          projectRoot = grid;
          projectCards = cards;
          projectInstance = await LiquidGlass.init({
            root: grid,
            glassElements: cards,
          });
        };

        await initializeProjectGlass();

        if (!cancelled) {
          document.documentElement.dataset.liquidGlass = 'ready';
        }

        observer = new MutationObserver((mutations) => {
          const addedRoots = [];
          let projectsChanged = false;

          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                addedRoots.push(node);
              }
            });

            if (
              mutation.target instanceof HTMLElement
              && mutation.target.classList.contains('projects-grid')
            ) {
              projectsChanged = true;
            }
          });

          addedRoots.forEach((node) => scheduleScan(node));

          if (projectsChanged) {
            window.clearTimeout(projectTimer);
            projectTimer = window.setTimeout(() => {
              initializeProjectGlass().catch((error) => {
                console.warn('[LiquidGlass] Project card refresh failed:', error);
              });
            }, 90);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      } catch (error) {
        console.warn('[LiquidGlass] WebGL enhancement unavailable:', error);
        document.documentElement.dataset.liquidGlass = 'fallback';
      }
    };

    const handlePointerMove = (event) => {
      const target = event.target?.closest?.(
        '.raf-liquid-card, .raf-liquid-button, .raf-liquid-segment-button',
      );

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const rect = target.getBoundingClientRect();
      target.style.setProperty('--raf-water-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--raf-water-y', `${event.clientY - rect.top}px`);
    };

    const handlePointerDown = (event) => {
      const segmentButton = event.target?.closest?.('.raf-liquid-segment-button');
      if (segmentButton instanceof HTMLButtonElement) {
        activateSegment(segmentButton);
      }

      const target = event.target?.closest?.(
        '.raf-liquid-card, .raf-liquid-button, .raf-liquid-segment-button',
      );

      if (target instanceof HTMLElement) {
        addWaterRipple(target, event);
      }
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });

    /* Два кадра гарантируют, что React полностью завершил hydration до любых
       canvas-вставок и служебных DOM-классов. */
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(initialize);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(scanTimer);
      window.clearTimeout(projectTimer);
      observer?.disconnect();
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);

      const root = document.querySelector('#raf-liquid-root');
      root?._rafLiquidCleanup?.();
      pageInstance?.destroy();
      destroyProjectGlass();

      document
        .querySelectorAll('.raf-water-underlay, .raf-water-ripple')
        .forEach((element) => element.remove());

      trackedElements.forEach((element) => {
        element.classList.remove(
          'raf-liquid-card',
          'raf-liquid-button',
          'raf-liquid-button--light',
          'raf-liquid-button--dark',
          'raf-liquid-header-panel',
          'raf-liquid-nav-items',
        );
      });

      document
        .querySelectorAll('.raf-liquid-segment, .raf-liquid-segment-button')
        .forEach((element) => {
          element.classList.remove(
            'raf-liquid-segment',
            'raf-liquid-segment-button',
            'raf-liquid-segment-button--active',
            'raf-segment-impact',
          );
        });

      document
        .querySelectorAll('.raf-liquidglass-surface')
        .forEach((element) => {
          element.classList.remove('raf-liquidglass-surface');
          delete element.dataset.config;
        });

      document
        .querySelectorAll('.raf-liquidglass-root')
        .forEach((element) => element.classList.remove('raf-liquidglass-root'));
    };
  }, [pathname]);

  return null;
}
