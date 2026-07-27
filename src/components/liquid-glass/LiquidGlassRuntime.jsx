'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const LIQUID_GLASS_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/@ybouane/liquidglass@1.0.3/dist/index.js';

const HEADER_CONFIG = {
  blurAmount: 0.22,
  refraction: 0.72,
  chromAberration: 0.035,
  edgeHighlight: 0.16,
  specular: 0.34,
  fresnel: 0.92,
  distortion: 0.018,
  cornerRadius: 28,
  zRadius: 22,
  opacity: 0.96,
  saturation: -0.18,
  brightness: -0.02,
  shadowOpacity: 0.34,
  shadowSpread: 18,
  shadowOffsetY: 5,
};

const CARD_CONFIG = {
  blurAmount: 0.18,
  refraction: 0.66,
  chromAberration: 0.028,
  edgeHighlight: 0.13,
  specular: 0.27,
  fresnel: 0.88,
  distortion: 0.014,
  cornerRadius: 32,
  zRadius: 24,
  opacity: 0.94,
  saturation: -0.24,
  brightness: -0.025,
  shadowOpacity: 0.3,
  shadowSpread: 14,
  shadowOffsetY: 5,
};

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

function createScene(className) {
  const scene = document.createElement('span');
  scene.className = className;
  scene.setAttribute('aria-hidden', 'true');
  return scene;
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
    && (
      node.classList.contains('project-card')
      || Boolean(node.querySelector('.project-card'))
    );
}

export default function LiquidGlassRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    if (!supportsLiquidGlass()) {
      document.documentElement.dataset.liquidGlass = 'fallback';
      return undefined;
    }

    let cancelled = false;
    let headerInstance = null;
    let cardsInstance = null;
    let cardsRoot = null;
    let cardElements = [];
    let headerScene = null;
    let cardsScene = null;
    let reinitTimer = null;
    let cardsInitVersion = 0;

    document.documentElement.dataset.liquidGlass = 'loading';

    const destroyCards = () => {
      cardsInitVersion += 1;
      cardsInstance?.destroy();
      cardsInstance = null;

      cardElements.forEach((card) => {
        card.classList.remove('raf-liquidglass-surface');
        delete card.dataset.config;
      });
      cardElements = [];

      if (cardsRoot) {
        cardsRoot.classList.remove('raf-liquidglass-root');
      }

      cardsScene?.remove();
      cardsScene = null;
      cardsRoot = null;
    };

    const initialize = async () => {
      try {
        await document.fonts?.ready;

        const module = await import(
          /* webpackIgnore: true */ LIQUID_GLASS_MODULE_URL
        );

        if (cancelled) {
          return null;
        }

        const { LiquidGlass } = module;
        const header = document.querySelector('body header');
        const headerGlass = header ? findHeaderGlass(header) : null;

        if (header && headerGlass) {
          header.classList.add('raf-liquidglass-root');
          headerGlass.classList.add('raf-liquidglass-surface');
          headerGlass.dataset.config = JSON.stringify(HEADER_CONFIG);

          headerScene = createScene('raf-liquidglass-header-scene');
          header.insertBefore(headerScene, header.firstChild);

          headerInstance = await LiquidGlass.init({
            root: header,
            glassElements: [headerGlass],
          });
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

          const scene = createScene('raf-liquidglass-cards-scene');

          root.classList.add('raf-liquidglass-root');
          root.insertBefore(scene, root.firstChild);

          cards.forEach((card) => {
            card.classList.add('raf-liquidglass-surface');
            card.dataset.config = JSON.stringify(CARD_CONFIG);
          });

          cardsRoot = root;
          cardsScene = scene;
          cardElements = cards;

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

        const observer = new MutationObserver((mutations) => {
          const projectsChanged = mutations.some((mutation) => (
            mutation.type === 'childList'
            && [
              ...mutation.addedNodes,
              ...mutation.removedNodes,
            ].some(containsProjectCard)
          ));

          if (!projectsChanged) {
            return;
          }

          window.clearTimeout(reinitTimer);
          reinitTimer = window.setTimeout(() => {
            initializeCards().catch((error) => {
              console.warn('[LiquidGlass] Card refresh failed:', error);
              document.documentElement.dataset.liquidGlass = 'partial';
            });
          }, 90);
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        return observer;
      } catch (error) {
        console.warn('[LiquidGlass] WebGL enhancement unavailable:', error);
        document.documentElement.dataset.liquidGlass = 'fallback';
        return null;
      }
    };

    let observer = null;
    const frame = window.requestAnimationFrame(() => {
      initialize().then((createdObserver) => {
        observer = createdObserver;
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(reinitTimer);
      observer?.disconnect();
      headerInstance?.destroy();
      destroyCards();
      headerScene?.remove();

      document
        .querySelectorAll('.raf-liquidglass-surface')
        .forEach((element) => {
          element.classList.remove('raf-liquidglass-surface');
          delete element.dataset.config;
        });

      document
        .querySelectorAll('.raf-liquidglass-root')
        .forEach((element) => {
          element.classList.remove('raf-liquidglass-root');
        });
    };
  }, [pathname]);

  return (
    <style jsx global>{`
      .raf-liquidglass-root {
        isolation: isolate;
      }

      .raf-liquidglass-header-scene,
      .raf-liquidglass-cards-scene {
        position: absolute;
        z-index: -2;
        pointer-events: none;
      }

      .raf-liquidglass-header-scene {
        inset: -5rem -8vw -3rem;
        background:
          radial-gradient(circle at 13% 16%, rgba(255, 255, 255, 0.2), transparent 24rem),
          radial-gradient(circle at 82% 14%, rgba(255, 255, 255, 0.1), transparent 28rem),
          linear-gradient(110deg, transparent 12%, rgba(255, 255, 255, 0.09) 42%, transparent 66%),
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 4.5rem),
          #080a11;
      }

      .projects-grid.raf-liquidglass-root {
        position: relative;
      }

      .raf-liquidglass-cards-scene {
        inset: -5rem;
        background:
          radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.17), transparent 25rem),
          radial-gradient(circle at 87% 68%, rgba(255, 255, 255, 0.11), transparent 30rem),
          repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 4.5rem),
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 4.5rem),
          #080a11;
      }

      html[data-liquid-glass='ready'] .raf-liquidglass-surface {
        background-color: rgba(255, 255, 255, 0.018) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .raf-liquidglass-surface > canvas:first-child {
        pointer-events: none !important;
      }

      @media (max-width: 767px) {
        .raf-liquidglass-cards-scene {
          inset: -2rem;
        }
      }
    `}</style>
  );
}
