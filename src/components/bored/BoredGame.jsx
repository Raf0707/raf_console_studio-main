'use client';

import {
  CircleDot,
  CloudRain,
  Crosshair,
  Download,
  Eye,
  FileJson,
  Gauge,
  Maximize2,
  Network,
  Play,
  RefreshCcw,
  RotateCcw,
  Save,
  Settings2,
  Sparkles,
  Square,
  Target,
  TimerReset,
  Trash2,
  Upload,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { BORED_CONTENT } from './content';
import { CrosshairRenderer, resolveCrosshairColor } from './CrosshairRenderer';
import styles from './BoredGame.module.css';

const MODE_IDS = ['grow', 'static', 'ninja', 'rush', 'chase', 'rain', 'chain', 'sniper'];
const STORAGE_KEY = 'raf-console-bored-profile-v5';
const LEGACY_STORAGE_KEYS = [
  'raf-console-bored-profile-v4',
  'raf-console-bored-profile-v3',
];
const PRESET_STORAGE_KEY = 'raf-console-bored-presets-v1';
const PRESET_SCHEMA_VERSION = 1;
const MAX_PRESETS_PER_TYPE = 10;
const PRESET_TYPES = [
  'all',
  'crosshair',
  'sniperCrosshair',
  'bothCrosshairs',
  'settingsWithoutCrosshairs',
];

const AUDIO_FILES = {
  shortShock1: '/sounds/ShortShock1.mp3',
  headShotShock: '/sounds/HadShoatShock.mp3',
  longShock1: '/sounds/LongShock1.mp3',
  longShock2: '/sounds/LongShock2.mp3',
  longShock3: '/sounds/LongShock3.mp3',
};

const MODE_ICONS = {
  grow: CircleDot,
  static: Gauge,
  ninja: Sparkles,
  rush: Crosshair,
  chase: Target,
  rain: CloudRain,
  chain: Network,
  sniper: Crosshair,
};

const ALL_LIGHTNING_SIDES = ['top', 'bottom', 'left', 'right'];

export const DEFAULT_GAME_SETTINGS = {
  general: {
    scoringEnabled: true,
    countdownSeconds: 3,
    sessionDurationSeconds: 0,
    maxActive: 7,
    adaptiveDifficulty: true,
    difficultyRamp: 10,
    pauseWhenHidden: true,
    autoFullscreen: true,
  },
  score: {
    missPenalty: -1,
    growThresholds: [
      { until: 0.065, points: 10 },
      { until: 0.19, points: 5 },
      { until: 0.4, points: 4 },
      { until: 0.7, points: 3 },
      { until: 1, points: 2 },
    ],
    standardThresholds: [
      { until: 0.22, points: 5 },
      { until: 0.45, points: 4 },
      { until: 0.72, points: 3 },
      { until: 1, points: 2 },
    ],
  },
  effects: {
    minimumVisiblePressMs: 72,
    flashEnabled: true,
    flashOpacity: 0.28,
    lightningEnabled: true,
    lightningCount: 3,
    lightningFadeMs: 230,
    particlesEnabled: true,
    screenShakeEnabled: true,
    vibrationEnabled: true,
    mobileHitBoost: 0.45,
    arenaGridEnabled: true,
    scoreFeedbackEnabled: true,
  },
  audio: {
    enabled: true,
    shortSound: 'shortShock1',
    longSound: 'longShock1',
    shortVolume: 0.58,
    longVolume: 0.46,
  },
  controls: {
    pointerLockEnabled: true,
    rawInputEnabled: true,
    showCustomCursor: true,
    mouseDpi: 800,
    mouseSensitivity: 1,
    zoomSensitivity: 1,
    scopeZoom: 1.42,
    rightClickScopeEnabled: true,
    longPressEnabled: true,
    longPressDelayMs: 130,
    dragStartDistancePx: 7,
    dragHitCooldownMs: 46,
    dragLightningBranches: 4,
  },
  recoil: {
    enabled: false,
    strengthPx: 5.5,
    horizontalVariance: 0.72,
    recoveryMs: 330,
    resetDelayMs: 70,
  },
  crosshair: {
    style: 'classicStatic',
    followRecoil: false,
    centerDot: false,
    length: 4,
    thickness: 1,
    gap: -2,
    outlineEnabled: true,
    outlineThickness: 1,
    colorPreset: 'green',
    red: 0,
    green: 250,
    blue: 71,
    opacity: 255,
    shape: 'cross',
  },
  sniperCrosshair: {
    exitDelayMs: 90,
    showInaccuracy: true,
    returnToScope: true,
    thickness: 1,
    centerDotEnabled: true,
    centerDotSize: 1,
    lineLength: 280,
    gap: 0,
    outlineEnabled: true,
    outlineThickness: 1,
    colorPreset: 'white',
    red: 255,
    green: 255,
    blue: 255,
    opacity: 238,
    shape: 'cross',
  },
  modes: {
    grow: {
      lifetimeMs: 3200,
      spawnMinMs: 680,
      spawnMaxMs: 1120,
      sizeMinRem: 10.5,
      sizeMaxRem: 16.5,
    },
    static: {
      lifetimeMs: 1550,
      spawnMinMs: 430,
      spawnMaxMs: 760,
      sizeMinRem: 3.8,
      sizeMaxRem: 6.8,
    },
    ninja: {
      lifetimeMs: 2500,
      spawnMinMs: 620,
      spawnMaxMs: 1050,
      sizeMinRem: 3.2,
      sizeMaxRem: 6.8,
    },
    rush: {
      lifetimeMs: 1850,
      spawnMinMs: 520,
      spawnMaxMs: 900,
      sizeMinRem: 3.3,
      sizeMaxRem: 6.2,
    },
    chase: {
      lifetimeMinMs: 430,
      lifetimeMaxMs: 980,
      nextDelayMs: 120,
      sizeMinRem: 4.2,
      sizeMaxRem: 6.1,
    },
    rain: {
      lifetimeMs: 2600,
      spawnMinMs: 300,
      spawnMaxMs: 620,
      sizeMinRem: 2.9,
      sizeMaxRem: 6.1,
    },
    chain: {
      lifetimeMs: 4200,
      spawnMinMs: 280,
      spawnMaxMs: 560,
      sizeMinRem: 3.1,
      sizeMaxRem: 5.5,
      chainRadiusPercent: 18,
      chainBonus: 2,
    },
    sniper: {
      lifetimeMs: 4200,
      spawnMinMs: 420,
      spawnMaxMs: 780,
      sizeMinRem: 2.1,
      sizeMaxRem: 3.8,
      precisionBonus: 5,
      trainingType: 'tracking',
      targetCount: 4,
      reactionRevealRadiusPercent: 18,
    },
  },
};

const PRESET_FACTORS = {
  calm: { spawn: 1.28, lifetime: 1.2, maxActive: 4 },
  normal: { spawn: 1, lifetime: 1, maxActive: 7 },
  fast: { spawn: 0.74, lifetime: 0.84, maxActive: 9 },
  extreme: { spawn: 0.5, lifetime: 0.64, maxActive: 12 },
};

function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundTo(value, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function deepMergeSettings(settings) {
  const input = settings ?? {};

  const merged = {
    ...DEFAULT_GAME_SETTINGS,
    ...input,
    general: {
      ...DEFAULT_GAME_SETTINGS.general,
      ...(input.general ?? {}),
    },
    score: {
      ...DEFAULT_GAME_SETTINGS.score,
      ...(input.score ?? {}),
    },
    effects: {
      ...DEFAULT_GAME_SETTINGS.effects,
      ...(input.effects ?? {}),
    },
    audio: {
      ...DEFAULT_GAME_SETTINGS.audio,
      ...(input.audio ?? {}),
    },
    controls: {
      ...DEFAULT_GAME_SETTINGS.controls,
      ...(input.controls ?? {}),
    },
    recoil: {
      ...DEFAULT_GAME_SETTINGS.recoil,
      ...(input.recoil ?? {}),
    },
    crosshair: {
      ...DEFAULT_GAME_SETTINGS.crosshair,
      ...(input.crosshair ?? {}),
    },
    sniperCrosshair: {
      ...DEFAULT_GAME_SETTINGS.sniperCrosshair,
      ...(input.sniperCrosshair ?? {}),
    },
    modes: Object.fromEntries(
        MODE_IDS.map((modeId) => [
          modeId,
          {
            ...DEFAULT_GAME_SETTINGS.modes[modeId],
            ...(input.modes?.[modeId] ?? {}),
          },
        ])
    ),
  };

  if (!merged.recoil.enabled) {
    merged.crosshair.followRecoil = false;
  }

  return merged;
}

function createEmptyPresetLibrary() {
  return Object.fromEntries(PRESET_TYPES.map((type) => [type, []]));
}

function normalizePresetLibrary(value) {
  const empty = createEmptyPresetLibrary();

  if (!value || typeof value !== 'object') {
    return empty;
  }

  return Object.fromEntries(
      PRESET_TYPES.map((type) => [
        type,
        Array.isArray(value[type])
            ? value[type]
                .filter((item) => item && typeof item === 'object')
                .slice(0, MAX_PRESETS_PER_TYPE)
            : [],
      ])
  );
}

function cloneSerializable(value) {
  return JSON.parse(JSON.stringify(value));
}

function createPresetData(type, settings, selectedMode) {
  if (type === 'crosshair') {
    return { crosshair: cloneSerializable(settings.crosshair) };
  }

  if (type === 'sniperCrosshair') {
    return { sniperCrosshair: cloneSerializable(settings.sniperCrosshair) };
  }

  if (type === 'bothCrosshairs') {
    return {
      crosshair: cloneSerializable(settings.crosshair),
      sniperCrosshair: cloneSerializable(settings.sniperCrosshair),
    };
  }

  if (type === 'settingsWithoutCrosshairs') {
    const { crosshair, sniperCrosshair, ...rest } = settings;
    return { settings: cloneSerializable(rest), selectedMode };
  }

  return { settings: cloneSerializable(settings), selectedMode };
}

function applyPresetData(currentSettings, currentMode, type, data) {
  if (type === 'crosshair') {
    return {
      settings: deepMergeSettings({
        ...currentSettings,
        crosshair: {
          ...currentSettings.crosshair,
          ...(data?.crosshair ?? data ?? {}),
        },
      }),
      selectedMode: currentMode,
    };
  }

  if (type === 'sniperCrosshair') {
    return {
      settings: deepMergeSettings({
        ...currentSettings,
        sniperCrosshair: {
          ...currentSettings.sniperCrosshair,
          ...(data?.sniperCrosshair ?? data ?? {}),
        },
      }),
      selectedMode: currentMode,
    };
  }

  if (type === 'bothCrosshairs') {
    return {
      settings: deepMergeSettings({
        ...currentSettings,
        crosshair: {
          ...currentSettings.crosshair,
          ...(data?.crosshair ?? {}),
        },
        sniperCrosshair: {
          ...currentSettings.sniperCrosshair,
          ...(data?.sniperCrosshair ?? {}),
        },
      }),
      selectedMode: currentMode,
    };
  }

  if (type === 'settingsWithoutCrosshairs') {
    const imported = data?.settings ?? data ?? {};
    return {
      settings: deepMergeSettings({
        ...imported,
        crosshair: currentSettings.crosshair,
        sniperCrosshair: currentSettings.sniperCrosshair,
      }),
      selectedMode: MODE_IDS.includes(data?.selectedMode)
          ? data.selectedMode
          : currentMode,
    };
  }

  return {
    settings: deepMergeSettings(data?.settings ?? data ?? {}),
    selectedMode: MODE_IDS.includes(data?.selectedMode)
        ? data.selectedMode
        : currentMode,
  };
}

function downloadJsonFile(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function safePresetFilename(value) {
  const normalized = String(value || 'preset')
      .trim()
      .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  return normalized || 'preset';
}

function formatReactionTime(milliseconds, locale) {
  if (!Number.isFinite(milliseconds)) {
    return '—';
  }

  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)} ${locale === 'ru' ? 'мс' : 'ms'}`;
  }

  return `${(milliseconds / 1000).toFixed(3)} ${locale === 'ru' ? 'с' : 's'}`;
}

function createSeededRandom(seed) {
  let value = seed % 2147483647;

  if (value <= 0) {
    value += 2147483646;
  }

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function getSideStart(side, hitX, hitY, random) {
  if (side === 'top') {
    return { x: clamp(hitX + (random() - 0.5) * 380, 70, 930), y: -18 };
  }

  if (side === 'bottom') {
    return { x: clamp(hitX + (random() - 0.5) * 380, 70, 930), y: 1018 };
  }

  if (side === 'left') {
    return { x: -18, y: clamp(hitY + (random() - 0.5) * 380, 70, 930) };
  }

  return { x: 1018, y: clamp(hitY + (random() - 0.5) * 380, 70, 930) };
}

function makeLightningPath(side, hitX, hitY, seed) {
  const random = createSeededRandom(seed);
  const start = getSideStart(side, hitX, hitY, random);
  const points = [start];
  const segments = 8;
  const directionX = hitX - start.x;
  const directionY = hitY - start.y;
  const length = Math.max(1, Math.hypot(directionX, directionY));
  const perpendicularX = -directionY / length;
  const perpendicularY = directionX / length;

  for (let index = 1; index < segments; index += 1) {
    const progress = index / segments;
    const envelope = Math.sin(Math.PI * progress);
    const offset = (random() - 0.5) * 92 * envelope;

    points.push({
      x: start.x + directionX * progress + perpendicularX * offset,
      y: start.y + directionY * progress + perpendicularY * offset,
    });
  }

  points.push({ x: hitX, y: hitY });

  return points
      .map(
          (point, index) =>
              `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
      )
      .join(' ');
}

