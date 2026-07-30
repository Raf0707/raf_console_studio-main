# RAF Agency Liquid Glass Shader System

Branch: `raf-agency-shaders`

This branch starts from the exact HEAD of `shaders` and adds a dedicated optical runtime for the main header and navigation bubble. It deliberately does not replace the original `shaders` branch.

## Why the previous implementation looked frozen

`src/app/layout.js` mounted `@/components/layouts/Header`, while the newer refraction implementation lived in `@/components/Header`. The displacement maps, layered header zones and `NavbarRefractionRuntime` therefore existed in the repository but were not part of the actual application tree.

The agency branch switches the root layout to the shader-enabled header and mounts `AgencyShaderRuntime` globally.

## Optical pipeline

The implementation uses three coordinated stages instead of relying on `backdrop-filter: blur(...)`:

1. **Live duplicated scene** — the current `#raf-page-root` is cloned into an inert optical layer inside the header. Its geometry is aligned every animation frame, so scrolling moves the duplicate immediately rather than leaving a static screenshot in the navbar.
2. **SVG displacement field** — the live scene is passed through the generated `raf-header-warp` or `raf-navbar-pill-warp` displacement map. This is what bends the real page pixels and navigation labels.
3. **WebGL 2 optical composite** — transparent GLSL canvases add Fresnel reflections, procedural caustics, chromatic edge dispersion, pointer highlights, scroll velocity response, bubble velocity stretch and independent impact ripples.

A browser cannot directly sample arbitrary DOM pixels as a WebGL texture without first rasterizing that DOM. The live-clone + SVG displacement + WebGL-lighting architecture therefore gives actual content refraction without adding a heavy screenshot dependency.

## Implemented effects

### Vertical header lens

- real page content follows scroll every frame;
- rounded-rectangle displacement map;
- different top-entry and bottom-lip optical zones;
- vertical barrel magnification;
- scroll-speed-dependent caustics and edge energy;
- pointer-aware highlight;
- low-opacity chromatic rim;
- no frozen one-time scene.

### Horizontal navigation lens

- the moving bubble clips an exact duplicate of all desktop navigation labels;
- the duplicated strip translates opposite to the bubble, so each label enters and leaves the lens continuously;
- velocity drives horizontal stretch and vertical squeeze;
- the pill uses a stronger displacement map than the navbar body;
- WebGL adds moving caustics, spectral edge separation and click ripples;
- the original link remains the accessible/clickable control; all optical copies are inert.

## Shader catalog

`agency-shader-library.js` exports reusable programs:

- `opticalComposite` — production runtime shader;
- `verticalRefractionField` — vertical scroll displacement vectors;
- `horizontalNavigationField` — moving bubble displacement vectors;
- `chromaticDispersion` — RGB wavelength separation;
- `caustics` — animated focused-light pattern;
- `microFrost` — optional microscopic surface noise;
- `specularRim` — pointer-aware edge reflection;
- `impactRipple` — independent touch/click wave.

The common GLSL core also exposes rounded-rectangle SDFs, numerical surface normals, Fresnel approximation, FBM noise, Gaussian rings, spectral rim generation and separate vertical/horizontal lens vector fields.

## Performance and fallback

- WebGL resolution is capped at `1.75` device-pixel ratio.
- The optical scene is a single clone, not nine full-page clones.
- Geometry writes are skipped when values have not changed.
- DOM rebuilds are throttled and only used for meaningful content mutations.
- Scroll and bubble velocity are smoothed before reaching GLSL uniforms.
- low-core, low-memory and data-saver devices automatically lower shader quality;
- `prefers-reduced-motion` disables motion amplification;
- `prefers-reduced-transparency` removes the live refraction scene and keeps only a faint static optical rim;
- WebGL context loss leaves the SVG/DOM refraction layer operational;
- `html.raf-glass-minimal` disables all agency layers.

## Main files

- `src/components/liquid-glass/refraction/AgencyShaderRuntime.jsx`
- `src/components/liquid-glass/refraction/agency-shader-library.js`
- `src/components/liquid-glass/refraction/agency-shaders.css`
- `src/app/layout.js`

## Tuning points

Runtime strength and opacity are defined in `createOpticalController()`:

- mode `0`: full header lens;
- mode `1`: navbar body;
- mode `2`: moving navigation bubble.

The physical displacement strength remains controlled by `NavbarRefractionRuntime.jsx` and `refraction-map.js`, while visual optics are controlled by the GLSL uniforms in `AgencyShaderRuntime.jsx`. Keeping those controls separate makes it possible to tune magnification without also overexposing highlights.
