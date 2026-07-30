'use client';

import { useEffect } from 'react';

import {
  FULLSCREEN_VERTEX_SHADER,
  OPTICAL_COMPOSITE_FRAGMENT_SHADER,
  RAF_AGENCY_SHADER_VERSION,
} from './agency-shader-library';

const HEADER_SELECTOR = [
  'header [data-raf-header-shell="true"]',
  'header [data-raf-native-refraction="true"][data-raf-scrolled]',
  '[data-raf-header-shell="true"]',
].join(',');

const NAVBAR_SELECTOR = '[data-raf-navbar-shell="true"]';
const PILL_SELECTOR = '[data-raf-refraction-target="navbar-pill"]';
const PAGE_SOURCE_SELECTOR = '#raf-page-root';
const MAX_DPR = 1.75;
const CLONE_REBUILD_DELAY = 96;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (from, to, amount) => from + (to - from) * amount;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error('Unable to allocate WebGL shader.');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error.';
    gl.deleteShader(shader);
    throw new Error(log);
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error('Unable to allocate WebGL program.');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'Unknown WebGL link error.';
    gl.deleteProgram(program);
    throw new Error(log);
  }

  return program;
}

function getBorderRadius(element) {
  const computed = window.getComputedStyle(element);
  return Number.parseFloat(computed.borderTopLeftRadius) || element.offsetHeight * 0.5;
}

function createOpticalController(element, mode) {
  const canvas = document.createElement('canvas');
  canvas.className = [
    'raf-agency-optical-canvas',
    `raf-agency-optical-canvas--mode-${mode}`,
  ].join(' ');
  canvas.dataset.rafAgencyShader = String(mode);
  canvas.dataset.rafAgencyShaderVersion = RAF_AGENCY_SHADER_VERSION;
  canvas.setAttribute('aria-hidden', 'true');

  element.appendChild(canvas);

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: mode === 2 ? 'high-performance' : 'default',
  });

  if (!gl) {
    canvas.remove();
    return null;
  }

  let program;

  try {
    program = createProgram(
      gl,
      FULLSCREEN_VERTEX_SHADER,
      OPTICAL_COMPOSITE_FRAGMENT_SHADER,
    );
  } catch (error) {
    console.warn('[RAF Agency Shaders] WebGL program failed:', error);
    canvas.remove();
    return null;
  }

  const buffer = gl.createBuffer();
  const vao = gl.createVertexArray();

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]),
    gl.STATIC_DRAW,
  );

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    time: gl.getUniformLocation(program, 'u_time'),
    scroll: gl.getUniformLocation(program, 'u_scroll'),
    scrollVelocity: gl.getUniformLocation(program, 'u_scrollVelocity'),
    motionVelocity: gl.getUniformLocation(program, 'u_motionVelocity'),
    impact: gl.getUniformLocation(program, 'u_impact'),
    strength: gl.getUniformLocation(program, 'u_strength'),
    mode: gl.getUniformLocation(program, 'u_mode'),
    radius: gl.getUniformLocation(program, 'u_radius'),
    opacity: gl.getUniformLocation(program, 'u_opacity'),
    quality: gl.getUniformLocation(program, 'u_quality'),
  };

  let cssWidth = 1;
  let cssHeight = 1;
  let radius = 1;
  let pointerX = 0.5;
  let pointerY = 0;
  let impactStartedAt = -Infinity;
  let disposed = false;
  let contextLost = false;

  const resize = () => {
    if (disposed || !element.isConnected) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    cssWidth = Math.max(1, rect.width);
    cssHeight = Math.max(1, rect.height);
    radius = getBorderRadius(element);

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.round(cssWidth * dpr));
    const height = Math.max(1, Math.round(cssHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    return rect.width > 1 && rect.height > 1;
  };

  const handlePointerMove = (event) => {
    const rect = element.getBoundingClientRect();
    pointerX = clamp(event.clientX - rect.left, 0, rect.width);
    pointerY = clamp(rect.height - (event.clientY - rect.top), 0, rect.height);
  };

  const handlePointerLeave = () => {
    pointerX = cssWidth * 0.5;
    pointerY = cssHeight;
  };

  const handlePointerDown = (event) => {
    handlePointerMove(event);
    impactStartedAt = performance.now();
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    element.dataset.rafAgencyGpu = 'lost';
  };

  const handleContextRestored = () => {
    contextLost = false;
    element.dataset.rafAgencyGpu = 'restored';
  };

  element.addEventListener('pointermove', handlePointerMove, { passive: true });
  element.addEventListener('pointerleave', handlePointerLeave, { passive: true });
  element.addEventListener('pointerdown', handlePointerDown, { passive: true });
  canvas.addEventListener('webglcontextlost', handleContextLost, false);
  canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

  gl.enable(gl.BLEND);
  gl.blendEquation(gl.FUNC_ADD);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);

  return {
    element,
    canvas,
    mode,
    resize,
    render(state) {
      if (disposed || contextLost || !resize()) {
        return;
      }

      const now = performance.now();
      const impact = clamp((now - impactStartedAt) / 720, 0, 1);
      const reduced = state.reducedMotion || state.reducedTransparency;

      const strengthByMode = mode === 0 ? 0.92 : mode === 1 ? 1.05 : 1.34;
      const opacityByMode = mode === 0 ? 0.58 : mode === 1 ? 0.52 : 0.78;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);

      gl.uniform2f(uniforms.resolution, cssWidth, cssHeight);
      gl.uniform2f(uniforms.pointer, pointerX, pointerY);
      gl.uniform1f(uniforms.time, state.time);
      gl.uniform1f(uniforms.scroll, state.scrollY);
      gl.uniform1f(uniforms.scrollVelocity, reduced ? 0 : state.scrollVelocity);
      gl.uniform1f(uniforms.motionVelocity, reduced ? 0 : state.pillVelocity);
      gl.uniform1f(uniforms.impact, reduced ? 1 : impact);
      gl.uniform1f(uniforms.strength, reduced ? 0.35 : strengthByMode);
      gl.uniform1f(uniforms.mode, mode);
      gl.uniform1f(uniforms.radius, radius);
      gl.uniform1f(uniforms.opacity, reduced ? opacityByMode * 0.45 : opacityByMode);
      gl.uniform1f(uniforms.quality, state.quality);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.bindVertexArray(null);
    },
    dispose() {
      disposed = true;
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerleave', handlePointerLeave);
      element.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      canvas.remove();
    },
  };
}

