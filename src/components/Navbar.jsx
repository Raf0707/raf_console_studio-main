'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import {
  ArrowDown,
  ArrowUp,
  Menu,
  X,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

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
  const router = useRouter();
  const normalizedPathname = normalizePathname(pathname);
  const foundRouteIndex = navLinks.findIndex((link) => (
    isActivePath(normalizedPathname, link.href)
  ));
  const routeIndex = foundRouteIndex >= 0 ? foundRouteIndex : 0;

  const [visualIndex, setVisualIndex] = useState(routeIndex);
  const [impactId, setImpactId] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileFabPortalReady, setMobileFabPortalReady] = useState(false);
  const [mobileFabPosition, setMobileFabPosition] = useState({
    right: 16,
    bottom: 16,
    viewportWidth: 0,
    viewportHeight: 0,
  });

  const [mobileSelectedIndex, setMobileSelectedIndex] = useState(routeIndex);
  const [mobileTransitionIndex, setMobileTransitionIndex] = useState(null);
  const [mobileImpactId, setMobileImpactId] = useState(0);

  const mobileTransitionTimerRef = useRef(null);

  useEffect(() => {
    setVisualIndex(routeIndex);

    if (!mobileOpen) {
      setMobileSelectedIndex(routeIndex);
      setMobileTransitionIndex(null);
    }
  }, [mobileOpen, routeIndex]);

  useEffect(() => {
    return () => {
      if (mobileTransitionTimerRef.current) {
        window.clearTimeout(mobileTransitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setMobileFabPortalReady(true);

    const updateMobileFabPosition = () => {
      const viewport = window.visualViewport;

      const viewportWidth = Math.max(
        1,
        Math.round(viewport?.width ?? window.innerWidth),
      );
      const viewportHeight = Math.max(
        1,
        Math.round(viewport?.height ?? window.innerHeight),
      );

      const viewportOffsetLeft = Math.round(
        viewport?.offsetLeft ?? 0,
      );
      const viewportOffsetTop = Math.round(
        viewport?.offsetTop ?? 0,
      );

      const right = Math.max(
        16,
        Math.round(
          window.innerWidth
          - (viewportOffsetLeft + viewportWidth)
          + 16,
        ),
      );

      const bottom = Math.max(
        16,
        Math.round(
          window.innerHeight
          - (viewportOffsetTop + viewportHeight)
          + 16,
        ),
      );

      setMobileFabPosition((current) => {
        if (
          current.right === right
          && current.bottom === bottom
          && current.viewportWidth === viewportWidth
          && current.viewportHeight === viewportHeight
        ) {
          return current;
        }

        return {
          right,
          bottom,
          viewportWidth,
          viewportHeight,
        };
      });
    };

    updateMobileFabPosition();

    window.addEventListener(
      'resize',
      updateMobileFabPosition,
      { passive: true },
    );
    window.addEventListener(
      'orientationchange',
      updateMobileFabPosition,
      { passive: true },
    );

    window.visualViewport?.addEventListener(
      'resize',
      updateMobileFabPosition,
      { passive: true },
    );
    window.visualViewport?.addEventListener(
      'scroll',
      updateMobileFabPosition,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        'resize',
        updateMobileFabPosition,
      );
      window.removeEventListener(
        'orientationchange',
        updateMobileFabPosition,
      );
      window.visualViewport?.removeEventListener(
        'resize',
        updateMobileFabPosition,
      );
      window.visualViewport?.removeEventListener(
        'scroll',
        updateMobileFabPosition,
      );
    };
  }, []);

  const activateDrop = (index) => {
    setVisualIndex(index);
    setImpactId((currentImpactId) => currentImpactId + 1);
  };

  const changeMobileSelection = (direction) => {
    if (
        mobileTransitionIndex !== null
        || navLinks.length === 0
    ) {
      return;
    }

    const nextIndex = (
        mobileSelectedIndex
        + direction
        + navLinks.length
    ) % navLinks.length;

    /*
     * Новый пункт становится активным сразу. Поэтому линза, блики и
     * каустика начинают движение одновременно с деформацией карточки,
     * без позднего «перезапуска» освещения после таймера.
     */
    setMobileSelectedIndex(nextIndex);
    setMobileTransitionIndex(nextIndex);
    setMobileImpactId((current) => current + 1);

    if (mobileTransitionTimerRef.current) {
      window.clearTimeout(mobileTransitionTimerRef.current);
    }

    mobileTransitionTimerRef.current = window.setTimeout(() => {
      setMobileTransitionIndex(null);
    }, 760);
  };

  const navigateToMobileSelection = () => {
    const selectedLink = navLinks[mobileSelectedIndex];

    if (!selectedLink) {
      return;
    }

    setMobileOpen(false);
    router.push(ensureTrailingSlash(selectedLink.href));
  };

  const handleMobileOpenChange = (open) => {
    setMobileOpen(open);

    if (open) {
      setMobileSelectedIndex(routeIndex);
      setMobileTransitionIndex(null);
    }
  };

  const showDesktop = variant === 'all' || variant === 'desktop';
  const showMobile = variant === 'all' || variant === 'mobile';

  return (
    <>
      {showDesktop && (
        <nav
          data-raf-navbar-shell="true"
          data-raf-native-refraction="true"
          data-raf-shader-ignore="true"
          data-raf-refraction-pointer="true"
          className={styles.desktopNav}
          aria-label={
            isRussian
              ? 'Основная навигация'
              : 'Primary navigation'
          }
          style={{
            '--items-count': navLinks.length,
          }}
        >
          <span
            aria-hidden="true"
            className={styles.navBase}
          />
          <span
            aria-hidden="true"
            data-raf-refraction-target="navbar-shell"
            className={styles.navWarp}
          />
          <span
            aria-hidden="true"
            data-raf-refraction-target="navbar-entry"
            className={styles.navWarpEntry}
          />
          <span
            aria-hidden="true"
            data-raf-refraction-target="navbar-lip"
            className={styles.navWarpLip}
          />
          <span
            aria-hidden="true"
            className={styles.navTint}
          />
          <span
            aria-hidden="true"
            className={styles.navSheen}
          />
          <span
            aria-hidden="true"
            className={styles.navRim}
          />

          <span
            aria-hidden="true"
            className={styles.activeDrop}
            style={{
              '--active-index': visualIndex,
              pointerEvents: 'none',
            }}
          >
            <span
              key={`${visualIndex}-${impactId}`}
              className={[
                styles.dropSurface,
                impactId > 0
                  ? styles.dropSurfaceImpact
                  : '',
              ].filter(Boolean).join(' ')}
            >
              <span className={styles.dropBase} />
              <span
                data-raf-refraction-target="navbar-pill"
                className={styles.dropWarp}
              />
              <span className={styles.dropTint} />
              <span className={styles.dropSheen} />
              <span className={styles.dropRim} />

              <span className={styles.dropHighlight} />
              <span className={styles.dropCaustic} />
              <span className={styles.dropRipple} />
            </span>
          </span>

          {navLinks.map((link, index) => {
            const active = isActivePath(
              normalizedPathname,
              link.href,
            );

            return (
              <Link
                key={link.href}
                href={ensureTrailingSlash(link.href)}
                prefetch
                aria-current={active ? 'page' : undefined}
                onClick={() => activateDrop(index)}
                className={[
                  styles.desktopLink,
                  visualIndex === index
                    ? styles.desktopLinkActive
                    : '',
                ].filter(Boolean).join(' ')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}      {showMobile && (
        <Drawer
          open={mobileOpen}
          onOpenChange={handleMobileOpenChange}
          shouldScaleBackground={false}
        >
          {mobileFabPortalReady && createPortal(
              <DrawerTrigger
                  data-raf-mobile-navigation-fab="true"
                  data-raf-refraction-pointer="true"
                  data-raf-viewport-width={mobileFabPosition.viewportWidth}
                  data-raf-viewport-height={mobileFabPosition.viewportHeight}
                  className={styles.mobileTrigger}
                  style={{
                    '--raf-mobile-fab-right': `${mobileFabPosition.right}px`,
                    '--raf-mobile-fab-bottom': `${mobileFabPosition.bottom}px`,
                  }}
                  aria-label={isRussian ? 'Открыть меню' : 'Open menu'}
                  aria-expanded={mobileOpen}
              >
    <span
        aria-hidden="true"
        className={styles.mobileFabBase}
    />

                <span
                    aria-hidden="true"
                    className={styles.mobileFabTint}
                />

                <span
                    aria-hidden="true"
                    className={styles.mobileFabSheen}
                />

                <span
                    aria-hidden="true"
                    className={styles.mobileFabRim}
                />

                <span className={styles.mobileFabIcon}>
      <Menu aria-hidden="true" />
    </span>

                <span className="sr-only">
      {isRussian ? 'Открыть меню' : 'Open menu'}
    </span>
              </DrawerTrigger>,
              document.body,
          )}

          <DrawerContent
              className={styles.drawerContent}
              data-raf-glass-surface="mobile-drawer"
          >
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
                  const routeActive = isActivePath(
                      normalizedPathname,
                      link.href,
                  );

                  const selected = mobileSelectedIndex === index;
                  const transitioning = mobileTransitionIndex === index;

                  return (
                      <li
                          key={link.href}
                          className={styles.mobileListItem}
                      >
                        <DrawerClose asChild>
                          <Link
                              href={ensureTrailingSlash(link.href)}
                              prefetch
                              aria-current={routeActive ? 'page' : undefined}
                              data-raf-mobile-drawer-item={
                                selected ? 'selected' : 'idle'
                              }
                              data-raf-glass-surface="mobile-navigation-item"
                              onPointerDown={() => {
                                setMobileSelectedIndex(index);
                                setMobileTransitionIndex(null);
                              }}
                              className={[
                                styles.mobileLink,
                                selected ? styles.mobileLinkSelected : '',
                                routeActive ? styles.mobileLinkRouteActive : '',
                                transitioning ? styles.mobileLinkTransitioning : '',
                              ].filter(Boolean).join(' ')}
                          >
            <span
                aria-hidden="true"
                className={styles.mobileItemLens}
            >
              <span className={styles.mobileItemHighlight} />
              <span className={styles.mobileItemCaustic} />
              <span
                  key={`${index}-${mobileImpactId}`}
                  className={styles.mobileItemRipple}
              />
            </span>

                            <span className={styles.mobileLinkLabel}>
              {link.label}
            </span>

                            <span className={styles.mobileLinkNumber}>
              {String(index + 1).padStart(2, '0')}
            </span>
                          </Link>
                        </DrawerClose>
                      </li>
                  );
                })}
              </ul>
              <div className={styles.mobileNavigationControls}>
                <button
                    type="button"
                    className={styles.mobileGoButton}
                    onClick={navigateToMobileSelection}
                    disabled={mobileTransitionIndex !== null}
                >
                  {isRussian ? 'Перейти' : 'Open'}
                </button>

                <div className={styles.mobileArrowButtons}>
                  <button
                      type="button"
                      className={styles.mobileArrowButton}
                      onClick={() => changeMobileSelection(-1)}
                      disabled={mobileTransitionIndex !== null}
                      aria-label={
                        isRussian
                            ? 'Предыдущий пункт меню'
                            : 'Previous menu item'
                      }
                  >
                    <ArrowUp aria-hidden="true" />
                  </button>

                  <button
                      type="button"
                      className={styles.mobileArrowButton}
                      onClick={() => changeMobileSelection(1)}
                      disabled={mobileTransitionIndex !== null}
                      aria-label={
                        isRussian
                            ? 'Следующий пункт меню'
                            : 'Next menu item'
                      }
                  >
                    <ArrowDown aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
