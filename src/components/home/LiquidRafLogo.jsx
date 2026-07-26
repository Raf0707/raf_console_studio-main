'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LiquidRafLogo.module.css';

function makeRadial(ctx, x, y, radius, stops) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  for (const [offset, color] of stops) {
    gradient.addColorStop(offset, color);
  }

  return gradient;
}

function drawLens(ctx, x, y, radius, phase, strength = 1) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  ctx.fillStyle = makeRadial(ctx, x, y, radius, [
    [0, `rgba(255,255,255,${0.88 * strength})`],
    [0.18, `rgba(255,255,255,${0.44 * strength})`],
    [0.36, `rgba(235,235,235,${0.14 * strength})`],
    [0.52, `rgba(0,0,0,${0.08 * strength})`],
    [0.72, 'rgba(0,0,0,0)'],
  ]);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  const orbit = radius * (0.35 + Math.sin(phase) * 0.06);
  const fringeX = x + Math.cos(phase) * orbit;
  const fringeY = y + Math.sin(phase * 0.9) * orbit;

  ctx.lineWidth = Math.max(1.5, radius * 0.038);
  ctx.strokeStyle = `rgba(212,124,66,${0.72 * strength})`;
  ctx.beginPath();
  ctx.ellipse(
    fringeX - radius * 0.025,
    fringeY,
    radius * 0.38,
    radius * 0.2,
    phase * 0.24,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  ctx.lineWidth = Math.max(1, radius * 0.024);
  ctx.strokeStyle = `rgba(118,181,205,${0.62 * strength})`;
  ctx.beginPath();
  ctx.ellipse(
    fringeX + radius * 0.022,
    fringeY,
    radius * 0.42,
    radius * 0.23,
    phase * 0.24,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  ctx.restore();
}

function drawMetalField(ctx, width, height, time) {
  ctx.clearRect(0, 0, width, height);

  const base = ctx.createLinearGradient(0, height, width, 0);
  base.addColorStop(0, '#313840');
  base.addColorStop(0.3, '#aeb5bd');
  base.addColorStop(0.55, '#f7f8f9');
  base.addColorStop(0.76, '#d7dce1');
  base.addColorStop(1, '#555d66');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const cycle = (time % 12000) / 12000;
  const wave = cycle * Math.PI * 2;

  // Одновременные потоки: сверху, снизу и слева.
  const topY = -height * 0.18 + cycle * height * 1.36;
  const bottomY = height * 1.18 - cycle * height * 1.36;
  const leftX = -width * 0.22 + cycle * width * 1.44;

  drawLens(
    ctx,
    width * (0.58 + Math.sin(wave * 0.72) * 0.12),
    topY,
    Math.max(width, height) * 0.32,
    wave + 0.4,
    1
  );

  drawLens(
    ctx,
    width * (0.37 + Math.cos(wave * 0.62) * 0.13),
    bottomY,
    Math.max(width, height) * 0.29,
    -wave + 1.8,
    0.9
  );

  drawLens(
    ctx,
    leftX,
    height * (0.51 + Math.sin(wave * 0.58) * 0.16),
    Math.max(width, height) * 0.27,
    wave * 1.12 + 2.4,
    0.86
  );

  // Большая текучая тёмная зона.
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const shadow = makeRadial(
    ctx,
    width * (0.52 + Math.sin(wave * 0.41) * 0.19),
    height * (0.48 + Math.cos(wave * 0.37) * 0.22),
    Math.max(width, height) * 0.54,
    [
      [0, 'rgba(5,7,10,0.72)'],
      [0.32, 'rgba(16,19,23,0.42)'],
      [0.68, 'rgba(16,19,23,0.08)'],
      [1, 'rgba(0,0,0,0)'],
    ]
  );
  ctx.fillStyle = shadow;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Узкий диагональный зеркальный проход.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(width * 0.5, height * 0.5);
  ctx.rotate(-0.48 + Math.sin(wave * 0.32) * 0.12);

  const sweepX = -width * 1.4 + cycle * width * 2.8;
  const sweep = ctx.createLinearGradient(
    sweepX - width * 0.16,
    0,
    sweepX + width * 0.16,
    0
  );
  sweep.addColorStop(0, 'rgba(255,255,255,0)');
  sweep.addColorStop(0.34, 'rgba(255,255,255,0.08)');
  sweep.addColorStop(0.48, 'rgba(255,255,255,0.94)');
  sweep.addColorStop(0.55, 'rgba(255,255,255,0.24)');
  sweep.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = sweep;
  ctx.fillRect(-width * 1.5, -height, width * 3, height * 2);
  ctx.restore();

  // Тёплый медный рефлекс.
  ctx.save();
  ctx.globalCompositeOperation = 'color-dodge';
  ctx.fillStyle = makeRadial(
    ctx,
    width * (0.76 + Math.sin(wave * 0.54) * 0.14),
    height * (0.24 + Math.cos(wave * 0.44) * 0.12),
    Math.max(width, height) * 0.25,
    [
      [0, 'rgba(255,233,211,0.56)'],
      [0.22, 'rgba(205,127,73,0.44)'],
      [0.58, 'rgba(122,64,34,0.08)'],
      [1, 'rgba(0,0,0,0)'],
    ]
  );
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export default function LiquidRafLogo({
  placement = 'hero',
  className = '',
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const visibleRef = useRef(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });

    if (!context) {
      return undefined;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = 1;
    let height = 1;
    let startTime = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.round(bounds.width * pixelRatio));
      height = Math.max(1, Math.round(bounds.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      drawMetalField(context, width, height, reduceMotion ? 4200 : 0);
      setReady(true);
    };

    const render = (now) => {
      if (visibleRef.current) {
        drawMetalField(context, width, height, now - startTime);
      }

      if (!reduceMotion) {
        frameRef.current = requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '160px' }
    );
    intersectionObserver.observe(canvas);

    resize();

    if (!reduceMotion) {
      frameRef.current = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  const placementClass =
    placement === 'about'
      ? styles.aboutPlacement
      : styles.heroPlacement;

  return (
    <div
      className={`${styles.stage} ${placementClass} ${className}`}
      aria-hidden="true"
    >
      <div className={styles.aura} />

      <div className={styles.logo}>
        <span className={styles.base} />
        <span className={styles.shadow} />

        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${ready ? styles.canvasReady : ''}`}
        />

        <span className={styles.shine} />
        <span className={styles.edge} />
      </div>
    </div>
  );
}
