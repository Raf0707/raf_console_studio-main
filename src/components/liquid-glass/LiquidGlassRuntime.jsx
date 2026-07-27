'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const LIQUID_GLASS_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/@ybouane/liquidglass@1.0.3/dist/index.js';
const HTML2CANVAS_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm';

const HEADER_CONFIG = {
  blurAmount: 0.07,
  refraction: 1.08,
  chromAberration: 0.018,
  edgeHighlight: 0.24,
  specular: 0.52,
  fresnel: 0.98,
  distortion: 0.024,
  cornerRadius: 28,
  zRadius: 23,
  opacity: 0.74,
  saturation: -0.12,
  brightness: 0.015,
  shadowOpacity: 0.22,
  shadowSpread: 16,
  shadowOffsetY: 4,
};

const CARD_CONFIG = {
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

function parseAlpha(color) {
  const match = color?.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    return 0;
  }

  const values = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return values.length >= 4 && Number.isFinite(values[3]) ? values[3] : 1;
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

function findHeaderGlass(header) {
  return Array.from(header.children).find(
    (element) => element instanceof HTMLElement
      && element.tagName === 'DIV'
      && element.querySelector('nav'),
  );
}

function containsProjectCard(node) {
  return node instanceof HTMLElement
    && !node.classList.contains('raf-liquidglass-card-scene')
    && (
      node.classList.contains('project-card')
      || Boolean(node.querySelector('.project-card'))
    );
}

function isVisible(element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return rect.width > 0
    && rect.height > 0
    && style.display !== 'none'
    && style.visibility !== 'hidden';
}

function isCardCandidate(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (
    element.closest('header')
    || element.closest('.project-segment')
    || element.classList.contains('raf-liquid-card')
    || element.classList.contains('raf-water-underlay')
    || element.classList.contains('raf-water-ripple')
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
  const glassGeometry = radius >= 14
    && borderWidth > 0
    && (
      parseAlpha(style.backgroundColor) > 0.01
      || style.backdropFilter !== 'none'
      || classes.includes('bg-')
    );

  return explicit || (semantic && glassGeometry);
}

function isSegmentRoot(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.classList.contains('project-segment')) {
    return true;
  }

  const directButtons = Array.from(element.children).filter(
    (child) => child instanceof HTMLButtonElement,
  );

  if (directButtons.length < 2 || directButtons.length > 8) {
    return false;
  }

  const hasSelectionState = directButtons.some(
    (button) => button.hasAttribute('aria-pressed')
      || button.classList.contains('bg-white'),
  );

  if (!hasSelectionState) {
    return false;
  }

  const style = window.getComputedStyle(element);
  const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;

  return radius >= 16;
}

function isActiveSegmentButton(button) {
  return button.getAttribute('aria-pressed') === 'true'
    || button.classList.contains('bg-white')
    || button.classList.contains('text-black');
}

function createWaterUnderlay() {
  const layer = document.createElement('span');
  layer.className = 'raf-water-underlay';
  layer.setAttribute('aria-hidden', 'true');
  return layer;
}

function enhanceSurface(element, className, enhancedElements) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.classList.add(className);
  enhancedElements.add(element);

  if (!element.querySelector(':scope > .raf-water-underlay')) {
    element.appendChild(createWaterUnderlay());
  }
}

function syncSegments(root = document) {
  const candidates = root === document
    ? Array.from(document.querySelectorAll('.project-segment, div'))
    : [root, ...root.querySelectorAll?.('.project-segment, div') || []];

  candidates.forEach((candidate) => {
    if (!isSegmentRoot(candidate)) {
      return;
    }

    candidate.classList.add('raf-liquid-segment');

    Array.from(candidate.children).forEach((child) => {
      if (!(child instanceof HTMLButtonElement)) {
        return;
      }

      child.classList.add('raf-liquid-segment-button');
      child.classList.toggle(
        'raf-liquid-segment-button--active',
        isActiveSegmentButton(child),
      );
    });
  });
}

