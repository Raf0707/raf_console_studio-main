'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './OfflineManager.module.css';

const OFFLINE_ROUTES = new Set([
  '/bored_ru',
  '/bored',
  '/privacy_policy_ru',
  '/privacy_policy',
]);

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}

function getLocaleFromPathname(pathname) {
  return normalizePathname(pathname).endsWith('_ru') ? 'ru' : 'en';
}

function isModifiedClick(event) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

export default function OfflineManager() {
  const pathname = usePathname() || '/main_ru';
  const [online, setOnline] = useState(true);
  const [connectionRestored, setConnectionRestored] = useState(false);
  const restoredTimerRef = useRef(null);

  const locale = useMemo(
    () => getLocaleFromPathname(pathname),
    [pathname]
  );

  useEffect(() => {
    setOnline(window.navigator.onLine);

    const offlineWorkerEnabled =
      process.env.NODE_ENV === 'production' ||
      process.env.NEXT_PUBLIC_ENABLE_OFFLINE_IN_DEV === 'true';

    if (
      !offlineWorkerEnabled ||
      !('serviceWorker' in navigator)
    ) {
      return undefined;
    }

    let disposed = false;

    async function registerOfflineWorker() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        await navigator.serviceWorker.ready;

        if (disposed) {
          return;
        }

        const worker =
          registration.active ??
          registration.waiting ??
          registration.installing ??
          navigator.serviceWorker.controller;

        worker?.postMessage({
          type: 'RAF_WARM_ESSENTIAL_ROUTES',
        });
      } catch (error) {
        console.error('Unable to register offline worker.', error);
      }
    }

    registerOfflineWorker();

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    function handleOffline() {
      setOnline(false);
      setConnectionRestored(false);

      if (restoredTimerRef.current) {
        window.clearTimeout(restoredTimerRef.current);
        restoredTimerRef.current = null;
      }
    }

    function handleOnline() {
      setOnline(true);
      setConnectionRestored(true);

      navigator.serviceWorker?.controller?.postMessage({
        type: 'RAF_WARM_ESSENTIAL_ROUTES',
      });

      if (restoredTimerRef.current) {
        window.clearTimeout(restoredTimerRef.current);
      }

      restoredTimerRef.current = window.setTimeout(() => {
        setConnectionRestored(false);
        restoredTimerRef.current = null;
      }, 3200);
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);

      if (restoredTimerRef.current) {
        window.clearTimeout(restoredTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleOfflineNavigation(event) {
      if (window.navigator.onLine || isModifiedClick(event)) {
        return;
      }

      const element =
        event.target instanceof Element
          ? event.target.closest('a[href]')
          : null;

      if (!element) {
        return;
      }

      if (
        element.hasAttribute('download') ||
        (element.target && element.target !== '_self')
      ) {
        return;
      }

      const destination = new URL(element.href, window.location.href);

      if (destination.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const normalizedPath = normalizePathname(destination.pathname);

      if (OFFLINE_ROUTES.has(normalizedPath)) {
        window.location.assign(
          `${normalizedPath}${destination.search}${destination.hash}`
        );
        return;
      }

      const currentLocale = getLocaleFromPathname(
        window.location.pathname
      );

      const fallbackUrl = new URL('/offline.html', window.location.origin);
      fallbackUrl.searchParams.set('lang', currentLocale);
      fallbackUrl.searchParams.set(
        'target',
        `${destination.pathname}${destination.search}${destination.hash}`
      );

      window.location.assign(fallbackUrl.href);
    }

    document.addEventListener('click', handleOfflineNavigation, true);

    return () => {
      document.removeEventListener(
        'click',
        handleOfflineNavigation,
        true
      );
    };
  }, []);

  if (online && !connectionRestored) {
    return null;
  }

  const isRussian = locale === 'ru';

  return (
    <aside
      className={styles.status}
      data-online={online ? 'true' : 'false'}
      role="status"
      aria-live="polite"
    >
      <span className={styles.indicator} aria-hidden="true" />

      <div className={styles.copy}>
        <strong>
          {online
            ? isRussian
              ? 'Подключение восстановлено'
              : 'Connection restored'
            : isRussian
              ? 'Нет подключения к интернету'
              : 'No internet connection'}
        </strong>

        {!online && (
          <span>
            {isRussian
              ? 'Офлайн доступны «От скуки» и «Политика».'
              : 'AntiBoredom and Policy remain available offline.'}
          </span>
        )}
      </div>

      {!online && (
        <nav className={styles.actions} aria-label="Offline sections">
          <a href={isRussian ? '/bored_ru' : '/bored'}>
            {isRussian ? 'От скуки' : 'AntiBoredom'}
          </a>
          <a
            href={
              isRussian
                ? '/privacy_policy_ru'
                : '/privacy_policy'
            }
          >
            {isRussian ? 'Политика' : 'Policy'}
          </a>
        </nav>
      )}
    </aside>
  );
}
