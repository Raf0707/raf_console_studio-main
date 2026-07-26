'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import styles from './DoublePendulumLoader.module.css';

const GRAVITY = 9.81;
const SECOND_PENDULUM_DELAY_MS = 10_000;
const MAX_DEVICE_PIXEL_RATIO = 2;

function createPendulum({ theta1, theta2, omega1 = 0, omega2 = 0, colors }) {
  return {
    theta1,
    theta2,
    omega1,
    omega2,
    colors,
    previousFirst: null,
    previousSecond: null,
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

  pendulum.omega1 += acceleration1 * deltaSeconds;
  pendulum.omega2 += acceleration2 * deltaSeconds;

  // Незначительное сопротивление сохраняет хаотичность, но не даёт системе разлетаться.
  pendulum.omega1 *= 0.9996;
  pendulum.omega2 *= 0.9994;

  pendulum.theta1 += pendulum.omega1 * deltaSeconds;
  pendulum.theta2 += pendulum.omega2 * deltaSeconds;
}

function getPendulumPoints(pendulum, originX, originY, length1, length2) {
  const first = {
    x: originX + Math.sin(pendulum.theta1) * length1,
    y: originY + Math.cos(pendulum.theta1) * length1,
  };

  const second = {
    x: first.x + Math.sin(pendulum.theta2) * length2,
    y: first.y + Math.cos(pendulum.theta2) * length2,
  };

  return { first, second };
}

function drawTrailSegment(context, from, to, color, width) {
  if (!from) {
    return;
  }

  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.stroke();
}

function drawCurrentPendulum(context, origin, points, colors, scale) {
  context.save();

  context.shadowBlur = 14 * scale;
  context.shadowColor = 'rgba(255,255,255,.18)';
  context.strokeStyle = colors.rod;
  context.lineWidth = Math.max(1, 1.5 * scale);
  context.lineCap = 'round';

  context.beginPath();
  context.moveTo(origin.x, origin.y);
  context.lineTo(points.first.x, points.first.y);
  context.lineTo(points.second.x, points.second.y);
  context.stroke();

  const pivotRadius = Math.max(3, 4.2 * scale);
  const firstRadius = Math.max(5, 7.2 * scale);
  const secondRadius = Math.max(5, 6.4 * scale);

  [
    [origin, pivotRadius, colors.pivot],
    [points.first, firstRadius, colors.first],
    [points.second, secondRadius, colors.second],
  ].forEach(([point, radius, fill]) => {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
  });

  context.restore();
}

function resizeCanvas(canvas, trailCanvas) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);

  [canvas, trailCanvas].forEach((target) => {
    target.width = Math.max(1, Math.round(width * dpr));
    target.height = Math.max(1, Math.round(height * dpr));
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;

    const context = target.getContext('2d');
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  });

  return { width, height, dpr };
}

