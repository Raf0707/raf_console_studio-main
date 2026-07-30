'use client';

import { useEffect } from 'react';

const SETTLE_DURATION = 430;

const RUNTIME_STYLES = `
/*
 * The drag runtime still owns the drop movement, snapping and navigation.
 * These rules only neutralize its former whole-word deformation. The new
 * masked overlay below then refracts exactly the text area touched by glass.
 */
[data-raf-navbar-shell="true"][data-raf-progressive-text-runtime="ready"]
[data-raf-navbar-text-refraction] {
  transform: none !important;
  filter: none !important;
  text-shadow: none !important;
  letter-spacing: inherit !important;
}

[data-raf-navbar-progressive-text-link="true"] {
  position: relative;
  isolation: isolate;
}

[data-raf-navbar-progressive-text-mask="true"] {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: block;
  overflow: visible;
  pointer-events: none;
  opacity: var(--raf-progressive-text-opacity, 0);
  clip-path: var(
    --raf-progressive-text-clip,
    polygon(0% -120%, 0% -120%, 0% 220%, 0% 220%)
  );
  will-change: opacity, clip-path;
}

[data-raf-navbar-progressive-text-fx="true"] {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  white-space: nowrap;
  color: inherit;
  font: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  text-align: center;
  transform-origin: var(--raf-progressive-text-origin, 50% 50%);
  transform:
    translate3d(var(--raf-progressive-text-shift, 0px), 0, 0)
    skewX(var(--raf-progressive-text-skew, 0deg))
    scaleX(var(--raf-progressive-text-scale-x, 1));
  filter:
    var(--raf-progressive-text-filter, blur(0px))
    blur(var(--raf-progressive-text-blur, 0px))
    saturate(var(--raf-progressive-text-saturation, 1));
  text-shadow:
    var(--raf-progressive-text-shadow-forward, 0px) 0 0 rgba(255, 255, 255, 0.5),
    var(--raf-progressive-text-shadow-back, 0px) 0 0 rgba(122, 184, 255, 0.22),
    0 0 var(--raf-progressive-text-glow, 0px) rgba(255, 255, 255, 0.3);
  will-change: transform, filter, text-shadow;
}

[data-raf-progressive-text-state="active"]
[data-raf-navbar-progressive-text-mask="true"] {
  transition:
    opacity 42ms linear,
    clip-path 38ms linear;
}

[data-raf-progressive-text-state="active"]
[data-raf-navbar-progressive-text-fx="true"] {
  transition:
    transform 46ms linear,
    filter 46ms linear,
    text-shadow 46ms linear;
}

[data-raf-progressive-text-state="idle"]
[data-raf-navbar-progressive-text-mask="true"] {
  transition: opacity 110ms ease-out;
}

[data-raf-progressive-text-state="idle"]
[data-raf-navbar-progressive-text-fx="true"] {
  transition:
    transform 145ms ease-out,
    filter 145ms ease-out,
    text-shadow 145ms ease-out;
}

[data-raf-progressive-text-state="settling"]
[data-raf-navbar-progressive-text-mask="true"] {
  transition: opacity ${SETTLE_DURATION}ms ease;
}

[data-raf-progressive-text-state="settling"]
[data-raf-navbar-progressive-text-fx="true"] {
  transition:
    transform ${SETTLE_DURATION}ms cubic-bezier(0.2, 0.9, 0.18, 1),
    filter ${SETTLE_DURATION}ms ease,
    text-shadow ${SETTLE_DURATION}ms ease;
}

@media (prefers-reduced-motion: reduce) {
  [data-raf-navbar-progressive-text-mask="true"],
  [data-raf-navbar-progressive-text-fx="true"] {
    transition-duration: 90ms !important;
  }

  [data-raf-navbar-progressive-text-fx="true"] {
    filter: none !important;
  }
}
`;

const clamp = (value, min, max) => (
  Math.min(max, Math.max(min, value))
);

function getDirectLinks(shell) {
  return Array.from(shell.querySelectorAll('a[href]')).filter(
    (link) => link.parentElement === shell,
  );
}

