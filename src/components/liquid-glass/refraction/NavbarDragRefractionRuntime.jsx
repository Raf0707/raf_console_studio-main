'use client';

import { useEffect } from 'react';

import '@/components/navbar-runtime.css';


const DESKTOP_DRAG_THRESHOLD = 4;
const DESKTOP_SNAP_DURATION = 480;
const MOBILE_REFRACTION_DURATION = 760;


const clamp = (value, min, max) => (
    Math.min(max, Math.max(min, value))
);

function getDirectDesktopLinks(shell) {
  return Array.from(shell.querySelectorAll('a[href]')).filter(
      (link) => link.parentElement === shell,
  );
}

function getDesktopParts(shell) {
  const warp = shell.querySelector(
      '[data-raf-refraction-target="navbar-pill"]',
  );

  const surface = warp?.parentElement;
  const drop = surface?.parentElement;
  const links = getDirectDesktopLinks(shell);

  if (
      !(warp instanceof HTMLElement)
      || !(surface instanceof HTMLElement)
      || !(drop instanceof HTMLElement)
      || links.length === 0
  ) {
    return null;
  }

  return {
    warp,
    surface,
    drop,
    links,
  };
}

function findClosestLink(links, clientX) {
  let closest = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  links.forEach((link) => {
    const rect = link.getBoundingClientRect();
    const center = rect.left + rect.width * 0.5;
    const distance = Math.abs(center - clientX);

    if (distance < closestDistance) {
      closest = link;
      closestDistance = distance;
    }
  });

  return closest;
}

function markDropOwner(parts, preferredLink = null) {
  if (!parts) {
    return;
  }

  const dropRect = parts.drop.getBoundingClientRect();
  const dropCenter = dropRect.left + dropRect.width * 0.5;
  const owner = preferredLink || findClosestLink(
      parts.links,
      dropCenter,
  );

  parts.links.forEach((link) => {
    if (link === owner) {
      link.dataset.rafNavbarDropOwner = 'true';
    } else {
      delete link.dataset.rafNavbarDropOwner;
    }
  });
}

function clearLinkRefraction(link) {
  link.style.setProperty('--raf-refraction-shift', '0px');
  link.style.setProperty('--raf-refraction-skew', '0deg');
  link.style.setProperty('--raf-refraction-scale-x', '1');
  link.style.setProperty('--raf-refraction-blur', '0px');
  link.style.setProperty('--raf-refraction-saturation', '1');
  link.style.setProperty('--raf-refraction-shadow-forward', '0px');
  link.style.setProperty('--raf-refraction-shadow-back', '0px');
  link.style.setProperty('--raf-refraction-glow', '0px');
  link.style.setProperty('--raf-refraction-letter-spacing', '0em');
  delete link.dataset.rafNavbarTextWarp;
}

function removeLinkRefraction(link) {
  delete link.dataset.rafNavbarTextRefraction;
  delete link.dataset.rafNavbarTextWarp;

  [
    '--raf-refraction-origin',
    '--raf-refraction-shift',
    '--raf-refraction-skew',
    '--raf-refraction-scale-x',
    '--raf-refraction-blur',
    '--raf-refraction-saturation',
    '--raf-refraction-shadow-forward',
    '--raf-refraction-shadow-back',
    '--raf-refraction-glow',
    '--raf-refraction-letter-spacing',
  ].forEach((property) => {
    link.style.removeProperty(property);
  });
}

