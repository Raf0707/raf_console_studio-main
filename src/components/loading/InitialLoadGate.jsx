'use client';

import { useEffect, useState } from 'react';

import DoublePendulumLoader from './DoublePendulumLoader';

const MINIMUM_VISIBLE_MS = 900;
const HARD_TIMEOUT_MS = 3_000;

export default function InitialLoadGate() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let firstFrameId = 0;
    let secondFrameId = 0;
    let finishTimerId = 0;
    const startedAt = performance.now();

    const hideAfterMinimumTime = () => {
      if (cancelled) {
        return;
      }

      const elapsed = performance.now() - startedAt;
      const delay = Math.max(0, MINIMUM_VISIBLE_MS - elapsed);

      window.clearTimeout(finishTimerId);
      finishTimerId = window.setTimeout(() => {
        if (!cancelled) {
          setVisible(false);
        }
      }, delay);
    };

    /*
     * InitialLoadGate нужен только для мгновенного первого кадра. После двух
     * paint-кадров управление длительной загрузкой принимает app/loading.js.
     * Поэтому видео, шрифты и сторонние ресурсы больше не удерживают оверлей.
     */
    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(hideAfterMinimumTime);
    });

    const hardTimeoutId = window.setTimeout(
      hideAfterMinimumTime,
      HARD_TIMEOUT_MS
    );

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      window.clearTimeout(finishTimerId);
      window.clearTimeout(hardTimeoutId);
    };
  }, []);

  return visible ? <DoublePendulumLoader initialLoad /> : null;
}