function scanCards(root, enhancedElements) {
  const searchRoot = root instanceof Element ? root : document;
  const candidates = [
    ...(isCardCandidate(searchRoot) ? [searchRoot] : []),
    ...searchRoot.querySelectorAll(
      'article, section, a, div, .project-card, .projects-filters, .projects-empty',
    ),
  ];

  candidates.forEach((candidate) => {
    if (isCardCandidate(candidate)) {
      enhanceSurface(candidate, 'raf-liquid-card', enhancedElements);
    }
  });
}

function scanButtons(root, enhancedElements) {
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
      || element.closest('.raf-liquid-card') === element
      || element.classList.contains('raf-liquid-button')
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const classes = classText(element);
    const isButton = element.tagName === 'BUTTON';
    const looksLikeAction = /(button|action|trigger|install|submit|cta)/i.test(classes);

    if ((!isButton && !looksLikeAction) || rect.width < 30 || rect.height < 28 || rect.height > 96) {
      return;
    }

    const style = window.getComputedStyle(element);
    const bright = classes.includes('bg-white')
      || classes.includes('text-black')
      || parseLuminance(style.backgroundColor) > 0.52;

    enhanceSurface(element, 'raf-liquid-button', enhancedElements);
    element.classList.toggle('raf-liquid-button--light', bright);
    element.classList.toggle('raf-liquid-button--dark', !bright);
  });
}

function enhanceNavigation(header, enhancedElements) {
  const nav = header.querySelector('nav');
  if (!nav) {
    return;
  }

  nav.classList.add('raf-liquid-nav-items');
  enhancedElements.add(nav);

  const dropSlot = Array.from(nav.children).find(
    (child) => child instanceof HTMLElement && child.getAttribute('aria-hidden') === 'true',
  );

  if (!dropSlot) {
    return;
  }

  dropSlot.classList.add('raf-nav-drop-slot');
  const drop = dropSlot.firstElementChild;

  if (drop instanceof HTMLElement) {
    drop.classList.add('raf-nav-drop');

    const [highlight, caustic, ripple] = Array.from(drop.children);
    highlight?.classList.add('raf-nav-drop-highlight');
    caustic?.classList.add('raf-nav-drop-caustic');
    ripple?.classList.add('raf-nav-drop-ripple');
  }
}

function createHeaderCaptureCanvas(header) {
  const canvas = document.createElement('canvas');
  canvas.className = 'raf-liquidglass-header-capture';
  canvas.setAttribute('aria-hidden', 'true');
  header.insertBefore(canvas, header.firstChild);
  return canvas;
}

async function captureHeaderBackground({
  html2canvas,
  header,
  panel,
  canvas,
}) {
  const pageRoot = document.querySelector('#raf-page-root');
  if (!pageRoot || !html2canvas || !isVisible(panel)) {
    return false;
  }

  const panelRect = panel.getBoundingClientRect();
  const headerRect = header.getBoundingClientRect();
  const pageRect = pageRoot.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 1.45);

  const shot = await html2canvas(pageRoot, {
    backgroundColor: '#080a11',
    x: Math.max(0, panelRect.left - pageRect.left),
    y: Math.max(0, panelRect.top - pageRect.top),
    width: Math.ceil(panelRect.width),
    height: Math.ceil(panelRect.height),
    scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    removeContainer: true,
    imageTimeout: 2500,
    ignoreElements: (element) => element.classList?.contains('raf-water-ripple'),
  });

  canvas.width = shot.width;
  canvas.height = shot.height;
  canvas.style.left = `${panelRect.left - headerRect.left}px`;
  canvas.style.top = `${panelRect.top - headerRect.top}px`;
  canvas.style.width = `${panelRect.width}px`;
  canvas.style.height = `${panelRect.height}px`;
  canvas.style.borderRadius = window.getComputedStyle(panel).borderRadius;

  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(shot, 0, 0);

  return true;
}