function getDropSurface(shell) {
  const warp = shell.querySelector(
    '[data-raf-refraction-target="navbar-pill"]',
  );
  const surface = warp?.parentElement;

  return surface instanceof HTMLElement ? surface : null;
}

function getDirectTextNodes(link) {
  return Array.from(link.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE
      && node.nodeValue?.trim(),
  );
}

function getTextLabel(link) {
  return getDirectTextNodes(link)
    .map((node) => node.nodeValue || '')
    .join('')
    .trim();
}

function getTextRect(link) {
  const textNodes = getDirectTextNodes(link);

  if (textNodes.length === 0) {
    return null;
  }

  const range = document.createRange();
  range.setStart(textNodes[0], 0);

  const lastNode = textNodes[textNodes.length - 1];
  range.setEnd(lastNode, lastNode.nodeValue?.length || 0);

  const rect = range.getBoundingClientRect();
  range.detach?.();

  return rect.width > 0.01 ? rect : null;
}

function getOverlay(link) {
  const mask = link.querySelector(
    ':scope > [data-raf-navbar-progressive-text-mask="true"]',
  );
  const fx = mask?.querySelector(
    ':scope > [data-raf-navbar-progressive-text-fx="true"]',
  );

  if (
    !(mask instanceof HTMLElement)
    || !(fx instanceof HTMLElement)
  ) {
    return null;
  }

  return {
    mask,
    fx,
  };
}

function prepareLink(link) {
  const label = getTextLabel(link)
    || link.dataset.rafProgressiveTextLabel
    || '';

  if (!label) {
    return false;
  }

  link.dataset.rafNavbarProgressiveTextLink = 'true';
  link.dataset.rafProgressiveTextLabel = label;

  const existing = getOverlay(link);

  if (existing) {
    if (existing.fx.textContent !== label) {
      existing.fx.textContent = label;
    }

    return true;
  }

  const mask = document.createElement('span');
  const fx = document.createElement('span');

  mask.dataset.rafNavbarProgressiveTextMask = 'true';
  mask.setAttribute('aria-hidden', 'true');

  fx.dataset.rafNavbarProgressiveTextFx = 'true';
  fx.setAttribute('aria-hidden', 'true');
  fx.textContent = label;

  mask.appendChild(fx);
  link.appendChild(mask);

  return true;
}

function resetEffectVariables(link) {
  link.style.setProperty('--raf-progressive-text-shift', '0px');
  link.style.setProperty('--raf-progressive-text-skew', '0deg');
  link.style.setProperty('--raf-progressive-text-scale-x', '1');
  link.style.setProperty('--raf-progressive-text-blur', '0px');
  link.style.setProperty('--raf-progressive-text-saturation', '1');
  link.style.setProperty('--raf-progressive-text-shadow-forward', '0px');
  link.style.setProperty('--raf-progressive-text-shadow-back', '0px');
  link.style.setProperty('--raf-progressive-text-glow', '0px');
  link.style.setProperty('--raf-progressive-text-filter', 'blur(0px)');
}

function setIdle(link) {
  link.dataset.rafProgressiveTextState = 'idle';
  link.style.setProperty('--raf-progressive-text-opacity', '0');
  resetEffectVariables(link);
}

function clearLink(link) {
  getOverlay(link)?.mask.remove();

  delete link.dataset.rafNavbarProgressiveTextLink;
  delete link.dataset.rafProgressiveTextLabel;
  delete link.dataset.rafProgressiveTextState;

  [
    '--raf-progressive-text-opacity',
    '--raf-progressive-text-clip',
    '--raf-progressive-text-origin',
    '--raf-progressive-text-shift',
    '--raf-progressive-text-skew',
    '--raf-progressive-text-scale-x',
    '--raf-progressive-text-blur',
    '--raf-progressive-text-saturation',
    '--raf-progressive-text-shadow-forward',
    '--raf-progressive-text-shadow-back',
    '--raf-progressive-text-glow',
    '--raf-progressive-text-filter',
  ].forEach((property) => {
    link.style.removeProperty(property);
  });
}