function applyHorizontalTextRefraction({
                                         links,
                                         pillCenter,
                                         pillWidth,
                                         direction,
                                         velocity,
                                       }) {
  const motionStrength = clamp(
      0.46 + Math.abs(velocity) / 1.05,
      0.46,
      1,
  );

  const influenceRadius = Math.max(
      pillWidth * 1.65,
      86,
  );

  links.forEach((link) => {
    const rect = link.getBoundingClientRect();
    const linkCenter = rect.left + rect.width * 0.5;
    const signedDistance = linkCenter - pillCenter;
    const distance = Math.abs(signedDistance);
    const proximity = clamp(
        1 - distance / influenceRadius,
        0,
        1,
    );

    const isAhead = direction > 0
        ? signedDistance >= -pillWidth * 0.45
        : signedDistance <= pillWidth * 0.45;

    const directionalWeight = isAhead ? 1 : 0.28;
    const pressure = clamp(
        proximity * directionalWeight * motionStrength,
        0,
        1,
    );

    link.dataset.rafNavbarTextRefraction = 'active';
    link.style.setProperty(
        '--raf-refraction-origin',
        direction > 0 ? '0% 50%' : '100% 50%',
    );
    link.style.setProperty(
        '--raf-refraction-shift',
        `${(direction * pressure * 5.4).toFixed(3)}px`,
    );
    link.style.setProperty(
        '--raf-refraction-skew',
        `${(-direction * pressure * 8.6).toFixed(3)}deg`,
    );
    link.style.setProperty(
        '--raf-refraction-scale-x',
        `${(1 + pressure * 0.085).toFixed(4)}`,
    );
    link.style.setProperty(
        '--raf-refraction-blur',
        `${(pressure * 0.18).toFixed(3)}px`,
    );
    link.style.setProperty(
        '--raf-refraction-saturation',
        `${(1 + pressure * 0.22).toFixed(3)}`,
    );
    link.style.setProperty(
        '--raf-refraction-shadow-forward',
        `${(direction * pressure * 2.8).toFixed(3)}px`,
    );
    link.style.setProperty(
        '--raf-refraction-shadow-back',
        `${(-direction * pressure * 1.9).toFixed(3)}px`,
    );
    link.style.setProperty(
        '--raf-refraction-glow',
        `${(pressure * 8).toFixed(3)}px`,
    );
    link.style.setProperty(
        '--raf-refraction-letter-spacing',
        `${(pressure * 0.012).toFixed(4)}em`,
    );

    if (pressure > 0.075) {
      link.dataset.rafNavbarTextWarp = direction > 0
          ? 'right'
          : 'left';
    } else {
      delete link.dataset.rafNavbarTextWarp;
    }
  });
}

function settleHorizontalTextRefraction(links, timers) {
  links.forEach((link) => {
    link.dataset.rafNavbarTextRefraction = 'settling';
    clearLinkRefraction(link);
  });

  const timer = window.setTimeout(() => {
    links.forEach(removeLinkRefraction);
    timers.delete(timer);
  }, 470);

  timers.add(timer);
}