function sanitizeSceneClone(clone) {
  clone.removeAttribute?.('id');
  clone.setAttribute?.('aria-hidden', 'true');
  clone.setAttribute?.('inert', '');
  clone.setAttribute?.('data-raf-agency-scene-clone', 'true');

  clone.querySelectorAll?.([
    'script',
    'style',
    'link',
    'noscript',
    'iframe',
    'video',
    'audio',
    'canvas',
    'header',
    'footer',
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

function createVerticalSceneLens(header, source) {
  const viewport = document.createElement('span');
  const sceneHost = document.createElement('span');

  viewport.className = 'raf-agency-live-lens raf-agency-live-lens--vertical';
  viewport.dataset.rafAgencyLens = 'vertical';
  viewport.setAttribute('aria-hidden', 'true');
  sceneHost.className = 'raf-agency-live-scene-host';
  viewport.appendChild(sceneHost);
  header.prepend(viewport);

  let clone = null;
  let disposed = false;
  let rebuildTimer = 0;
  let rebuildFrame = 0;
  let lastGeometry = '';
  let mutationObserver = null;
  let resizeObserver = null;

  const rebuild = () => {
    rebuildFrame = 0;
    rebuildTimer = 0;

    if (disposed || !source.isConnected || !header.isConnected) {
      return;
    }

    clone = sanitizeSceneClone(source.cloneNode(true));
    clone.classList.add('raf-agency-live-scene-clone');
    syncMutableFormState(source, clone);
    sceneHost.replaceChildren(clone);
    lastGeometry = '';
  };

  const scheduleRebuild = () => {
    if (disposed || rebuildTimer || rebuildFrame) {
      return;
    }

    rebuildTimer = window.setTimeout(() => {
      rebuildTimer = 0;
      rebuildFrame = window.requestAnimationFrame(rebuild);
    }, CLONE_REBUILD_DELAY);
  };

  const syncGeometry = () => {
    if (disposed || !clone || !source.isConnected || !header.isConnected) {
      return;
    }

    const headerRect = header.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const visualViewport = window.visualViewport;
    const viewportOffsetX = visualViewport?.offsetLeft || 0;
    const viewportOffsetY = visualViewport?.offsetTop || 0;

    const x = sourceRect.left - headerRect.left - viewportOffsetX;
    const y = sourceRect.top - headerRect.top - viewportOffsetY;
    const geometry = [
      x.toFixed(2),
      y.toFixed(2),
      sourceRect.width.toFixed(2),
      sourceRect.height.toFixed(2),
      headerRect.width.toFixed(2),
      headerRect.height.toFixed(2),
    ].join('|');

    if (geometry === lastGeometry) {
      return;
    }

    lastGeometry = geometry;
    clone.style.setProperty('--raf-agency-scene-x', `${x}px`);
    clone.style.setProperty('--raf-agency-scene-y', `${y}px`);
    clone.style.setProperty('--raf-agency-scene-width', `${sourceRect.width}px`);
    clone.style.setProperty('--raf-agency-scene-height', `${sourceRect.height}px`);
    viewport.style.setProperty('--raf-agency-header-width', `${headerRect.width}px`);
    viewport.style.setProperty('--raf-agency-header-height', `${headerRect.height}px`);
  };

  rebuild();

  mutationObserver = new MutationObserver((records) => {
    const meaningful = records.some((record) => {
      const target = record.target instanceof Element ? record.target : record.target.parentElement;
      if (target?.closest?.('[data-raf-agency-lens], [data-raf-agency-scene-clone]')) {
        return false;
      }

      if (record.type === 'childList' || record.type === 'characterData') {
        return true;
      }

      return record.type === 'attributes'
        && ['class', 'style', 'src', 'hidden', 'open', 'aria-expanded'].includes(record.attributeName);
    });

    if (meaningful) {
      scheduleRebuild();
    }
  });

  mutationObserver.observe(source, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'src', 'hidden', 'open', 'aria-expanded'],
  });

  resizeObserver = new ResizeObserver(() => {
    lastGeometry = '';
  });
  resizeObserver.observe(header);
  resizeObserver.observe(source);

  return {
    syncGeometry,
    scheduleRebuild,
    dispose() {
      disposed = true;
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      if (rebuildTimer) window.clearTimeout(rebuildTimer);
      if (rebuildFrame) window.cancelAnimationFrame(rebuildFrame);
      viewport.remove();
    },
  };
}

function copyTextStyle(from, to) {
  const computed = window.getComputedStyle(from);
  const properties = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'fontStretch',
    'letterSpacing',
    'lineHeight',
    'textTransform',
    'textShadow',
  ];

  properties.forEach((property) => {
    to.style[property] = computed[property];
  });
}

