'use client';

import { useEffect } from 'react';

import { createRefractionMap } from './refraction-map';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const FILTER_MARGIN = 28;
const MAX_MAP_SIZE = 2048;

const RUNTIME_STYLES = `
[data-raf-navbar-shell="true"][data-raf-moving-lens-runtime="ready"]
[data-raf-navbar-text-refraction] {
  transform: none !important;
  filter: none !important;
  letter-spacing: inherit !important;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.42),
    0 0 0.55rem rgba(0, 0, 0, 0.28) !important;
}

[data-raf-navbar-shell="true"][data-raf-moving-lens-runtime="ready"]
a[aria-current="page"][data-raf-navbar-text-refraction],
[data-raf-navbar-shell="true"][data-raf-moving-lens-runtime="ready"]
a[data-raf-navbar-drop-owner="true"][data-raf-navbar-text-refraction] {
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.55),
    0 0 0.8rem rgba(255, 255, 255, 0.2) !important;
}

[data-raf-navbar-shell="true"][data-raf-moving-lens-runtime="ready"]
[data-raf-navbar-progressive-text-mask="true"] {
  display: none !important;
}

[data-raf-navbar-moving-lens="true"],
[data-raf-navbar-moving-lens="true"] * {
  pointer-events: none !important;
  user-select: none !important;
}

[data-raf-navbar-moving-lens="true"] {
  position: absolute;
  z-index: 12;
  top: 0;
  left: 0;
  display: block;
  overflow: hidden;
  border-radius: 999px;
  contain: paint;
  isolation: isolate;
  opacity: 0;
  will-change: transform, width, height, opacity;
}

[data-raf-navbar-moving-lens-sample="true"] {
  position: absolute;
  inset: 0;
  display: block;
  overflow: visible;
  transform: translateZ(0);
  transform-origin: 50% 50%;
  will-change: filter;
}

[data-raf-navbar-moving-lens-label="true"] {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  white-space: nowrap;
  text-align: center;
  text-decoration: none;
  transform: none !important;
  transition: none !important;
  animation: none !important;
  will-change: left, top, width, height;
}

@media (prefers-reduced-transparency: reduce) {
  [data-raf-navbar-moving-lens="true"] {
    display: none !important;
  }
}
`;

const clamp = (value, min, max) => (
  Math.min(max, Math.max(min, value))
);

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  return element;
}

function setHref(element, value) {
  element.setAttribute('href', value);
  element.setAttributeNS(XLINK_NS, 'xlink:href', value);
}

function createFilterDefinition(id, suffix) {
  const filter = createSvgElement('filter', {
    id,
    filterUnits: 'userSpaceOnUse',
    primitiveUnits: 'userSpaceOnUse',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    colorInterpolationFilters: 'sRGB',
  });

  const image = createSvgElement('feImage', {
    id: `raf-navbar-moving-lens-map-${suffix}`,
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    preserveAspectRatio: 'none',
    result: 'map',
  });
  setHref(
    image,
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  );

  const displacement = createSvgElement('feDisplacementMap', {
    id: `raf-navbar-moving-lens-displacement-${suffix}`,
    in: 'SourceGraphic',
    in2: 'map',
    scale: 68,
    xChannelSelector: 'R',
    yChannelSelector: 'G',
    result: 'bent',
  });

  const blur = createSvgElement('feGaussianBlur', {
    in: 'bent',
    stdDeviation: 0.14,
    result: 'softened',
  });

  const monochrome = createSvgElement('feColorMatrix', {
    in: 'softened',
    type: 'saturate',
    values: 0,
    result: 'mono',
  });

  const transfer = createSvgElement('feComponentTransfer', {
    in: 'mono',
  });

  ['R', 'G', 'B'].forEach((channel) => {
    transfer.appendChild(createSvgElement(`feFunc${channel}`, {
      type: 'gamma',
      amplitude: 1.26,
      exponent: 0.82,
      offset: -0.024,
    }));
  });

  filter.append(
    image,
    displacement,
    blur,
    monochrome,
    transfer,
  );

  return {
    filter,
    image,
    displacement,
  };
}

function createFilterHost() {
  const svg = createSvgElement('svg', {
    'aria-hidden': 'true',
    focusable: 'false',
    width: 0,
    height: 0,
  });

  Object.assign(svg.style, {
    position: 'absolute',
    width: '0px',
    height: '0px',
    overflow: 'hidden',
    pointerEvents: 'none',
  });

  const defs = createSvgElement('defs');
  const right = createFilterDefinition(
    'raf-navbar-moving-lens-right',
    'right',
  );
  const left = createFilterDefinition(
    'raf-navbar-moving-lens-left',
    'left',
  );

  defs.append(right.filter, left.filter);
  svg.appendChild(defs);
  document.body.appendChild(svg);

  return {
    svg,
    right,
    left,
  };
}

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
    !(drop instanceof HTMLElement)
    || links.length === 0
  ) {
    return null;
  }

  return {
    drop,
    links,
  };
}

