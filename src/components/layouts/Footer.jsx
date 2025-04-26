'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    const isRussian = pathname.includes('_ru') || pathname.includes('/ru');

    const copyright = isRussian
        ? '© 2025 Raf</>Console Studio. Все права защищены.'
        : '© 2025 Raf</>Console Studio. All rights reserved.';

    return (
        <footer className='flex justify-center mt-[128px] mb-[40px]'>
      <span className='text-neutral-500 text-center'>
        {copyright}
      </span>
        </footer>
    );
}