function createCardScenes(root, cards) {
  const rootRect = root.getBoundingClientRect();

  return cards.map((card, index) => {
    const rect = card.getBoundingClientRect();
    const scene = document.createElement('span');
    scene.className = 'raf-liquidglass-card-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.style.left = `${rect.left - rootRect.left}px`;
    scene.style.top = `${rect.top - rootRect.top}px`;
    scene.style.width = `${rect.width}px`;
    scene.style.height = `${rect.height}px`;
    scene.style.setProperty('--scene-index', String(index));
    scene.style.borderRadius = window.getComputedStyle(card).borderRadius;
    root.insertBefore(scene, root.firstChild);
    return scene;
  });
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
  window.setTimeout(() => ripple.remove(), 980);
}

export default function LiquidGlassRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const enhancedElements = new Set();
    let cancelled = false;
    let headerInstance = null;
    let cardsInstance = null;
    let cardsRoot = null;
    let cardElements = [];
    let cardScenes = [];
    let headerCapture = null;
    let captureTimer = null;
    let scanTimer = null;
    let cardsTimer = null;
    let cardsInitVersion = 0;
    let observer = null;

    document.documentElement.dataset.liquidGlass = supportsLiquidGlass()
      ? 'loading'
      : 'fallback';

    const scanDom = (root = document) => {
      syncSegments(root);
      scanCards(root, enhancedElements);
      scanButtons(root, enhancedElements);

      const header = document.querySelector('body header');
      if (header) {
        const panel = findHeaderGlass(header);
        panel?.classList.add('raf-liquid-header-panel');
        if (panel) {
          enhancedElements.add(panel);
        }
        enhanceNavigation(header, enhancedElements);
      }
    };

    const scheduleScan = (root = document) => {
      window.clearTimeout(scanTimer);
      scanTimer = window.setTimeout(() => scanDom(root), 60);
    };

    const destroyCards = () => {
      cardsInitVersion += 1;
      cardsInstance?.destroy();
      cardsInstance = null;

      cardElements.forEach((card) => {
        card.classList.remove('raf-liquidglass-surface');
        delete card.dataset.config;
      });
      cardElements = [];

      cardScenes.forEach((scene) => scene.remove());
      cardScenes = [];

      cardsRoot?.classList.remove('raf-liquidglass-root');
      cardsRoot = null;
    };

    const initialize = async () => {
      scanDom();

      if (!supportsLiquidGlass()) {
        return;
      }

      try {
        await document.fonts?.ready;

        const [liquidModule, captureModule] = await Promise.all([
          import(/* webpackIgnore: true */ LIQUID_GLASS_MODULE_URL),
          import(/* webpackIgnore: true */ HTML2CANVAS_MODULE_URL).catch(() => null),
        ]);

        if (cancelled) {
          return;
        }

        const { LiquidGlass } = liquidModule;
        const html2canvas = captureModule?.default || captureModule?.html2canvas || null;
        const header = document.querySelector('body header');
        const panel = header ? findHeaderGlass(header) : null;

        if (header && panel && html2canvas) {
          header.classList.add('raf-liquidglass-root');
          panel.classList.add('raf-liquidglass-surface', 'raf-liquid-header-panel');
          panel.dataset.config = JSON.stringify(HEADER_CONFIG);
          headerCapture = createHeaderCaptureCanvas(header);

          try {
            await captureHeaderBackground({
              html2canvas,
              header,
              panel,
              canvas: headerCapture,
            });

            headerInstance = await LiquidGlass.init({
              root: header,
              glassElements: [panel],
            });

            const refreshCapture = () => {
              window.clearTimeout(captureTimer);
              captureTimer = window.setTimeout(async () => {
                if (cancelled) {
                  return;
                }

                try {
                  const changed = await captureHeaderBackground({
                    html2canvas,
                    header,
                    panel,
                    canvas: headerCapture,
                  });

                  if (changed) {
                    headerInstance?.markChanged(headerCapture);
                  }
                } catch (error) {
                  console.warn('[LiquidGlass] Header background refresh failed:', error);
                }
              }, 130);
            };

            window.addEventListener('scroll', refreshCapture, { passive: true });
            window.addEventListener('resize', refreshCapture, { passive: true });
            panel.addEventListener('pointerenter', refreshCapture, { passive: true });

            headerCapture._rafCleanup = () => {
              window.removeEventListener('scroll', refreshCapture);
              window.removeEventListener('resize', refreshCapture);
              panel.removeEventListener('pointerenter', refreshCapture);
            };
          } catch (error) {
            console.warn('[LiquidGlass] Transparent header capture unavailable:', error);
            headerCapture.remove();
            headerCapture = null;
            panel.classList.remove('raf-liquidglass-surface');
            delete panel.dataset.config;
          }
        }

        const initializeCards = async () => {
          destroyCards();
          const initVersion = cardsInitVersion;
          const root = document.querySelector('.projects-grid');
          const cards = root
            ? Array.from(root.children).filter(
              (element) => element.classList?.contains('project-card'),
            )
            : [];

          if (!root || cards.length === 0 || cancelled) {
            return;
          }

          root.classList.add('raf-liquidglass-root');
          cards.forEach((card) => {
            card.classList.add('raf-liquidglass-surface', 'raf-liquid-card');
            card.dataset.config = JSON.stringify(CARD_CONFIG);
            enhanceSurface(card, 'raf-liquid-card', enhancedElements);
          });

          const scenes = createCardScenes(root, cards);
          cardsRoot = root;
          cardElements = cards;
          cardScenes = scenes;

          const instance = await LiquidGlass.init({
            root,
            glassElements: cards,
          });

          if (cancelled || initVersion !== cardsInitVersion) {
            instance.destroy();
            return;
          }

          cardsInstance = instance;
        };

        await initializeCards();

        if (!cancelled) {
          document.documentElement.dataset.liquidGlass = 'ready';
        }

        observer = new MutationObserver((mutations) => {
          const relevantMutations = mutations.filter((mutation) => {
            if (mutation.type === 'attributes') {
              return mutation.attributeName === 'class'
                || mutation.attributeName === 'aria-pressed';
            }

            return [...mutation.addedNodes, ...mutation.removedNodes].some(
              (node) => !(node instanceof HTMLElement)
                || !node.classList.contains('raf-water-ripple'),
            );
          });

          if (relevantMutations.length === 0) {
            return;
          }

          const projectsChanged = relevantMutations.some((mutation) => (
            mutation.type === 'childList'
            && [...mutation.addedNodes, ...mutation.removedNodes].some(containsProjectCard)
          ));

          if (projectsChanged) {
            window.clearTimeout(cardsTimer);
            cardsTimer = window.setTimeout(() => {
              initializeCards().catch((error) => {
                console.warn('[LiquidGlass] Card refresh failed:', error);
                document.documentElement.dataset.liquidGlass = 'partial';
              });
            }, 100);
          }

          scheduleScan();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'aria-pressed'],
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
      const target = event.target?.closest?.(
        '.raf-liquid-card, .raf-liquid-button, .raf-liquid-segment-button',
      );

      if (!(target instanceof HTMLElement)) {
        return;
      }

      addWaterRipple(target, event);

      if (target.classList.contains('raf-liquid-segment-button')) {
        target.classList.remove('raf-segment-impact');
        void target.offsetWidth;
        target.classList.add('raf-segment-impact');
        window.setTimeout(() => target.classList.remove('raf-segment-impact'), 900);
      }
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const frame = window.requestAnimationFrame(initialize);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(captureTimer);
      window.clearTimeout(scanTimer);
      window.clearTimeout(cardsTimer);
      observer?.disconnect();
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);

      headerCapture?._rafCleanup?.();
      headerInstance?.destroy();
      destroyCards();
      headerCapture?.remove();

      document
        .querySelectorAll('.raf-water-underlay, .raf-water-ripple')
        .forEach((element) => element.remove());

      enhancedElements.forEach((element) => {
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

  return (
    <style jsx global>{`
      .raf-liquidglass-root {
        position: relative;
        isolation: isolate;
      }

      .raf-liquidglass-header-capture {
        position: absolute;
        z-index: -2;
        display: block;
        pointer-events: none;
        object-fit: cover;
      }

      .raf-liquid-header-panel {
        background: rgba(255, 255, 255, 0.026) !important;
        border-color: rgba(255, 255, 255, 0.23) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.28),
          inset 0 -1px 0 rgba(255, 255, 255, 0.055),
          -1.4rem 0 3.8rem -2.7rem rgba(255, 255, 255, 0.34),
          1.4rem 0 3.8rem -2.7rem rgba(255, 255, 255, 0.22),
          0 1.1rem 3rem rgba(0, 0, 0, 0.2) !important;
        backdrop-filter: blur(20px) saturate(135%) contrast(105%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(135%) contrast(105%) !important;
      }

      .raf-liquid-header-panel::before,
      .raf-liquid-header-panel::after {
        opacity: 0.32 !important;
      }

      html[data-liquid-glass='ready'] .raf-liquid-header-panel {
        background: rgba(255, 255, 255, 0.008) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .raf-liquid-nav-items {
        overflow: visible !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .raf-liquid-nav-items::before {
        display: none !important;
      }

      .raf-liquid-nav-items a {
        color: rgba(255, 255, 255, 0.66) !important;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.28) !important;
      }

      .raf-liquid-nav-items a:hover,
      .raf-liquid-nav-items a[aria-current='page'],
      .raf-liquid-nav-items a[class*='desktopLinkActive'] {
        color: rgba(255, 255, 255, 0.98) !important;
        text-shadow: 0 0 1.1rem rgba(255, 255, 255, 0.25) !important;
      }

      .raf-nav-drop-slot {
        overflow: visible !important;
      }

      .raf-nav-drop {
        overflow: hidden !important;
        border-color: rgba(255, 255, 255, 0.48) !important;
        background:
          radial-gradient(ellipse at 28% 12%, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.12) 24%, transparent 43%),
          radial-gradient(ellipse at 78% 84%, rgba(255, 255, 255, 0.18), transparent 46%),
          linear-gradient(132deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.025) 46%, rgba(255, 255, 255, 0.11)) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.72),
          inset 0 -1px 0 rgba(255, 255, 255, 0.1),
          inset 0 0 1rem rgba(255, 255, 255, 0.08),
          0 0.7rem 1.6rem rgba(0, 0, 0, 0.2) !important;
        backdrop-filter: blur(7px) saturate(125%) contrast(106%) !important;
        -webkit-backdrop-filter: blur(7px) saturate(125%) contrast(106%) !important;
      }

      .raf-nav-drop-highlight {
        opacity: 0.62 !important;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.68), transparent) !important;
      }

      .raf-nav-drop-caustic {
        opacity: 0.38 !important;
        background: radial-gradient(ellipse, rgba(255, 255, 255, 0.58), transparent 70%) !important;
      }

      .raf-nav-drop-ripple {
        border-color: rgba(255, 255, 255, 0.55) !important;
        box-shadow: 0 0 1rem rgba(255, 255, 255, 0.12) !important;
      }

      .raf-liquidglass-card-scene {
        position: absolute;
        z-index: 0;
        display: block;
        pointer-events: none;
        background:
          radial-gradient(ellipse at 0% 38%, rgba(255, 255, 255, 0.19), transparent 36%),
          radial-gradient(ellipse at 100% 72%, rgba(255, 255, 255, 0.12), transparent 40%),
          linear-gradient(132deg, rgba(255, 255, 255, 0.035), transparent 42%, rgba(255, 255, 255, 0.025));
        opacity: 0.72;
      }

      .projects-grid.raf-liquidglass-root {
        position: relative;
      }

      .projects-grid.raf-liquidglass-root > .project-card {
        z-index: 1;
      }

      .raf-liquid-card {
        --raf-water-x: 18%;
        --raf-water-y: 18%;
        position: relative;
        overflow: hidden;
        isolation: isolate;
        border-color: rgba(255, 255, 255, 0.16) !important;
        background: rgba(255, 255, 255, 0.026) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.18),
          inset 0 -1px 0 rgba(255, 255, 255, 0.035),
          -1.8rem 0 4rem -3.2rem rgba(255, 255, 255, 0.42),
          1.8rem 0 4rem -3.2rem rgba(255, 255, 255, 0.24),
          0 2rem 5rem -3rem rgba(0, 0, 0, 0.84) !important;
        backdrop-filter: blur(20px) saturate(128%) contrast(104%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(128%) contrast(104%) !important;
      }

      .raf-liquid-card:hover {
        border-color: rgba(255, 255, 255, 0.28) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.28),
          inset 0 -1px 0 rgba(255, 255, 255, 0.055),
          -2rem 0 4.8rem -3.25rem rgba(255, 255, 255, 0.58),
          2rem 0 4.8rem -3.25rem rgba(255, 255, 255, 0.34),
          0 2.4rem 5.5rem -3rem rgba(0, 0, 0, 0.9) !important;
      }

      html[data-liquid-glass='ready'] .raf-liquidglass-surface.raf-liquid-card {
        background: rgba(255, 255, 255, 0.006) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .raf-water-underlay {
        position: absolute;
        z-index: 0;
        inset: -30%;
        display: block;
        pointer-events: none;
        border-radius: inherit;
        opacity: 0;
        background:
          radial-gradient(16rem circle at var(--raf-water-x) var(--raf-water-y), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.055) 28%, transparent 66%),
          conic-gradient(from 218deg at 32% 28%, transparent 0 18%, rgba(255, 255, 255, 0.11) 27%, transparent 39% 58%, rgba(255, 255, 255, 0.075) 68%, transparent 82%);
        filter: blur(14px);
        mix-blend-mode: screen;
        transform: translate3d(-7%, -4%, 0) rotate(-10deg) scale(0.94);
        transition: opacity 420ms ease, transform 850ms cubic-bezier(0.2, 0.8, 0.2, 1);
        will-change: opacity, transform;
      }

      .raf-liquid-card:hover > .raf-water-underlay,
      .raf-liquid-button:hover > .raf-water-underlay,
      .raf-liquid-segment-button:hover > .raf-water-underlay {
        opacity: 0.78;
        transform: translate3d(8%, 7%, 0) rotate(8deg) scale(1.08);
        animation: rafWaterDrift 5.4s ease-in-out infinite alternate;
      }

      .raf-water-ripple {
        position: absolute;
        z-index: 5;
        width: 2.2rem;
        height: 2.2rem;
        pointer-events: none;
        border: 1px solid rgba(255, 255, 255, 0.48);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 68%);
        box-shadow: 0 0 1.2rem rgba(255, 255, 255, 0.12);
        transform: translate(-50%, -50%) scale(0.22);
        animation: rafWaterRipple 920ms cubic-bezier(0.15, 0.72, 0.2, 1) forwards;
      }

      .raf-liquid-segment {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        border-color: rgba(255, 255, 255, 0.14) !important;
        background: rgba(255, 255, 255, 0.022) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.11),
          inset 0 -1px 0 rgba(255, 255, 255, 0.025),
          0 1.2rem 3.4rem -2.5rem rgba(255, 255, 255, 0.22),
          0 1.4rem 3.5rem -2.2rem rgba(0, 0, 0, 0.72) !important;
        backdrop-filter: blur(20px) saturate(130%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(130%) !important;
      }

      .raf-liquid-segment-button {
        --raf-water-x: 50%;
        --raf-water-y: 50%;
        position: relative !important;
        overflow: hidden !important;
        isolation: isolate;
        border: 1px solid transparent !important;
        color: rgba(255, 255, 255, 0.52) !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .raf-liquid-segment-button > * {
        position: relative;
        z-index: 3;
      }

      .raf-liquid-segment-button::before {
        position: absolute;
        z-index: 1;
        inset: 2px;
        pointer-events: none;
        content: '';
        border: 1px solid rgba(255, 255, 255, 0.42);
        border-radius: inherit;
        opacity: 0;
        background:
          radial-gradient(ellipse at 26% 10%, rgba(255, 255, 255, 0.46), transparent 38%),
          linear-gradient(138deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.025) 52%, rgba(255, 255, 255, 0.095));
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.6),
          inset 0 -1px 0 rgba(255, 255, 255, 0.06),
          0 0.8rem 1.8rem rgba(0, 0, 0, 0.16);
        backdrop-filter: blur(7px) saturate(125%) !important;
        -webkit-backdrop-filter: blur(7px) saturate(125%) !important;
        transform: scale(0.86);
        transition: opacity 380ms ease, transform 620ms cubic-bezier(0.2, 0.9, 0.16, 1.08);
      }

      .raf-liquid-segment-button--active {
        color: rgba(255, 255, 255, 0.98) !important;
        text-shadow: 0 0 1rem rgba(255, 255, 255, 0.18);
      }

      .raf-liquid-segment-button--active::before {
        opacity: 1;
        transform: scale(1);
      }

      .raf-liquid-segment-button.raf-segment-impact::before {
        animation: rafSegmentDrop 820ms cubic-bezier(0.2, 0.88, 0.18, 1) both;
      }

      .raf-liquid-button {
        --raf-water-x: 50%;
        --raf-water-y: 50%;
        position: relative !important;
        overflow: hidden !important;
        isolation: isolate;
        border: 1px solid rgba(255, 255, 255, 0.24) !important;
        background: rgba(255, 255, 255, 0.055) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.28),
          inset 0 -1px 0 rgba(255, 255, 255, 0.045),
          0 0.8rem 2rem -1.2rem rgba(0, 0, 0, 0.58) !important;
        backdrop-filter: blur(16px) saturate(135%) contrast(105%) !important;
        -webkit-backdrop-filter: blur(16px) saturate(135%) contrast(105%) !important;
      }

      .raf-liquid-button > :not(.raf-water-underlay):not(.raf-water-ripple) {
        position: relative;
        z-index: 3;
      }

      .raf-liquid-button--dark {
        color: rgba(255, 255, 255, 0.9) !important;
        background: rgba(8, 10, 14, 0.18) !important;
      }

      .raf-liquid-button--light {
        color: rgba(10, 12, 16, 0.94) !important;
        border-color: rgba(255, 255, 255, 0.44) !important;
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.12) 52%, rgba(255, 255, 255, 0.26)) !important;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.74),
          inset 0 -1px 0 rgba(255, 255, 255, 0.08),
          0 0.9rem 2.4rem -1.3rem rgba(255, 255, 255, 0.18),
          0 1rem 2.4rem -1.1rem rgba(0, 0, 0, 0.46) !important;
      }

      .raf-liquid-button:hover {
        border-color: rgba(255, 255, 255, 0.42) !important;
        transform: translateY(-1px);
      }

      .raf-liquid-button:active {
        transform: translateY(0) scale(0.97);
      }

      .raf-liquidglass-surface > canvas:first-child {
        pointer-events: none !important;
      }

      @keyframes rafWaterDrift {
        0% {
          transform: translate3d(-7%, -4%, 0) rotate(-10deg) scale(0.96);
        }
        48% {
          transform: translate3d(10%, 8%, 0) rotate(7deg) scale(1.1);
        }
        100% {
          transform: translate3d(3%, -2%, 0) rotate(-2deg) scale(1.04);
        }
      }

      @keyframes rafWaterRipple {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.18);
        }
        18% {
          opacity: 0.68;
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(8.5);
        }
      }

      @keyframes rafSegmentDrop {
        0%, 100% {
          transform: scaleX(1) scaleY(1);
        }
        18% {
          transform: scaleX(0.87) scaleY(1.12);
        }
        38% {
          transform: scaleX(1.16) scaleY(0.82);
        }
        60% {
          transform: scaleX(0.95) scaleY(1.06);
        }
        80% {
          transform: scaleX(1.035) scaleY(0.98);
        }
      }

      @media (max-width: 767px) {
        .raf-liquid-card {
          backdrop-filter: blur(15px) saturate(120%) !important;
          -webkit-backdrop-filter: blur(15px) saturate(120%) !important;
        }

        .raf-water-underlay {
          filter: blur(10px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .raf-water-underlay,
        .raf-water-ripple,
        .raf-liquid-segment-button::before {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  );
}