function makeLightningBranches(hitX, hitY, seed, count) {
  const random = createSeededRandom(seed);
  const branches = [];
  const safeCount = clamp(Math.round(count), 1, 8);

  for (let index = 0; index < safeCount; index += 1) {
    const angle = randomBetweenWith(random, 0, Math.PI * 2);
    const length = randomBetweenWith(random, 115, 360);
    const startRadius = randomBetweenWith(random, 8, 58);
    const start = {
      x: clamp(hitX + Math.cos(angle) * startRadius, 0, 1000),
      y: clamp(hitY + Math.sin(angle) * startRadius, 0, 1000),
    };
    const end = {
      x: clamp(hitX + Math.cos(angle) * length, 0, 1000),
      y: clamp(hitY + Math.sin(angle) * length, 0, 1000),
    };
    const points = [start];
    const segments = 4 + Math.floor(random() * 3);
    const directionX = end.x - start.x;
    const directionY = end.y - start.y;
    const pathLength = Math.max(1, Math.hypot(directionX, directionY));
    const perpendicularX = -directionY / pathLength;
    const perpendicularY = directionX / pathLength;

    for (let segment = 1; segment < segments; segment += 1) {
      const progress = segment / segments;
      const offset = (random() - 0.5) * 62 * Math.sin(Math.PI * progress);
      points.push({
        x: start.x + directionX * progress + perpendicularX * offset,
        y: start.y + directionY * progress + perpendicularY * offset,
      });
    }

    points.push(end);
    branches.push(
        points
            .map(
                (point, pointIndex) =>
                    `${pointIndex === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
            )
            .join(' ')
    );
  }

  return branches;
}

function randomBetweenWith(random, minimum, maximum) {
  return minimum + random() * (maximum - minimum);
}

function shuffledLightningSides(count, previousSignature) {
  let selected = [];
  let signature = previousSignature;

  for (let attempt = 0; attempt < 5 && signature === previousSignature; attempt += 1) {
    selected = [...ALL_LIGHTNING_SIDES]
        .sort(() => Math.random() - 0.5)
        .slice(0, clamp(Math.round(count), 1, 4));
    signature = selected.join('-');
  }

  return { selected, signature };
}

function getAward(progress, mode, settings) {
  const thresholds =
      mode === 'grow'
          ? settings.score.growThresholds
          : settings.score.standardThresholds;

  return thresholds.find((threshold) => progress <= threshold.until)?.points ?? 2;
}

function getBubbleClass(mode) {
  const classMap = {
    grow: styles.bubbleGrow,
    static: styles.bubbleStatic,
    ninja: styles.bubbleNinja,
    rush: styles.bubbleRush,
    chase: styles.bubbleChase,
    rain: styles.bubbleRain,
    chain: styles.bubbleChain,
    sniper: styles.bubbleSniper,
  };

  return classMap[mode] ?? styles.bubbleStatic;
}

function createBubble(mode, settings, id) {
  const modeSettings = settings.modes[mode];
  const createdAt = performance.now();
  const common = {
    id,
    mode,
    createdAt,
    x: randomBetween(9, 91),
    y: randomBetween(12, 88),
    size: randomBetween(modeSettings.sizeMinRem, modeSettings.sizeMaxRem),
    hueShift: randomBetween(-16, 16),
    rotation: randomBetween(-20, 20),
  };

  if (mode === 'chase') {
    return {
      ...common,
      lifetime: randomBetween(
          modeSettings.lifetimeMinMs,
          modeSettings.lifetimeMaxMs
      ),
    };
  }

  if (mode === 'ninja') {
    const drift = randomBetween(-20, 20);

    return {
      ...common,
      y: 104,
      lifetime: modeSettings.lifetimeMs,
      midX: `${drift * 0.58}vw`,
      endX: `${drift}vw`,
      apexY: `${randomBetween(-74, -54)}dvh`,
    };
  }

  if (mode === 'rush') {
    return {
      ...common,
      lifetime: modeSettings.lifetimeMs,
      x: randomBetween(17, 83),
      y: randomBetween(18, 80),
      rushX: `${randomBetween(-6, 6)}vw`,
      rushY: `${randomBetween(-5, 5)}dvh`,
    };
  }

  if (mode === 'rain') {
    return {
      ...common,
      x: randomBetween(4, 96),
      y: -10,
      lifetime: modeSettings.lifetimeMs * randomBetween(0.78, 1.2),
      rainDrift: `${randomBetween(-15, 15)}vw`,
      rainRotate: `${randomBetween(180, 520)}deg`,
    };
  }

  return {
    ...common,
    lifetime: modeSettings.lifetimeMs,
  };
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function RangeSetting({
                        label,
                        description,
                        value,
                        min,
                        max,
                        step,
                        unit,
                        onChange,
                      }) {
  return (
      <label className={styles.settingControl}>
      <span className={styles.settingControlHead}>
        <span>
          <strong>{label}</strong>
          <small>{description}</small>
        </span>
        <output>
          {value}
          {unit ? ` ${unit}` : ''}
        </output>
      </span>
        <input
            className={styles.rangeInput}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
  );
}

function ToggleSetting({ label, description, checked, onChange, disabled = false }) {
  return (
      <label
          className={`${styles.toggleControl} ${disabled ? styles.controlDisabled : ''}`}
      >
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
        <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
        />
        <span className={styles.toggleTrack} aria-hidden="true">
        <span />
      </span>
      </label>
  );
}

function SelectSetting({ label, description, value, options, onChange, numeric = false }) {
  return (
      <label className={styles.selectControl}>
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
        <select
            value={value}
            onChange={(event) =>
                onChange(numeric ? Number(event.target.value) : event.target.value)
            }
        >
          {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
          ))}
        </select>
      </label>
  );
}

export default function BoredGame({ locale = 'ru', settings: externalSettings }) {
  const content = BORED_CONTENT[locale] ?? BORED_CONTENT.ru;
  const initialSettings = useMemo(
      () => deepMergeSettings(externalSettings),
      [externalSettings]
  );

  const arenaRef = useRef(null);
  const fullscreenRef = useRef(null);
  const runningRef = useRef(false);
  const modeRef = useRef('grow');
  const settingsRef = useRef(initialSettings);
  const bubblesRef = useRef([]);
  const bubbleIdRef = useRef(0);
  const effectIdRef = useRef(0);
  const spawnTimerRef = useRef(null);
  const bubbleTimersRef = useRef(new Map());
  const lastLightningSignatureRef = useRef('');
  const feedbackTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const sessionTickerRef = useRef(null);
  const sessionStopTimerRef = useRef(null);
  const sessionStartedAtRef = useRef(0);
  const scheduleNextSpawnRef = useRef(null);
  const stopSessionRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef(new Map());
  const audioLoadPromiseRef = useRef(null);
  const longAudioRef = useRef(null);
  const longAudioTokenRef = useRef(0);
  const bubbleNodesRef = useRef(new Map());
  const activePressRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const longDischargeTimerRef = useRef(null);
  const lastDragImpactAtRef = useRef(0);
  const aimPositionRef = useRef({ x: 50, y: 50 });
  const scopeActiveRef = useRef(false);
  const pointerLockedRef = useRef(false);
  const overlayOpenRef = useRef(false);
  const nativeFullscreenRef = useRef(false);
  const recoilOffsetRef = useRef({ x: 0, y: 0 });
  const recoilRecoveryFrameRef = useRef(null);
  const recoilResetTimerRef = useRef(null);
  const lastAimMovementRef = useRef({ at: 0, x: 0, y: 0, magnitude: 0 });
  const downwardFlickRef = useRef({ at: 0, strength: 0 });
  const scopeInaccuracyRef = useRef(0);
  const scopeInaccuracyTimerRef = useRef(null);
  const scopeCycleTimersRef = useRef([]);
  const reactionSeenAtRef = useRef(new Map());
  const presetImportRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);

  const [selectedMode, setSelectedMode] = useState('grow');
  const [gameSettings, setGameSettings] = useState(initialSettings);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [countdownValue, setCountdownValue] = useState(0);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [effects, setEffects] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [shakeActive, setShakeActive] = useState(false);
  const [scopeActive, setScopeActive] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [draggingDischarge, setDraggingDischarge] = useState(false);
  const [aimPosition, setAimPosition] = useState({ x: 50, y: 50 });
  const [recoilOffset, setRecoilOffset] = useState({ x: 0, y: 0 });
  const [scopeInaccuracy, setScopeInaccuracy] = useState(0);
  const [scopeShotCycle, setScopeShotCycle] = useState(false);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [detectedReactionTargetId, setDetectedReactionTargetId] = useState(null);
  const [presetLibrary, setPresetLibrary] = useState(createEmptyPresetLibrary);
  const [presetType, setPresetType] = useState('all');
  const [presetName, setPresetName] = useState('');
  const [presetMessage, setPresetMessage] = useState('');

  const scoringEnabled = gameSettings.general.scoringEnabled;
  const selectedModeContent = content.modes[selectedMode];
  const selectedModeSettings = gameSettings.modes[selectedMode];
  const isSessionActive = phase === 'running' || phase === 'countdown';
  const effectiveScopeActive = scopeActive;
  const isSniperReactionMode =
      selectedMode === 'sniper' &&
      gameSettings.modes.sniper.trainingType === 'reaction';
  const effectiveSensitivity =
      gameSettings.controls.mouseSensitivity *
      (effectiveScopeActive ? gameSettings.controls.zoomSensitivity : 1);
  const effectiveDpi = Math.round(
      gameSettings.controls.mouseDpi * gameSettings.controls.mouseSensitivity
  );
  const crosshairDynamicGap =
      ['classicStatic', 'defaultStatic'].includes(gameSettings.crosshair.style)
          ? 0
          : clamp(
              scopeInaccuracy *
              ({
                default: 12,
                classic: 5,
                classicDynamic: 8,
                legacy: 3,
              }[gameSettings.crosshair.style] ?? 7) +
              Math.hypot(recoilOffset.x, recoilOffset.y) * 0.42,
              0,
              22
          );
  const displayedRecoilOffset =
      gameSettings.recoil.enabled && gameSettings.crosshair.followRecoil
          ? recoilOffset
          : { x: 0, y: 0 };

  useEffect(() => {
    try {
      const stored =
          window.localStorage.getItem(STORAGE_KEY) ??
          LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean);

      if (stored) {
        const parsed = JSON.parse(stored);
        setGameSettings(deepMergeSettings(parsed.settings));

        if (MODE_IDS.includes(parsed.selectedMode)) {
          setSelectedMode(parsed.selectedMode);
        }
      }

      const storedPresets = window.localStorage.getItem(PRESET_STORAGE_KEY);
      if (storedPresets) {
        setPresetLibrary(normalizePresetLibrary(JSON.parse(storedPresets)));
      }
    } catch {
      setGameSettings(initialSettings);
    } finally {
      setHydrated(true);
    }
  }, [initialSettings]);

  useEffect(() => {
    settingsRef.current = gameSettings;
  }, [gameSettings]);

  useEffect(() => {
    modeRef.current = selectedMode;

    if (selectedMode === 'sniper') {
      scopeActiveRef.current = true;
      setScopeActive(true);
    } else if (!overlayOpenRef.current) {
      scopeActiveRef.current = false;
      setScopeActive(false);
    }
  }, [selectedMode]);

  useEffect(() => {
    aimPositionRef.current = aimPosition;
  }, [aimPosition]);

  useEffect(() => {
    recoilOffsetRef.current = recoilOffset;
  }, [recoilOffset]);

  useEffect(() => {
    scopeInaccuracyRef.current = scopeInaccuracy;
  }, [scopeInaccuracy]);

  useEffect(() => {
    scopeActiveRef.current = effectiveScopeActive;
  }, [effectiveScopeActive]);

  useEffect(() => {
    pointerLockedRef.current = pointerLocked;
  }, [pointerLocked]);

  useEffect(() => {
    overlayOpenRef.current = overlayOpen;
  }, [overlayOpen]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ settings: gameSettings, selectedMode })
    );
  }, [gameSettings, hydrated, selectedMode]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
        PRESET_STORAGE_KEY,
        JSON.stringify(presetLibrary)
    );
  }, [hydrated, presetLibrary]);

  useEffect(() => {
    if (!overlayOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayOpen]);

  const clearScopeCycleTimers = useCallback(() => {
    scopeCycleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    scopeCycleTimersRef.current = [];
    setScopeShotCycle(false);
  }, []);

  const resetRecoil = useCallback(() => {
    if (recoilResetTimerRef.current !== null) {
      window.clearTimeout(recoilResetTimerRef.current);
      recoilResetTimerRef.current = null;
    }

    if (recoilRecoveryFrameRef.current !== null) {
      window.cancelAnimationFrame(recoilRecoveryFrameRef.current);
      recoilRecoveryFrameRef.current = null;
    }

    recoilOffsetRef.current = { x: 0, y: 0 };
    setRecoilOffset({ x: 0, y: 0 });
  }, []);

  const beginRecoilRecovery = useCallback(() => {
    const recoilSettings = settingsRef.current.recoil;

    if (recoilResetTimerRef.current !== null) {
      window.clearTimeout(recoilResetTimerRef.current);
    }

    recoilResetTimerRef.current = window.setTimeout(() => {
      recoilResetTimerRef.current = null;
      const start = performance.now();
      const initial = { ...recoilOffsetRef.current };
      const duration = Math.max(60, recoilSettings.recoveryMs);

      const animate = (now) => {
        const progress = clamp((now - start) / duration, 0, 1);
        const remaining = (1 - progress) ** 3;
        const next = {
          x: initial.x * remaining,
          y: initial.y * remaining,
        };

        recoilOffsetRef.current = next;
        setRecoilOffset(next);

        if (progress < 1) {
          recoilRecoveryFrameRef.current = window.requestAnimationFrame(animate);
        } else {
          recoilRecoveryFrameRef.current = null;
          recoilOffsetRef.current = { x: 0, y: 0 };
          setRecoilOffset({ x: 0, y: 0 });
        }
      };

      recoilRecoveryFrameRef.current = window.requestAnimationFrame(animate);
    }, Math.max(0, recoilSettings.resetDelayMs));
  }, []);

  const applyShotRecoil = useCallback(() => {
    const recoilSettings = settingsRef.current.recoil;

    if (!recoilSettings.enabled) {
      return;
    }

    if (recoilRecoveryFrameRef.current !== null) {
      window.cancelAnimationFrame(recoilRecoveryFrameRef.current);
      recoilRecoveryFrameRef.current = null;
    }

    if (recoilResetTimerRef.current !== null) {
      window.clearTimeout(recoilResetTimerRef.current);
      recoilResetTimerRef.current = null;
    }

    const current = recoilOffsetRef.current;
    const strength = Math.max(0, recoilSettings.strengthPx);
    const horizontal =
        (Math.random() * 2 - 1) * strength * recoilSettings.horizontalVariance;
    const next = {
      x: clamp(current.x + horizontal, -34, 34),
      y: clamp(current.y - strength * randomBetween(0.82, 1.18), -48, 12),
    };

    recoilOffsetRef.current = next;
    setRecoilOffset(next);
    beginRecoilRecovery();
  }, [beginRecoilRecovery]);

  const registerAimMovement = useCallback((movementX, movementY) => {
    const now = performance.now();
    const magnitude = Math.hypot(movementX, movementY);
    lastAimMovementRef.current = {
      at: now,
      x: movementX,
      y: movementY,
      magnitude,
    };

    if (movementY > 7 && magnitude > 10) {
      downwardFlickRef.current = {
        at: now,
        strength: movementY + magnitude * 0.35,
      };
    }

    const nextInaccuracy = clamp(magnitude / 24, 0, 1);
    scopeInaccuracyRef.current = Math.max(scopeInaccuracyRef.current * 0.72, nextInaccuracy);
    setScopeInaccuracy(scopeInaccuracyRef.current);

    if (scopeInaccuracyTimerRef.current !== null) {
      window.clearTimeout(scopeInaccuracyTimerRef.current);
    }

    scopeInaccuracyTimerRef.current = window.setTimeout(() => {
      scopeInaccuracyTimerRef.current = null;
      scopeInaccuracyRef.current = 0;
      setScopeInaccuracy(0);
    }, 135);
  }, []);

  const isBubbleInsideReactionLens = useCallback((bubble) => {
    if (!isSniperReactionMode || !scopeActiveRef.current) {
      return !isSniperReactionMode;
    }

    const arena = arenaRef.current;
    if (!arena) {
      return false;
    }

    const rect = arena.getBoundingClientRect();
    const controls = settingsRef.current.controls;
    const sniperSettings = settingsRef.current.modes.sniper;
    const aim = aimPositionRef.current;
    const zoom = Math.max(1, controls.scopeZoom);
    const dx = ((bubble.x - aim.x) / 100) * rect.width * zoom;
    const dy = ((bubble.y - aim.y) / 100) * rect.height * zoom;
    const configuredRevealRadius =
        (Math.min(rect.width, rect.height) * sniperSettings.reactionRevealRadiusPercent) /
        100;
    const lensRadius =
        rect.width <= 608
            ? Math.min(rect.width * 0.38, 184)
            : clamp(rect.width * 0.23, 140.8, 288);
    const revealRadius = Math.min(configuredRevealRadius, lensRadius * 0.96);

    return Math.hypot(dx, dy) <= revealRadius;
  }, [isSniperReactionMode]);

  const syncBubbles = useCallback((updater) => {
    const next =
        typeof updater === 'function' ? updater(bubblesRef.current) : updater;
    bubblesRef.current = next;
    setBubbles(next);
  }, []);

  useEffect(() => {
    if (phase !== 'running' || !isSniperReactionMode) {
      setDetectedReactionTargetId(null);
      return;
    }

    const liveIds = new Set(bubbles.map((bubble) => bubble.id));
    reactionSeenAtRef.current.forEach((_, bubbleId) => {
      if (!liveIds.has(bubbleId)) {
        reactionSeenAtRef.current.delete(bubbleId);
      }
    });

    const visibleTargets = bubbles.filter(isBubbleInsideReactionLens);
    const now = performance.now();

    visibleTargets.forEach((bubble) => {
      if (!reactionSeenAtRef.current.has(bubble.id)) {
        reactionSeenAtRef.current.set(bubble.id, now);
      }
    });

    setDetectedReactionTargetId(visibleTargets[0]?.id ?? null);
  }, [aimPosition, bubbles, isBubbleInsideReactionLens, isSniperReactionMode, phase]);

  const clearBubbleTimer = useCallback((bubbleId) => {
    const timer = bubbleTimersRef.current.get(bubbleId);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      bubbleTimersRef.current.delete(bubbleId);
    }
  }, []);

  const clearSessionTimers = useCallback(() => {
    if (spawnTimerRef.current !== null) {
      window.clearTimeout(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    if (countdownTimerRef.current !== null) {
      window.clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (sessionTickerRef.current !== null) {
      window.clearInterval(sessionTickerRef.current);
      sessionTickerRef.current = null;
    }

    if (sessionStopTimerRef.current !== null) {
      window.clearTimeout(sessionStopTimerRef.current);
      sessionStopTimerRef.current = null;
    }

    bubbleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    bubbleTimersRef.current.clear();
  }, []);

  const showFeedback = useCallback(
      (value, x, y, positive) => {
        if (!settingsRef.current.effects.scoreFeedbackEnabled) {
          return;
        }

        if (feedbackTimerRef.current !== null) {
          window.clearTimeout(feedbackTimerRef.current);
        }

        setFeedback({ id: Date.now(), value, x, y, positive });
        feedbackTimerRef.current = window.setTimeout(() => {
          setFeedback(null);
          feedbackTimerRef.current = null;
        }, 640);
      },
      []
  );

  const ensureAudioReady = useCallback(async () => {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextClass = window.AudioContext ?? window['webkitAudioContext'];

    if (!AudioContextClass) {
      return null;
    }

    const audioContext =
        audioContextRef.current ?? new AudioContextClass({ latencyHint: 'interactive' });
    audioContextRef.current = audioContext;

    if (audioContext.state === 'suspended') {
      await audioContext.resume().catch(() => {});
    }

    if (!audioLoadPromiseRef.current) {
      audioLoadPromiseRef.current = Promise.all(
          Object.entries(AUDIO_FILES).map(async ([key, url]) => {
            try {
              const response = await fetch(url);

              if (!response.ok) {
                throw new Error(`Unable to load ${url}`);
              }

              const arrayBuffer = await response.arrayBuffer();
              const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
              audioBuffersRef.current.set(key, decoded);
            } catch (error) {
              console.warn('[BoredGame] Audio file was not loaded:', url, error);
            }
          })
      );
    }

    await audioLoadPromiseRef.current;
    return audioContext;
  }, []);

  const playShortSound = useCallback(async () => {
    const currentSettings = settingsRef.current;

    if (!currentSettings.audio.enabled) {
      return;
    }

    const audioContext = await ensureAudioReady();
    const buffer = audioBuffersRef.current.get(currentSettings.audio.shortSound);

    if (!audioContext || !buffer) {
      return;
    }

    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    source.buffer = buffer;
    source.playbackRate.setValueAtTime(1, now);
    gain.gain.setValueAtTime(
        clamp(currentSettings.audio.shortVolume, 0, 1),
        now
    );

    source.connect(gain);
    gain.connect(audioContext.destination);
    source.start(now);
  }, [ensureAudioReady]);

  const stopLongSound = useCallback(() => {
    longAudioTokenRef.current += 1;
    const active = longAudioRef.current;
    longAudioRef.current = null;

    if (!active) {
      return;
    }

    const now = active.context.currentTime;
    active.gain.gain.cancelScheduledValues(now);
    active.gain.gain.setValueAtTime(active.gain.gain.value, now);
    active.gain.gain.linearRampToValueAtTime(0.0001, now + 0.018);

    try {
      active.source.stop(now + 0.022);
    } catch {
      // The source may already be stopped by the browser.
    }
  }, []);

  const startLongSound = useCallback(async () => {
    const currentSettings = settingsRef.current;

    if (!currentSettings.audio.enabled || scopeActiveRef.current) {
      return;
    }

    stopLongSound();
    const token = longAudioTokenRef.current;
    const audioContext = await ensureAudioReady();

    if (token !== longAudioTokenRef.current || !audioContext) {
      return;
    }

    const buffer = audioBuffersRef.current.get(currentSettings.audio.longSound);

    if (!buffer) {
      return;
    }

    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const trim = Math.min(0.014, buffer.duration * 0.04);

    source.buffer = buffer;
    source.loop = true;
    source.loopStart = trim;
    source.loopEnd = Math.max(trim + 0.12, buffer.duration - trim);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(
        clamp(currentSettings.audio.longVolume, 0, 1),
        now + 0.016
    );

    source.connect(gain);
    gain.connect(audioContext.destination);
    source.start(now, source.loopStart);

    longAudioRef.current = { source, gain, context: audioContext };
  }, [ensureAudioReady, stopLongSound]);

  const triggerHaptics = useCallback(() => {
    if (
        settingsRef.current.effects.vibrationEnabled &&
        typeof navigator !== 'undefined' &&
        typeof navigator.vibrate === 'function'
    ) {
      navigator.vibrate(12);
    }
  }, []);

  const removeEffect = useCallback((effectId) => {
    setEffects((current) => current.filter((effect) => effect.id !== effectId));
  }, []);

  const createImpactAt = useCallback(
      (clientX, clientY, bubble, continuous = false) => {
        const arena = arenaRef.current;
        const effectSettings = settingsRef.current.effects;
        const controlSettings = settingsRef.current.controls;

        if (!arena) {
          return;
        }

        const rect = arena.getBoundingClientRect();
        const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
        const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
        const hitX = x * 10;
        const hitY = y * 10;
        const visualEffectEnabled =
            effectSettings.flashEnabled ||
            effectSettings.lightningEnabled ||
            effectSettings.particlesEnabled;

        if (effectSettings.screenShakeEnabled && !continuous) {
          setShakeActive(false);
          window.requestAnimationFrame(() => {
            setShakeActive(true);
            window.setTimeout(() => setShakeActive(false), 150);
          });
        }

        if (!visualEffectEnabled) {
          return;
        }

        effectIdRef.current += 1;
        const effectId = effectIdRef.current;
        const { selected: sides, signature } = shuffledLightningSides(
            effectSettings.lightningCount,
            lastLightningSignatureRef.current
        );
        lastLightningSignatureRef.current = signature;

        const paths = effectSettings.lightningEnabled
            ? sides.map((side, index) =>
                makeLightningPath(
                    side,
                    hitX,
                    hitY,
                    effectId * 31 + index * 97 + (bubble?.id ?? 0) * 13
                )
            )
            : [];
        const branchPaths =
            continuous && effectSettings.lightningEnabled
                ? makeLightningBranches(
                    hitX,
                    hitY,
                    effectId * 59 + (bubble?.id ?? 0) * 17,
                    controlSettings.dragLightningBranches
                )
                : [];

        setEffects((current) => [
          ...current,
          {
            id: effectId,
            x,
            y,
            paths,
            branchPaths,
            continuous,
            released: false,
            flashEnabled: effectSettings.flashEnabled,
            flashOpacity: continuous
                ? effectSettings.flashOpacity * 0.46
                : effectSettings.flashOpacity,
            particlesEnabled: effectSettings.particlesEnabled && !continuous,
          },
        ]);

        const visibleMs = continuous
            ? Math.max(56, Math.min(110, controlSettings.dragHitCooldownMs * 1.7))
            : effectSettings.minimumVisiblePressMs;

        window.setTimeout(() => {
          setEffects((current) =>
              current.map((effect) =>
                  effect.id === effectId ? { ...effect, released: true } : effect
              )
          );

          window.setTimeout(() => {
            removeEffect(effectId);
          }, effectSettings.lightningFadeMs);
        }, visibleMs);
      },
      [removeEffect]
  );

  const missBubble = useCallback(
      (bubbleId) => {
        const bubble = bubblesRef.current.find((item) => item.id === bubbleId);

        if (!bubble || !runningRef.current) {
          return;
        }

        clearBubbleTimer(bubbleId);
        reactionSeenAtRef.current.delete(bubbleId);
        syncBubbles((current) => current.filter((item) => item.id !== bubbleId));
        setMisses((current) => current + 1);

        if (settingsRef.current.general.scoringEnabled) {
          const penalty = settingsRef.current.score.missPenalty;
          setScore((current) => current + penalty);
          showFeedback(
              penalty > 0 ? `+${penalty}` : `${penalty}`,
              bubble.x,
              bubble.y,
              false
          );
        }

        if (
            runningRef.current &&
            modeRef.current === 'chase' &&
            scheduleNextSpawnRef.current
        ) {
          scheduleNextSpawnRef.current(
              settingsRef.current.modes.chase.nextDelayMs
          );
        }
      },
      [clearBubbleTimer, showFeedback, syncBubbles]
  );

  const spawnBubble = useCallback(() => {
    const currentSettings = settingsRef.current;

    if (
        !runningRef.current ||
        (document.hidden && currentSettings.general.pauseWhenHidden)
    ) {
      return;
    }

    const mode = modeRef.current;
    const maxActive =
        mode === 'chase'
            ? 1
            : mode === 'sniper'
                ? currentSettings.modes.sniper.targetCount
                : currentSettings.general.maxActive;

    if (bubblesRef.current.length >= maxActive) {
      return;
    }

    bubbleIdRef.current += 1;
    const bubble = createBubble(mode, currentSettings, bubbleIdRef.current);
    syncBubbles((current) => [...current, bubble]);

    const missTimer = window.setTimeout(() => {
      missBubble(bubble.id);
    }, bubble.lifetime);

    bubbleTimersRef.current.set(bubble.id, missTimer);
  }, [missBubble, syncBubbles]);

  const scheduleNextSpawn = useCallback(
      (customDelay) => {
        if (!runningRef.current) {
          return;
        }

        if (spawnTimerRef.current !== null) {
          window.clearTimeout(spawnTimerRef.current);
        }

        const currentSettings = settingsRef.current;
        const mode = modeRef.current;
        const modeSettings = currentSettings.modes[mode];
        const rawDelay =
            customDelay ??
            randomBetween(modeSettings.spawnMinMs, modeSettings.spawnMaxMs);
        const elapsedMinutes = Math.max(
            0,
            (performance.now() - sessionStartedAtRef.current) / 60000
        );
        const acceleration = currentSettings.general.adaptiveDifficulty
            ? 1 +
            elapsedMinutes *
            (currentSettings.general.difficultyRamp / 100)
            : 1;
        const delay = Math.max(90, rawDelay / acceleration);

        spawnTimerRef.current = window.setTimeout(() => {
          spawnTimerRef.current = null;
          spawnBubble();

          if (runningRef.current && modeRef.current !== 'chase') {
            scheduleNextSpawn();
          }
        }, delay);
      },
      [spawnBubble]
  );

  scheduleNextSpawnRef.current = scheduleNextSpawn;

  const getAimClientPoint = useCallback(() => {
    const arena = arenaRef.current;

    if (!arena) {
      return { clientX: 0, clientY: 0 };
    }

    const rect = arena.getBoundingClientRect();
    const position = aimPositionRef.current;

    return {
      clientX: rect.left + (position.x / 100) * rect.width,
      clientY: rect.top + (position.y / 100) * rect.height,
    };
  }, []);

  const getShotClientPoint = useCallback(() => {
    const point = getAimClientPoint();
    const currentSettings = settingsRef.current;
    let offsetX = currentSettings.recoil.enabled
        ? recoilOffsetRef.current.x
        : 0;
    let offsetY = currentSettings.recoil.enabled
        ? recoilOffsetRef.current.y
        : 0;

    if (
        scopeActiveRef.current &&
        currentSettings.sniperCrosshair.showInaccuracy &&
        scopeInaccuracyRef.current > 0
    ) {
      const now = performance.now();
      const downwardFlick = downwardFlickRef.current;
      const compensated =
          now - downwardFlick.at <= 145 && downwardFlick.strength >= 15;

      if (!compensated) {
        const spread = scopeInaccuracyRef.current;
        offsetX += (Math.random() * 2 - 1) * 9 * spread;
        offsetY -= randomBetween(7, 17) * spread;
      }
    }

    return {
      clientX: point.clientX + offsetX,
      clientY: point.clientY + offsetY,
    };
  }, [getAimClientPoint]);

  const setAimFromClientPoint = useCallback((clientX, clientY) => {
    const arena = arenaRef.current;

    if (!arena) {
      return;
    }

    const rect = arena.getBoundingClientRect();
    const next = {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100),
    };

    aimPositionRef.current = next;
    setAimPosition(next);
  }, []);

  const moveAimBy = useCallback((movementX, movementY) => {
    const arena = arenaRef.current;

    if (!arena) {
      return;
    }

    const rect = arena.getBoundingClientRect();
    const controls = settingsRef.current.controls;
    const zoomMultiplier = scopeActiveRef.current
        ? controls.zoomSensitivity
        : 1;
    const sensitivity = controls.mouseSensitivity * zoomMultiplier;
    const current = aimPositionRef.current;
    const next = {
      x: clamp(current.x + (movementX * sensitivity * 100) / rect.width, 0, 100),
      y: clamp(current.y + (movementY * sensitivity * 100) / rect.height, 0, 100),
    };

    aimPositionRef.current = next;
    setAimPosition(next);
  }, []);

  const findBubbleAtPoint = useCallback((clientX, clientY) => {
    const boostRem = settingsRef.current.effects.mobileHitBoost;
    const rootFontSize =
        Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
    const boostPixels = boostRem * rootFontSize;

    for (let index = bubblesRef.current.length - 1; index >= 0; index -= 1) {
      const bubble = bubblesRef.current[index];

      if (
          bubble.mode === 'sniper' &&
          settingsRef.current.modes.sniper.trainingType === 'reaction' &&
          !isBubbleInsideReactionLens(bubble)
      ) {
        continue;
      }

      const node = bubbleNodesRef.current.get(bubble.id);

      if (!node) {
        continue;
      }

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radiusX = rect.width / 2 + boostPixels;
      const radiusY = rect.height / 2 + boostPixels;
      const normalizedDistance = Math.hypot(
          (clientX - centerX) / Math.max(1, radiusX),
          (clientY - centerY) / Math.max(1, radiusY)
      );

      if (normalizedDistance <= 1) {
        return {
          bubble,
          precision: clamp(1 - normalizedDistance, 0, 1),
        };
      }
    }

    return null;
  }, [isBubbleInsideReactionLens]);

  const popBubbleAtPoint = useCallback(
      (bubble, clientX, clientY, interaction = 'tap', precision = 0) => {
        if (!runningRef.current) {
          return false;
        }

        const currentSettings = settingsRef.current;
        const elapsed = performance.now() - bubble.createdAt;
        const progress = clamp(elapsed / bubble.lifetime, 0, 1);
        const baseAward = getAward(progress, bubble.mode, currentSettings);
        let poppedIds = [bubble.id];
        let totalAward = baseAward;

        if (bubble.mode === 'sniper') {
          totalAward += Math.round(
              precision * currentSettings.modes.sniper.precisionBonus
          );
        }

        if (bubble.mode === 'chain') {
          const radius = currentSettings.modes.chain.chainRadiusPercent;
          const neighbours = bubblesRef.current.filter((candidate) => {
            if (candidate.id === bubble.id) {
              return false;
            }

            return Math.hypot(candidate.x - bubble.x, candidate.y - bubble.y) <= radius;
          });

          poppedIds = [bubble.id, ...neighbours.map((item) => item.id)];
          totalAward +=
              neighbours.length * currentSettings.modes.chain.chainBonus;
        }

        poppedIds.forEach((bubbleId) => {
          clearBubbleTimer(bubbleId);
          bubbleNodesRef.current.delete(bubbleId);
        });
        syncBubbles((current) =>
            current.filter((item) => !poppedIds.includes(item.id))
        );
        setHits((current) => current + poppedIds.length);

        if (
            bubble.mode === 'sniper' &&
            currentSettings.modes.sniper.trainingType === 'reaction'
        ) {
          const seenAt = reactionSeenAtRef.current.get(bubble.id);
          reactionSeenAtRef.current.delete(bubble.id);

          if (Number.isFinite(seenAt)) {
            const reactionTime = Math.max(0, performance.now() - seenAt);
            setReactionTimes((current) => [reactionTime, ...current].slice(0, 6));
          }
        }

        if (currentSettings.general.scoringEnabled) {
          setScore((current) => current + totalAward);
          showFeedback(`+${totalAward}`, bubble.x, bubble.y, true);
        }

        createImpactAt(clientX, clientY, bubble, interaction === 'drag');

        if (interaction === 'tap') {
          playShortSound();
          triggerHaptics();
        }

        if (
            runningRef.current &&
            (modeRef.current === 'chase' || modeRef.current === 'sniper') &&
            scheduleNextSpawnRef.current
        ) {
          const nextDelay =
              modeRef.current === 'chase'
                  ? currentSettings.modes.chase.nextDelayMs
                  : currentSettings.modes.sniper.spawnMinMs;
          scheduleNextSpawnRef.current(nextDelay);
        }

        return true;
      },
      [
        clearBubbleTimer,
        createImpactAt,
        playShortSound,
        showFeedback,
        syncBubbles,
        triggerHaptics,
      ]
  );

  const shootAtPoint = useCallback(
      (clientX, clientY, interaction = 'tap') => {
        const target = findBubbleAtPoint(clientX, clientY);

        if (!target) {
          if (interaction === 'drag') {
            createImpactAt(clientX, clientY, null, true);
          }
          return false;
        }

        return popBubbleAtPoint(
            target.bubble,
            clientX,
            clientY,
            interaction,
            target.precision
        );
      },
      [createImpactAt, findBubbleAtPoint, popBubbleAtPoint]
  );

  const runSniperShotCycle = useCallback(() => {
    if (!scopeActiveRef.current) {
      return;
    }

    clearScopeCycleTimers();
    const sniperSettings = settingsRef.current.sniperCrosshair;
    const delay = Math.max(0, sniperSettings.exitDelayMs);
    const exitTimer = window.setTimeout(() => {
      setScopeShotCycle(true);

      if (!sniperSettings.returnToScope) {
        scopeActiveRef.current = false;
        setScopeActive(false);
      }

      const settleTimer = window.setTimeout(() => {
        setScopeShotCycle(false);

        if (sniperSettings.returnToScope) {
          scopeActiveRef.current = true;
          setScopeActive(true);
        }
      }, 165);

      scopeCycleTimersRef.current.push(settleTimer);
    }, delay);

    scopeCycleTimersRef.current.push(exitTimer);
  }, [clearScopeCycleTimers]);

  const fireSingleShot = useCallback(() => {
    if (!runningRef.current) {
      return false;
    }

    const point = getShotClientPoint();
    const hit = shootAtPoint(point.clientX, point.clientY, 'tap');

    applyShotRecoil();

    if (scopeActiveRef.current || modeRef.current === 'sniper') {
      runSniperShotCycle();
    }

    return hit;
  }, [applyShotRecoil, getShotClientPoint, runSniperShotCycle, shootAtPoint]);

  const emitLongDischarge = useCallback(() => {
    if (!runningRef.current || scopeActiveRef.current) {
      return;
    }

    const now = performance.now();
    const cooldown = settingsRef.current.controls.dragHitCooldownMs;

    if (now - lastDragImpactAtRef.current < cooldown) {
      return;
    }

    lastDragImpactAtRef.current = now;
    const point = getAimClientPoint();
    shootAtPoint(point.clientX, point.clientY, 'drag');
  }, [getAimClientPoint, shootAtPoint]);

  const stopLongDischarge = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (longDischargeTimerRef.current !== null) {
      window.clearInterval(longDischargeTimerRef.current);
      longDischargeTimerRef.current = null;
    }

    if (activePressRef.current) {
      activePressRef.current.dragging = false;
    }

    setDraggingDischarge(false);
    stopLongSound();
  }, [stopLongSound]);

  const startLongDischarge = useCallback(() => {
    const controls = settingsRef.current.controls;

    if (
        !runningRef.current ||
        !controls.longPressEnabled ||
        scopeActiveRef.current ||
        modeRef.current === 'sniper'
    ) {
      return;
    }

    if (activePressRef.current) {
      activePressRef.current.dragging = true;
    }

    setDraggingDischarge(true);
    startLongSound();
    emitLongDischarge();

    if (longDischargeTimerRef.current !== null) {
      window.clearInterval(longDischargeTimerRef.current);
    }

    longDischargeTimerRef.current = window.setInterval(
        emitLongDischarge,
        Math.max(32, controls.dragHitCooldownMs)
    );
  }, [emitLongDischarge, startLongSound]);

  const toggleScope = useCallback(() => {
    if (!settingsRef.current.controls.rightClickScopeEnabled) {
      return;
    }

    stopLongDischarge();
    setScopeActive((current) => {
      const next = !current;
      scopeActiveRef.current = next;
      return next;
    });
  }, [stopLongDischarge]);

  const handleArenaPointerDown = useCallback(
      (event) => {
        if (!runningRef.current) {
          return;
        }

        if (event.button === 2) {
          event.preventDefault();
          toggleScope();
          return;
        }

        if (event.button !== 0) {
          return;
        }

        event.preventDefault();
        ensureAudioReady();

        if (!pointerLockedRef.current && event.pointerType !== 'mouse') {
          setAimFromClientPoint(event.clientX, event.clientY);
        }

        if (scopeActiveRef.current || modeRef.current === 'sniper') {
          fireSingleShot();
          return;
        }

        activePressRef.current = {
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          lastClientX: event.clientX,
          lastClientY: event.clientY,
          movement: 0,
          dragging: false,
        };

        if (settingsRef.current.controls.longPressEnabled) {
          longPressTimerRef.current = window.setTimeout(() => {
            longPressTimerRef.current = null;
            startLongDischarge();
          }, settingsRef.current.controls.longPressDelayMs);
        }
      },
      [
        ensureAudioReady,
        fireSingleShot,
        setAimFromClientPoint,
        startLongDischarge,
        toggleScope,
      ]
  );

  const handleArenaPointerMove = useCallback(
      (event) => {
        if (!runningRef.current) {
          return;
        }

        const activePress = activePressRef.current;
        const hasNativeMovement =
            event.pointerType === 'mouse' &&
            Number.isFinite(event.movementX) &&
            Number.isFinite(event.movementY);
        const movementX = hasNativeMovement
            ? event.movementX
            : activePress
                ? event.clientX - activePress.lastClientX
                : 0;
        const movementY = hasNativeMovement
            ? event.movementY
            : activePress
                ? event.clientY - activePress.lastClientY
                : 0;

        if (event.pointerType === 'mouse') {
          if (hasNativeMovement) {
            moveAimBy(movementX, movementY);
          } else {
            setAimFromClientPoint(event.clientX, event.clientY);
          }
        } else {
          setAimFromClientPoint(event.clientX, event.clientY);
        }

        registerAimMovement(movementX, movementY);

        if (!activePress || activePress.pointerId !== event.pointerId) {
          return;
        }

        activePress.lastClientX = event.clientX;
        activePress.lastClientY = event.clientY;
        activePress.movement += Math.hypot(movementX, movementY);

        if (
            !activePress.dragging &&
            activePress.movement >= settingsRef.current.controls.dragStartDistancePx
        ) {
          if (longPressTimerRef.current !== null) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
          startLongDischarge();
        }

        if (activePress.dragging) {
          emitLongDischarge();
        }
      },
      [
        emitLongDischarge,
        moveAimBy,
        registerAimMovement,
        setAimFromClientPoint,
        startLongDischarge,
      ]
  );

  const finishPointerPress = useCallback(
      (pointerId) => {
        const activePress = activePressRef.current;

        if (!activePress || activePress.pointerId !== pointerId) {
          return;
        }

        const wasDragging = activePress.dragging;
        activePressRef.current = null;

        if (longPressTimerRef.current !== null) {
          window.clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        if (wasDragging) {
          stopLongDischarge();
          return;
        }

        fireSingleShot();
      },
      [fireSingleShot, stopLongDischarge]
  );

  const handleArenaPointerUp = useCallback(
      (event) => {
        if (event.button === 0) {
          finishPointerPress(event.pointerId);
        }
      },
      [finishPointerPress]
  );

  const requestPointerLock = useCallback(() => {
    const arena = arenaRef.current;

    if (!arena?.requestPointerLock) {
      return;
    }

    try {
      const request = settingsRef.current.controls.rawInputEnabled
          ? arena.requestPointerLock({ unadjustedMovement: true })
          : arena.requestPointerLock();

      request?.catch?.(() => {
        arena.requestPointerLock?.();
      });
    } catch {
      arena.requestPointerLock?.();
    }
  }, []);

  const stopSession = useCallback(
      (nextPhase = 'finished') => {
        runningRef.current = false;
        activePressRef.current = null;
        stopLongDischarge();
        clearScopeCycleTimers();
        resetRecoil();
        clearSessionTimers();
        bubbleNodesRef.current.clear();
        reactionSeenAtRef.current.clear();
        syncBubbles([]);
        setEffects([]);
        setCountdownValue(0);
        setDetectedReactionTargetId(null);
        scopeInaccuracyRef.current = 0;
        setScopeInaccuracy(0);
        setPhase(nextPhase);

        if (document.pointerLockElement && document.exitPointerLock) {
          document.exitPointerLock();
        }
      },
      [
        clearScopeCycleTimers,
        clearSessionTimers,
        resetRecoil,
        stopLongDischarge,
        syncBubbles,
      ]
  );

  stopSessionRef.current = stopSession;

  const beginRunning = useCallback(() => {
    const currentSettings = settingsRef.current;
    runningRef.current = true;
    sessionStartedAtRef.current = performance.now();
    setElapsedSeconds(0);
    setAimPosition({ x: 50, y: 50 });
    aimPositionRef.current = { x: 50, y: 50 };

    if (modeRef.current === 'sniper') {
      setScopeActive(true);
      scopeActiveRef.current = true;
    }

    setPhase('running');

    sessionTickerRef.current = window.setInterval(() => {
      const elapsed =
          (performance.now() - sessionStartedAtRef.current) / 1000;
      setElapsedSeconds(elapsed);
    }, 250);

    if (currentSettings.general.sessionDurationSeconds > 0) {
      sessionStopTimerRef.current = window.setTimeout(() => {
        stopSessionRef.current?.('finished');
      }, currentSettings.general.sessionDurationSeconds * 1000);
    }

    window.requestAnimationFrame(() => {
      spawnBubble();

      if (modeRef.current !== 'chase') {
        scheduleNextSpawn();
      }
    });
  }, [scheduleNextSpawn, spawnBubble]);

  const startSession = useCallback(() => {
    stopSession('ready');
    setScore(0);
    setHits(0);
    setMisses(0);
    setFeedback(null);
    setElapsedSeconds(0);
    setReactionTimes([]);
    reactionSeenAtRef.current.clear();
    setDetectedReactionTargetId(null);
    modeRef.current = selectedMode;
    ensureAudioReady();

    const countdownSeconds = settingsRef.current.general.countdownSeconds;

    if (countdownSeconds <= 0) {
      beginRunning();
      return;
    }

    setPhase('countdown');
    setCountdownValue(countdownSeconds);

    const tick = (remaining) => {
      if (remaining <= 1) {
        countdownTimerRef.current = window.setTimeout(() => {
          setCountdownValue(0);
          beginRunning();
        }, 1000);
        return;
      }

      countdownTimerRef.current = window.setTimeout(() => {
        setCountdownValue(remaining - 1);
        tick(remaining - 1);
      }, 1000);
    };

    tick(countdownSeconds);
  }, [beginRunning, ensureAudioReady, selectedMode, stopSession]);

  const openGame = useCallback(() => {
    stopSession('ready');
    setScore(0);
    setHits(0);
    setMisses(0);
    setElapsedSeconds(0);
    setOverlayOpen(true);
    ensureAudioReady();

    const node = fullscreenRef.current;

    if (
        settingsRef.current.general.autoFullscreen &&
        node?.requestFullscreen &&
        !document.fullscreenElement
    ) {
      node.requestFullscreen()
          .then(() => {
            nativeFullscreenRef.current = true;
          })
          .catch(() => {
            nativeFullscreenRef.current = false;
            // The fixed overlay remains a complete fallback on browsers that block the API.
          });
    }
  }, [ensureAudioReady, stopSession]);

  const closeGame = useCallback(() => {
    stopSession('ready');
    setOverlayOpen(false);

    nativeFullscreenRef.current = false;

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, [stopSession]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
          nativeFullscreenRef.current &&
          !document.fullscreenElement &&
          overlayOpenRef.current
      ) {
        nativeFullscreenRef.current = false;
        stopSessionRef.current?.('ready');
        setOverlayOpen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === arenaRef.current;
      pointerLockedRef.current = locked;
      setPointerLocked(locked);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () =>
        document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  useEffect(() => {
    const handleGlobalPointerEnd = (event) => {
      if (event.button === 0 || event.type === 'pointercancel') {
        finishPointerPress(event.pointerId);
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerEnd);
    window.addEventListener('pointercancel', handleGlobalPointerEnd);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerEnd);
      window.removeEventListener('pointercancel', handleGlobalPointerEnd);
    };
  }, [finishPointerPress]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!overlayOpenRef.current) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        if (runningRef.current) {
          stopSessionRef.current?.('finished');
        } else if (phase !== 'countdown') {
          startSession();
        }
        return;
      }

      if (event.key === 'Escape') {
        if (document.pointerLockElement && document.exitPointerLock) {
          document.exitPointerLock();
          return;
        }
        closeGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeGame, phase, startSession]);

  useEffect(() => {
    const handleVisibility = () => {
      if (
          !runningRef.current ||
          !settingsRef.current.general.pauseWhenHidden
      ) {
        return;
      }

      if (document.hidden) {
        if (spawnTimerRef.current !== null) {
          window.clearTimeout(spawnTimerRef.current);
          spawnTimerRef.current = null;
        }

        bubbleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
        bubbleTimersRef.current.clear();
        syncBubbles([]);
      } else {
        scheduleNextSpawnRef.current?.(220);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [syncBubbles]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      clearSessionTimers();
      clearScopeCycleTimers();
      resetRecoil();

      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }

      if (scopeInaccuracyTimerRef.current !== null) {
        window.clearTimeout(scopeInaccuracyTimerRef.current);
      }

      stopLongSound();
      audioContextRef.current?.close?.();
    };
  }, [clearScopeCycleTimers, clearSessionTimers, resetRecoil, stopLongSound]);

  const updateGeneral = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      general: { ...current.general, [key]: value },
    }));
  }, []);

  const updateScore = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      score: { ...current.score, [key]: value },
    }));
  }, []);

  const updateEffects = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      effects: { ...current.effects, [key]: value },
    }));
  }, []);

  const updateAudio = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      audio: { ...current.audio, [key]: value },
    }));
  }, []);

  const updateControls = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      controls: { ...current.controls, [key]: value },
    }));
  }, []);

  const updateRecoil = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      recoil: { ...current.recoil, [key]: value },
      crosshair:
          key === 'enabled' && !value
              ? { ...current.crosshair, followRecoil: false }
              : current.crosshair,
    }));
  }, []);

  const updateCrosshair = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      crosshair: {
        ...current.crosshair,
        [key]:
            key === 'followRecoil' && !current.recoil.enabled ? false : value,
      },
    }));
  }, []);

  const updateSniperCrosshair = useCallback((key, value) => {
    setGameSettings((current) => ({
      ...current,
      sniperCrosshair: { ...current.sniperCrosshair, [key]: value },
    }));
  }, []);

  const updateMode = useCallback(
      (key, value) => {
        setGameSettings((current) => {
          const nextMode = {
            ...current.modes[selectedMode],
            [key]: value,
          };

          if (key === 'spawnMinMs' && value > nextMode.spawnMaxMs) {
            nextMode.spawnMaxMs = value;
          }

          if (key === 'spawnMaxMs' && value < nextMode.spawnMinMs) {
            nextMode.spawnMinMs = value;
          }

          if (key === 'lifetimeMinMs' && value > nextMode.lifetimeMaxMs) {
            nextMode.lifetimeMaxMs = value;
          }

          if (key === 'lifetimeMaxMs' && value < nextMode.lifetimeMinMs) {
            nextMode.lifetimeMinMs = value;
          }

          if (key === 'sizeMinRem' && value > nextMode.sizeMaxRem) {
            nextMode.sizeMaxRem = value;
          }

          if (key === 'sizeMaxRem' && value < nextMode.sizeMinRem) {
            nextMode.sizeMinRem = value;
          }

          return {
            ...current,
            modes: {
              ...current.modes,
              [selectedMode]: nextMode,
            },
          };
        });
      },
      [selectedMode]
  );

  const applyPreset = useCallback(
      (presetId) => {
        const factor = PRESET_FACTORS[presetId];
        const defaultMode = DEFAULT_GAME_SETTINGS.modes[selectedMode];
        const nextMode = { ...defaultMode };

        if ('spawnMinMs' in nextMode) {
          nextMode.spawnMinMs = Math.round(nextMode.spawnMinMs * factor.spawn);
          nextMode.spawnMaxMs = Math.round(nextMode.spawnMaxMs * factor.spawn);
        }

        if ('lifetimeMs' in nextMode) {
          nextMode.lifetimeMs = Math.round(nextMode.lifetimeMs * factor.lifetime);
        }

        if ('lifetimeMinMs' in nextMode) {
          nextMode.lifetimeMinMs = Math.round(
              nextMode.lifetimeMinMs * factor.lifetime
          );
          nextMode.lifetimeMaxMs = Math.round(
              nextMode.lifetimeMaxMs * factor.lifetime
          );
        }

        setGameSettings((current) => ({
          ...current,
          general: { ...current.general, maxActive: factor.maxActive },
          modes: { ...current.modes, [selectedMode]: nextMode },
        }));
      },
      [selectedMode]
  );

  const resetCurrentMode = useCallback(() => {
    setGameSettings((current) => ({
      ...current,
      modes: {
        ...current.modes,
        [selectedMode]: { ...DEFAULT_GAME_SETTINGS.modes[selectedMode] },
      },
    }));
  }, [selectedMode]);

  const resetAll = useCallback(() => {
    setSelectedMode('grow');
    setGameSettings(deepMergeSettings(externalSettings));
  }, [externalSettings]);

  const showPresetMessage = useCallback((message) => {
    setPresetMessage(message);
    window.setTimeout(() => {
      setPresetMessage((current) => (current === message ? '' : current));
    }, 2400);
  }, []);

  const saveCurrentPreset = useCallback(() => {
    const name = presetName.trim();

    if (!name) {
      showPresetMessage(content.presetMessages.nameRequired);
      return;
    }

    const currentItems = presetLibrary[presetType] ?? [];

    if (currentItems.length >= MAX_PRESETS_PER_TYPE) {
      showPresetMessage(content.presetMessages.limitReached);
      return;
    }

    const preset = {
      schemaVersion: PRESET_SCHEMA_VERSION,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: presetType,
      name,
      createdAt: new Date().toISOString(),
      data: createPresetData(presetType, gameSettings, selectedMode),
    };

    setPresetLibrary((current) => ({
      ...current,
      [presetType]: [preset, ...(current[presetType] ?? [])].slice(
          0,
          MAX_PRESETS_PER_TYPE
      ),
    }));
    setPresetName('');
    showPresetMessage(content.presetMessages.saved);
  }, [
    content.presetMessages,
    gameSettings,
    presetLibrary,
    presetName,
    presetType,
    selectedMode,
    showPresetMessage,
  ]);

  const loadPreset = useCallback(
      (preset) => {
        const next = applyPresetData(
            gameSettings,
            selectedMode,
            preset.type,
            preset.data
        );
        setGameSettings(next.settings);
        setSelectedMode(next.selectedMode);
        showPresetMessage(content.presetMessages.loaded);
      },
      [content.presetMessages, gameSettings, selectedMode, showPresetMessage]
  );

  const deletePreset = useCallback(
      (preset) => {
        setPresetLibrary((current) => ({
          ...current,
          [preset.type]: (current[preset.type] ?? []).filter(
              (item) => item.id !== preset.id
          ),
        }));
        showPresetMessage(content.presetMessages.deleted);
      },
      [content.presetMessages, showPresetMessage]
  );

  const exportPreset = useCallback((preset) => {
    downloadJsonFile(
        `${safePresetFilename(preset.name)}-${preset.type}.json`,
        {
          app: 'Raf Console Bored',
          schemaVersion: PRESET_SCHEMA_VERSION,
          preset,
        }
    );
  }, []);

  const exportPresetLibrary = useCallback(() => {
    downloadJsonFile('raf-console-bored-presets.json', {
      app: 'Raf Console Bored',
      schemaVersion: PRESET_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      presets: presetLibrary,
    });
  }, [presetLibrary]);

  const importPresetsFromFile = useCallback(
      async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
          return;
        }

        try {
          if (file.size > 2_000_000) {
            throw new Error('Preset file is too large');
          }

          const parsed = JSON.parse(await file.text());
          const importedLibrary = parsed?.presets
              ? normalizePresetLibrary(parsed.presets)
              : null;

          if (importedLibrary) {
            setPresetLibrary((current) =>
                Object.fromEntries(
                    PRESET_TYPES.map((type) => [
                      type,
                      [
                        ...(importedLibrary[type] ?? []).map((item, index) => ({
                          ...item,
                          id: `${Date.now()}-${type}-${index}-${Math.random()
                              .toString(36)
                              .slice(2, 7)}`,
                          type,
                        })),
                        ...(current[type] ?? []),
                      ].slice(0, MAX_PRESETS_PER_TYPE),
                    ])
                )
            );
            showPresetMessage(content.presetMessages.imported);
            return;
          }

          const preset = parsed?.preset ?? parsed;

          if (!PRESET_TYPES.includes(preset?.type) || !preset?.data) {
            throw new Error('Unsupported preset format');
          }

          setPresetLibrary((current) => ({
            ...current,
            [preset.type]: [
              {
                schemaVersion: PRESET_SCHEMA_VERSION,
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                type: preset.type,
                name: String(preset.name || content.presetImportedName).slice(0, 80),
                createdAt: new Date().toISOString(),
                data: preset.data,
              },
              ...(current[preset.type] ?? []),
            ].slice(0, MAX_PRESETS_PER_TYPE),
          }));
          showPresetMessage(content.presetMessages.imported);
        } catch (error) {
          console.warn('[BoredGame] Preset import failed:', error);
          showPresetMessage(content.presetMessages.importError);
        }
      },
      [content.presetImportedName, content.presetMessages, showPresetMessage]
  );

  const presetTypeOptions = PRESET_TYPES.map((type) => ({
    value: type,
    label: content.presetTypes[type],
  }));

  const crosshairStyleOptions = [
    { value: 'default', label: content.crosshairStyles.default },
    { value: 'defaultStatic', label: content.crosshairStyles.defaultStatic },
    { value: 'classic', label: content.crosshairStyles.classic },
    { value: 'classicDynamic', label: content.crosshairStyles.classicDynamic },
    { value: 'classicStatic', label: content.crosshairStyles.classicStatic },
    { value: 'legacy', label: content.crosshairStyles.legacy },
  ];

  const crosshairShapeOptions = [
    { value: 'cross', label: content.crosshairShapes.cross },
    { value: 't', label: content.crosshairShapes.t },
  ];

  const crosshairColorOptions = [
    { value: 'green', label: content.crosshairColors.green },
    { value: 'yellow', label: content.crosshairColors.yellow },
    { value: 'blue', label: content.crosshairColors.blue },
    { value: 'cyan', label: content.crosshairColors.cyan },
    { value: 'red', label: content.crosshairColors.red },
    { value: 'white', label: content.crosshairColors.white },
    { value: 'custom', label: content.crosshairColors.custom },
  ];

  const durationOptions = [
    { value: 0, label: content.unlimited },
    { value: 30, label: `30 ${content.secondsShort}` },
    { value: 60, label: `60 ${content.secondsShort}` },
    { value: 120, label: `2 min` },
    { value: 300, label: `5 min` },
  ];

  const shortSoundOptions = [
    { value: 'shortShock1', label: 'ShortShock1' },
    { value: 'headShotShock', label: 'HadShoatShock' },
  ];

  const longSoundOptions = [
    { value: 'longShock1', label: 'LongShock1' },
    { value: 'longShock2', label: 'LongShock2' },
    { value: 'longShock3', label: 'LongShock3' },
  ];

  const displayedTime =
      gameSettings.general.sessionDurationSeconds > 0
          ? gameSettings.general.sessionDurationSeconds - elapsedSeconds
          : elapsedSeconds;
  const currentPresetItems = presetLibrary[presetType] ?? [];

  const modeLifetimeControls = selectedMode === 'chase' ? (
      <>
        <RangeSetting
            {...content.settings.lifetimeMinMs}
            value={Math.round(selectedModeSettings.lifetimeMinMs)}
            min={200}
            max={1500}
            step={10}
            unit={content.millisecondsShort}
            onChange={(value) => updateMode('lifetimeMinMs', value)}
        />
        <RangeSetting
            {...content.settings.lifetimeMaxMs}
            value={Math.round(selectedModeSettings.lifetimeMaxMs)}
            min={300}
            max={2600}
            step={10}
            unit={content.millisecondsShort}
            onChange={(value) => updateMode('lifetimeMaxMs', value)}
        />
        <RangeSetting
            {...content.settings.nextDelayMs}
            value={Math.round(selectedModeSettings.nextDelayMs)}
            min={0}
            max={900}
            step={10}
            unit={content.millisecondsShort}
            onChange={(value) => updateMode('nextDelayMs', value)}
        />
      </>
  ) : (
      <>
        <RangeSetting
            {...content.settings.spawnMinMs}
            value={Math.round(selectedModeSettings.spawnMinMs)}
            min={100}
            max={2200}
            step={10}
            unit={content.millisecondsShort}
            onChange={(value) => updateMode('spawnMinMs', value)}
        />
        <RangeSetting
            {...content.settings.spawnMaxMs}
            value={Math.round(selectedModeSettings.spawnMaxMs)}
            min={150}
            max={3000}
            step={10}
            unit={content.millisecondsShort}
            onChange={(value) => updateMode('spawnMaxMs', value)}
        />
        <RangeSetting
            {...content.settings.lifetimeMs}
            value={Math.round(selectedModeSettings.lifetimeMs)}
            min={500}
            max={6500}
            step={50}
            unit={content.millisecondsShort}
            onChange={(value) => updateMode('lifetimeMs', value)}
        />
      </>
  );

  return (
      <main className={styles.page}>
        <div className={styles.backgroundGrid} aria-hidden="true" />
        <div className={styles.backgroundGlowOne} aria-hidden="true" />
        <div className={styles.backgroundGlowTwo} aria-hidden="true" />

        <div className={styles.shell}>
          <section className={styles.hero}>
            <div className={styles.eyebrow}>
              <Zap className={styles.eyebrowIcon} />
              <span>{content.eyebrow}</span>
            </div>
            <h1 className={styles.title}>{content.title}</h1>
            <p className={styles.subtitle}>{content.subtitle}</p>
          </section>

          <section className={styles.controlPanel}>
            <div className={styles.controlHeader}>
              <div>
                <span className={styles.sectionLabel}>{content.scoring}</span>
                <div className={styles.segmentedControl}>
                  <button
                      type="button"
                      className={`${styles.segmentButton} ${
                          scoringEnabled ? styles.segmentButtonActive : ''
                      }`}
                      onClick={() => updateGeneral('scoringEnabled', true)}
                  >
                    {content.scoreMode}
                  </button>
                  <button
                      type="button"
                      className={`${styles.segmentButton} ${
                          !scoringEnabled ? styles.segmentButtonActive : ''
                      }`}
                      onClick={() => updateGeneral('scoringEnabled', false)}
                  >
                    {content.relaxMode}
                  </button>
                </div>
              </div>

              <button
                  type="button"
                  className={`${styles.mainButton} ${styles.playButton}`}
                  onClick={openGame}
              >
                <Maximize2 className={styles.mainButtonIcon} />
                <span>{content.play}</span>
              </button>
            </div>

            <div className={styles.modeRail}>
              {MODE_IDS.map((modeId) => {
                const Icon = MODE_ICONS[modeId];
                const modeContent = content.modes[modeId];
                const active = selectedMode === modeId;

                return (
                    <button
                        key={modeId}
                        type="button"
                        className={`${styles.modeCard} ${
                            active ? styles.modeCardActive : ''
                        }`}
                        onClick={() => setSelectedMode(modeId)}
                        title={overlayOpen ? content.modeLocked : undefined}
                    >
                  <span className={styles.modeCardTop}>
                    <span className={styles.modeNumber}>{modeContent.number}</span>
                    <span className={styles.modeIconShell}>
                      <Icon className={styles.modeIcon} />
                    </span>
                  </span>
                      <strong>{modeContent.title}</strong>
                      <small>{modeContent.short}</small>
                      <span className={styles.modeDescription}>
                    {modeContent.description}
                  </span>
                    </button>
                );
              })}
            </div>
          </section>

          <section className={styles.settingsSection}>
            <div className={styles.settingsHeader}>
              <div>
                <span className={styles.sectionLabel}>{content.settingsTitle}</span>
                <h2>{selectedModeContent.title}</h2>
                <p>{content.settingsSubtitle}</p>
              </div>

              <div className={styles.saveStatus}>
                <Settings2 />
                <span>{content.saved}</span>
              </div>
            </div>

            <div className={styles.presetBar}>
              <span>{content.presets}</span>
              <div>
                <button type="button" onClick={() => applyPreset('calm')}>
                  {content.presetCalm}
                </button>
                <button type="button" onClick={() => applyPreset('normal')}>
                  {content.presetNormal}
                </button>
                <button type="button" onClick={() => applyPreset('fast')}>
                  {content.presetFast}
                </button>
                <button type="button" onClick={() => applyPreset('extreme')}>
                  {content.presetExtreme}
                </button>
              </div>
              <button type="button" className={styles.resetButton} onClick={resetCurrentMode}>
                <RotateCcw />
                {content.resetMode}
              </button>
            </div>

            <div className={styles.settingsGrid}>
              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <TimerReset />
                  <div>
                    <span className={styles.sectionLabel}>{content.generalSettings}</span>
                    <strong>{content.currentMode}</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  <RangeSetting
                      {...content.settings.countdownSeconds}
                      value={gameSettings.general.countdownSeconds}
                      min={0}
                      max={10}
                      step={1}
                      unit={content.secondsShort}
                      onChange={(value) => updateGeneral('countdownSeconds', value)}
                  />
                  <SelectSetting
                      {...content.settings.sessionDurationSeconds}
                      value={gameSettings.general.sessionDurationSeconds}
                      options={durationOptions}
                      numeric
                      onChange={(value) => updateGeneral('sessionDurationSeconds', value)}
                  />
                  <RangeSetting
                      {...content.settings.maxActive}
                      value={gameSettings.general.maxActive}
                      min={1}
                      max={16}
                      step={1}
                      onChange={(value) => updateGeneral('maxActive', value)}
                  />
                  <ToggleSetting
                      {...content.settings.adaptiveDifficulty}
                      checked={gameSettings.general.adaptiveDifficulty}
                      onChange={(value) => updateGeneral('adaptiveDifficulty', value)}
                  />
                  {gameSettings.general.adaptiveDifficulty && (
                      <RangeSetting
                          {...content.settings.difficultyRamp}
                          value={gameSettings.general.difficultyRamp}
                          min={0}
                          max={45}
                          step={1}
                          unit={content.percentShort}
                          onChange={(value) => updateGeneral('difficultyRamp', value)}
                      />
                  )}
                  <RangeSetting
                      {...content.settings.missPenalty}
                      value={gameSettings.score.missPenalty}
                      min={-10}
                      max={0}
                      step={1}
                      unit={content.pointsShort}
                      onChange={(value) => updateScore('missPenalty', value)}
                  />
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  {(() => {
                    const ModeIcon = MODE_ICONS[selectedMode];
                    return <ModeIcon />;
                  })()}
                  <div>
                    <span className={styles.sectionLabel}>{content.currentModeSettings}</span>
                    <strong>{selectedModeContent.short}</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  {modeLifetimeControls}
                  <RangeSetting
                      {...content.settings.sizeMinRem}
                      value={roundTo(selectedModeSettings.sizeMinRem, 1)}
                      min={1.8}
                      max={18}
                      step={0.1}
                      unit={content.remShort}
                      onChange={(value) => updateMode('sizeMinRem', value)}
                  />
                  <RangeSetting
                      {...content.settings.sizeMaxRem}
                      value={roundTo(selectedModeSettings.sizeMaxRem, 1)}
                      min={2.2}
                      max={22}
                      step={0.1}
                      unit={content.remShort}
                      onChange={(value) => updateMode('sizeMaxRem', value)}
                  />
                  {selectedMode === 'chain' && (
                      <>
                        <RangeSetting
                            {...content.settings.chainRadiusPercent}
                            value={selectedModeSettings.chainRadiusPercent}
                            min={6}
                            max={38}
                            step={1}
                            unit={content.percentShort}
                            onChange={(value) => updateMode('chainRadiusPercent', value)}
                        />
                        <RangeSetting
                            {...content.settings.chainBonus}
                            value={selectedModeSettings.chainBonus}
                            min={0}
                            max={10}
                            step={1}
                            unit={content.pointsShort}
                            onChange={(value) => updateMode('chainBonus', value)}
                        />
                      </>
                  )}
                  {selectedMode === 'sniper' && (
                      <>
                        <SelectSetting
                            {...content.settings.sniperTrainingType}
                            value={selectedModeSettings.trainingType}
                            options={[
                              { value: 'tracking', label: content.sniperTrainingTypes.tracking },
                              { value: 'reaction', label: content.sniperTrainingTypes.reaction },
                            ]}
                            onChange={(value) => updateMode('trainingType', value)}
                        />
                        <RangeSetting
                            {...content.settings.sniperTargetCount}
                            value={selectedModeSettings.targetCount}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(value) => updateMode('targetCount', value)}
                        />
                        {selectedModeSettings.trainingType === 'reaction' && (
                            <RangeSetting
                                {...content.settings.reactionRevealRadiusPercent}
                                value={selectedModeSettings.reactionRevealRadiusPercent}
                                min={8}
                                max={30}
                                step={1}
                                unit={content.percentShort}
                                onChange={(value) =>
                                    updateMode('reactionRevealRadiusPercent', value)
                                }
                            />
                        )}
                        <RangeSetting
                            {...content.settings.precisionBonus}
                            value={selectedModeSettings.precisionBonus}
                            min={0}
                            max={10}
                            step={1}
                            unit={content.pointsShort}
                            onChange={(value) => updateMode('precisionBonus', value)}
                        />
                      </>
                  )}
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Zap />
                  <div>
                    <span className={styles.sectionLabel}>{content.effectSettings}</span>
                    <strong>FlashBank Lite</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  <ToggleSetting
                      {...content.settings.flashEnabled}
                      checked={gameSettings.effects.flashEnabled}
                      onChange={(value) => updateEffects('flashEnabled', value)}
                  />
                  {gameSettings.effects.flashEnabled && (
                      <RangeSetting
                          {...content.settings.flashOpacity}
                          value={roundTo(gameSettings.effects.flashOpacity, 2)}
                          min={0.05}
                          max={0.65}
                          step={0.01}
                          onChange={(value) => updateEffects('flashOpacity', value)}
                      />
                  )}
                  <ToggleSetting
                      {...content.settings.lightningEnabled}
                      checked={gameSettings.effects.lightningEnabled}
                      onChange={(value) => updateEffects('lightningEnabled', value)}
                  />
                  {gameSettings.effects.lightningEnabled && (
                      <>
                        <RangeSetting
                            {...content.settings.lightningCount}
                            value={gameSettings.effects.lightningCount}
                            min={1}
                            max={4}
                            step={1}
                            onChange={(value) => updateEffects('lightningCount', value)}
                        />
                        <RangeSetting
                            {...content.settings.lightningFadeMs}
                            value={gameSettings.effects.lightningFadeMs}
                            min={80}
                            max={900}
                            step={10}
                            unit={content.millisecondsShort}
                            onChange={(value) => updateEffects('lightningFadeMs', value)}
                        />
                      </>
                  )}
                  <ToggleSetting
                      {...content.settings.particlesEnabled}
                      checked={gameSettings.effects.particlesEnabled}
                      onChange={(value) => updateEffects('particlesEnabled', value)}
                  />
                  <ToggleSetting
                      {...content.settings.screenShakeEnabled}
                      checked={gameSettings.effects.screenShakeEnabled}
                      onChange={(value) => updateEffects('screenShakeEnabled', value)}
                  />
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Volume2 />
                  <div>
                    <span className={styles.sectionLabel}>{content.audioSettings}</span>
                    <strong>Shock Audio</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  <ToggleSetting
                      {...content.settings.audioEnabled}
                      checked={gameSettings.audio.enabled}
                      onChange={(value) => updateAudio('enabled', value)}
                  />
                  {gameSettings.audio.enabled && (
                      <>
                        <SelectSetting
                            {...content.settings.shortSound}
                            value={gameSettings.audio.shortSound}
                            options={shortSoundOptions}
                            onChange={(value) => updateAudio('shortSound', value)}
                        />
                        <RangeSetting
                            {...content.settings.shortVolume}
                            value={roundTo(gameSettings.audio.shortVolume, 2)}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(value) => updateAudio('shortVolume', value)}
                        />
                        <SelectSetting
                            {...content.settings.longSound}
                            value={gameSettings.audio.longSound}
                            options={longSoundOptions}
                            onChange={(value) => updateAudio('longSound', value)}
                        />
                        <RangeSetting
                            {...content.settings.longVolume}
                            value={roundTo(gameSettings.audio.longVolume, 2)}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(value) => updateAudio('longVolume', value)}
                        />
                      </>
                  )}
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Crosshair />
                  <div>
                    <span className={styles.sectionLabel}>{content.aimSettings}</span>
                    <strong>CS2-style AIM</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  <RangeSetting
                      {...content.settings.mouseDpi}
                      value={gameSettings.controls.mouseDpi}
                      min={100}
                      max={6400}
                      step={50}
                      unit="DPI"
                      onChange={(value) => updateControls('mouseDpi', value)}
                  />
                  <RangeSetting
                      {...content.settings.mouseSensitivity}
                      value={roundTo(gameSettings.controls.mouseSensitivity, 2)}
                      min={0.1}
                      max={8}
                      step={0.05}
                      onChange={(value) => updateControls('mouseSensitivity', value)}
                  />
                  <div className={styles.edpiReadout}>
                    <span>{content.edpi}</span>
                    <strong>{effectiveDpi}</strong>
                  </div>
                  <RangeSetting
                      {...content.settings.zoomSensitivity}
                      value={roundTo(gameSettings.controls.zoomSensitivity, 2)}
                      min={0.1}
                      max={2.5}
                      step={0.01}
                      onChange={(value) => updateControls('zoomSensitivity', value)}
                  />
                  <RangeSetting
                      {...content.settings.scopeZoom}
                      value={roundTo(gameSettings.controls.scopeZoom, 2)}
                      min={1.05}
                      max={2.4}
                      step={0.05}
                      onChange={(value) => updateControls('scopeZoom', value)}
                  />
                  <ToggleSetting
                      {...content.settings.rightClickScopeEnabled}
                      checked={gameSettings.controls.rightClickScopeEnabled}
                      onChange={(value) => updateControls('rightClickScopeEnabled', value)}
                  />
                  <ToggleSetting
                      {...content.settings.pointerLockEnabled}
                      checked={gameSettings.controls.pointerLockEnabled}
                      onChange={(value) => updateControls('pointerLockEnabled', value)}
                  />
                  {gameSettings.controls.pointerLockEnabled && (
                      <ToggleSetting
                          {...content.settings.rawInputEnabled}
                          checked={gameSettings.controls.rawInputEnabled}
                          onChange={(value) => updateControls('rawInputEnabled', value)}
                      />
                  )}
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Crosshair />
                  <div>
                    <span className={styles.sectionLabel}>{content.crosshairSettings}</span>
                    <strong>{content.crosshairBuilder}</strong>
                  </div>
                </div>

                <div className={styles.crosshairPreviewStage}>
                  <span className={styles.previewAxisHorizontal} />
                  <span className={styles.previewAxisVertical} />
                  <CrosshairRenderer
                      config={gameSettings.crosshair}
                      preview
                      dynamicGap={
                        ['classicStatic', 'defaultStatic'].includes(gameSettings.crosshair.style) ? 0 : 7
                      }
                      recoilOffset={
                        gameSettings.crosshair.followRecoil
                            ? { x: 4, y: -5 }
                            : { x: 0, y: 0 }
                      }
                  />
                  <span
                      className={styles.crosshairColorSwatch}
                      style={{ background: resolveCrosshairColor(gameSettings.crosshair).css }}
                  />
                </div>

                <div className={styles.settingsList}>
                  <SelectSetting
                      {...content.settings.crosshairStyle}
                      value={gameSettings.crosshair.style}
                      options={crosshairStyleOptions}
                      onChange={(value) => updateCrosshair('style', value)}
                  />
                  <ToggleSetting
                      {...content.settings.followRecoil}
                      checked={gameSettings.crosshair.followRecoil}
                      disabled={!gameSettings.recoil.enabled}
                      onChange={(value) => updateCrosshair('followRecoil', value)}
                  />
                  <ToggleSetting
                      {...content.settings.centerDot}
                      checked={gameSettings.crosshair.centerDot}
                      onChange={(value) => updateCrosshair('centerDot', value)}
                  />
                  <RangeSetting
                      {...content.settings.crosshairLength}
                      value={roundTo(gameSettings.crosshair.length, 1)}
                      min={0.5}
                      max={20}
                      step={0.5}
                      onChange={(value) => updateCrosshair('length', value)}
                  />
                  <RangeSetting
                      {...content.settings.crosshairThickness}
                      value={roundTo(gameSettings.crosshair.thickness, 1)}
                      min={0.1}
                      max={6}
                      step={0.1}
                      onChange={(value) => updateCrosshair('thickness', value)}
                  />
                  <RangeSetting
                      {...content.settings.crosshairGap}
                      value={roundTo(gameSettings.crosshair.gap, 1)}
                      min={-5}
                      max={16}
                      step={0.5}
                      onChange={(value) => updateCrosshair('gap', value)}
                  />
                  <ToggleSetting
                      {...content.settings.crosshairOutlineEnabled}
                      checked={gameSettings.crosshair.outlineEnabled}
                      onChange={(value) => updateCrosshair('outlineEnabled', value)}
                  />
                  {gameSettings.crosshair.outlineEnabled && (
                      <RangeSetting
                          {...content.settings.crosshairOutlineThickness}
                          value={roundTo(gameSettings.crosshair.outlineThickness, 1)}
                          min={0.25}
                          max={4}
                          step={0.25}
                          onChange={(value) =>
                              updateCrosshair('outlineThickness', value)
                          }
                      />
                  )}
                  <SelectSetting
                      {...content.settings.crosshairColor}
                      value={gameSettings.crosshair.colorPreset}
                      options={crosshairColorOptions}
                      onChange={(value) => updateCrosshair('colorPreset', value)}
                  />
                  {gameSettings.crosshair.colorPreset === 'custom' && (
                      <div className={styles.rgbSettingsGrid}>
                        <RangeSetting
                            {...content.settings.crosshairRed}
                            value={gameSettings.crosshair.red}
                            min={0}
                            max={255}
                            step={1}
                            onChange={(value) => updateCrosshair('red', value)}
                        />
                        <RangeSetting
                            {...content.settings.crosshairGreen}
                            value={gameSettings.crosshair.green}
                            min={0}
                            max={255}
                            step={1}
                            onChange={(value) => updateCrosshair('green', value)}
                        />
                        <RangeSetting
                            {...content.settings.crosshairBlue}
                            value={gameSettings.crosshair.blue}
                            min={0}
                            max={255}
                            step={1}
                            onChange={(value) => updateCrosshair('blue', value)}
                        />
                      </div>
                  )}
                  <RangeSetting
                      {...content.settings.crosshairOpacity}
                      value={gameSettings.crosshair.opacity}
                      min={0}
                      max={255}
                      step={1}
                      onChange={(value) => updateCrosshair('opacity', value)}
                  />
                  <SelectSetting
                      {...content.settings.crosshairShape}
                      value={gameSettings.crosshair.shape}
                      options={crosshairShapeOptions}
                      onChange={(value) => updateCrosshair('shape', value)}
                  />
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Target />
                  <div>
                    <span className={styles.sectionLabel}>{content.recoilSettings}</span>
                    <strong>{content.recoilTraining}</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  <ToggleSetting
                      {...content.settings.recoilEnabled}
                      checked={gameSettings.recoil.enabled}
                      onChange={(value) => updateRecoil('enabled', value)}
                  />
                  {gameSettings.recoil.enabled && (
                      <>
                        <RangeSetting
                            {...content.settings.recoilStrengthPx}
                            value={roundTo(gameSettings.recoil.strengthPx, 1)}
                            min={0.5}
                            max={20}
                            step={0.5}
                            unit="px"
                            onChange={(value) => updateRecoil('strengthPx', value)}
                        />
                        <RangeSetting
                            {...content.settings.recoilHorizontalVariance}
                            value={roundTo(gameSettings.recoil.horizontalVariance, 2)}
                            min={0}
                            max={1.5}
                            step={0.05}
                            onChange={(value) =>
                                updateRecoil('horizontalVariance', value)
                            }
                        />
                        <RangeSetting
                            {...content.settings.recoilRecoveryMs}
                            value={gameSettings.recoil.recoveryMs}
                            min={60}
                            max={1200}
                            step={10}
                            unit={content.millisecondsShort}
                            onChange={(value) => updateRecoil('recoveryMs', value)}
                        />
                        <RangeSetting
                            {...content.settings.recoilResetDelayMs}
                            value={gameSettings.recoil.resetDelayMs}
                            min={0}
                            max={500}
                            step={10}
                            unit={content.millisecondsShort}
                            onChange={(value) => updateRecoil('resetDelayMs', value)}
                        />
                      </>
                  )}
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Eye />
                  <div>
                    <span className={styles.sectionLabel}>{content.sniperCrosshairSettings}</span>
                    <strong>{content.sniperCrosshairBuilder}</strong>
                  </div>
                </div>

                <div className={`${styles.crosshairPreviewStage} ${styles.sniperPreviewStage}`}>
                <span className={styles.previewScopeLens}>
                  <CrosshairRenderer
                      config={gameSettings.sniperCrosshair}
                      preview
                      scoped
                      inaccuracy={
                        gameSettings.sniperCrosshair.showInaccuracy ? 0.32 : 0
                      }
                  />
                </span>
                  <span
                      className={styles.crosshairColorSwatch}
                      style={{
                        background: resolveCrosshairColor(
                            gameSettings.sniperCrosshair
                        ).css,
                      }}
                  />
                </div>

                <div className={styles.settingsList}>
                  <RangeSetting
                      {...content.settings.sniperExitDelayMs}
                      value={gameSettings.sniperCrosshair.exitDelayMs}
                      min={0}
                      max={800}
                      step={10}
                      unit={content.millisecondsShort}
                      onChange={(value) =>
                          updateSniperCrosshair('exitDelayMs', value)
                      }
                  />
                  <ToggleSetting
                      {...content.settings.sniperShowInaccuracy}
                      checked={gameSettings.sniperCrosshair.showInaccuracy}
                      onChange={(value) =>
                          updateSniperCrosshair('showInaccuracy', value)
                      }
                  />
                  <ToggleSetting
                      {...content.settings.sniperReturnToScope}
                      checked={gameSettings.sniperCrosshair.returnToScope}
                      onChange={(value) =>
                          updateSniperCrosshair('returnToScope', value)
                      }
                  />
                  <RangeSetting
                      {...content.settings.sniperThickness}
                      value={roundTo(gameSettings.sniperCrosshair.thickness, 1)}
                      min={0.5}
                      max={8}
                      step={0.5}
                      onChange={(value) =>
                          updateSniperCrosshair('thickness', value)
                      }
                  />
                  <ToggleSetting
                      {...content.settings.sniperCenterDotEnabled}
                      checked={gameSettings.sniperCrosshair.centerDotEnabled}
                      onChange={(value) =>
                          updateSniperCrosshair('centerDotEnabled', value)
                      }
                  />
                  {gameSettings.sniperCrosshair.centerDotEnabled && (
                      <RangeSetting
                          {...content.settings.sniperCenterDotSize}
                          value={roundTo(
                              gameSettings.sniperCrosshair.centerDotSize,
                              1
                          )}
                          min={0.5}
                          max={8}
                          step={0.5}
                          onChange={(value) =>
                              updateSniperCrosshair('centerDotSize', value)
                          }
                      />
                  )}
                  <RangeSetting
                      {...content.settings.sniperLineLength}
                      value={gameSettings.sniperCrosshair.lineLength}
                      min={24}
                      max={320}
                      step={1}
                      onChange={(value) =>
                          updateSniperCrosshair('lineLength', value)
                      }
                  />
                  <RangeSetting
                      {...content.settings.sniperGap}
                      value={gameSettings.sniperCrosshair.gap}
                      min={0}
                      max={28}
                      step={1}
                      onChange={(value) => updateSniperCrosshair('gap', value)}
                  />
                  <ToggleSetting
                      {...content.settings.crosshairOutlineEnabled}
                      checked={gameSettings.sniperCrosshair.outlineEnabled}
                      onChange={(value) =>
                          updateSniperCrosshair('outlineEnabled', value)
                      }
                  />
                  {gameSettings.sniperCrosshair.outlineEnabled && (
                      <RangeSetting
                          {...content.settings.crosshairOutlineThickness}
                          value={roundTo(
                              gameSettings.sniperCrosshair.outlineThickness,
                              1
                          )}
                          min={0.25}
                          max={4}
                          step={0.25}
                          onChange={(value) =>
                              updateSniperCrosshair('outlineThickness', value)
                          }
                      />
                  )}
                  <SelectSetting
                      {...content.settings.crosshairColor}
                      value={gameSettings.sniperCrosshair.colorPreset}
                      options={crosshairColorOptions}
                      onChange={(value) =>
                          updateSniperCrosshair('colorPreset', value)
                      }
                  />
                  {gameSettings.sniperCrosshair.colorPreset === 'custom' && (
                      <div className={styles.rgbSettingsGrid}>
                        <RangeSetting
                            {...content.settings.crosshairRed}
                            value={gameSettings.sniperCrosshair.red}
                            min={0}
                            max={255}
                            step={1}
                            onChange={(value) =>
                                updateSniperCrosshair('red', value)
                            }
                        />
                        <RangeSetting
                            {...content.settings.crosshairGreen}
                            value={gameSettings.sniperCrosshair.green}
                            min={0}
                            max={255}
                            step={1}
                            onChange={(value) =>
                                updateSniperCrosshair('green', value)
                            }
                        />
                        <RangeSetting
                            {...content.settings.crosshairBlue}
                            value={gameSettings.sniperCrosshair.blue}
                            min={0}
                            max={255}
                            step={1}
                            onChange={(value) =>
                                updateSniperCrosshair('blue', value)
                            }
                        />
                      </div>
                  )}
                  <RangeSetting
                      {...content.settings.crosshairOpacity}
                      value={gameSettings.sniperCrosshair.opacity}
                      min={0}
                      max={255}
                      step={1}
                      onChange={(value) =>
                          updateSniperCrosshair('opacity', value)
                      }
                  />
                  <SelectSetting
                      {...content.settings.crosshairShape}
                      value={gameSettings.sniperCrosshair.shape}
                      options={crosshairShapeOptions}
                      onChange={(value) =>
                          updateSniperCrosshair('shape', value)
                      }
                  />
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Zap />
                  <div>
                    <span className={styles.sectionLabel}>{content.dragSettings}</span>
                    <strong>Continuous Shock</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  <ToggleSetting
                      {...content.settings.longPressEnabled}
                      checked={gameSettings.controls.longPressEnabled}
                      onChange={(value) => updateControls('longPressEnabled', value)}
                  />
                  {gameSettings.controls.longPressEnabled && (
                      <>
                        <RangeSetting
                            {...content.settings.longPressDelayMs}
                            value={gameSettings.controls.longPressDelayMs}
                            min={60}
                            max={600}
                            step={10}
                            unit={content.millisecondsShort}
                            onChange={(value) => updateControls('longPressDelayMs', value)}
                        />
                        <RangeSetting
                            {...content.settings.dragStartDistancePx}
                            value={gameSettings.controls.dragStartDistancePx}
                            min={1}
                            max={30}
                            step={1}
                            unit="px"
                            onChange={(value) => updateControls('dragStartDistancePx', value)}
                        />
                        <RangeSetting
                            {...content.settings.dragHitCooldownMs}
                            value={gameSettings.controls.dragHitCooldownMs}
                            min={24}
                            max={180}
                            step={2}
                            unit={content.millisecondsShort}
                            onChange={(value) => updateControls('dragHitCooldownMs', value)}
                        />
                        <RangeSetting
                            {...content.settings.dragLightningBranches}
                            value={gameSettings.controls.dragLightningBranches}
                            min={1}
                            max={8}
                            step={1}
                            onChange={(value) => updateControls('dragLightningBranches', value)}
                        />
                      </>
                  )}
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.settingsCardTitle}>
                  <Settings2 />
                  <div>
                    <span className={styles.sectionLabel}>{content.comfortSettings}</span>
                    <strong>Mobile & Desktop</strong>
                  </div>
                </div>

                <div className={styles.settingsList}>
                  <ToggleSetting
                      {...content.settings.showCustomCursor}
                      checked={gameSettings.controls.showCustomCursor}
                      onChange={(value) => updateControls('showCustomCursor', value)}
                  />
                  <ToggleSetting
                      {...content.settings.vibrationEnabled}
                      checked={gameSettings.effects.vibrationEnabled}
                      onChange={(value) => updateEffects('vibrationEnabled', value)}
                  />
                  <RangeSetting
                      {...content.settings.mobileHitBoost}
                      value={roundTo(gameSettings.effects.mobileHitBoost, 2)}
                      min={0}
                      max={1.5}
                      step={0.05}
                      unit={content.remShort}
                      onChange={(value) => updateEffects('mobileHitBoost', value)}
                  />
                  <ToggleSetting
                      {...content.settings.arenaGridEnabled}
                      checked={gameSettings.effects.arenaGridEnabled}
                      onChange={(value) => updateEffects('arenaGridEnabled', value)}
                  />
                  <ToggleSetting
                      {...content.settings.scoreFeedbackEnabled}
                      checked={gameSettings.effects.scoreFeedbackEnabled}
                      onChange={(value) => updateEffects('scoreFeedbackEnabled', value)}
                  />
                  <ToggleSetting
                      {...content.settings.autoFullscreen}
                      checked={gameSettings.general.autoFullscreen}
                      onChange={(value) => updateGeneral('autoFullscreen', value)}
                  />
                  <ToggleSetting
                      {...content.settings.pauseWhenHidden}
                      checked={gameSettings.general.pauseWhenHidden}
                      onChange={(value) => updateGeneral('pauseWhenHidden', value)}
                  />
                </div>
              </article>
            </div>

            <article className={styles.presetVault}>
              <div className={styles.presetVaultHeader}>
                <div className={styles.settingsCardTitle}>
                  <FileJson />
                  <div>
                    <span className={styles.sectionLabel}>{content.presetVaultTitle}</span>
                    <strong>{content.presetVaultSubtitle}</strong>
                  </div>
                </div>
                <span className={styles.presetLimitBadge}>
                {currentPresetItems.length}/{MAX_PRESETS_PER_TYPE}
              </span>
              </div>

              <div className={styles.presetComposer}>
                <SelectSetting
                    {...content.settings.presetType}
                    value={presetType}
                    options={presetTypeOptions}
                    onChange={setPresetType}
                />
                <label className={styles.presetNameField}>
                  <span>{content.presetName}</span>
                  <input
                      type="text"
                      maxLength={80}
                      value={presetName}
                      placeholder={content.presetNamePlaceholder}
                      onChange={(event) => setPresetName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          saveCurrentPreset();
                        }
                      }}
                  />
                </label>
                <button
                    type="button"
                    className={styles.presetPrimaryButton}
                    onClick={saveCurrentPreset}
                >
                  <Save />
                  {content.savePreset}
                </button>
                <button
                    type="button"
                    className={styles.presetUtilityButton}
                    onClick={() => presetImportRef.current?.click()}
                >
                  <Upload />
                  {content.importJson}
                </button>
                <button
                    type="button"
                    className={styles.presetUtilityButton}
                    onClick={exportPresetLibrary}
                >
                  <Download />
                  {content.exportAllJson}
                </button>
                <input
                    ref={presetImportRef}
                    className={styles.hiddenFileInput}
                    type="file"
                    accept="application/json,.json"
                    onChange={importPresetsFromFile}
                />
              </div>

              {presetMessage && (
                  <div className={styles.presetMessage} role="status">
                    {presetMessage}
                  </div>
              )}

              <div className={styles.presetList}>
                {currentPresetItems.length === 0 ? (
                    <div className={styles.presetEmptyState}>
                      <FileJson />
                      <span>{content.noPresets}</span>
                    </div>
                ) : (
                    currentPresetItems.map((preset) => (
                        <div key={preset.id} className={styles.presetItem}>
                          <div>
                            <strong>{preset.name}</strong>
                            <span>
                        {new Date(preset.createdAt).toLocaleString(
                            locale === 'ru' ? 'ru-RU' : 'en-US'
                        )}
                      </span>
                          </div>
                          <div className={styles.presetItemActions}>
                            <button type="button" onClick={() => loadPreset(preset)}>
                              <Upload />
                              {content.loadPreset}
                            </button>
                            <button type="button" onClick={() => exportPreset(preset)}>
                              <Download />
                              {content.exportPreset}
                            </button>
                            <button
                                type="button"
                                className={styles.presetDeleteButton}
                                onClick={() => deletePreset(preset)}
                                aria-label={content.deletePreset}
                                title={content.deletePreset}
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </div>
                    ))
                )}
              </div>
            </article>

            <div className={styles.settingsFooter}>
              <button type="button" onClick={resetAll}>
                <RefreshCcw />
                {content.resetAll}
              </button>
            </div>
          </section>
        </div>

        <section
            ref={fullscreenRef}
            className={`${styles.fullscreenGame} ${
                overlayOpen ? styles.fullscreenGameOpen : styles.fullscreenGameClosed
            }`}
            aria-hidden={!overlayOpen}
        >
          <div className={styles.fullscreenBackdrop} aria-hidden="true" />

          <header className={styles.gameHud}>
            <div className={styles.hudStats}>
              <div className={styles.hudCell}>
                <span>{content.score}</span>
                <strong>{scoringEnabled ? score : '—'}</strong>
              </div>
              <div className={styles.hudCell}>
                <span>{content.hits}</span>
                <strong>{hits}</strong>
              </div>
              <div className={styles.hudCell}>
                <span>{content.misses}</span>
                <strong>{misses}</strong>
              </div>
              <div className={styles.hudCell}>
                <span>{content.time}</span>
                <strong>{formatTime(displayedTime)}</strong>
              </div>
              <div className={`${styles.hudCell} ${styles.hudMode}`}>
                <span>{content.currentMode}</span>
                <strong>{selectedModeContent.title}</strong>
              </div>
            </div>

            <div className={styles.hudActions}>
              {gameSettings.controls.pointerLockEnabled && phase === 'running' && (
                  <button
                      type="button"
                      className={`${styles.captureButton} ${
                          pointerLocked ? styles.captureButtonActive : ''
                      }`}
                      onClick={requestPointerLock}
                      title={content.captureMouse}
                  >
                    <Crosshair />
                    <span>
                  {pointerLocked ? content.mouseCaptured : content.captureMouse}
                </span>
                  </button>
              )}

              <button
                  type="button"
                  className={`${styles.mainButton} ${
                      isSessionActive ? styles.stopButton : styles.startButton
                  }`}
                  onClick={isSessionActive ? () => stopSession('finished') : startSession}
              >
                {isSessionActive ? (
                    <Square className={styles.mainButtonIcon} />
                ) : (
                    <Play className={styles.mainButtonIcon} />
                )}
                <span>{isSessionActive ? content.stop : content.start}</span>
              </button>

              <button
                  type="button"
                  className={styles.closeButton}
                  onClick={closeGame}
                  aria-label={content.close}
                  title={content.close}
              >
                <X />
              </button>
            </div>
          </header>

          <div
              ref={arenaRef}
              className={`${styles.fullscreenArena} ${
                  phase === 'running' ? styles.arenaRunning : ''
              } ${
                  phase === 'running' && gameSettings.controls.showCustomCursor
                      ? styles.arenaCustomCursor
                      : ''
              }`}
              style={{
                '--hit-boost': `${gameSettings.effects.mobileHitBoost}rem`,
                '--aim-x': `${aimPosition.x}%`,
                '--aim-y': `${aimPosition.y}%`,
                '--scope-zoom': gameSettings.controls.scopeZoom,
                '--scope-inaccuracy': scopeInaccuracy,
                '--scope-blur': `${scopeInaccuracy * 1.8}px`,
              }}
              aria-label={selectedModeContent.title}
              onPointerDown={handleArenaPointerDown}
              onPointerMove={handleArenaPointerMove}
              onPointerUp={handleArenaPointerUp}
              onPointerCancel={handleArenaPointerUp}
              onPointerEnter={(event) => {
                if (
                    phase === 'running' &&
                    event.pointerType === 'mouse' &&
                    !pointerLockedRef.current &&
                    !activePressRef.current
                ) {
                  setAimFromClientPoint(event.clientX, event.clientY);
                }
              }}
              onContextMenu={(event) => event.preventDefault()}
          >
            {gameSettings.effects.arenaGridEnabled && (
                <div className={styles.arenaMesh} aria-hidden="true" />
            )}
            <div className={styles.arenaHalo} aria-hidden="true" />
            <div className={styles.arenaEdge} aria-hidden="true" />

            {phase === 'ready' && (
                <div className={styles.arenaState}>
              <span className={styles.arenaStateIcon}>
                <CircleDot />
              </span>
                  <h2>{content.fullscreenReadyTitle}</h2>
                  <p>{content.fullscreenReadyText}</p>
                </div>
            )}

            {phase === 'finished' && (
                <div className={styles.arenaState}>
              <span className={styles.arenaStateIcon}>
                <Target />
              </span>
                  <h2>{content.fullscreenFinishedTitle}</h2>
                  <p>{content.fullscreenFinishedText}</p>
                </div>
            )}

            {phase === 'countdown' && (
                <div className={styles.countdownLayer}>
                  <span>{content.countdown}</span>
                  <strong key={countdownValue}>{countdownValue}</strong>
                </div>
            )}

            {phase === 'running' && (
                <div className={styles.runningHint}>
                  {selectedMode === 'sniper'
                      ? content.fullscreenRunningSniper
                      : content.fullscreenRunning}
                </div>
            )}

            {phase === 'running' && (
                <div className={styles.arenaStatusRail} aria-hidden="true">
                  {effectiveScopeActive && <span>{content.scopeActive}</span>}
                  {draggingDischarge && <span>{content.dragActive}</span>}
                  {pointerLocked && <span>{content.mouseCaptured}</span>}
                </div>
            )}

            <div
                className={`${styles.worldLayer} ${
                    effectiveScopeActive ? styles.worldLayerScoped : ''
                } ${shakeActive ? styles.worldLayerShake : ''}`}
            >
              {bubbles.map((bubble) => (
                  <button
                      key={bubble.id}
                      ref={(node) => {
                        if (node) {
                          bubbleNodesRef.current.set(bubble.id, node);
                        } else {
                          bubbleNodesRef.current.delete(bubble.id);
                        }
                      }}
                      type="button"
                      tabIndex={-1}
                      data-bubble-id={bubble.id}
                      className={`${styles.bubbleButton} ${getBubbleClass(bubble.mode)} ${
                          bubble.mode === 'sniper' && isSniperReactionMode
                              ? isBubbleInsideReactionLens(bubble)
                                  ? styles.reactionTargetVisible
                                  : styles.reactionTargetHidden
                              : ''
                      } ${
                          bubble.id === detectedReactionTargetId
                              ? styles.reactionTargetDetected
                              : ''
                      }`}
                      aria-label={locale === 'ru' ? 'Лопнуть шарик' : 'Pop bubble'}
                      style={{
                        '--bubble-x': `${bubble.x}%`,
                        '--bubble-y': `${bubble.y}%`,
                        '--bubble-size': `${bubble.size}rem`,
                        '--bubble-life': `${bubble.lifetime}ms`,
                        '--bubble-hue': `${bubble.hueShift}deg`,
                        '--bubble-rotation': `${bubble.rotation}deg`,
                        '--mid-x': bubble.midX ?? '0vw',
                        '--end-x': bubble.endX ?? '0vw',
                        '--apex-y': bubble.apexY ?? '-60dvh',
                        '--rush-x': bubble.rushX ?? '0vw',
                        '--rush-y': bubble.rushY ?? '0dvh',
                        '--rain-drift': bubble.rainDrift ?? '0vw',
                        '--rain-rotate': bubble.rainRotate ?? '360deg',
                      }}
                  >
                <span className={styles.bubbleVisual}>
                  <span className={styles.bubbleSurface} />
                  <span className={styles.bubbleHighlight} />
                  <span className={styles.bubbleCaustic} />
                  {bubble.mode === 'grow' && <span className={styles.bubbleCore} />}
                  {bubble.mode === 'sniper' && (
                      <span className={styles.sniperTargetCore} />
                  )}
                </span>
                  </button>
              ))}

              {effects.map((effect) => (
                  <div
                      key={effect.id}
                      className={`${styles.impact} ${
                          effect.released ? styles.impactReleased : ''
                      } ${effect.continuous ? styles.impactContinuous : ''}`}
                      style={{
                        '--impact-x': `${effect.x}%`,
                        '--impact-y': `${effect.y}%`,
                        '--flash-opacity': effect.flashOpacity,
                        '--impact-fade': `${gameSettings.effects.lightningFadeMs}ms`,
                      }}
                      aria-hidden="true"
                  >
                    {effect.flashEnabled && <span className={styles.flashLayer} />}
                    <span className={styles.impactCore} />

                    {effect.particlesEnabled && (
                        <span className={styles.particleField}>
                    {Array.from({ length: 12 }, (_, index) => (
                        <i
                            key={index}
                            style={{
                              '--particle-angle': `${index * 30 + (effect.id % 17)}deg`,
                              '--particle-distance': `${3.2 + (index % 4) * 0.72}rem`,
                            }}
                        />
                    ))}
                  </span>
                    )}

                    {(effect.paths.length > 0 || effect.branchPaths?.length > 0) && (
                        <svg
                            className={styles.lightningCanvas}
                            viewBox="0 0 1000 1000"
                            preserveAspectRatio="none"
                        >
                          <defs>
                            <filter id={`lightning-blur-${effect.id}`}>
                              <feGaussianBlur stdDeviation="8" />
                            </filter>
                          </defs>

                          {effect.paths.map((path, index) => (
                              <g key={`${effect.id}-main-${index}`}>
                                <path
                                    d={path}
                                    className={styles.lightningOuter}
                                    filter={`url(#lightning-blur-${effect.id})`}
                                />
                                <path d={path} className={styles.lightningGlow} />
                                <path d={path} className={styles.lightningCore} />
                              </g>
                          ))}

                          {(effect.branchPaths ?? []).map((path, index) => (
                              <g key={`${effect.id}-branch-${index}`}>
                                <path
                                    d={path}
                                    className={styles.lightningBranchGlow}
                                />
                                <path d={path} className={styles.lightningBranch} />
                              </g>
                          ))}
                        </svg>
                    )}
                  </div>
              ))}

              {feedback && (
                  <span
                      key={feedback.id}
                      className={`${styles.feedback} ${
                          feedback.positive
                              ? styles.feedbackPositive
                              : styles.feedbackNegative
                      }`}
                      style={{
                        '--feedback-x': `${feedback.x}%`,
                        '--feedback-y': `${feedback.y}%`,
                      }}
                  >
                {feedback.value}
              </span>
              )}
            </div>

            {phase === 'running' &&
                gameSettings.controls.showCustomCursor &&
                !effectiveScopeActive && (
                    <span
                        className={`${styles.aimCursorAnchor} ${
                            draggingDischarge ? styles.aimCursorDischargingModern : ''
                        }`}
                        aria-hidden="true"
                    >
                <CrosshairRenderer
                    config={gameSettings.crosshair}
                    dynamicGap={crosshairDynamicGap}
                    recoilOffset={displayedRecoilOffset}
                    inaccuracy={scopeInaccuracy * 0.35}
                />
              </span>
                )}

            {phase === 'running' && effectiveScopeActive && (
                <div
                    className={`${styles.scopeOverlay} ${
                        scopeInaccuracy > 0 && gameSettings.sniperCrosshair.showInaccuracy
                            ? styles.scopeOverlayInaccurate
                            : ''
                    } ${scopeShotCycle ? styles.scopeOverlayShotCycle : ''}`}
                    aria-hidden="true"
                >
              <span className={styles.scopeLens}>
                <CrosshairRenderer
                    config={gameSettings.sniperCrosshair}
                    scoped
                    inaccuracy={scopeInaccuracy}
                    recoilOffset={
                      gameSettings.recoil.enabled
                          ? recoilOffset
                          : { x: 0, y: 0 }
                    }
                />
              </span>
                </div>
            )}

            {phase === 'running' && isSniperReactionMode && (
                <div className={styles.reactionTimingPanel}>
                  <div>
                    <span>{content.reactionLast}</span>
                    <strong>{formatReactionTime(reactionTimes[0], locale)}</strong>
                  </div>
                  <div>
                    <span>{content.reactionBest}</span>
                    <strong>
                      {formatReactionTime(
                          reactionTimes.length > 0 ? Math.min(...reactionTimes) : NaN,
                          locale
                      )}
                    </strong>
                  </div>
                  <div className={styles.reactionHistory}>
                    {reactionTimes.slice(0, 5).map((time, index) => (
                        <span key={`${time}-${index}`}>
                    {formatReactionTime(time, locale)}
                  </span>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </section>
      </main>
  );
}