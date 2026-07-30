'use client';

import { useEffect } from 'react';

import { createRefractionMap } from './refraction-map';

const FILTER_MARGIN = 32;
const MAX_MAP_SIZE = 2048;
const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

const RUNTIME_STYLES = `
[data-raf-navbar-shell="true"][data-raf-moving-lens-runtime="ready"]
[data-raf-navbar-text-refraction] {
  transform: none !important;
  filter: none !important;
  letter-spacing: inherit !important;
  text-shadow:
    0 1px 0 rgba(0,0,0,.42),
    0 0 .55rem rgba(0,0,0,.28) !important;
}

[data-raf-navbar-shell="true"][data-raf-moving-lens-runtime="ready"]
a[aria-current="page"][data-raf-navbar-text-refraction],
[data-raf-navbar-shell="true"][data-raf-moving-lens-runtime="ready"]
a[data-raf-navbar-drop-owner="true"][data-raf-navbar-text-refraction] {
  text-shadow:
    0 1px 0 rgba(0,0,0,.55),
    0 0 .8rem rgba(255,255,255,.2) !important;
}

[data-raf-navbar-progressive-text-mask="true"] {
  display: none !important;
}

[data-raf-navbar-moving-lens-scene="true"],
[data-raf-navbar-moving-lens-scene="true"] * {
  pointer-events: none !important;
  user-select: none !important;
}

[data-raf-navbar-moving-lens-scene="true"] {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: block;
  overflow: visible;
  border: 0 !important;
  border-radius: inherit;
  opacity: 0;
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  mix-blend-mode: normal;
  isolation: isolate;
  transform-origin: 50% 50%;
  will-change: transform, opacity;
}

[data-raf-navbar-moving-lens-sample="true"] {
  position: absolute;
  inset: 0;
  display: block;
  overflow: visible;
  border: 0 !important;
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
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
  border: 0 !important;
  white-space: nowrap;
  text-align: center;
  text-decoration: none;
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  transform: none !important;
  transition: none !important;
  animation: none !important;
}

@media (prefers-reduced-transparency: reduce) {
  [data-raf-navbar-moving-lens-scene="true"] {
    display: none !important;
  }
}
`;

const clamp = (value, min, max) => (
  Math.min(max, Math.max(min, value))
);

function getLinks(shell) {
  return Array.from(shell.querySelectorAll('a[href]')).filter(
    (link) => link.parentElement === shell,
  );
}

function getParts(shell) {
  const warp = shell.querySelector(
    '[data-raf-refraction-target="navbar-pill"]',
  );
  const surface = warp?.parentElement;
  const drop = surface?.parentElement;
  const links = getLinks(shell);

  if (
    !(surface instanceof HTMLElement)
    || !(drop instanceof HTMLElement)
    || links.length === 0
  ) {
    return null;
  }

  return { surface, drop, links };
}