function clearLegacyProgressiveEffect(shell) {
  shell.querySelectorAll(
    '[data-raf-navbar-progressive-text-mask="true"]',
  ).forEach((node) => node.remove());

  getDirectDesktopLinks(shell).forEach((link) => {
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
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function decodeChannel(value) {
  return clamp((value - 128) / 127, -1, 1);
}

function encodeChannel(value) {
  return Math.round(clamp(128 + value * 127, 0, 255));
}

function rotateMapPixels(sourcePixels, sourceWidth, sourceHeight, direction) {
  const destinationWidth = sourceHeight;
  const destinationHeight = sourceWidth;
  const destination = new Uint8ClampedArray(
    destinationWidth * destinationHeight * 4,
  );

  for (let sourceY = 0; sourceY < sourceHeight; sourceY += 1) {
    for (let sourceX = 0; sourceX < sourceWidth; sourceX += 1) {
      const sourceOffset = (
        sourceY * sourceWidth + sourceX
      ) * 4;

      const sourceVectorX = decodeChannel(
        sourcePixels[sourceOffset],
      );
      const sourceVectorY = decodeChannel(
        sourcePixels[sourceOffset + 1],
      );

      let destinationX;
      let destinationY;
      let destinationVectorX;
      let destinationVectorY;

      if (direction > 0) {
        destinationX = sourceHeight - 1 - sourceY;
        destinationY = sourceX;
        destinationVectorX = -sourceVectorY;
        destinationVectorY = sourceVectorX;
      } else {
        destinationX = sourceY;
        destinationY = sourceWidth - 1 - sourceX;
        destinationVectorX = sourceVectorY;
        destinationVectorY = -sourceVectorX;
      }

      const destinationOffset = (
        destinationY * destinationWidth + destinationX
      ) * 4;

      destination[destinationOffset] = encodeChannel(
        destinationVectorX,
      );
      destination[destinationOffset + 1] = encodeChannel(
        destinationVectorY,
      );
      destination[destinationOffset + 2] = 128;
      destination[destinationOffset + 3] = sourcePixels[
        sourceOffset + 3
      ];
    }
  }

  return {
    pixels: destination,
    width: destinationWidth,
    height: destinationHeight,
  };
}

async function createDirectionalMaps({
  width,
  height,
  radius,
}) {
  const safeWidth = clamp(Math.round(width), 8, MAX_MAP_SIZE);
  const safeHeight = clamp(Math.round(height), 8, MAX_MAP_SIZE);

  const sourceMap = createRefractionMap({
    width: safeHeight,
    height: safeWidth,
    radius,
    margin: FILTER_MARGIN,
    band: Math.max(8, safeWidth * 0.5),
    profileShape: 3.45,
    edgePower: 1.22,
    bodyStrength: 0.2,
    normalStrength: 1.28,
    shoulderStrength: 0.34,
    shoulderPosition: 0.57,
    shoulderWidth: 0.18,
    bodyLensStrength: 0.24,
    bodyLensPower: 0.9,
    horizontalLensScale: 0.72,
    verticalLensScale: 1.18,
  });

  if (!sourceMap) {
    return null;
  }

  const sourceImage = await loadImage(sourceMap.dataUrl);
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = sourceMap.width;
  sourceCanvas.height = sourceMap.height;

  const sourceContext = sourceCanvas.getContext('2d', {
    alpha: false,
    willReadFrequently: true,
  });

  if (!sourceContext) {
    return null;
  }

  sourceContext.drawImage(sourceImage, 0, 0);
  const sourceImageData = sourceContext.getImageData(
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
  );

  const makeMap = (direction) => {
    const rotated = rotateMapPixels(
      sourceImageData.data,
      sourceCanvas.width,
      sourceCanvas.height,
      direction,
    );

    const canvas = document.createElement('canvas');
    canvas.width = rotated.width;
    canvas.height = rotated.height;

    const context = canvas.getContext('2d', {
      alpha: false,
    });

    if (!context) {
      return null;
    }

    const imageData = context.createImageData(
      rotated.width,
      rotated.height,
    );
    imageData.data.set(rotated.pixels);
    context.putImageData(imageData, 0, 0);

    return {
      dataUrl: canvas.toDataURL('image/png'),
      width: rotated.width,
      height: rotated.height,
      margin: sourceMap.margin,
    };
  };

  const right = makeMap(1);
  const left = makeMap(-1);

  if (!right || !left) {
    return null;
  }

  return {
    right,
    left,
  };
}

function applyMap(filterDefinition, map) {
  const x = -map.margin;
  const y = -map.margin;

  filterDefinition.filter.setAttribute('x', String(x));
  filterDefinition.filter.setAttribute('y', String(y));
  filterDefinition.filter.setAttribute('width', String(map.width));
  filterDefinition.filter.setAttribute('height', String(map.height));

  filterDefinition.image.setAttribute('x', String(x));
  filterDefinition.image.setAttribute('y', String(y));
  filterDefinition.image.setAttribute('width', String(map.width));
  filterDefinition.image.setAttribute('height', String(map.height));
  setHref(filterDefinition.image, map.dataUrl);
}

function createLabelClone(link) {
  const clone = document.createElement('span');
  const style = window.getComputedStyle(link);

  clone.dataset.rafNavbarMovingLensLabel = 'true';
  clone.setAttribute('aria-hidden', 'true');
  clone.textContent = (link.textContent || '').trim();

  Object.assign(clone.style, {
    color: style.color,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontStyle: style.fontStyle,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    textShadow: style.textShadow,
    textTransform: style.textTransform,
  });

  return clone;
}

function getSceneSignature(links) {
  return links.map((link) => [
    link.textContent,
    link.className,
    link.getAttribute('aria-current'),
  ].join('::')).join('||');
}

function setOriginalLinkMask(link, lensRect) {
  const linkRect = link.getBoundingClientRect();
  const overlapLeft = Math.max(linkRect.left, lensRect.left);
  const overlapRight = Math.min(linkRect.right, lensRect.right);

  if (
    overlapRight <= overlapLeft
    || linkRect.width <= 0.01
  ) {
    link.style.removeProperty('mask-image');
    link.style.removeProperty('-webkit-mask-image');
    return;
  }

  const start = clamp(
    ((overlapLeft - linkRect.left) / linkRect.width) * 100,
    0,
    100,
  );
  const end = clamp(
    ((overlapRight - linkRect.left) / linkRect.width) * 100,
    0,
    100,
  );
  const feather = clamp(
    (0.85 / linkRect.width) * 100,
    0.08,
    1.2,
  );
  const before = Math.max(0, start - feather);
  const after = Math.min(100, end + feather);

  const mask = [
    'linear-gradient(90deg,',
    '#000 0%,',
    `#000 ${before.toFixed(3)}%,`,
    `transparent ${start.toFixed(3)}%,`,
    `transparent ${end.toFixed(3)}%,`,
    `#000 ${after.toFixed(3)}%,`,
    '#000 100%)',
  ].join(' ');

  link.style.setProperty('mask-image', mask);
  link.style.setProperty('-webkit-mask-image', mask);
}

function clearOriginalLinkMask(link) {
  link.style.removeProperty('mask-image');
  link.style.removeProperty('-webkit-mask-image');
}

function attachMovingLens(shell, filterHost) {
  let disposed = false;
  let frame = 0;
  let previousCenter = null;
  let previousTime = performance.now();
  let direction = 1;
  let sceneSignature = '';
  let mapKey = '';
  let mapGeneration = 0;
  let mapsReady = false;
  let labelClones = [];

  clearLegacyProgressiveEffect(shell);

  const lens = document.createElement('span');
  const sample = document.createElement('span');

  lens.dataset.rafNavbarMovingLens = 'true';
  lens.setAttribute('aria-hidden', 'true');
  sample.dataset.rafNavbarMovingLensSample = 'true';

  lens.appendChild(sample);
  shell.appendChild(lens);
  shell.dataset.rafMovingLensRuntime = 'ready';

  const rebuildScene = (links) => {
    sample.replaceChildren();
    labelClones = links.map((link) => {
      const clone = createLabelClone(link);
      sample.appendChild(clone);
      return {
        link,
        clone,
      };
    });
  };

  const requestMaps = ({ width, height, radius }) => {
    const nextKey = [
      Math.round(width),
      Math.round(height),
      radius.toFixed(2),
    ].join('x');

    if (nextKey === mapKey) {
      return;
    }

    mapKey = nextKey;
    mapsReady = false;
    const generation = ++mapGeneration;

    createDirectionalMaps({
      width,
      height,
      radius,
    }).then((maps) => {
      if (
        disposed
        || generation !== mapGeneration
        || !maps
      ) {
        return;
      }

      applyMap(filterHost.right, maps.right);
      applyMap(filterHost.left, maps.left);
      mapsReady = true;
    }).catch(() => {
      if (generation === mapGeneration) {
        mapsReady = false;
      }
    });
  };

  const render = (time) => {
    frame = 0;

    if (disposed || !shell.isConnected) {
      return;
    }

    const parts = getDesktopParts(shell);

    if (!parts) {
      lens.style.opacity = '0';
      frame = window.requestAnimationFrame(render);
      return;
    }

    const nextSignature = getSceneSignature(parts.links);

    if (nextSignature !== sceneSignature) {
      sceneSignature = nextSignature;
      rebuildScene(parts.links);
    }

    const shellRect = shell.getBoundingClientRect();
    const dropRect = parts.drop.getBoundingClientRect();
    const localLeft = dropRect.left - shellRect.left;
    const localTop = dropRect.top - shellRect.top;
    const width = dropRect.width;
    const height = dropRect.height;

    if (width < 8 || height < 8) {
      parts.links.forEach(clearOriginalLinkMask);
      lens.style.opacity = '0';
      frame = window.requestAnimationFrame(render);
      return;
    }

    lens.style.width = `${width}px`;
    lens.style.height = `${height}px`;
    lens.style.transform = `translate3d(${localLeft}px, ${localTop}px, 0)`;

    const center = dropRect.left + width * 0.5;
    const elapsed = Math.max(1, time - previousTime);
    const velocity = previousCenter === null
      ? 0
      : (center - previousCenter) / elapsed;

    if (Math.abs(velocity) > 0.012) {
      direction = velocity > 0 ? 1 : -1;
    } else if (shell.dataset.rafNavbarDragDirection === 'right') {
      direction = 1;
    } else if (shell.dataset.rafNavbarDragDirection === 'left') {
      direction = -1;
    }

    previousCenter = center;
    previousTime = time;

    const radius = Number.parseFloat(
      window.getComputedStyle(parts.drop).borderTopLeftRadius,
    ) || height * 0.5;

    requestMaps({
      width,
      height,
      radius,
    });

    const scale = Math.round(clamp(
      height * 1.65 + Math.abs(velocity) * 18,
      58,
      92,
    ));

    filterHost.right.displacement.setAttribute(
      'scale',
      String(scale),
    );
    filterHost.left.displacement.setAttribute(
      'scale',
      String(scale),
    );

    sample.style.filter = [
      `url(#raf-navbar-moving-lens-${direction > 0 ? 'right' : 'left'})`,
      'contrast(1.035)',
      'brightness(1.008)',
    ].join(' ');

    const lensRect = {
      left: dropRect.left,
      right: dropRect.right,
      top: dropRect.top,
      bottom: dropRect.bottom,
      width,
      height,
    };

    labelClones.forEach(({ link, clone }) => {
      const linkRect = link.getBoundingClientRect();

      clone.style.left = `${linkRect.left - lensRect.left}px`;
      clone.style.top = `${linkRect.top - lensRect.top}px`;
      clone.style.width = `${linkRect.width}px`;
      clone.style.height = `${linkRect.height}px`;
    });

    if (mapsReady) {
      parts.links.forEach((link) => {
        setOriginalLinkMask(link, lensRect);
      });
      lens.style.opacity = '1';
    } else {
      parts.links.forEach(clearOriginalLinkMask);
      lens.style.opacity = '0';
    }

    frame = window.requestAnimationFrame(render);
  };

  frame = window.requestAnimationFrame(render);

  return () => {
    disposed = true;
    mapGeneration += 1;

    if (frame !== 0) {
      window.cancelAnimationFrame(frame);
    }

    getDirectDesktopLinks(shell).forEach(clearOriginalLinkMask);
    lens.remove();
    delete shell.dataset.rafMovingLensRuntime;
  };
}

export default function NavbarProgressiveTextRefractionRuntime() {
  useEffect(() => {
    let disposed = false;
    let bindFrame = 0;

    const style = document.createElement('style');
    style.dataset.rafNavbarMovingLensStyles = 'true';
    style.textContent = RUNTIME_STYLES;
    document.head.appendChild(style);

    const filterHost = createFilterHost();
    const bindings = new Map();

    const bindAll = () => {
      bindFrame = 0;

      if (disposed) {
        return;
      }

      const shells = new Set(
        document.querySelectorAll(
          '[data-raf-navbar-shell="true"]',
        ),
      );

      bindings.forEach((dispose, shell) => {
        if (!shells.has(shell) || !shell.isConnected) {
          dispose();
          bindings.delete(shell);
        }
      });

      shells.forEach((shell) => {
        if (
          shell instanceof HTMLElement
          && !bindings.has(shell)
          && getDesktopParts(shell)
        ) {
          bindings.set(
            shell,
            attachMovingLens(shell, filterHost),
          );
        }
      });
    };

    const scheduleBind = () => {
      if (bindFrame !== 0 || disposed) {
        return;
      }

      bindFrame = window.requestAnimationFrame(bindAll);
    };

    const observer = new MutationObserver(scheduleBind);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', scheduleBind, {
      passive: true,
    });

    scheduleBind();

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', scheduleBind);

      if (bindFrame !== 0) {
        window.cancelAnimationFrame(bindFrame);
      }

      bindings.forEach((dispose) => dispose());
      bindings.clear();
      filterHost.svg.remove();
      style.remove();
    };
  }, []);

  return null;
}