function createHorizontalNavigationLens(navbar, pillTarget) {
  const activeDrop = pillTarget.closest('span');
  const pill = activeDrop?.parentElement || pillTarget.parentElement;

  if (!(pill instanceof HTMLElement)) {
    return null;
  }

  const viewport = document.createElement('span');
  const strip = document.createElement('span');

  viewport.className = 'raf-agency-live-lens raf-agency-live-lens--horizontal';
  viewport.dataset.rafAgencyLens = 'horizontal';
  viewport.setAttribute('aria-hidden', 'true');
  strip.className = 'raf-agency-navigation-strip';
  viewport.appendChild(strip);
  navbar.appendChild(viewport);

  let disposed = false;
  let lastLayout = '';
  let lastCenter = null;
  let lastTime = performance.now();
  let velocity = 0;
  let mutationObserver = null;
  let resizeObserver = null;

  const rebuildLabels = () => {
    if (disposed) return;

    const links = Array.from(navbar.querySelectorAll(':scope > a'));
    strip.replaceChildren();

    links.forEach((link) => {
      const label = document.createElement('span');
      label.className = 'raf-agency-navigation-label';
      label.textContent = link.textContent;
      copyTextStyle(link, label);
      strip.appendChild(label);
    });

    strip.style.setProperty('--raf-agency-items-count', String(Math.max(links.length, 1)));
    lastLayout = '';
  };

  const syncGeometry = (time) => {
    if (disposed || !navbar.isConnected || !pill.isConnected) {
      return velocity;
    }

    const navRect = navbar.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const left = pillRect.left - navRect.left;
    const top = pillRect.top - navRect.top;
    const center = pillRect.left + pillRect.width * 0.5;
    const deltaTime = Math.max(1, time - lastTime);

    if (lastCenter !== null) {
      const instantaneous = (center - lastCenter) / deltaTime * 1000;
      velocity = mix(velocity, instantaneous, 0.22);
    }

    lastCenter = center;
    lastTime = time;

    const layout = [
      left.toFixed(2),
      top.toFixed(2),
      pillRect.width.toFixed(2),
      pillRect.height.toFixed(2),
      navRect.width.toFixed(2),
      navRect.height.toFixed(2),
    ].join('|');

    if (layout !== lastLayout) {
      lastLayout = layout;
      viewport.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      viewport.style.width = `${pillRect.width}px`;
      viewport.style.height = `${pillRect.height}px`;
      strip.style.width = `${navRect.width}px`;
      strip.style.height = `${navRect.height}px`;
      strip.style.transform = `translate3d(${-left}px, ${-top}px, 0)`;
    }

    const stretch = clamp(Math.abs(velocity) / 850, 0, 0.36);
    viewport.style.setProperty('--raf-agency-pill-velocity', velocity.toFixed(3));
    viewport.style.setProperty('--raf-agency-pill-stretch', String(1 + stretch));
    viewport.style.setProperty('--raf-agency-pill-squeeze', String(1 - stretch * 0.34));

    return velocity;
  };

  rebuildLabels();

  mutationObserver = new MutationObserver((records) => {
    const labelsChanged = records.some((record) => {
      if (record.target instanceof Element && record.target.closest('[data-raf-agency-lens]')) {
        return false;
      }
      return record.type === 'childList' || record.type === 'characterData';
    });

    if (labelsChanged) {
      rebuildLabels();
    }
  });
  mutationObserver.observe(navbar, { childList: true, subtree: true, characterData: true });

  resizeObserver = new ResizeObserver(() => {
    lastLayout = '';
  });
  resizeObserver.observe(navbar);
  resizeObserver.observe(pill);

  return {
    pill,
    viewport,
    syncGeometry,
    dispose() {
      disposed = true;
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      viewport.remove();
    },
  };
}

