'use client';

import {
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  Scaling,
  MoveHorizontal,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './PendulumPlayground.module.css';

const GRAVITY = 9.81;
const MIN_PENDULUMS = 1;
const MAX_PENDULUMS = 5;
const MAX_DPR = 2;
const MIN_SPACING = 0.45;
const MAX_SPACING = 1.65;
const MIN_SIZE = 0.65;
const MAX_SIZE = 1.55;

const PALETTES = [
  {
    first: 'rgba(255,255,255,.98)',
    second: 'rgba(216,216,216,.96)',
    firstTrail: 'rgba(255,255,255,.72)',
    secondTrail: 'rgba(216,216,216,.58)',
    rod: 'rgba(245,245,245,.62)',
    pivot: 'rgba(255,255,255,.95)',
  },
  {
    first: 'rgba(182,182,182,.98)',
    second: 'rgba(238,238,238,.94)',
    firstTrail: 'rgba(170,170,170,.64)',
    secondTrail: 'rgba(235,235,235,.5)',
    rod: 'rgba(205,205,205,.54)',
    pivot: 'rgba(220,220,220,.88)',
  },
  {
    first: 'rgba(118,118,118,.98)',
    second: 'rgba(197,197,197,.96)',
    firstTrail: 'rgba(104,104,104,.62)',
    secondTrail: 'rgba(192,192,192,.48)',
    rod: 'rgba(165,165,165,.48)',
    pivot: 'rgba(164,164,164,.82)',
  },
  {
    first: 'rgba(230,230,230,.96)',
    second: 'rgba(150,150,150,.98)',
    firstTrail: 'rgba(225,225,225,.54)',
    secondTrail: 'rgba(145,145,145,.56)',
    rod: 'rgba(190,190,190,.5)',
    pivot: 'rgba(210,210,210,.84)',
  },
  {
    first: 'rgba(142,142,142,.98)',
    second: 'rgba(252,252,252,.94)',
    firstTrail: 'rgba(132,132,132,.56)',
    secondTrail: 'rgba(248,248,248,.46)',
    rod: 'rgba(210,210,210,.46)',
    pivot: 'rgba(190,190,190,.84)',
  },
];

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function createPendulum(index) {
  const phase = index * 0.73;

  return {
    theta1: 1.64 + phase * 0.21,
    theta2: -1.12 - phase * 0.18,
    omega1: 0.018 * (index % 2 === 0 ? 1 : -1),
    omega2: 0.025 * (index % 2 === 0 ? -1 : 1),
    previousFirst: null,
    previousSecond: null,
    colors: PALETTES[index % PALETTES.length],
  };
}

function calculateAcceleration(pendulum, length1, length2) {
  const mass1 = 1;
  const mass2 = 0.84;
  const { theta1, theta2, omega1, omega2 } = pendulum;
  const delta = theta1 - theta2;
  const denominator = 2 * mass1 + mass2 - mass2 * Math.cos(2 * delta);

  const acceleration1 = (
      -GRAVITY * (2 * mass1 + mass2) * Math.sin(theta1)
      - mass2 * GRAVITY * Math.sin(theta1 - 2 * theta2)
      - 2 * Math.sin(delta) * mass2
      * (omega2 * omega2 * length2 + omega1 * omega1 * length1 * Math.cos(delta))
  ) / (length1 * denominator);

  const acceleration2 = (
      2 * Math.sin(delta)
      * (
          omega1 * omega1 * length1 * (mass1 + mass2)
          + GRAVITY * (mass1 + mass2) * Math.cos(theta1)
          + omega2 * omega2 * length2 * mass2 * Math.cos(delta)
      )
  ) / (length2 * denominator);

  return { acceleration1, acceleration2 };
}

function advancePendulum(pendulum, length1, length2, deltaSeconds) {
  const { acceleration1, acceleration2 } = calculateAcceleration(
      pendulum,
      length1,
      length2
  );

  pendulum.omega1 = (pendulum.omega1 + acceleration1 * deltaSeconds) * 0.9996;
  pendulum.omega2 = (pendulum.omega2 + acceleration2 * deltaSeconds) * 0.9994;
  pendulum.theta1 += pendulum.omega1 * deltaSeconds;
  pendulum.theta2 += pendulum.omega2 * deltaSeconds;
}

function getPoints(pendulum, origin, length1, length2) {
  const first = {
    x: origin.x + Math.sin(pendulum.theta1) * length1,
    y: origin.y + Math.cos(pendulum.theta1) * length1,
  };

  const second = {
    x: first.x + Math.sin(pendulum.theta2) * length2,
    y: first.y + Math.cos(pendulum.theta2) * length2,
  };

  return { first, second };
}

function pointOnCircle(center, radius, angleDegrees) {
  const angle = angleDegrees * (Math.PI / 180);

  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  };
}

