'use client';

import { useEffect } from 'react';

import { RAF_AGENCY_SHADER_VERSION } from './agency-shader-library';

const HEADER_SELECTOR = [
  'header [data-raf-header-shell="true"]',
  'header [data-raf-native-refraction="true"][data-raf-scrolled]',
  '[data-raf-header-shell="true"]',
].join(',');

const PAGE_SOURCE_SELECTOR = '#raf-page-root';
const CLONE_REBUILD_DELAY = 96;
const MAX_GEOMETRY_DPR = 2;

function readPreference(query) {
  return window.matchMedia?.(query).matches ?? false;
}

function snapToDevicePixel(value) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_GEOMETRY_DPR);
  return Math.round(value * dpr) / dpr;
}

function sanitizeSceneClone(clone) {
  clone.removeAttribute?.('id');
  clone.setAttribute?.('aria-hidden', 'true');
  clone.setAttribute?.('inert', '');
  clone.setAttribute?.('data-raf-agency-scene-clone', 'true');

  const pageNode = clone.querySelector('.page');

  if (pageNode) {
    pageNode.style.paddingTop = '0px';
  }

  if (clone.matches?.('[data-policy-page]')) {
    clone.style.paddingTop = '0px';
  }

  clone.querySelectorAll?.([
    'script',
    'style',
    'link',
    'noscript',
    'iframe',
    'video',
    'audio',
    'canvas',

    '[data-raf-navbar-shell]',
    '[data-raf-mobile-navigation-fab]',
    '[data-raf-agency-lens]',
    '[data-raf-agency-scene-clone]',
    '[data-raf-lens-overlay]',
    '[data-raf-lens-clone]',
  ].join(',')).forEach((node) => node.remove());

  clone.querySelectorAll?.('[id]').forEach((node) => node.removeAttribute('id'));
  clone.querySelectorAll?.('a, button, input, select, textarea, [tabindex]').forEach((node) => {
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-hidden', 'true');
  });

  return clone;
}

function syncMutableFormState(source, clone) {
  const sourceFields = source.querySelectorAll('input, textarea, select, progress, meter');
  const cloneFields = clone.querySelectorAll('input, textarea, select, progress, meter');

  sourceFields.forEach((sourceField, index) => {
    const cloneField = cloneFields[index];
    if (!cloneField) return;

    if ('value' in sourceField && 'value' in cloneField) {
      cloneField.value = sourceField.value;
    }
    if ('checked' in sourceField && 'checked' in cloneField) {
      cloneField.checked = sourceField.checked;
    }
  });

  const sourceDetails = source.querySelectorAll('details');
  const cloneDetails = clone.querySelectorAll('details');

  sourceDetails.forEach((sourceDetail, index) => {
    if (cloneDetails[index]) {
      cloneDetails[index].open = sourceDetail.open;
    }
  });
}