function readPreference(query) {
  return window.matchMedia?.(query).matches ?? false;
}

function estimateQuality() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const reducedData = navigator.connection?.saveData === true;

  if (reducedData || cores <= 2 || memory <= 2) return 0.35;
  if (cores <= 4 || memory <= 4) return 0.68;
  return 1;
}

export default function AgencyShaderRuntime() {
  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let bindFrame = 0;
    let mutationObserver = null;

    let header = null;
    let navbar = null;
    let pillTarget = null;
    let source = null;

    let verticalLens = null;
    let horizontalLens = null;
    let headerShader = null;
    let navbarShader = null;
    let pillShader = null;

    const state = {
      time: 0,
      scrollY: window.scrollY,
      scrollVelocity: 0,
      pillVelocity: 0,
      quality: estimateQuality(),
      reducedMotion: readPreference('(prefers-reduced-motion: reduce)'),
      reducedTransparency: readPreference('(prefers-reduced-transparency: reduce)'),
    };

    let previousScroll = window.scrollY;
    let previousTime = performance.now();

    const disposeBindings = () => {
      verticalLens?.dispose();
      horizontalLens?.dispose();
      headerShader?.dispose();
      navbarShader?.dispose();
      pillShader?.dispose();

      verticalLens = null;
      horizontalLens = null;
      headerShader = null;
      navbarShader = null;
      pillShader = null;
    };

    const bind = () => {
      bindFrame = 0;
      if (disposed) return;

      const nextHeader = document.querySelector(HEADER_SELECTOR);
      const nextNavbar = document.querySelector(NAVBAR_SELECTOR);
      const nextPillTarget = document.querySelector(PILL_SELECTOR);
      const nextSource = document.querySelector(PAGE_SOURCE_SELECTOR);

      if (
        nextHeader === header
        && nextNavbar === navbar
        && nextPillTarget === pillTarget
        && nextSource === source
      ) {
        return;
      }

      disposeBindings();
      header = nextHeader instanceof HTMLElement ? nextHeader : null;
      navbar = nextNavbar instanceof HTMLElement ? nextNavbar : null;
      pillTarget = nextPillTarget instanceof HTMLElement ? nextPillTarget : null;
      source = nextSource instanceof HTMLElement ? nextSource : null;

      if (header && source && !state.reducedTransparency) {
        verticalLens = createVerticalSceneLens(header, source);
      }

      if (navbar && pillTarget && !state.reducedTransparency) {
        horizontalLens = createHorizontalNavigationLens(navbar, pillTarget);
      }

      if (header) {
        header.dataset.rafAgencyShaderSystem = RAF_AGENCY_SHADER_VERSION;
        headerShader = createOpticalController(header, 0);
      }

      if (navbar) {
        navbar.dataset.rafAgencyShaderSystem = RAF_AGENCY_SHADER_VERSION;
        navbarShader = createOpticalController(navbar, 1);
      }

      if (horizontalLens?.pill) {
        horizontalLens.pill.dataset.rafAgencyShaderSystem = RAF_AGENCY_SHADER_VERSION;
        pillShader = createOpticalController(horizontalLens.pill, 2);
      }
    };

    const scheduleBind = () => {
      if (bindFrame || disposed) return;
      bindFrame = window.requestAnimationFrame(bind);
    };

    const render = (timestamp) => {
      if (disposed) return;

      const delta = clamp(timestamp - previousTime, 1, 50);
      const currentScroll = window.scrollY;
      const instantaneousScrollVelocity = (currentScroll - previousScroll) / delta * 1000;

      state.time = timestamp * 0.001;
      state.scrollY = currentScroll;
      state.scrollVelocity = mix(state.scrollVelocity, instantaneousScrollVelocity, 0.18);
      state.pillVelocity = horizontalLens?.syncGeometry(timestamp) || mix(state.pillVelocity, 0, 0.1);

      previousScroll = currentScroll;
      previousTime = timestamp;

      verticalLens?.syncGeometry();
      headerShader?.render(state);
      navbarShader?.render(state);
      pillShader?.render(state);

      frame = window.requestAnimationFrame(render);
    };

    mutationObserver = new MutationObserver((records) => {
      const relevant = records.some((record) => {
        if (record.target instanceof Element && record.target.closest('[data-raf-agency-lens]')) {
          return false;
        }
        return record.type === 'childList';
      });

      if (relevant) scheduleBind();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const transparencyQuery = window.matchMedia?.('(prefers-reduced-transparency: reduce)');

    const handlePreferenceChange = () => {
      state.reducedMotion = motionQuery?.matches ?? false;
      state.reducedTransparency = transparencyQuery?.matches ?? false;
      header = null;
      navbar = null;
      pillTarget = null;
      source = null;
      scheduleBind();
    };

    motionQuery?.addEventListener?.('change', handlePreferenceChange);
    transparencyQuery?.addEventListener?.('change', handlePreferenceChange);
    window.addEventListener('resize', scheduleBind, { passive: true });
    window.addEventListener('orientationchange', scheduleBind, { passive: true });
    window.visualViewport?.addEventListener('resize', scheduleBind, { passive: true });

    bind();
    frame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      mutationObserver?.disconnect();
      motionQuery?.removeEventListener?.('change', handlePreferenceChange);
      transparencyQuery?.removeEventListener?.('change', handlePreferenceChange);
      window.removeEventListener('resize', scheduleBind);
      window.removeEventListener('orientationchange', scheduleBind);
      window.visualViewport?.removeEventListener('resize', scheduleBind);

      if (frame) window.cancelAnimationFrame(frame);
      if (bindFrame) window.cancelAnimationFrame(bindFrame);

      disposeBindings();
    };
  }, []);

  return null;
}