function attachDesktopDrag(shell) {
  let candidate = null;
  let suppressNativeClick = false;
  let dispatchingNavigation = false;
  let settleTimer = null;

  const timers = new Set();

  shell.dataset.rafNavbarDragRuntime = 'ready';

  const refreshOwner = (preferredLink = null) => {
    markDropOwner(
        getDesktopParts(shell),
        preferredLink,
    );
  };

  const resetDropSurface = (surface) => {
    surface.style.transition =
        'transform 400ms cubic-bezier(0.2, 0.9, 0.18, 1)';
    surface.style.transform =
        'scaleX(1) scaleY(1) skewX(0deg)';

    const timer = window.setTimeout(() => {
      if (surface.isConnected) {
        surface.style.removeProperty('transition');
        surface.style.removeProperty('transform');
      }
      timers.delete(timer);
    }, 430);

    timers.add(timer);
  };

  const finishDrag = (event, cancelled = false) => {
    if (!candidate || event.pointerId !== candidate.pointerId) {
      return;
    }

    const currentCandidate = candidate;
    candidate = null;

    if (!currentCandidate.dragged) {
      return;
    }

    event.preventDefault();

    if (
        shell.hasPointerCapture?.(currentCandidate.pointerId)
    ) {
      shell.releasePointerCapture(currentCandidate.pointerId);
    }

    const parts = getDesktopParts(shell);

    if (!parts) {
      return;
    }

    const currentDropRect = parts.drop.getBoundingClientRect();
    const currentCenter = currentDropRect.left
        + currentDropRect.width * 0.5;

    const targetLink = cancelled
        ? currentCandidate.ownerLink
        : findClosestLink(parts.links, currentCenter);

    const safeTargetLink = targetLink || parts.links[0];
    const targetTranslate = safeTargetLink.offsetLeft
        - parts.drop.offsetLeft;

    parts.drop.style.transition =
        `transform ${DESKTOP_SNAP_DURATION}ms cubic-bezier(0.2, 0.9, 0.15, 1.08)`;
    parts.drop.style.transform =
        `translate3d(${targetTranslate}px, 0, 0)`;

    resetDropSurface(parts.surface);
    settleHorizontalTextRefraction(parts.links, timers);

    shell.dataset.rafNavbarDragging = 'settling';
    shell.dataset.rafNavbarDragDirection =
        currentCandidate.direction > 0 ? 'right' : 'left';

    markDropOwner(parts, safeTargetLink);

    if (!cancelled) {
      suppressNativeClick = true;

      window.requestAnimationFrame(() => {
        if (!safeTargetLink.isConnected) {
          return;
        }

        dispatchingNavigation = true;
        safeTargetLink.click();
        dispatchingNavigation = false;
      });
    }

    if (settleTimer !== null) {
      window.clearTimeout(settleTimer);
      timers.delete(settleTimer);
    }

    settleTimer = window.setTimeout(() => {
      if (parts.drop.isConnected) {
        parts.drop.style.removeProperty('transition');
        parts.drop.style.removeProperty('transform');
      }

      delete shell.dataset.rafNavbarDragging;
      delete shell.dataset.rafNavbarDragDirection;

      refreshOwner(safeTargetLink);
      suppressNativeClick = false;
      timers.delete(settleTimer);
      settleTimer = null;
    }, DESKTOP_SNAP_DURATION + 70);

    timers.add(settleTimer);
  };

  const handlePointerDown = (event) => {
    if (
        event.button !== 0
        || event.pointerType === 'touch'
        || candidate !== null
    ) {
      return;
    }

    const parts = getDesktopParts(shell);

    if (!parts) {
      return;
    }

    const dropRect = parts.drop.getBoundingClientRect();
    const insideDrop = event.clientX >= dropRect.left
        && event.clientX <= dropRect.right
        && event.clientY >= dropRect.top
        && event.clientY <= dropRect.bottom;

    if (!insideDrop) {
      return;
    }

    const shellRect = shell.getBoundingClientRect();
    const ownerLink = findClosestLink(
        parts.links,
        dropRect.left + dropRect.width * 0.5,
    );

    candidate = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      lastClientX: event.clientX,
      lastTimestamp: event.timeStamp || performance.now(),
      startLocalLeft: dropRect.left - shellRect.left,
      direction: 1,
      dragged: false,
      ownerLink,
    };
  };

  const handlePointerMove = (event) => {
    if (!candidate || event.pointerId !== candidate.pointerId) {
      return;
    }

    const deltaX = event.clientX - candidate.startClientX;
    const deltaY = event.clientY - candidate.startClientY;

    if (
        !candidate.dragged
        && Math.hypot(deltaX, deltaY) < DESKTOP_DRAG_THRESHOLD
    ) {
      return;
    }

    const parts = getDesktopParts(shell);

    if (!parts) {
      candidate = null;
      return;
    }

    if (!candidate.dragged) {
      candidate.dragged = true;
      shell.dataset.rafNavbarDragging = 'true';
      parts.drop.style.transition = 'none';

      shell.setPointerCapture?.(candidate.pointerId);
      window.getSelection?.()?.removeAllRanges();
    }

    event.preventDefault();

    const shellRect = shell.getBoundingClientRect();
    const baseLeft = parts.drop.offsetLeft;
    const minimumLeft = baseLeft;
    const maximumLeft = shell.clientWidth
        - parts.drop.offsetWidth
        - baseLeft;

    const nextLeft = clamp(
        candidate.startLocalLeft + deltaX,
        minimumLeft,
        maximumLeft,
    );

    const translateX = nextLeft - baseLeft;
    const timestamp = event.timeStamp || performance.now();
    const elapsed = Math.max(
        1,
        timestamp - candidate.lastTimestamp,
    );
    const velocity = (
        event.clientX - candidate.lastClientX
    ) / elapsed;

    if (Math.abs(velocity) > 0.012) {
      candidate.direction = velocity > 0 ? 1 : -1;
    } else if (Math.abs(deltaX) > 0.5) {
      candidate.direction = deltaX > 0 ? 1 : -1;
    }

    candidate.lastClientX = event.clientX;
    candidate.lastTimestamp = timestamp;

    parts.drop.style.transform =
        `translate3d(${translateX}px, 0, 0)`;

    const stretch = clamp(
        1 + Math.abs(velocity) * 0.28,
        1,
        1.17,
    );
    const squeeze = clamp(
        1 - (stretch - 1) * 0.42,
        0.92,
        1,
    );
    const skew = clamp(
        velocity * 13,
        -7,
        7,
    );

    parts.surface.style.transition = 'none';
    parts.surface.style.transform =
        `scaleX(${stretch.toFixed(4)}) scaleY(${squeeze.toFixed(4)}) skewX(${skew.toFixed(3)}deg)`;

    const pillCenter = shellRect.left
        + nextLeft
        + parts.drop.offsetWidth * 0.5;

    shell.dataset.rafNavbarDragDirection =
        candidate.direction > 0 ? 'right' : 'left';

    applyHorizontalTextRefraction({
      links: parts.links,
      pillCenter,
      pillWidth: parts.drop.offsetWidth,
      direction: candidate.direction,
      velocity,
    });
  };

  const handlePointerUp = (event) => {
    finishDrag(event, false);
  };

  const handlePointerCancel = (event) => {
    finishDrag(event, true);
  };

  const handleDragStart = (event) => {
    if (candidate) {
      event.preventDefault();
    }
  };

  const handleClickCapture = (event) => {
    if (dispatchingNavigation) {
      return;
    }

    if (suppressNativeClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressNativeClick = false;
    }
  };

  const handleDropTransitionEnd = (event) => {
    const parts = getDesktopParts(shell);

    if (
        parts
        && event.target === parts.drop
        && !candidate
    ) {
      refreshOwner();
    }
  };

  shell.addEventListener('pointerdown', handlePointerDown);
  shell.addEventListener('dragstart', handleDragStart, true);
  shell.addEventListener('click', handleClickCapture, true);
  shell.addEventListener('transitionend', handleDropTransitionEnd);
  window.addEventListener('pointermove', handlePointerMove, {
    passive: false,
  });
  window.addEventListener('pointerup', handlePointerUp, true);
  window.addEventListener('pointercancel', handlePointerCancel, true);

  refreshOwner();

  return () => {
    candidate = null;

    shell.removeEventListener('pointerdown', handlePointerDown);
    shell.removeEventListener('dragstart', handleDragStart, true);
    shell.removeEventListener('click', handleClickCapture, true);
    shell.removeEventListener('transitionend', handleDropTransitionEnd);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp, true);
    window.removeEventListener('pointercancel', handlePointerCancel, true);

    timers.forEach((timer) => {
      window.clearTimeout(timer);
    });
    timers.clear();

    const parts = getDesktopParts(shell);

    parts?.links.forEach((link) => {
      removeLinkRefraction(link);
      delete link.dataset.rafNavbarDropOwner;
    });

    if (parts) {
      parts.drop.style.removeProperty('transition');
      parts.drop.style.removeProperty('transform');
      parts.surface.style.removeProperty('transition');
      parts.surface.style.removeProperty('transform');
    }

    delete shell.dataset.rafNavbarDragRuntime;
    delete shell.dataset.rafNavbarDragging;
    delete shell.dataset.rafNavbarDragDirection;
  };
}