export default function DoublePendulumLoader({ initialLoad = false }) {
  const canvasRef = useRef(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const pathname = usePathname();
  const isRussian = pathname?.endsWith('_ru') || pathname === '/';

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    const trailCanvas = document.createElement('canvas');
    const trailContext = trailCanvas.getContext('2d');

    let viewport = resizeCanvas(canvas, trailCanvas);
    let animationFrameId = 0;
    let startedAt = performance.now();
    let previousFrameAt = startedAt;
    let secondPendulum = null;
    let revealedCanvas = false;

    const primaryPendulum = createPendulum({
      theta1: 1.96,
      theta2: -1.13,
      omega1: 0.04,
      omega2: -0.025,
      colors: {
        first: 'rgba(255,255,255,.98)',
        second: 'rgba(215,215,215,.96)',
        firstTrail: 'rgba(255,255,255,.86)',
        secondTrail: 'rgba(210,210,210,.68)',
        rod: 'rgba(245,245,245,.66)',
        pivot: 'rgba(255,255,255,.92)',
      },
    });

    const resetPreviousPoints = () => {
      primaryPendulum.previousFirst = null;
      primaryPendulum.previousSecond = null;

      if (secondPendulum) {
        secondPendulum.previousFirst = null;
        secondPendulum.previousSecond = null;
      }
    };

    const handleResize = () => {
      viewport = resizeCanvas(canvas, trailCanvas);
      trailContext.clearRect(0, 0, viewport.width, viewport.height);
      resetPreviousPoints();
    };

    const drawPendulum = (pendulum, geometry, deltaSeconds, trailWidthMultiplier = 1) => {
      advancePendulum(
        pendulum,
        geometry.length1 / geometry.physicsScale,
        geometry.length2 / geometry.physicsScale,
        deltaSeconds
      );

      const points = getPendulumPoints(
        pendulum,
        geometry.origin.x,
        geometry.origin.y,
        geometry.length1,
        geometry.length2
      );

      drawTrailSegment(
        trailContext,
        pendulum.previousFirst,
        points.first,
        pendulum.colors.firstTrail,
        Math.max(0.8, 1.5 * geometry.visualScale * trailWidthMultiplier)
      );

      drawTrailSegment(
        trailContext,
        pendulum.previousSecond,
        points.second,
        pendulum.colors.secondTrail,
        Math.max(0.8, 1.25 * geometry.visualScale * trailWidthMultiplier)
      );

      pendulum.previousFirst = points.first;
      pendulum.previousSecond = points.second;

      return points;
    };

    const render = (now) => {
      const elapsed = now - startedAt;
      const rawDeltaSeconds = Math.min((now - previousFrameAt) / 1000, 0.032);
      const deltaSeconds = Math.max(rawDeltaSeconds, 1 / 240);
      previousFrameAt = now;

      if (!secondPendulum && elapsed >= SECOND_PENDULUM_DELAY_MS) {
        secondPendulum = createPendulum({
          theta1: -1.72,
          theta2: 1.31,
          omega1: -0.035,
          omega2: 0.052,
          colors: {
            first: 'rgba(105,105,105,.96)',
            second: 'rgba(188,188,188,.94)',
            firstTrail: 'rgba(78,78,78,.72)',
            secondTrail: 'rgba(185,185,185,.55)',
            rod: 'rgba(150,150,150,.5)',
            pivot: 'rgba(120,120,120,.84)',
          },
        });
      }

      const shortestSide = Math.min(viewport.width, viewport.height);
      const availableHeight = Math.max(260, viewport.height * 0.72);
      const totalLength = Math.min(shortestSide * 0.64, availableHeight);
      const visualScale = Math.max(0.72, Math.min(1.4, shortestSide / 700));
      const geometry = {
        origin: {
          x: viewport.width / 2,
          y: viewport.height / 2 - totalLength * 0.08,
        },
        length1: totalLength * 0.54,
        length2: totalLength * 0.46,
        physicsScale: Math.max(72, shortestSide * 0.16),
        visualScale,
      };

      // Очень лёгкое затухание превращает линии в живой рисунок, а не в сплошную заливку.
      trailContext.save();
      trailContext.globalCompositeOperation = 'destination-out';
      trailContext.fillStyle = 'rgba(0,0,0,.006)';
      trailContext.fillRect(0, 0, viewport.width, viewport.height);
      trailContext.restore();

      const primaryPoints = drawPendulum(primaryPendulum, geometry, deltaSeconds, 1);
      let secondaryPoints = null;

      if (secondPendulum) {
        secondaryPoints = drawPendulum(secondPendulum, geometry, deltaSeconds, 0.92);
      }

      context.clearRect(0, 0, viewport.width, viewport.height);
      context.drawImage(
        trailCanvas,
        0,
        0,
        trailCanvas.width,
        trailCanvas.height,
        0,
        0,
        viewport.width,
        viewport.height
      );

      if (secondPendulum && secondaryPoints) {
        drawCurrentPendulum(
          context,
          geometry.origin,
          secondaryPoints,
          secondPendulum.colors,
          visualScale
        );
      }

      drawCurrentPendulum(
        context,
        geometry.origin,
        primaryPoints,
        primaryPendulum.colors,
        visualScale
      );

      if (!revealedCanvas) {
        revealedCanvas = true;
        setCanvasReady(true);
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={styles.loader}
      role="status"
      aria-live="polite"
      aria-label={isRussian ? 'Страница загружается' : 'Page is loading'}
      data-initial-load={initialLoad ? 'true' : 'false'}
      data-canvas-ready={canvasReady ? 'true' : 'false'}
    >
      <div className={styles.ambient} aria-hidden="true" />
      <p className={styles.message}>
        {isRussian ? 'Загрузка...' : 'Loading...'}
      </p>
      <div className={styles.instantPendulum} aria-hidden="true">
        <div className={styles.instantOrbit} />
        <div className={styles.instantRig}>
          <span className={styles.instantPivot} />
          <span className={styles.instantArmOne}>
            <span className={styles.instantMassOne}>
              <span className={styles.instantArmTwo}>
                <span className={styles.instantMassTwo} />
              </span>
            </span>
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <span className="sr-only">
        {isRussian
          ? 'Подождите, содержимое страницы загружается.'
          : 'Please wait while the page content loads.'}
      </span>
    </div>
  );
}
