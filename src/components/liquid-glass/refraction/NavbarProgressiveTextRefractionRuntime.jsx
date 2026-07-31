'use client';

import { useEffect } from 'react';


import { createRefractionMap } from './refraction-map';

const FILTER_MARGIN = 32;
const MAX_MAP_SIZE = 2048;
const MOTION_VELOCITY_EPSILON = 0.006;
const MOTION_SETTLE_GRACE = 64;
const TRANSPARENT_PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';


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

      /*
       * Stronger convex mode:
       * preserve the stable horizontal lens geometry,
       * but increase the centre magnification and edge reduction.
       */
      output[destinationOffset] = encode(
          -((rotatedX * 1.12) + direction * curvature * 0.068),
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
    bodyStrength: 0.22,
    normalStrength: 1.34,
    shoulderStrength: 0.28,
    shoulderPosition: 0.57,
    shoulderWidth: 0.18,
    bodyLensStrength: 0.3,
    bodyLensPower: 0.86,
    horizontalLensScale: 1.08,
    verticalLensScale: 1.0,
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
  const text = (link.textContent || '').trim();
  const characters = Array.from(text);
  const visibleCharacterIndexes = characters
      .map((character, index) => (
          character.trim() ? index : -1
      ))
      .filter((index) => index >= 0);

  const firstVisibleIndex = visibleCharacterIndexes[0] ?? 0;
  const lastVisibleIndex = visibleCharacterIndexes.at(-1)
      ?? Math.max(characters.length - 1, 0);
  const visibleRange = Math.max(
      lastVisibleIndex - firstVisibleIndex,
      1,
  );

  clone.dataset.rafNavbarMovingLensLabel = 'true';
  clone.setAttribute('aria-hidden', 'true');

  characters.forEach((character, index) => {
    const glyph = document.createElement('span');
    const normalizedPosition = clamp(
        (
            (index - firstVisibleIndex) / visibleRange
        ) * 2 - 1,
        -1,
        1,
    );

    /*
     * Explicit per-glyph anamorphic profile:
     * edges are narrower; the centre is wider and taller.
     */
    const centerWeight = Math.pow(
        Math.max(1 - Math.abs(normalizedPosition), 0),
        0.68,
    );
    const horizontalScale = 0.74 + centerWeight * 0.92;

    /*
     * The centre is now visibly larger in both axes.
     * Edge glyphs remain slightly smaller, while the middle rises
     * and broadens like a real convex optical bulge.
     */
    const verticalScale = 0.84 + centerWeight * 0.76;
    const overallScale = 0.9 + centerWeight * 0.18;

    /*
     * Lens-following tilt:
     * left-side glyphs lean slightly left,
     * right-side glyphs lean slightly right,
     * the centre remains upright.
     */
    const rotation = normalizedPosition * 4.8;
    const spacing = -0.045 + centerWeight * 0.11;

    glyph.dataset.rafNavbarMovingLensCharacter = 'true';
    glyph.textContent = character === ' '
        ? '\u00a0'
        : character;

    glyph.style.setProperty(
        '--raf-navbar-glyph-scale-x',
        horizontalScale.toFixed(4),
    );
    glyph.style.setProperty(
        '--raf-navbar-glyph-scale-y',
        verticalScale.toFixed(4),
    );
    glyph.style.setProperty(
        '--raf-navbar-glyph-overall-scale',
        overallScale.toFixed(4),
    );
    glyph.style.setProperty(
        '--raf-navbar-glyph-rotation',
        `${rotation.toFixed(3)}deg`,
    );
    glyph.style.setProperty(
        '--raf-navbar-glyph-spacing',
        `${spacing.toFixed(4)}em`,
    );

    clone.appendChild(glyph);
  });

  Object.assign(clone.style, {
    color: style.color,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontStyle: style.fontStyle,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: '0px',
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
  let lastMotionTime = Number.NEGATIVE_INFINITY;
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

    const dragLifecycleActive = shell.hasAttribute(
        'data-raf-navbar-dragging',
    );
    const physicallyMoving = Math.abs(velocity)
        > MOTION_VELOCITY_EPSILON;

    if (dragLifecycleActive || physicallyMoving) {
      lastMotionTime = time;
    }

    const motionActive = dragLifecycleActive
        || physicallyMoving
        || time - lastMotionTime <= MOTION_SETTLE_GRACE;

    previousCenter = center;
    previousTime = time;

    const radius = Number.parseFloat(
        window.getComputedStyle(parts.drop).borderTopLeftRadius,
    ) || height * 0.5;

    requestMaps(width, height, radius);

    const scale = Math.round(clamp(
        height * 1.36 + Math.abs(velocity) * 8,
        52,
        76,
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

    if (mapsReady && motionActive) {
      const lensRect = {
        left: surfaceRect.left,
        right: surfaceRect.right,
      };
      parts.links.forEach((link) => maskLink(link, lensRect));
      scene.style.opacity = '1';
      scene.dataset.rafNavbarMovingLensActive = 'true';
      shell.dataset.rafNavbarMovingLensActive = 'true';
    } else {
      parts.links.forEach(clearMask);
      scene.style.opacity = '0';
      delete scene.dataset.rafNavbarMovingLensActive;
      delete shell.dataset.rafNavbarMovingLensActive;
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
    delete shell.dataset.rafNavbarMovingLensActive;
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
                      stdDeviation="0.085 0.11"
                      edgeMode="duplicate"
                      result="smoothed"
                  />
                  <feColorMatrix
                      in="smoothed"
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