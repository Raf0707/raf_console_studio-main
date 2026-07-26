'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isRussian = pathname.includes('_ru') || pathname.includes('/ru');
  const year = new Date().getFullYear();

  const copyright = isRussian
    ? `© ${year} Raf</>Console Studio. Все права защищены.`
    : `© ${year} Raf</>Console Studio. All rights reserved.`;

  return (
    <footer className="relative mx-auto mt-24 flex max-w-7xl justify-center border-t border-neutral-500/20 px-4 py-10">
      <span className="text-center text-sm text-neutral-500">{copyright}</span>
    </footer>
  );
}
