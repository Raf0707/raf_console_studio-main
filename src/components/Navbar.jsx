'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import InstallAppButton from '@/components/pwa/InstallAppButton';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';

import styles from './Navbar.module.css';

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}

function ensureTrailingSlash(href) {
  if (
      !href ||
      href === '/' ||
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
  ) {
    return href;
  }

  const match = href.match(/^([^?#]*)(.*)$/);

  if (!match) {
    return href;
  }

  const pathname = match[1];
  const suffix = match[2];

  return `${pathname.replace(/\/+$/, '')}/${suffix}`;
}

function isActivePath(pathname, href) {
  return normalizePathname(pathname) === normalizePathname(href);
}

export default function Navbar({
  navLinks,
  isRussian,
  pathname,
  variant = 'all',
}) {
  const normalizedPathname = normalizePathname(pathname);
  const foundRouteIndex = navLinks.findIndex((link) => (
    isActivePath(normalizedPathname, link.href)
  ));
  const routeIndex = foundRouteIndex >= 0 ? foundRouteIndex : 0;

  const [visualIndex, setVisualIndex] = useState(routeIndex);
  const [impactId, setImpactId] = useState(0);

  useEffect(() => {
    setVisualIndex(routeIndex);
  }, [routeIndex]);

  const activateDrop = (index) => {
    setVisualIndex(index);
    setImpactId((currentImpactId) => currentImpactId + 1);
  };

  const showDesktop = variant === 'all' || variant === 'desktop';
  const showMobile = variant === 'all' || variant === 'mobile';

  return (
    <>
      {showDesktop && (
        <nav
          className={styles.desktopNav}
          aria-label={isRussian ? 'Основная навигация' : 'Primary navigation'}
          style={{ '--items-count': navLinks.length }}
        >
          <span
            aria-hidden="true"
            className={styles.activeDrop}
            style={{ '--active-index': visualIndex, pointerEvents: 'none' }}
          >
            <span
              key={`${visualIndex}-${impactId}`}
              className={`${styles.dropSurface} ${impactId > 0 ? styles.dropSurfaceImpact : ''}`}
            >
              <span className={styles.dropHighlight} />
              <span className={styles.dropCaustic} />
              <span className={styles.dropRipple} />
            </span>
          </span>

          {navLinks.map((link, index) => {
            const active = isActivePath(normalizedPathname, link.href);

            return (
              <Link
                key={link.href}
                href={ensureTrailingSlash(link.href)}
                prefetch
                aria-current={active ? 'page' : undefined}
                onPointerDown={() => activateDrop(index)}
                onClick={() => activateDrop(index)}
                className={`${styles.desktopLink} ${
                  visualIndex === index ? styles.desktopLinkActive : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      {showMobile && (
        <Drawer>
          <DrawerTrigger
            className={styles.mobileTrigger}
            aria-label={isRussian ? 'Открыть меню' : 'Open menu'}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">
              {isRussian ? 'Открыть меню' : 'Open menu'}
            </span>
          </DrawerTrigger>

          <DrawerContent className={styles.drawerContent}>
            <div className={styles.drawerBody}>
              <div className={styles.drawerHeader}>
                <p className={styles.drawerBrand}>
                  <span>Raf&lt;/&gt;Console</span>{' '}
                  <span>Studio</span>
                </p>

                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white/65 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">
                      {isRussian ? 'Закрыть меню' : 'Close menu'}
                    </span>
                  </Button>
                </DrawerClose>
              </div>

              <InstallAppButton
                locale={isRussian ? 'ru' : 'en'}
                className={styles.drawerInstall}
              />

              <ul className={styles.mobileList}>
                {navLinks.map((link, index) => {
                  const active = isActivePath(normalizedPathname, link.href);

                  return (
                    <li key={link.href}>
                      <DrawerClose asChild>
                        <Link
                            href={ensureTrailingSlash(link.href)}
                          prefetch
                          aria-current={active ? 'page' : undefined}
                          className={`${styles.mobileLink} ${active ? styles.mobileLinkActive : ''}`}
                        >
                          <span>{link.label}</span>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                        </Link>
                      </DrawerClose>
                    </li>
                  );
                })}
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
