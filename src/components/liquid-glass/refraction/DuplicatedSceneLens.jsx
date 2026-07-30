'use client';

import { useEffect, useMemo, useRef } from 'react';

import styles from './DuplicatedSceneLens.module.css';

const DEFAULT_BANDS = 9;

function getSceneSource(navbar) {
  const explicit = document.querySelector('[data-raf-lens-scene]');
  if (explicit && !explicit.contains(navbar)) return explicit;

  const main = document.querySelector('main');
  if (main && !main.contains(navbar)) return main;

  const appRoot = document.querySelector('#__next');
  if (appRoot && !appRoot.contains(navbar)) return appRoot;

  return document.body;
}

function sanitizeClone(clone) {
  clone.removeAttribute?.('id');
  clone.setAttribute?.('aria-hidden', 'true');
  clone.setAttribute?.('inert', '');
  clone.setAttribute?.('data-raf-lens-clone', 'true');

  clone.querySelectorAll?.([
    'script',
    'style',
    'link',
    'noscript',
    'iframe',
    'video',
    'audio',
    '[data-raf-navbar-shell]',
    '[data-raf-mobile-navigation-fab]',
    '[data-raf-lens-overlay]',
    '[data-raf-lens-clone]',
  ].join(',')).forEach((node) => node.remove());

  clone.querySelectorAll?.('[id]').forEach((node) => {
    node.removeAttribute('id');
  });

  clone.querySelectorAll?.('a, button, input, select, textarea, [tabindex]').forEach((node) => {
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-hidden', 'true');
  });

  return clone;
}

function syncMutableState(source, clone) {
  const sourceFields = source.querySelectorAll?.('input, textarea, select, progress, meter');
  const cloneFields = clone.querySelectorAll?.('input, textarea, select, progress, meter');

  sourceFields?.forEach((sourceField, index) => {
    const cloneField = cloneFields?.[index];
    if (!cloneField) return;

    if ('value' in sourceField && 'value' in cloneField) {
      cloneField.value = sourceField.value;
    }
    if ('checked' in sourceField && 'checked' in cloneField) {
      cloneField.checked = sourceField.checked;
    }
  });

  const sourceDetails = source.querySelectorAll?.('details');
  const cloneDetails = clone.querySelectorAll?.('details');
  sourceDetails?.forEach((sourceDetail, index) => {
    const cloneDetail = cloneDetails?.[index];
    if (cloneDetail) cloneDetail.open = sourceDetail.open;
  });
}

