'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Globe } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import Navbar from '@/components/Navbar';
import InstallAppButton from '@/components/pwa/InstallAppButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LANGUAGE_ROUTE_MAP = {
  '/': { ru: '/main_ru', en: '/main' },
  '/main': { ru: '/main_ru', en: '/main' },
  '/main_ru': { ru: '/main_ru', en: '/main' },
  '/studio': { ru: '/studio_ru', en: '/studio' },
  '/studio_ru': { ru: '/studio_ru', en: '/studio' },
  '/projects': { ru: '/projects_ru', en: '/projects' },
  '/projects_ru': { ru: '/projects_ru', en: '/projects' },
  '/contacts': { ru: '/contacts_ru', en: '/contacts' },
  '/contacts_ru': { ru: '/contacts_ru', en: '/contacts' },
  '/privacy_policy': { ru: '/privacy_policy_ru', en: '/privacy_policy' },
  '/privacy_policy_ru': { ru: '/privacy_policy_ru', en: '/privacy_policy' },
  '/bored': { ru: '/bored_ru', en: '/bored' },
  '/bored_ru': { ru: '/bored_ru', en: '/bored' },
};

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '');
}

function getCurrentLanguage(pathname) {
  return normalizePathname(pathname).endsWith('_ru') ? 'ru' : 'en';
}

function getLocalizedPath(pathname, targetLanguage) {
  const normalizedPathname = normalizePathname(pathname);
  const mappedRoute = LANGUAGE_ROUTE_MAP[normalizedPathname];

  if (mappedRoute) {
    return mappedRoute[targetLanguage];
  }

  const segments = normalizedPathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return targetLanguage === 'ru' ? '/main_ru' : '/main';
  }

  const [firstSegment, ...restSegments] = segments;
  const localizedFirstSegment = targetLanguage === 'ru'
    ? (firstSegment.endsWith('_ru') ? firstSegment : `${firstSegment}_ru`)
    : firstSegment.replace(/_ru$/, '');

  return `/${[localizedFirstSegment, ...restSegments].join('/')}`;
}