function getOrigins(count, width, height, spacingScale, totalLength) {
  const center = { x: width / 2, y: height / 2 };
  const shortestSide = Math.min(width, height);
  const desiredRadius = shortestSide * 0.19 * spacingScale;
  const safeRadius = Math.max(24, shortestSide / 2 - totalLength * 0.82 - 18);
  const radius = clamp(desiredRadius, 24, Math.min(shortestSide * 0.42, safeRadius));

  if (count === 1) {
    return [center];
  }

  if (count === 2) {
    return [
      { x: center.x - radius, y: center.y },
      { x: center.x + radius, y: center.y },
    ];
  }

  if (count === 3) {
    // Равносторонний треугольник: все три точки равноудалены от центра.
    return [-90, 30, 150].map((angle) => pointOnCircle(center, radius, angle));
  }

  // Квадрат также вписан в окружность: каждая вершина равноудалена от центра.
  const square = [-135, -45, 45, 135].map((angle) =>
      pointOnCircle(center, radius, angle)
  );

  return count === 4 ? square : [...square, center];
}

function drawTrail(context, previous, current, color, width) {
  if (!previous) {
    return;
  }

  context.beginPath();
  context.moveTo(previous.x, previous.y);
  context.lineTo(current.x, current.y);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
}

function drawPendulum(context, origin, points, colors, scale) {
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = colors.rod;
  context.lineWidth = Math.max(1, 1.35 * scale);
  context.shadowBlur = 12 * scale;
  context.shadowColor = 'rgba(255,255,255,.14)';

  context.beginPath();
  context.moveTo(origin.x, origin.y);
  context.lineTo(points.first.x, points.first.y);
  context.lineTo(points.second.x, points.second.y);
  context.stroke();

  const nodes = [
    [origin, Math.max(2.7, 3.8 * scale), colors.pivot],
    [points.first, Math.max(4.2, 6.1 * scale), colors.first],
    [points.second, Math.max(4, 5.7 * scale), colors.second],
  ];

  nodes.forEach(([point, radius, fill]) => {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
  });

  context.restore();
}

