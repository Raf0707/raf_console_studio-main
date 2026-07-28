import BoredWithPendulum from '@/components/bored/BoredWithPendulum';
;

export const metadata = {
  title: 'От скуки — Raf</>Console Studio',
  description: 'Игровые режимы, AIM-тренировка и наблюдение за системой двойных маятников.',
};

export default function BoredRuPage() {
  return <BoredWithPendulum locale="ru" />;
}