function getMobileItemParts(item) {
  if (!(item instanceof HTMLElement)) {
    return null;
  }

  const spans = Array.from(item.children).filter(
      (child) => child instanceof HTMLElement
          && child.tagName === 'SPAN',
  );

  if (spans.length < 2) {
    return null;
  }

  return {
    lens: spans[0],
    label: spans[1],
    number: spans[2] || null,
  };
}

function createTransferLayer({
                               left,
                               top,
                               width,
                               height,
                               direction,
                               delay = 0,
                               reducedMotion = false,
                             }) {
  const layer = document.createElement('span');
  const filterId = direction > 0
      ? '#raf-navbar-vertical-surface-refraction-down'
      : '#raf-navbar-vertical-surface-refraction-up';

  layer.dataset.rafMobileRefractionBridge = 'true';
  layer.setAttribute('aria-hidden', 'true');

  Object.assign(layer.style, {
    position: 'fixed',
    zIndex: '2147483100',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${Math.max(10, height)}px`,
    pointerEvents: 'none',
    border: '1px solid rgba(255, 255, 255, 0.22)',
    borderRadius: '999px',
    opacity: '0',
    background: [
      'radial-gradient(ellipse at 36% 6%, rgba(255,255,255,.48), transparent 34%)',
      'radial-gradient(ellipse at 72% 96%, rgba(255,255,255,.2), transparent 42%)',
      'linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.018) 48%, rgba(255,255,255,.09))',
    ].join(','),
    boxShadow: [
      'inset 0 1px 0 rgba(255,255,255,.7)',
      'inset 0 -1px 0 rgba(0,0,0,.24)',
      '0 0 .9rem rgba(255,255,255,.12)',
    ].join(','),
    backdropFilter: `url(${filterId}) blur(.7px) saturate(132%) contrast(108%)`,
    WebkitBackdropFilter: `url(${filterId}) blur(.7px) saturate(132%) contrast(108%)`,
    transformOrigin: direction > 0 ? '50% 0%' : '50% 100%',
    willChange: 'transform, opacity, filter',
  });

  document.body.appendChild(layer);

  const duration = reducedMotion ? 180 : 620;

  const animation = layer.animate(
      [
        {
          opacity: 0,
          transform: 'scaleY(0.04) scaleX(0.66)',
          filter: 'blur(2px)',
        },
        {
          opacity: 0.78,
          transform: 'scaleY(1.08) scaleX(1.03)',
          filter: 'blur(0px)',
          offset: 0.38,
        },
        {
          opacity: 0.42,
          transform: 'scaleY(0.92) scaleX(0.95)',
          filter: 'blur(0.35px)',
          offset: 0.72,
        },
        {
          opacity: 0,
          transform: 'scaleY(0.18) scaleX(0.72)',
          filter: 'blur(1.6px)',
        },
      ],
      {
        duration,
        delay,
        easing: 'cubic-bezier(0.2, 0.88, 0.18, 1)',
        fill: 'both',
      },
  );

  const remove = () => {
    animation.cancel();
    layer.remove();
  };

  animation.finished.then(remove).catch(remove);

  return remove;
}

function createMobileTransferBridge(
    source,
    target,
    direction,
    reducedMotion,
) {
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const sharedWidth = Math.min(sourceRect.width, targetRect.width);
  const width = Math.max(34, sharedWidth * 0.54);
  const left = Math.max(
      sourceRect.left,
      targetRect.left,
  ) + (sharedWidth - width) * 0.5;

  const topRect = sourceRect.top <= targetRect.top
      ? sourceRect
      : targetRect;
  const bottomRect = sourceRect.top <= targetRect.top
      ? targetRect
      : sourceRect;

  const gapTop = topRect.bottom - 5;
  const gapBottom = bottomRect.top + 5;
  const gapHeight = gapBottom - gapTop;

  const removers = [];

  if (gapHeight > 0 && gapHeight <= 150) {
    removers.push(createTransferLayer({
      left,
      top: gapTop,
      width,
      height: gapHeight,
      direction,
      reducedMotion,
    }));
  } else {
    const tailHeight = Math.min(34, sourceRect.height * 0.62);

    removers.push(createTransferLayer({
      left: sourceRect.left + (sourceRect.width - width) * 0.5,
      top: direction > 0
          ? sourceRect.bottom - 5
          : sourceRect.top - tailHeight + 5,
      width,
      height: tailHeight,
      direction,
      reducedMotion,
    }));

    removers.push(createTransferLayer({
      left: targetRect.left + (targetRect.width - width) * 0.5,
      top: direction > 0
          ? targetRect.top - tailHeight + 5
          : targetRect.bottom - 5,
      width,
      height: tailHeight,
      direction,
      delay: reducedMotion ? 20 : 130,
      reducedMotion,
    }));
  }

  return () => {
    removers.forEach((remove) => remove());
  };
}

function animateMobileRefraction({
                                   source,
                                   target,
                                   direction,
                                   reducedMotion,
                                 }) {
  const sourceParts = getMobileItemParts(source);
  const targetParts = getMobileItemParts(target);

  if (!sourceParts || !targetParts) {
    return () => {};
  }

  const directionName = direction > 0 ? 'down' : 'up';
  const sign = direction > 0 ? 1 : -1;
  const duration = reducedMotion
      ? 220
      : MOBILE_REFRACTION_DURATION;

  source.dataset.rafMobileRefractionRole = 'source';
  source.dataset.rafMobileRefractionDirection = directionName;
  source.style.setProperty(
      '--raf-mobile-refraction-origin',
      direction > 0 ? '100%' : '0%',
  );

  target.dataset.rafMobileRefractionRole = 'target';
  target.dataset.rafMobileRefractionDirection = directionName;
  target.style.setProperty(
      '--raf-mobile-refraction-origin',
      direction > 0 ? '0%' : '100%',
  );

  const animations = [];

  animations.push(sourceParts.label.animate(
      [
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) scaleY(1) scaleX(1)',
          textShadow: '0 0 0 rgba(255,255,255,0)',
        },
        {
          opacity: 0.9,
          transform: `translate3d(0, ${sign * 11}px, 0) scaleY(1.34) scaleX(.96)`,
          textShadow: `0 ${sign * 4}px 5px rgba(255,255,255,.46)`,
          offset: 0.34,
        },
        {
          opacity: 0.42,
          transform: `translate3d(0, ${sign * 17}px, 0) scaleY(.72) scaleX(1.04)`,
          textShadow: `0 ${sign * 7}px 9px rgba(150,195,255,.3)`,
          offset: 0.68,
        },
        {
          opacity: 0,
          transform: `translate3d(0, ${sign * 8}px, 0) scaleY(.86) scaleX(1)`,
          textShadow: '0 0 0 rgba(255,255,255,0)',
        },
      ],
      {
        duration: duration * 0.72,
        easing: 'cubic-bezier(0.2, 0.88, 0.18, 1)',
        fill: 'both',
      },
  ));

  animations.push(targetParts.label.animate(
      [
        {
          opacity: 0.34,
          transform: `translate3d(0, ${-sign * 17}px, 0) scaleY(1.36) scaleX(.95)`,
          textShadow: `0 ${-sign * 7}px 9px rgba(150,195,255,.34)`,
        },
        {
          opacity: 0.92,
          transform: `translate3d(0, ${sign * 3}px, 0) scaleY(.9) scaleX(1.04)`,
          textShadow: `0 ${sign * 3}px 5px rgba(255,255,255,.42)`,
          offset: 0.46,
        },
        {
          opacity: 1,
          transform: `translate3d(0, ${-sign * 1}px, 0) scaleY(1.045) scaleX(.99)`,
          textShadow: '0 0 8px rgba(255,255,255,.22)',
          offset: 0.76,
        },
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) scaleY(1) scaleX(1)',
          textShadow: '0 0 0 rgba(255,255,255,0)',
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.2, 0.88, 0.18, 1)',
        fill: 'both',
      },
  ));

  animations.push(sourceParts.lens.animate(
      [
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) scaleY(1) scaleX(1)',
          borderRadius: 'inherit',
        },
        {
          opacity: 0.82,
          transform: `translate3d(0, ${sign * 12}px, 0) scaleY(1.48) scaleX(.82)`,
          borderRadius: '42% 58% 50% 50% / 66% 66% 34% 34%',
          offset: 0.38,
        },
        {
          opacity: 0,
          transform: `translate3d(0, ${sign * 24}px, 0) scaleY(.28) scaleX(.62)`,
          borderRadius: '999px',
        },
      ],
      {
        duration: duration * 0.72,
        easing: 'cubic-bezier(0.2, 0.88, 0.18, 1)',
        fill: 'both',
      },
  ));

  animations.push(targetParts.lens.animate(
      [
        {
          opacity: 0.12,
          transform: `translate3d(0, ${-sign * 22}px, 0) scaleY(.22) scaleX(.6)`,
          borderRadius: '999px',
        },
        {
          opacity: 0.96,
          transform: `translate3d(0, ${-sign * 3}px, 0) scaleY(1.46) scaleX(.84)`,
          borderRadius: '48% 52% 44% 56% / 34% 34% 66% 66%',
          offset: 0.44,
        },
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) scaleY(.94) scaleX(1.035)',
          borderRadius: 'inherit',
          offset: 0.75,
        },
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) scaleY(1) scaleX(1)',
          borderRadius: 'inherit',
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.2, 0.88, 0.18, 1)',
        fill: 'both',
      },
  ));

  const removeBridge = reducedMotion
      ? () => {}
      : createMobileTransferBridge(
          source,
          target,
          direction,
          reducedMotion,
      );

  let disposed = false;

  const cleanup = () => {
    if (disposed) {
      return;
    }

    disposed = true;

    animations.forEach((animation) => {
      animation.cancel();
    });

    removeBridge();

    [source, target].forEach((item) => {
      delete item.dataset.rafMobileRefractionRole;
      delete item.dataset.rafMobileRefractionDirection;
      item.style.removeProperty('--raf-mobile-refraction-origin');
    });
  };

  Promise.allSettled(
      animations.map((animation) => animation.finished),
  ).then(cleanup);

  return cleanup;
}

function getArrowDirection(button) {
  const label = (
      button.getAttribute('aria-label') || ''
  ).toLocaleLowerCase();

  if (
      label.includes('previous')
      || label.includes('предыдущ')
  ) {
    return -1;
  }

  if (
      label.includes('next')
      || label.includes('следующ')
  ) {
    return 1;
  }

  return 0;
}

function getMobileArrowButtons(drawer) {
  return Array.from(
      drawer.querySelectorAll('button[aria-label]'),
  ).filter((button) => getArrowDirection(button) !== 0);
}

function attachMobileRefraction(drawer) {
  let pending = null;
  let activeCleanup = null;
  let resolveFrame = 0;
  let resolveAttempts = 0;

  const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
  ).matches;

  const resolveTarget = () => {
    resolveFrame = 0;

    if (!pending || !drawer.isConnected) {
      return;
    }

    const target = drawer.querySelector(
        '[data-raf-mobile-drawer-item="selected"]',
    );

    if (
        target instanceof HTMLElement
        && target !== pending.source
    ) {
      activeCleanup?.();
      activeCleanup = animateMobileRefraction({
        source: pending.source,
        target,
        direction: pending.direction,
        reducedMotion,
      });
      pending = null;
      resolveAttempts = 0;
      return;
    }

    resolveAttempts += 1;

    if (resolveAttempts < 10) {
      resolveFrame = window.requestAnimationFrame(
          resolveTarget,
      );
    } else {
      pending = null;
      resolveAttempts = 0;
    }
  };

  const handleArrowClick = (event) => {
    const button = event.currentTarget;
    const direction = getArrowDirection(button);

    if (direction === 0 || button.disabled) {
      return;
    }

    const source = drawer.querySelector(
        '[data-raf-mobile-drawer-item="selected"]',
    );

    if (!(source instanceof HTMLElement)) {
      return;
    }

    pending = {
      source,
      direction,
    };
    resolveAttempts = 0;

    if (resolveFrame !== 0) {
      window.cancelAnimationFrame(resolveFrame);
    }

    resolveFrame = window.requestAnimationFrame(
        resolveTarget,
    );
  };

  const buttons = getMobileArrowButtons(drawer);

  buttons.forEach((button) => {
    button.addEventListener('click', handleArrowClick, true);
  });

  drawer.dataset.rafMobileRefractionRuntime = 'ready';

  return () => {
    buttons.forEach((button) => {
      button.removeEventListener(
          'click',
          handleArrowClick,
          true,
      );
    });

    if (resolveFrame !== 0) {
      window.cancelAnimationFrame(resolveFrame);
    }

    activeCleanup?.();
    delete drawer.dataset.rafMobileRefractionRuntime;
  };
}

export default function NavbarDragRefractionRuntime() {
  useEffect(() => {
    let cancelled = false;
    let bindFrame = 0;

    const desktopBindings = new Map();
    const mobileBindings = new Map();

    const bindAll = () => {
      bindFrame = 0;

      if (cancelled) {
        return;
      }

      const desktopShells = new Set(
          document.querySelectorAll(
              '[data-raf-navbar-shell="true"]',
          ),
      );

      desktopBindings.forEach((dispose, shell) => {
        if (!desktopShells.has(shell) || !shell.isConnected) {
          dispose();
          desktopBindings.delete(shell);
        }
      });

      desktopShells.forEach((shell) => {
        if (
            shell instanceof HTMLElement
            && !desktopBindings.has(shell)
            && getDesktopParts(shell)
        ) {
          desktopBindings.set(
              shell,
              attachDesktopDrag(shell),
          );
        }
      });

      const drawers = new Set(
          document.querySelectorAll(
              '[data-raf-glass-surface="mobile-drawer"]',
          ),
      );

      mobileBindings.forEach((dispose, drawer) => {
        if (!drawers.has(drawer) || !drawer.isConnected) {
          dispose();
          mobileBindings.delete(drawer);
        }
      });

      drawers.forEach((drawer) => {
        if (
            drawer instanceof HTMLElement
            && !mobileBindings.has(drawer)
            && getMobileArrowButtons(drawer).length > 0
        ) {
          mobileBindings.set(
              drawer,
              attachMobileRefraction(drawer),
          );
        }
      });
    };

    const scheduleBind = () => {
      if (bindFrame !== 0) {
        return;
      }

      bindFrame = window.requestAnimationFrame(bindAll);
    };

    const mutationObserver = new MutationObserver(
        scheduleBind,
    );

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'class',
        'data-raf-mobile-drawer-item',
        'data-state',
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

      mutationObserver.disconnect();
      window.removeEventListener('resize', scheduleBind);

      desktopBindings.forEach((dispose) => dispose());
      desktopBindings.clear();

      mobileBindings.forEach((dispose) => dispose());
      mobileBindings.clear();

      document.querySelectorAll(
          '[data-raf-mobile-refraction-bridge="true"]',
      ).forEach((bridge) => bridge.remove());
    };
  }, []);

  return (
      <>
        <svg
            aria-hidden="true"
            focusable="false"
            width="0"
            height="0"
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
        >
          <defs>
            <filter
                id="raf-navbar-horizontal-text-refraction-right"
                x="-28%"
                y="-70%"
                width="156%"
                height="240%"
                colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.024 0.085"
                  numOctaves="1"
                  seed="19"
                  result="noise"
              />
              <feGaussianBlur
                  in="noise"
                  stdDeviation="1.1 0.35"
                  result="smoothNoise"
              />
              <feColorMatrix
                  in="smoothNoise"
                  values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0"
                  result="horizontalMap"
              />
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="horizontalMap"
                  scale="8"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
            </filter>

            <filter
                id="raf-navbar-horizontal-text-refraction-left"
                x="-28%"
                y="-70%"
                width="156%"
                height="240%"
                colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.024 0.085"
                  numOctaves="1"
                  seed="19"
                  result="noise"
              />
              <feGaussianBlur
                  in="noise"
                  stdDeviation="1.1 0.35"
                  result="smoothNoise"
              />
              <feColorMatrix
                  in="smoothNoise"
                  values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1 0"
                  result="horizontalMap"
              />
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="horizontalMap"
                  scale="-8"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
            </filter>

            <filter
                id="raf-navbar-vertical-text-refraction-down"
                x="-32%"
                y="-80%"
                width="164%"
                height="260%"
                colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.08 0.022"
                  numOctaves="1"
                  seed="31"
                  result="noise"
              />
              <feGaussianBlur
                  in="noise"
                  stdDeviation="0.35 1.15"
                  result="smoothNoise"
              />
              <feColorMatrix
                  in="smoothNoise"
                  values="0 0 0 0 0.5  0 1 0 0 0  0 0 0 0 0.5  0 0 0 1 0"
                  result="verticalMap"
              />
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="verticalMap"
                  scale="9"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
            </filter>

            <filter
                id="raf-navbar-vertical-text-refraction-up"
                x="-32%"
                y="-80%"
                width="164%"
                height="260%"
                colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.08 0.022"
                  numOctaves="1"
                  seed="31"
                  result="noise"
              />
              <feGaussianBlur
                  in="noise"
                  stdDeviation="0.35 1.15"
                  result="smoothNoise"
              />
              <feColorMatrix
                  in="smoothNoise"
                  values="0 0 0 0 0.5  0 1 0 0 0  0 0 0 0 0.5  0 0 0 1 0"
                  result="verticalMap"
              />
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="verticalMap"
                  scale="-9"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
            </filter>

            <filter
                id="raf-navbar-vertical-surface-refraction-down"
                x="-45%"
                y="-45%"
                width="190%"
                height="190%"
                colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.055 0.018"
                  numOctaves="1"
                  seed="43"
                  result="noise"
              />
              <feColorMatrix
                  in="noise"
                  values="0 0 0 0 0.5  0 1 0 0 0  0 0 0 0 0.5  0 0 0 1 0"
                  result="verticalMap"
              />
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="verticalMap"
                  scale="14"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
            </filter>

            <filter
                id="raf-navbar-vertical-surface-refraction-up"
                x="-45%"
                y="-45%"
                width="190%"
                height="190%"
                colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.055 0.018"
                  numOctaves="1"
                  seed="43"
                  result="noise"
              />
              <feColorMatrix
                  in="noise"
                  values="0 0 0 0 0.5  0 1 0 0 0  0 0 0 0 0.5  0 0 0 1 0"
                  result="verticalMap"
              />
              <feDisplacementMap
                  in="SourceGraphic"
                  in2="verticalMap"
                  scale="-14"
                  xChannelSelector="R"
                  yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      </>
  );
}