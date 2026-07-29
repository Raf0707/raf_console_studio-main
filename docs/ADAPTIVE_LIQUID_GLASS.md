# Adaptive Liquid Glass

The website uses three rendering levels and switches between them at runtime:

1. `shader-high`, `shader-medium`, `shader-low` — WebGL2 procedural background and lens refraction.
2. `glass` — the existing frosted CSS material.
3. `minimal` — emergency CSS with almost all motion and expensive compositing disabled.

## Platform policy

- Desktop browsers: WebGL2 is probed and benchmarked. Quality is selected from the measured GPU limits, a small draw benchmark, logical CPU count and reported device memory.
- Android 13+ and iOS 26+: the web shader may be enabled when WebGL2 passes the probe.
- Older Android and iOS versions: CSS frosted fallback only.
- Native wrappers can use the reference Android AGSL and SwiftUI files in `native/`.

The native files are reference integration points. They are not executed by the Next.js website itself.

## Automatic downgrade and recovery

The runtime samples frame intervals, long tasks and jank windows. Repeated bad windows downgrade one level. Stable windows can restore a level after a cooldown.

A lost WebGL context immediately returns the UI to CSS glass. The runtime listens for context restoration and also runs a low-frequency watchdog before rebuilding GPU resources.

## Diagnostics

Open the browser console and inspect:

```js
window.__RAF_GLASS_DIAGNOSTICS__
```

The object contains the active mode, platform gate, renderer information, benchmark time, estimated FPS, jank ratio, surface count and the latest transition reason.

Mode changes are also emitted as:

```js
window.addEventListener('raf-glass-mode-change', (event) => {
  console.log(event.detail);
});
```

## Performance rules

- The canvas resolution and FPS are capped per quality tier.
- Only visible, rounded glass surfaces are sent to the shader.
- The number of refracted surfaces is capped at 24/18/12 by tier.
- Pointer, scroll and resize listeners are passive.
- Large project-card droplet animations are disabled in desktop CSS fallback.
- Coarse-pointer devices do not run hover morphing.
- `prefers-reduced-motion` forces minimal mode.
