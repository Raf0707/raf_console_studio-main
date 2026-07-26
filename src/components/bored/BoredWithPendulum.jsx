'use client';

import { BoredGame } from './index';
import PendulumPlayground from './PendulumPlayground';

export default function BoredWithPendulum({ locale = 'ru' }) {
  return (
    <>
      <BoredGame locale={locale} />
      <PendulumPlayground locale={locale} />
    </>
  );
}
