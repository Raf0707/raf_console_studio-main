'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/main_ru';
  }

  return pathname.replace(/\/+$/, '');
}

function getRouteGroup(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  const firstSegment = normalizedPathname.split('/').filter(Boolean)[0] ?? 'main_ru';
  const segment = firstSegment.replace(/_ru$/, '');

  switch (segment) {
    case 'main':
      return 'home';
    case 'studio':
      return 'studio';
    case 'projects':
      return 'projects';
    case 'contacts':
      return 'contacts';
    case 'privacy_policy':
      return 'privacy';
    case 'bored':
      return 'bored';
    default:
      return 'other';
  }
}

export default function RouteResponsiveController() {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPathname = normalizePathname(pathname);
    const root = document.documentElement;
    const routeGroup = getRouteGroup(normalizedPathname);

    root.dataset.rafRoute = routeGroup;
    root.dataset.rafLocale = normalizedPathname.endsWith('_ru') ? 'ru' : 'en';
    root.lang = normalizedPathname.endsWith('_ru') ? 'ru' : 'en';

    /*
     * SegmentButton прокручивается внутри себя. Горизонтальная позиция самого
     * документа всегда возвращается к нулю, поэтому fixed Header не уезжает.
     */
    if (routeGroup === 'projects') {
      const resetDocumentHorizontalScroll = () => {
        root.scrollLeft = 0;
        document.body.scrollLeft = 0;
        document.scrollingElement?.scrollTo({
          left: 0,
          top: document.scrollingElement.scrollTop,
          behavior: 'instant',
        });
      };

      resetDocumentHorizontalScroll();
      const frameId = window.requestAnimationFrame(resetDocumentHorizontalScroll);

      return () => {
        window.cancelAnimationFrame(frameId);
        delete root.dataset.rafRoute;
        delete root.dataset.rafLocale;
      };
    }

    return () => {
      delete root.dataset.rafRoute;
      delete root.dataset.rafLocale;
    };
  }, [pathname]);

  return null;
}