export default function Header() {
  const { setTheme } = useTheme();
  const pathname = usePathname() || '/main_ru';
  const searchParams = useSearchParams();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [isLanguagePending, startLanguageTransition] = useTransition();
  const preservedScrollYRef = useRef(null);

  const normalizedPathname = normalizePathname(pathname);
  const currentLanguage = getCurrentLanguage(normalizedPathname);
  const isRussian = currentLanguage === 'ru';

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  useEffect(() => {
    const updateHeaderState = () => setScrolled(window.scrollY > 18);

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    return () => window.removeEventListener('scroll', updateHeaderState);
  }, []);

  useEffect(() => {
    const preservedScrollY = preservedScrollYRef.current;

    if (preservedScrollY === null) {
      return undefined;
    }

    let secondFrameId = 0;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        window.scrollTo({ top: preservedScrollY, left: 0, behavior: 'instant' });
        preservedScrollYRef.current = null;
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
    };
  }, [normalizedPathname]);

  const navLinks = useMemo(() => (
    isRussian
      ? [
          { label: 'Главная', href: '/main_ru' },
          { label: 'Студия', href: '/studio_ru' },
          { label: 'Проекты', href: '/projects_ru' },
          { label: 'Контакты', href: '/contacts_ru' },
          { label: 'Политика', href: '/privacy_policy_ru' },
          { label: 'От скуки', href: '/bored_ru' },
        ]
      : [
          { label: 'Home', href: '/main' },
          { label: 'Studio', href: '/studio' },
          { label: 'Projects', href: '/projects' },
          { label: 'Contacts', href: '/contacts' },
          { label: 'Policy', href: '/privacy_policy' },
          { label: 'AntiBoredom', href: '/bored' },
        ]
  ), [isRussian]);

  const toggleLanguage = () => {
    if (isLanguagePending) {
      return;
    }

    const targetLanguage = isRussian ? 'en' : 'ru';
    const localizedPath = getLocalizedPath(normalizedPathname, targetLanguage);
    const queryString = searchParams.toString();
    const destination = queryString ? `${localizedPath}?${queryString}` : localizedPath;

    preservedScrollYRef.current = window.scrollY;

    startLanguageTransition(() => {
      router.replace(destination, { scroll: false });
    });
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[1000] px-2.5 pt-2.5 transition-[padding,transform] duration-500 sm:px-5 sm:pt-3',
        scrolled && 'pt-1.5 sm:pt-2'
      )}
    >
      <svg
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="raf-navbar-liquid" x="-30%" y="-90%" width="160%" height="280%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.06"
              numOctaves="2"
              seed="17"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="1.1" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feSpecularLighting
              in="softNoise"
              surfaceScale="3"
              specularConstant="0.55"
              specularExponent="20"
              lightingColor="#ffffff"
              result="specular"
            >
              <feDistantLight azimuth="225" elevation="48" />
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularCut" />
            <feBlend in="displaced" in2="specularCut" mode="screen" />
          </filter>
        </defs>
      </svg>

      <div
        className={cn(
          [
            'relative mx-auto isolate flex min-h-[3.5rem] w-full max-w-[96rem] items-center gap-2 overflow-visible rounded-[1.45rem]',
            'border border-white/18 bg-white/[0.055] px-2.5 text-white',
            'shadow-[0_1rem_3.5rem_rgba(0,0,0,.24),inset_0_1px_0_rgba(255,255,255,.28),inset_0_-1px_0_rgba(255,255,255,.06)]',
            'backdrop-blur-[30px] backdrop-saturate-[185%] backdrop-contrast-[108%]',
            'transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500',
            'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]',
            'before:bg-[linear-gradient(135deg,rgba(255,255,255,.13),rgba(255,255,255,.035)_38%,rgba(255,255,255,.015)_62%,rgba(255,255,255,.09))]',
            'after:pointer-events-none after:absolute after:inset-x-[10%] after:top-0 after:-z-10 after:h-px',
            'after:bg-gradient-to-r after:from-transparent after:via-white/65 after:to-transparent',
            'sm:min-h-16 sm:rounded-[1.75rem] sm:px-4 lg:gap-3 xl:px-5',
          ],
          scrolled && [
            'border-white/22 bg-white/[0.075]',
            'shadow-[0_1.4rem_4.5rem_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.3),inset_0_-1px_0_rgba(255,255,255,.07)]',
          ]
        )}
      >
        <Link
          href={isRussian ? '/main_ru' : '/main'}
          scroll={false}
          className="relative z-20 min-w-0 shrink text-[clamp(.62rem,2.8vw,.82rem)] font-semibold tracking-[-0.045em] text-white sm:text-sm xl:text-base"
          aria-label="Raf Console Studio"
        >
          <span className="whitespace-nowrap">Raf&lt;/&gt;Console</span>{' '}
          <span className="whitespace-nowrap font-medium text-[#ad8a70]">Studio</span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <Navbar
            variant="desktop"
            navLinks={navLinks}
            isRussian={isRussian}
            pathname={normalizedPathname}
          />
        </div>

        <div className="relative z-20 ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden xl:block">
            <InstallAppButton locale={currentLanguage} />
          </div>
          <div className="hidden lg:block xl:hidden">
            <InstallAppButton locale={currentLanguage} compact />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            disabled={isLanguagePending}
            className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.05] text-white/75 hover:bg-white/15 hover:text-white disabled:pointer-events-none disabled:opacity-55 sm:h-10 sm:w-10"
            aria-label={isRussian ? 'Switch to English' : 'Переключить на русский'}
            aria-busy={isLanguagePending}
          >
            <Globe
              className={cn(
                'h-4 w-4 transition-transform duration-500',
                isLanguagePending && 'rotate-180'
              )}
            />
          </Button>

          <Navbar
            variant="mobile"
            navLinks={navLinks}
            isRussian={isRussian}
            pathname={normalizedPathname}
          />
        </div>
      </div>
    </header>
  );
}