function createStableVerticalSceneLens(header, source) {
  const viewport = document.createElement('span');
  const sceneHost = document.createElement('span');

  viewport.className = 'raf-agency-live-lens raf-agency-live-lens--vertical';
  viewport.dataset.rafAgencyLens = 'vertical';
  viewport.dataset.rafAgencySampling = 'single-scene';
  viewport.dataset.rafAgencyReady = 'false';
  viewport.setAttribute('aria-hidden', 'true');

  sceneHost.className = 'raf-agency-live-scene-host';
  viewport.appendChild(sceneHost);
  header.prepend(viewport);

  const bodyBackground = window.getComputedStyle(document.body).backgroundColor;
  if (bodyBackground && bodyBackground !== 'rgba(0, 0, 0, 0)') {
    viewport.style.setProperty('--raf-agency-scene-background', bodyBackground);
  }

  let clone = null;
  let disposed = false;
  let geometryFrame = 0;
  let rebuildFrame = 0;
  let rebuildTimer = 0;
  let lastGeometry = '';

  const writeGeometry = (targetClone) => {
    if (
      disposed
      || !targetClone
      || !source.isConnected
      || !header.isConnected
    ) {
      return false;
    }

    const headerRect = header.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();

    const x = snapToDevicePixel(sourceRect.left - headerRect.left);
    const y = snapToDevicePixel(sourceRect.top - headerRect.top);
    const width = snapToDevicePixel(sourceRect.width);
    const height = snapToDevicePixel(sourceRect.height);
    const geometry = [x, y, width, height].join('|');

    if (targetClone === clone && geometry === lastGeometry) {
      return true;
    }

    targetClone.style.setProperty('--raf-agency-scene-x', `${x}px`);
    targetClone.style.setProperty('--raf-agency-scene-y', `${y}px`);
    targetClone.style.setProperty('--raf-agency-scene-width', `${width}px`);
    targetClone.style.setProperty('--raf-agency-scene-height', `${height}px`);

    lastGeometry = geometry;
    viewport.dataset.rafAgencyReady = 'true';
    return true;
  };

  const syncGeometry = () => {
    geometryFrame = 0;
    writeGeometry(clone);
  };

  const scheduleGeometry = () => {
    if (disposed || geometryFrame) {
      return;
    }

    geometryFrame = window.requestAnimationFrame(syncGeometry);
  };

  const rebuild = () => {
    rebuildFrame = 0;
    rebuildTimer = 0;

    if (disposed || !source.isConnected || !header.isConnected) {
      return;
    }

    const nextClone = sanitizeSceneClone(source.cloneNode(true));
    nextClone.style.paddingTop = '0px';
    nextClone.style.marginTop = '0px';
    nextClone.classList.add('raf-agency-live-scene-clone');
    syncMutableFormState(source, nextClone);

    /*
     * The new clone receives its final coordinates before it is inserted.
     * Therefore React never exposes an unpositioned duplicate for one frame.
     */
    lastGeometry = '';
    writeGeometry(nextClone);
    clone = nextClone;
    sceneHost.replaceChildren(nextClone);
  };

  const scheduleRebuild = () => {
    if (disposed) {
      return;
    }

    if (rebuildTimer) {
      window.clearTimeout(rebuildTimer);
    }

    rebuildTimer = window.setTimeout(() => {
      rebuildTimer = 0;
      if (!rebuildFrame) {
        rebuildFrame = window.requestAnimationFrame(rebuild);
      }
    }, CLONE_REBUILD_DELAY);
  };

  const routeObserver = new MutationObserver((records) => {
    const pageRootChanged = records.some((record) => (
      record.type === 'childList'
      && record.target === source
      && (record.addedNodes.length > 0 || record.removedNodes.length > 0)
    ));

    if (pageRootChanged) {
      scheduleRebuild();
    }
  });

  routeObserver.observe(source, {
    childList: true,
    subtree: false,
  });

  const resizeObserver = new ResizeObserver(() => {
    lastGeometry = '';
    scheduleGeometry();
  });

  resizeObserver.observe(header);
  resizeObserver.observe(source);

  window.addEventListener('scroll', scheduleGeometry, { passive: true });
  window.addEventListener('resize', scheduleGeometry, { passive: true });
  window.addEventListener('orientationchange', scheduleGeometry, { passive: true });
  window.visualViewport?.addEventListener('scroll', scheduleGeometry, { passive: true });
  window.visualViewport?.addEventListener('resize', scheduleGeometry, { passive: true });

  rebuild();

  return {
    scheduleRebuild,
    dispose() {
      disposed = true;
      routeObserver.disconnect();
      resizeObserver.disconnect();

      window.removeEventListener('scroll', scheduleGeometry);
      window.removeEventListener('resize', scheduleGeometry);
      window.removeEventListener('orientationchange', scheduleGeometry);
      window.visualViewport?.removeEventListener('scroll', scheduleGeometry);
      window.visualViewport?.removeEventListener('resize', scheduleGeometry);

      if (geometryFrame) window.cancelAnimationFrame(geometryFrame);
      if (rebuildFrame) window.cancelAnimationFrame(rebuildFrame);
      if (rebuildTimer) window.clearTimeout(rebuildTimer);

      viewport.remove();
    },
  };
}

export default function AgencyShaderRuntime() {
  useEffect(() => {
    let disposed = false;
    let bindFrame = 0;
    let delayedBindTimer = 0;
    let header = null;
    let source = null;
    let verticalLens = null;

    const bind = () => {
      bindFrame = 0;
      if (disposed) return;

      const nextHeader = document.querySelector(HEADER_SELECTOR);
      const nextSource = document.querySelector(PAGE_SOURCE_SELECTOR);
      const resolvedHeader = nextHeader instanceof HTMLElement ? nextHeader : null;
      const resolvedSource = nextSource instanceof HTMLElement ? nextSource : null;

      if (resolvedHeader === header && resolvedSource === source) {
        return;
      }

      verticalLens?.dispose();
      verticalLens = null;
      header = resolvedHeader;
      source = resolvedSource;

      if (header) {
        header.dataset.rafAgencyShaderSystem = RAF_AGENCY_SHADER_VERSION;
        header.dataset.rafAgencySampling = 'single-scene';
      }

      const reducedTransparency = readPreference('(prefers-reduced-transparency: reduce)');
      if (header && source && !reducedTransparency) {
        verticalLens = createStableVerticalSceneLens(header, source);
      }
    };

    const scheduleBind = () => {
      if (disposed || bindFrame) return;
      bindFrame = window.requestAnimationFrame(bind);
    };

    const transparencyQuery = window.matchMedia?.('(prefers-reduced-transparency: reduce)');
    const handlePreferenceChange = () => {
      header = null;
      source = null;
      scheduleBind();
    };

    transparencyQuery?.addEventListener?.('change', handlePreferenceChange);
    window.addEventListener('resize', scheduleBind, { passive: true });
    window.addEventListener('orientationchange', scheduleBind, { passive: true });

    /*
     * This component now hydrates in the same Suspense boundary as Header.
     * Deferring one frame also lets all Header refs/effects settle before the
     * first optical node is prepended.
     */
    bindFrame = window.requestAnimationFrame(bind);
    delayedBindTimer = window.setTimeout(bind, 240);

    return () => {
      disposed = true;
      transparencyQuery?.removeEventListener?.('change', handlePreferenceChange);
      window.removeEventListener('resize', scheduleBind);
      window.removeEventListener('orientationchange', scheduleBind);

      if (bindFrame) window.cancelAnimationFrame(bindFrame);
      if (delayedBindTimer) window.clearTimeout(delayedBindTimer);

      verticalLens?.dispose();
    };
  }, []);

  return null;
}