export default function PendulumPlayground({ locale = 'ru' }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const trailCanvasRef = useRef(null);
  const pendulumsRef = useRef(Array.from({ length: MAX_PENDULUMS }, (_, index) => createPendulum(index)));
  const [count, setCount] = useState(1);
  const [spacing, setSpacing] = useState(1);
  const [size, setSize] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const isRussian = locale === 'ru';

  const copy = useMemo(() => (
      isRussian
          ? {
            eyebrow: 'Наблюдение · двойной маятник',
            title: 'Соскучился по экрану загрузки? А вот и он, но с дополнительными опциями',
            description: 'Добавляйте от одного до пяти двойных маятников. Точки автоматически образуют центр, линию, треугольник, квадрат или квадрат с центральной точкой.',
            decrease: 'Убрать маятник',
            increase: 'Добавить маятник',
            fullscreen: 'Развернуть на весь экран',
            exitFullscreen: 'Выйти из полноэкранного режима',
            clear: 'Очистить траектории',
            count: 'Маятников',
            spacing: 'Расположение',
            spacingCompact: 'Кучно',
            spacingWide: 'Широко',
            size: 'Размер',
            sizeSmall: 'Меньше',
            sizeLarge: 'Больше',
          }
          : {
            eyebrow: 'Observation · double pendulum',
            title: 'Missed the loading screen? Here it is again, now with extra controls',
            description: 'Add from one to five double pendulums. Their points automatically form a center, line, triangle, square, or square with a center point.',
            decrease: 'Remove a pendulum',
            increase: 'Add a pendulum',
            fullscreen: 'Open fullscreen',
            exitFullscreen: 'Exit fullscreen',
            clear: 'Clear trails',
            count: 'Pendulums',
            spacing: 'Spacing',
            spacingCompact: 'Compact',
            spacingWide: 'Wide',
            size: 'Size',
            sizeSmall: 'Smaller',
            sizeLarge: 'Larger',
          }
  ), [isRussian]);

  const clearTrails = useCallback(() => {
    const trailCanvas = trailCanvasRef.current;

    if (trailCanvas) {
      const context = trailCanvas.getContext('2d');
      context.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    }

    pendulumsRef.current.forEach((pendulum) => {
      pendulum.previousFirst = null;
      pendulum.previousSecond = null;
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
      setExpanded(false);
      return;
    }

    try {
      if (stage.requestFullscreen) {
        await stage.requestFullscreen();
        setExpanded(true);
      } else {
        setExpanded((current) => !current);
      }
    } catch {
      setExpanded((current) => !current);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setExpanded(document.fullscreenElement === stageRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!expanded) {
      return undefined;
    }

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !document.fullscreenElement) {
        setExpanded(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [expanded]);

  useEffect(() => {
    clearTrails();
  }, [clearTrails, count, spacing, size]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;

    if (!stage || !canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    const trailCanvas = document.createElement('canvas');
    const trailContext = trailCanvas.getContext('2d');
    trailCanvasRef.current = trailCanvas;

    let width = 1;
    let height = 1;
    let animationFrameId = 0;
    let previousFrameAt = performance.now();

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      [canvas, trailCanvas].forEach((target) => {
        target.width = Math.max(1, Math.round(width * dpr));
        target.height = Math.max(1, Math.round(height * dpr));
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        target.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      });

      clearTrails();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();

    const render = (now) => {
      const deltaSeconds = clamp((now - previousFrameAt) / 1000, 1 / 240, 0.032);
      previousFrameAt = now;

      const activePendulums = pendulumsRef.current.slice(0, count);
      const shortestSide = Math.min(width, height);
      const totalLengthFactor = count === 1 ? 0.36 : count === 2 ? 0.27 : 0.2;
      const baseTotalLength = clamp(shortestSide * totalLengthFactor, 72, count === 1 ? 330 : 190);
      const totalLength = baseTotalLength * size;
      const origins = getOrigins(count, width, height, spacing, totalLength);
      const length1 = totalLength * 0.54;
      const length2 = totalLength * 0.46;
      const physicsScale = Math.max(66, shortestSide * 0.15);
      const visualScale = clamp(shortestSide / 720, 0.65, 1.25) * size;

      trailContext.save();
      trailContext.globalCompositeOperation = 'destination-out';
      trailContext.fillStyle = 'rgba(0,0,0,.008)';
      trailContext.fillRect(0, 0, width, height);
      trailContext.restore();

      const rendered = activePendulums.map((pendulum, index) => {
        advancePendulum(
            pendulum,
            length1 / physicsScale,
            length2 / physicsScale,
            deltaSeconds
        );

        const points = getPoints(pendulum, origins[index], length1, length2);

        drawTrail(
            trailContext,
            pendulum.previousFirst,
            points.first,
            pendulum.colors.firstTrail,
            Math.max(0.75, 1.25 * visualScale)
        );
        drawTrail(
            trailContext,
            pendulum.previousSecond,
            points.second,
            pendulum.colors.secondTrail,
            Math.max(0.7, 1.05 * visualScale)
        );

        pendulum.previousFirst = points.first;
        pendulum.previousSecond = points.second;

        return { pendulum, origin: origins[index], points };
      });

      context.clearRect(0, 0, width, height);
      context.drawImage(
          trailCanvas,
          0,
          0,
          trailCanvas.width,
          trailCanvas.height,
          0,
          0,
          width,
          height
      );

      rendered.forEach(({ pendulum, origin, points }) => {
        drawPendulum(context, origin, points, pendulum.colors, visualScale);
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      trailCanvasRef.current = null;
    };
  }, [clearTrails, count, expanded, spacing, size]);

  return (
      <section className={styles.section} aria-labelledby="pendulum-playground-title">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h2 id="pendulum-playground-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>

        <div
            ref={stageRef}
            className={styles.stage}
            data-expanded={expanded ? 'true' : 'false'}
        >
          <div className={styles.stageGlow} aria-hidden="true" />
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

          <div className={styles.controlDock}>
            <div className={styles.controls}>
              <div className={styles.counter}>
                <span>{copy.count}</span>
                <strong>{count}</strong>
              </div>

              <button
                  type="button"
                  onClick={() => setCount((current) => Math.max(MIN_PENDULUMS, current - 1))}
                  disabled={count <= MIN_PENDULUMS}
                  aria-label={copy.decrease}
              >
                <Minus aria-hidden="true" />
              </button>

              <button
                  type="button"
                  onClick={() => setCount((current) => Math.min(MAX_PENDULUMS, current + 1))}
                  disabled={count >= MAX_PENDULUMS}
                  aria-label={copy.increase}
              >
                <Plus aria-hidden="true" />
              </button>

              <button type="button" onClick={clearTrails} aria-label={copy.clear}>
                <RotateCcw aria-hidden="true" />
              </button>

              <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={expanded ? copy.exitFullscreen : copy.fullscreen}
              >
                {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
              </button>
            </div>

            <div className={styles.adjustments}>
              <label className={styles.adjustment}>
              <span className={styles.adjustmentTitle}>
                <MoveHorizontal aria-hidden="true" />
                {copy.spacing}
              </span>
                <span className={styles.rangeRow}>
                <span>{copy.spacingCompact}</span>
                <input
                    type="range"
                    min={MIN_SPACING}
                    max={MAX_SPACING}
                    step="0.05"
                    value={spacing}
                    onChange={(event) => setSpacing(Number(event.target.value))}
                    aria-label={copy.spacing}
                />
                <span>{copy.spacingWide}</span>
              </span>
              </label>

              <label className={styles.adjustment}>
              <span className={styles.adjustmentTitle}>
                <Scaling aria-hidden="true" />
                {copy.size}
              </span>
                <span className={styles.rangeRow}>
                <span>{copy.sizeSmall}</span>
                <input
                    type="range"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    step="0.05"
                    value={size}
                    onChange={(event) => setSize(Number(event.target.value))}
                    aria-label={copy.size}
                />
                <span>{copy.sizeLarge}</span>
              </span>
              </label>
            </div>
          </div>
        </div>
      </section>
  );
}