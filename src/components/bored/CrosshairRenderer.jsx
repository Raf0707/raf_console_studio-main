import styles from './CrosshairRenderer.module.css';

const PRESET_COLORS = {
  green: [0, 250, 71],
  yellow: [255, 220, 0],
  blue: [74, 126, 255],
  cyan: [0, 220, 255],
  red: [255, 72, 72],
  white: [255, 255, 255],
};

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function resolveCrosshairColor(config) {
  const preset = PRESET_COLORS[config?.colorPreset];
  const rawRed = Number(config?.red);
  const rawGreen = Number(config?.green);
  const rawBlue = Number(config?.blue);
  const rawOpacity = Number(config?.opacity);
  const red = preset?.[0] ?? clamp(Number.isFinite(rawRed) ? rawRed : 0, 0, 255);
  const green = preset?.[1] ?? clamp(Number.isFinite(rawGreen) ? rawGreen : 250, 0, 255);
  const blue = preset?.[2] ?? clamp(Number.isFinite(rawBlue) ? rawBlue : 71, 0, 255);
  const opacity = clamp(Number.isFinite(rawOpacity) ? rawOpacity : 255, 0, 255) / 255;

  return {
    rgb: `${red}, ${green}, ${blue}`,
    css: `rgba(${red}, ${green}, ${blue}, ${opacity})`,
    opacity,
  };
}

export function CrosshairRenderer({
  config,
  className = '',
  dynamicGap = 0,
  recoilOffset = { x: 0, y: 0 },
  inaccuracy = 0,
  preview = false,
  scoped = false,
}) {
  const color = resolveCrosshairColor(config);
  const length = scoped
    ? clamp(Number(config?.lineLength) || 280, 24, 320)
    : clamp(Number(config?.length) || 4, 0.5, 20) * 3;
  const thickness = scoped
    ? clamp(Number(config?.thickness) || 1, 0.5, 8)
    : clamp(Number(config?.thickness) || 1, 0.1, 8) * 1.35;
  const baseGap = scoped
    ? clamp(Number(config?.gap) || 0, 0, 28)
    : clamp(6 + (Number(config?.gap) || 0) * 2, 0, 48);
  const outline = config?.outlineEnabled
    ? clamp(Number(config?.outlineThickness) || 1, 0.25, 4)
    : 0;
  const centerDotSize = scoped
    ? clamp(Number(config?.centerDotSize) || 1, 0, 10) * 2
    : Math.max(1.5, thickness * 1.8);
  const showDot = scoped ? config?.centerDotEnabled !== false : Boolean(config?.centerDot);
  const shape = config?.shape === 't' ? 't' : 'cross';
  const rootClassName = [
    styles.crosshair,
    scoped ? styles.crosshairScoped : styles.crosshairStandard,
    preview ? styles.crosshairPreview : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={rootClassName}
      style={{
        '--crosshair-color': color.css,
        '--crosshair-rgb': color.rgb,
        '--crosshair-length': `${length}px`,
        '--crosshair-thickness': `${thickness}px`,
        '--crosshair-glow': `${thickness * 2.5}px`,
        '--crosshair-gap': `${Math.max(0, baseGap + dynamicGap)}px`,
        '--crosshair-outline': `${outline}px`,
        '--crosshair-recoil-x': `${recoilOffset.x || 0}px`,
        '--crosshair-recoil-y': `${recoilOffset.y || 0}px`,
        '--crosshair-blur': `${clamp(inaccuracy * 2.4, 0, 4)}px`,
        '--crosshair-opacity': color.opacity,
      }}
      aria-hidden="true"
    >
      {shape !== 't' && <i className={`${styles.arm} ${styles.armTop}`} />}
      <i className={`${styles.arm} ${styles.armRight}`} />
      <i className={`${styles.arm} ${styles.armBottom}`} />
      <i className={`${styles.arm} ${styles.armLeft}`} />
      {showDot && <i className={styles.centerDot} style={{ '--dot-size': `${centerDotSize}px` }} />}
    </span>
  );
}