function applyProgressiveRefraction({
  links,
  pillRect,
  direction,
  velocity,
}) {
  const motionStrength = clamp(
    0.58 + Math.abs(velocity) / 0.92,
    0.58,
    1,
  );

  links.forEach((link) => {
    if (!prepareLink(link)) {
      return;
    }

    const linkRect = link.getBoundingClientRect();
    const textRect = getTextRect(link);

    if (!textRect || linkRect.width <= 0.01) {
      setIdle(link);
      return;
    }

    /*
     * Refraction begins only when the visible glass surface reaches the first
     * glyph. Padding and the rest of the navigation item do not participate.
     */
    const overlapLeft = Math.max(textRect.left, pillRect.left);
    const overlapRight = Math.min(textRect.right, pillRect.right);
    const overlapWidth = Math.max(0, overlapRight - overlapLeft);

    if (overlapWidth <= 0.01) {
      setIdle(link);
      return;
    }

    /*
     * The mask is expressed in link coordinates because its overlay fills the
     * link. Its visible slice is exactly the part of the word under the drop:
     * one touched letter means one letter-sized slice, then two, and so on.
     */
    const startPercent = clamp(
      ((overlapLeft - linkRect.left) / linkRect.width) * 100,
      0,
      100,
    );
    const endPercent = clamp(
      ((overlapRight - linkRect.left) / linkRect.width) * 100,
      0,
      100,
    );

    const labelLength = Math.max(
      1,
      Array.from(link.dataset.rafProgressiveTextLabel || '').length,
    );
    const averageGlyphWidth = Math.max(
      4,
      textRect.width / labelLength,
    );
    const contactStrength = clamp(
      overlapWidth / (averageGlyphWidth * 0.9),
      0,
      1,
    );
    const pressure = clamp(
      motionStrength * (0.24 + contactStrength * 0.76),
      0,
      1,
    );

    link.dataset.rafProgressiveTextState = 'active';
    link.style.setProperty(
      '--raf-progressive-text-clip',
      `polygon(${startPercent.toFixed(3)}% -120%, ${endPercent.toFixed(3)}% -120%, ${endPercent.toFixed(3)}% 220%, ${startPercent.toFixed(3)}% 220%)`,
    );
    link.style.setProperty(
      '--raf-progressive-text-opacity',
      `${(0.52 + pressure * 0.48).toFixed(3)}`,
    );
    link.style.setProperty(
      '--raf-progressive-text-origin',
      direction > 0 ? '0% 50%' : '100% 50%',
    );
    link.style.setProperty(
      '--raf-progressive-text-shift',
      `${(direction * pressure * 4.8).toFixed(3)}px`,
    );
    link.style.setProperty(
      '--raf-progressive-text-skew',
      `${(-direction * pressure * 8.2).toFixed(3)}deg`,
    );
    link.style.setProperty(
      '--raf-progressive-text-scale-x',
      `${(1 + pressure * 0.078).toFixed(4)}`,
    );
    link.style.setProperty(
      '--raf-progressive-text-blur',
      `${(pressure * 0.16).toFixed(3)}px`,
    );
    link.style.setProperty(
      '--raf-progressive-text-saturation',
      `${(1 + pressure * 0.2).toFixed(3)}`,
    );
    link.style.setProperty(
      '--raf-progressive-text-shadow-forward',
      `${(direction * pressure * 2.5).toFixed(3)}px`,
    );
    link.style.setProperty(
      '--raf-progressive-text-shadow-back',
      `${(-direction * pressure * 1.6).toFixed(3)}px`,
    );
    link.style.setProperty(
      '--raf-progressive-text-glow',
      `${(pressure * 7).toFixed(3)}px`,
    );
    link.style.setProperty(
      '--raf-progressive-text-filter',
      direction > 0
        ? 'url(#raf-navbar-horizontal-text-refraction-right)'
        : 'url(#raf-navbar-horizontal-text-refraction-left)',
    );
  });
}

function settleLinks(links, timers) {
  links.forEach((link) => {
    if (!prepareLink(link)) {
      return;
    }

    link.dataset.rafProgressiveTextState = 'settling';
    link.style.setProperty('--raf-progressive-text-opacity', '0');
    resetEffectVariables(link);
  });

  const timer = window.setTimeout(() => {
    links.forEach((link) => {
      link.dataset.rafProgressiveTextState = 'idle';
      link.style.removeProperty('--raf-progressive-text-clip');
    });
    timers.delete(timer);
  }, SETTLE_DURATION + 40);

  timers.add(timer);
}