export default function DuplicatedSceneLens({
  navbarRef,
  bandCount = DEFAULT_BANDS,
  strength = 0.14,
}) {
  const sceneHostsRef = useRef([]);
  const sourceRef = useRef(null);
  const frameRef = useRef(0);
  const rebuildFrameRef = useRef(0);
  const lastGeometryRef = useRef('');

  const bands = useMemo(() => (
    Array.from({ length: bandCount }, (_, index) => {
      const t = bandCount <= 1 ? 0.5 : index / (bandCount - 1);
      const curve = Math.pow(Math.sin(Math.PI * t), 0.82);
      const scaleY = 1 + strength * curve;
      const scaleX = 1 + strength * 0.26 * curve;
      const edge = Math.abs(t - 0.5) * 2;
      const blur = 0.38 + edge * 0.74;
      const shift = (t - 0.5) * 1.8;

      return {
        index,
        scaleX,
        scaleY,
        blur,
        shift,
      };
    })
  ), [bandCount, strength]);

  useEffect(() => {
    const navbar = navbarRef?.current;
    if (!navbar) return undefined;

    let disposed = false;
    let resizeObserver;
    let mutationObserver;

    const buildClones = () => {
      if (disposed) return;

      const source = getSceneSource(navbar);
      sourceRef.current = source;

      sceneHostsRef.current.forEach((host) => {
        if (!host) return;

        const clone = sanitizeClone(source.cloneNode(true));
        clone.classList.add(styles.sceneClone);
        syncMutableState(source, clone);
        host.replaceChildren(clone);
      });

      lastGeometryRef.current = '';
    };

    const scheduleCloneRebuild = () => {
      if (rebuildFrameRef.current) return;

      rebuildFrameRef.current = window.requestAnimationFrame(() => {
        rebuildFrameRef.current = 0;
        buildClones();
      });
    };

    const updateGeometry = () => {
      if (disposed) return;

      const source = sourceRef.current;
      const currentNavbar = navbarRef?.current;

      if (!source || !currentNavbar || !currentNavbar.isConnected) {
        frameRef.current = window.requestAnimationFrame(updateGeometry);
        return;
      }

      const navRect = currentNavbar.getBoundingClientRect();
      const sourceRect = source.getBoundingClientRect();
      const visualViewport = window.visualViewport;
      const viewportOffsetX = visualViewport?.offsetLeft ?? 0;
      const viewportOffsetY = visualViewport?.offsetTop ?? 0;

      const sceneX = sourceRect.left - navRect.left - viewportOffsetX;
      const sceneY = sourceRect.top - navRect.top - viewportOffsetY;
      const originX = navRect.width / 2 - sceneX;
      const originY = navRect.height / 2 - sceneY;

      const geometryKey = [
        sceneX.toFixed(3),
        sceneY.toFixed(3),
        sourceRect.width.toFixed(3),
        sourceRect.height.toFixed(3),
        originX.toFixed(3),
        originY.toFixed(3),
      ].join('|');

      if (geometryKey !== lastGeometryRef.current) {
        lastGeometryRef.current = geometryKey;

        sceneHostsRef.current.forEach((host) => {
          const clone = host?.firstElementChild;
          if (!clone) return;

          clone.style.setProperty('--raf-scene-x', `${sceneX}px`);
          clone.style.setProperty('--raf-scene-y', `${sceneY}px`);
          clone.style.setProperty('--raf-scene-width', `${sourceRect.width}px`);
          clone.style.setProperty('--raf-scene-height', `${sourceRect.height}px`);
          clone.style.setProperty('--raf-lens-origin-x', `${originX}px`);
          clone.style.setProperty('--raf-lens-origin-y', `${originY}px`);
        });
      }

      frameRef.current = window.requestAnimationFrame(updateGeometry);
    };

    buildClones();

    resizeObserver = new ResizeObserver(() => {
      lastGeometryRef.current = '';
    });
    resizeObserver.observe(navbar);
    if (sourceRef.current) resizeObserver.observe(sourceRef.current);

    mutationObserver = new MutationObserver((records) => {
      const requiresRebuild = records.some((record) => {
        if (record.type === 'childList' || record.type === 'characterData') {
          return true;
        }

        return record.type === 'attributes'
          && ['class', 'style', 'src', 'hidden', 'open'].includes(record.attributeName);
      });

      if (requiresRebuild) scheduleCloneRebuild();
    });

    if (sourceRef.current) {
      mutationObserver.observe(sourceRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'src', 'hidden', 'open'],
      });
    }

    const invalidateGeometry = () => {
      lastGeometryRef.current = '';
    };

    document.addEventListener('scroll', invalidateGeometry, true);
    window.addEventListener('resize', invalidateGeometry, { passive: true });
    window.addEventListener('orientationchange', invalidateGeometry, { passive: true });
    window.visualViewport?.addEventListener('scroll', invalidateGeometry, { passive: true });
    window.visualViewport?.addEventListener('resize', invalidateGeometry, { passive: true });

    frameRef.current = window.requestAnimationFrame(updateGeometry);

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();

      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (rebuildFrameRef.current) window.cancelAnimationFrame(rebuildFrameRef.current);

      document.removeEventListener('scroll', invalidateGeometry, true);
      window.removeEventListener('resize', invalidateGeometry);
      window.removeEventListener('orientationchange', invalidateGeometry);
      window.visualViewport?.removeEventListener('scroll', invalidateGeometry);
      window.visualViewport?.removeEventListener('resize', invalidateGeometry);
    };
  }, [navbarRef, bandCount]);

  return (
    <span
      aria-hidden="true"
      data-raf-lens-overlay="true"
      className={styles.lensViewport}
    >
      {bands.map((band) => (
        <span
          key={band.index}
          className={styles.band}
          style={{
            '--raf-band-index': band.index,
            '--raf-band-count': bandCount,
            '--raf-band-scale-x': band.scaleX,
            '--raf-band-scale-y': band.scaleY,
            '--raf-band-blur': `${band.blur}px`,
            '--raf-band-shift': `${band.shift}px`,
          }}
        >
          <span
            ref={(node) => {
              sceneHostsRef.current[band.index] = node;
            }}
            className={styles.sceneHost}
          />
        </span>
      ))}
    </span>
  );
}