function clearLegacy(shell) {
  shell.querySelectorAll(
    '[data-raf-navbar-progressive-text-mask="true"]',
  ).forEach((node) => node.remove());

  getLinks(shell).forEach((link) => {
    delete link.dataset.rafNavbarProgressiveTextLink;
    delete link.dataset.rafProgressiveTextLabel;
    delete link.dataset.rafProgressiveTextState;

    Array.from(link.style).forEach((property) => {
      if (property.startsWith('--raf-progressive-text-')) {
        link.style.removeProperty(property);
      }
    });
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function decode(value) {
  return clamp((value - 128) / 127, -1, 1);
}

function encode(value) {
  return Math.round(clamp(128 + value * 127, 0, 255));
}

function rotatePixels(data, width, height, direction) {
  const outputWidth = height;
  const outputHeight = width;
  const output = new Uint8ClampedArray(
    outputWidth * outputHeight * 4,
  );

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceOffset = (y * width + x) * 4;
      const vectorX = decode(data[sourceOffset]);
      const vectorY = decode(data[sourceOffset + 1]);
      const curvature = clamp(
        Math.hypot(vectorX, vectorY) * 1.35,
        0,
        1,
      );

      const destinationX = direction > 0
        ? height - 1 - y
        : y;
      const destinationY = direction > 0
        ? x
        : width - 1 - x;
      const rotatedX = direction > 0
        ? -vectorY
        : vectorY;
      const rotatedY = direction > 0
        ? vectorX
        : -vectorX;
      const destinationOffset = (
        destinationY * outputWidth + destinationX
      ) * 4;

      output[destinationOffset] = encode(
        rotatedX + direction * curvature * 0.055,
      );
      output[destinationOffset + 1] = encode(rotatedY);
      output[destinationOffset + 2] = 128;
      output[destinationOffset + 3] = data[sourceOffset + 3];
    }
  }

  return {
    data: output,
    width: outputWidth,
    height: outputHeight,
  };
}

async function createMaps(width, height, radius) {
  const safeWidth = clamp(Math.round(width), 8, MAX_MAP_SIZE);
  const safeHeight = clamp(Math.round(height), 8, MAX_MAP_SIZE);
  const source = createRefractionMap({
    width: safeHeight,
    height: safeWidth,
    radius,
    margin: FILTER_MARGIN,
    band: Math.max(8, safeHeight * 0.5),
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

  if (!source) return null;

  const image = await loadImage(source.dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;

  const context = canvas.getContext('2d', {
    alpha: false,
    willReadFrequently: true,
  });
  if (!context) return null;

  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  ).data;

  const make = (direction) => {
    const rotated = rotatePixels(
      pixels,
      canvas.width,
      canvas.height,
      direction,
    );
    const target = document.createElement('canvas');
    target.width = rotated.width;
    target.height = rotated.height;

    const targetContext = target.getContext('2d', { alpha: false });
    if (!targetContext) return null;

    const imageData = targetContext.createImageData(
      rotated.width,
      rotated.height,
    );
    imageData.data.set(rotated.data);
    targetContext.putImageData(imageData, 0, 0);

    return {
      dataUrl: target.toDataURL('image/png'),
      width: rotated.width,
      height: rotated.height,
      margin: source.margin,
    };
  };

  const right = make(1);
  const left = make(-1);
  return right && left ? { right, left } : null;
}

function setHref(element, value) {
  element.setAttribute('href', value);
  element.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    value,
  );
}

function applyMap(suffix, map) {
  const filter = document.getElementById(
    `raf-navbar-moving-lens-${suffix}`,
  );
  const image = document.getElementById(
    `raf-navbar-moving-lens-map-${suffix}`,
  );

  if (!(filter instanceof SVGElement) || !(image instanceof SVGElement)) {
    return;
  }

  const x = -map.margin;
  const y = -map.margin;

  filter.setAttribute('x', String(x));
  filter.setAttribute('y', String(y));
  filter.setAttribute('width', String(map.width));
  filter.setAttribute('height', String(map.height));
  image.setAttribute('x', String(x));
  image.setAttribute('y', String(y));
  image.setAttribute('width', String(map.width));
  image.setAttribute('height', String(map.height));
  setHref(image, map.dataUrl);
}

function createLabel(link) {
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

function signature(links) {
  return links.map((link) => [
    link.textContent,
    link.className,
    link.getAttribute('aria-current'),
    link.dataset.rafNavbarDropOwner,
  ].join('::')).join('||');
}

function clearMask(link) {
  [
    'mask-image',
    '-webkit-mask-image',
    'mask-repeat',
    '-webkit-mask-repeat',
    'mask-size',
    '-webkit-mask-size',
  ].forEach((property) => link.style.removeProperty(property));
}

function maskLink(link, lensRect) {
  const rect = link.getBoundingClientRect();
  const left = Math.max(rect.left, lensRect.left);
  const right = Math.min(rect.right, lensRect.right);

  if (right <= left || rect.width <= 0.01) {
    clearMask(link);
    return;
  }

  const start = clamp(((left - rect.left) / rect.width) * 100, 0, 100);
  const end = clamp(((right - rect.left) / rect.width) * 100, 0, 100);
  const feather = clamp((0.7 / rect.width) * 100, 0.06, 0.9);
  const mask = [
    'linear-gradient(90deg,',
    '#000 0%,',
    `#000 ${Math.max(0, start - feather).toFixed(3)}%,`,
    `transparent ${start.toFixed(3)}%,`,
    `transparent ${end.toFixed(3)}%,`,
    `#000 ${Math.min(100, end + feather).toFixed(3)}%,`,
    '#000 100%)',
  ].join(' ');

  link.style.setProperty('mask-image', mask);
  link.style.setProperty('-webkit-mask-image', mask);
  link.style.setProperty('mask-repeat', 'no-repeat');
  link.style.setProperty('-webkit-mask-repeat', 'no-repeat');
  link.style.setProperty('mask-size', '100% 100%');
  link.style.setProperty('-webkit-mask-size', '100% 100%');
}

function inverseTransform(surface) {
  const style = window.getComputedStyle(surface);
  const value = style.transform;

  if (!value || value === 'none') {
    return {
      value: 'none',
      origin: style.transformOrigin || '50% 50%',
    };
  }

  try {
    const Matrix = window.DOMMatrixReadOnly || window.DOMMatrix;
    return {
      value: Matrix
        ? new Matrix(value).inverse().toString()
        : 'none',
      origin: style.transformOrigin || '50% 50%',
    };
  } catch {
    return {
      value: 'none',
      origin: style.transformOrigin || '50% 50%',
    };
  }
}

function attach(shell) {
  let disposed = false;
  let frame = 0;
  let previousCenter = null;
  let previousTime = performance.now();
  let direction = 1;
  let sceneSignature = '';
  let mapKey = '';
  let mapGeneration = 0;
  let mapsReady = false;
  let clones = [];

  clearLegacy(shell);

  const scene = document.createElement('span');
  const sample = document.createElement('span');
  scene.dataset.rafNavbarMovingLensScene = 'true';
  scene.setAttribute('aria-hidden', 'true');
  sample.dataset.rafNavbarMovingLensSample = 'true';
  scene.appendChild(sample);
  shell.dataset.rafMovingLensRuntime = 'ready';

  const rebuild = (links) => {
    sample.replaceChildren();
    clones = links.map((link) => {
      const clone = createLabel(link);
      sample.appendChild(clone);
      return { link, clone };
    });
  };

  const requestMaps = (width, height, radius) => {
    const key = `${Math.round(width)}x${Math.round(height)}x${radius.toFixed(2)}`;
    if (key === mapKey) return;

    mapKey = key;
    mapsReady = false;
    const generation = ++mapGeneration;

    createMaps(width, height, radius).then((maps) => {
      if (disposed || generation !== mapGeneration || !maps) return;
      applyMap('right', maps.right);
      applyMap('left', maps.left);
      mapsReady = true;
    }).catch(() => {
      if (generation === mapGeneration) mapsReady = false;
    });
  };

  const render = (time) => {
    frame = 0;
    if (disposed || !shell.isConnected) return;

    const parts = getParts(shell);
    if (!parts) {
      scene.style.opacity = '0';
      frame = window.requestAnimationFrame(render);
      return;
    }

    if (scene.parentElement !== parts.surface) {
      parts.surface.appendChild(scene);
    }

    const nextSignature = signature(parts.links);
    if (nextSignature !== sceneSignature) {
      sceneSignature = nextSignature;
      rebuild(parts.links);
    }

    const dropRect = parts.drop.getBoundingClientRect();
    const surfaceRect = parts.surface.getBoundingClientRect();
    const width = parts.drop.offsetWidth;
    const height = parts.drop.offsetHeight;

    if (width < 8 || height < 8) {
      parts.links.forEach(clearMask);
      scene.style.opacity = '0';
      frame = window.requestAnimationFrame(render);
      return;
    }

    const center = dropRect.left + dropRect.width * 0.5;
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

    requestMaps(width, height, radius);

    const scale = Math.round(clamp(
      height * 1.45 + Math.abs(velocity) * 10,
      58,
      82,
    ));
    document.getElementById(
      'raf-navbar-moving-lens-displacement-right',
    )?.setAttribute('scale', String(scale));
    document.getElementById(
      'raf-navbar-moving-lens-displacement-left',
    )?.setAttribute('scale', String(scale));

    sample.style.filter = [
      `url(#raf-navbar-moving-lens-${direction > 0 ? 'right' : 'left'})`,
      'contrast(1.025)',
      'brightness(1.004)',
    ].join(' ');

    const inverse = inverseTransform(parts.surface);
    scene.style.transformOrigin = inverse.origin;
    scene.style.transform = inverse.value;

    clones.forEach(({ link, clone }) => {
      const rect = link.getBoundingClientRect();
      clone.style.left = `${rect.left - dropRect.left}px`;
      clone.style.top = `${rect.top - dropRect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
    });

    if (mapsReady) {
      const lensRect = {
        left: surfaceRect.left,
        right: surfaceRect.right,
      };
      parts.links.forEach((link) => maskLink(link, lensRect));
      scene.style.opacity = '1';
    } else {
      parts.links.forEach(clearMask);
      scene.style.opacity = '0';
    }

    frame = window.requestAnimationFrame(render);
  };

  frame = window.requestAnimationFrame(render);

  return () => {
    disposed = true;
    mapGeneration += 1;
    if (frame) window.cancelAnimationFrame(frame);
    getLinks(shell).forEach(clearMask);
    scene.remove();
    delete shell.dataset.rafMovingLensRuntime;
  };
}

export default function NavbarProgressiveTextRefractionRuntime() {
  useEffect(() => {
    let disposed = false;
    let bindFrame = 0;
    const bindings = new Map();

    const bind = () => {
      bindFrame = 0;
      if (disposed) return;

      const shells = new Set(document.querySelectorAll(
        '[data-raf-navbar-shell="true"]',
      ));

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
          && getParts(shell)
        ) {
          bindings.set(shell, attach(shell));
        }
      });
    };

    const schedule = () => {
      if (!bindFrame && !disposed) {
        bindFrame = window.requestAnimationFrame(bind);
      }
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      if (bindFrame) window.cancelAnimationFrame(bindFrame);
      bindings.forEach((dispose) => dispose());
      bindings.clear();
    };
  }, []);

  return (
    <>
      <style>{RUNTIME_STYLES}</style>
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
          {['right', 'left'].map((direction) => (
            <filter
              key={direction}
              id={`raf-navbar-moving-lens-${direction}`}
              filterUnits="userSpaceOnUse"
              primitiveUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="10"
              height="10"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                id={`raf-navbar-moving-lens-map-${direction}`}
                href={TRANSPARENT_PIXEL}
                x="0"
                y="0"
                width="10"
                height="10"
                preserveAspectRatio="none"
                result="map"
              />
              <feDisplacementMap
                id={`raf-navbar-moving-lens-displacement-${direction}`}
                in="SourceGraphic"
                in2="map"
                scale="64"
                xChannelSelector="R"
                yChannelSelector="G"
                result="bent"
              />
              <feGaussianBlur
                in="bent"
                stdDeviation="0.14"
                result="softened"
              />
              <feColorMatrix
                in="softened"
                type="saturate"
                values="0"
                result="mono"
              />
              <feComponentTransfer in="mono">
                <feFuncR type="gamma" amplitude="1.18" exponent="0.88" offset="-0.018" />
                <feFuncG type="gamma" amplitude="1.18" exponent="0.88" offset="-0.018" />
                <feFuncB type="gamma" amplitude="1.18" exponent="0.88" offset="-0.018" />
              </feComponentTransfer>
            </filter>
          ))}
        </defs>
      </svg>
    </>
  );
}