function attachShell(shell) {
  let animationFrame = 0;
  let lastClientX = null;
  let lastTimestamp = 0;
  let velocity = 0;

  const timers = new Set();

  shell.dataset.rafProgressiveTextRuntime = 'ready';

  const prepareLinks = () => {
    const links = getDirectLinks(shell);
    links.forEach(prepareLink);
    return links;
  };

  const update = () => {
    animationFrame = 0;

    if (
      !shell.isConnected
      || shell.dataset.rafNavbarDragging !== 'true'
    ) {
      return;
    }

    const surface = getDropSurface(shell);

    if (!surface) {
      return;
    }

    const direction = shell.dataset.rafNavbarDragDirection === 'left'
      ? -1
      : 1;

    applyProgressiveRefraction({
      links: prepareLinks(),
      pillRect: surface.getBoundingClientRect(),
      direction,
      velocity,
    });
  };

  const scheduleUpdate = () => {
    if (animationFrame === 0) {
      animationFrame = window.requestAnimationFrame(update);
    }
  };

  const handlePointerMove = (event) => {
    if (shell.dataset.rafNavbarDragging !== 'true') {
      lastClientX = event.clientX;
      lastTimestamp = event.timeStamp || performance.now();
      return;
    }

    const timestamp = event.timeStamp || performance.now();

    if (lastClientX !== null) {
      velocity = (
        event.clientX - lastClientX
      ) / Math.max(1, timestamp - lastTimestamp);
    }

    lastClientX = event.clientX;
    lastTimestamp = timestamp;
    scheduleUpdate();
  };

  const handleDragEnd = () => {
    if (animationFrame !== 0) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    settleLinks(prepareLinks(), timers);
    lastClientX = null;
    lastTimestamp = 0;
    velocity = 0;
  };

  window.addEventListener('pointermove', handlePointerMove, {
    passive: true,
  });
  window.addEventListener('pointerup', handleDragEnd, true);
  window.addEventListener('pointercancel', handleDragEnd, true);

  prepareLinks();

  return () => {
    if (animationFrame !== 0) {
      window.cancelAnimationFrame(animationFrame);
    }

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handleDragEnd, true);
    window.removeEventListener('pointercancel', handleDragEnd, true);

    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();

    getDirectLinks(shell).forEach(clearLink);
    delete shell.dataset.rafProgressiveTextRuntime;
  };
}

export default function NavbarProgressiveTextRefractionRuntime() {
  useEffect(() => {
    let bindFrame = 0;
    let cancelled = false;

    const bindings = new Map();

    const bindAll = () => {
      bindFrame = 0;

      if (cancelled) {
        return;
      }

      const shells = new Set(
        document.querySelectorAll(
          '[data-raf-navbar-shell="true"]',
        ),
      );

      bindings.forEach((dispose, shell) => {
        if (!shell.isConnected || !shells.has(shell)) {
          dispose();
          bindings.delete(shell);
        }
      });

      shells.forEach((shell) => {
        if (!(shell instanceof HTMLElement)) {
          return;
        }

        getDirectLinks(shell).forEach(prepareLink);

        if (!bindings.has(shell) && getDropSurface(shell)) {
          bindings.set(shell, attachShell(shell));
        }
      });
    };

    const scheduleBind = () => {
      if (bindFrame === 0) {
        bindFrame = window.requestAnimationFrame(bindAll);
      }
    };

    const observer = new MutationObserver(scheduleBind);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'class',
        'data-raf-navbar-dragging',
        'data-raf-navbar-drag-direction',
      ],
    });

    window.addEventListener('resize', scheduleBind, {
      passive: true,
    });

    scheduleBind();

    return () => {
      cancelled = true;

      if (bindFrame !== 0) {
        window.cancelAnimationFrame(bindFrame);
      }

      observer.disconnect();
      window.removeEventListener('resize', scheduleBind);

      bindings.forEach((dispose) => dispose());
      bindings.clear();
    };
  }, []);

  return <style>{RUNTIME_STYLES}</style>;
}
