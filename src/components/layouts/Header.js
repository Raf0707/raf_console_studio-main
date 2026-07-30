'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Globe } from 'lucide-react';
import {
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from 'react';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import styles from '@/components/Header.module.css';

const LANGUAGE_ANIMATION_DURATION = 360;

const LANGUAGE_ROUTE_MAP = {
    '/': {
        ru: '/main_ru',
        en: '/main',
    },

    '/main': {
        ru: '/main_ru',
        en: '/main',
    },

    '/main_ru': {
        ru: '/main_ru',
        en: '/main',
    },

    '/studio': {
        ru: '/studio_ru',
        en: '/studio',
    },

    '/studio_ru': {
        ru: '/studio_ru',
        en: '/studio',
    },

    '/projects': {
        ru: '/projects_ru',
        en: '/projects',
    },

    '/projects_ru': {
        ru: '/projects_ru',
        en: '/projects',
    },

    '/contacts': {
        ru: '/contacts_ru',
        en: '/contacts',
    },

    '/contacts_ru': {
        ru: '/contacts_ru',
        en: '/contacts',
    },

    '/privacy_policy': {
        ru: '/privacy_policy_ru',
        en: '/privacy_policy',
    },

    '/privacy_policy_ru': {
        ru: '/privacy_policy_ru',
        en: '/privacy_policy',
    },

    '/bored': {
        ru: '/bored_ru',
        en: '/bored',
    },

    '/bored_ru': {
        ru: '/bored_ru',
        en: '/bored',
    },

    /*'/settings': {
        ru: '/settings_ru',
        en: '/settings',
    },

    '/settings_ru': {
        ru: '/settings_ru',
        en: '/settings',
    },*/
};

function normalizePathname(pathname) {
    if (!pathname || pathname === '/') {
        return '/';
    }

    return pathname.replace(/\/+$/, '');
}

function getCurrentLanguage(pathname) {
    const normalizedPathname =
        normalizePathname(pathname);

    return normalizedPathname.endsWith('_ru')
        ? 'ru'
        : 'en';
}

function getLocalizedPath(
    pathname,
    targetLanguage
) {
    const normalizedPathname =
        normalizePathname(pathname);

    const mappedRoute =
        LANGUAGE_ROUTE_MAP[normalizedPathname];

    if (mappedRoute) {
        return mappedRoute[targetLanguage];
    }

    const segments = normalizedPathname
        .split('/')
        .filter(Boolean);

    if (segments.length === 0) {
        return targetLanguage === 'ru'
            ? '/main_ru'
            : '/main';
    }

    const [
        firstSegment,
        ...restSegments
    ] = segments;

    const localizedFirstSegment =
        targetLanguage === 'ru'
            ? firstSegment.endsWith('_ru')
                ? firstSegment
                : `${firstSegment}_ru`
            : firstSegment.replace(/_ru$/, '');

    return `/${[
        localizedFirstSegment,
        ...restSegments,
    ].join('/')}`;
}

export default function Header() {
    const { setTheme } = useTheme();

    const pathname =
        usePathname() || '/main_ru';

    const searchParams =
        useSearchParams();

    const router =
        useRouter();

    const [
        scrolled,
        setScrolled,
    ] = useState(false);

    const [
        isLanguageAnimating,
        setIsLanguageAnimating,
    ] = useState(false);

    const [
        isLanguagePending,
        startLanguageTransition,
    ] = useTransition();

    const preservedScrollYRef =
        useRef(null);

    const languageTimerRef =
        useRef(null);

    const normalizedPathname =
        normalizePathname(pathname);

    const currentLanguage =
        getCurrentLanguage(
            normalizedPathname
        );

    const isRussian =
        currentLanguage === 'ru';

    const languageButtonDisabled =
        isLanguageAnimating ||
        isLanguagePending;

    useEffect(() => {
        setTheme('dark');
    }, [setTheme]);

    useEffect(() => {
        const updateHeaderState = () => {
            setScrolled(
                window.scrollY > 18
            );
        };

        updateHeaderState();

        window.addEventListener(
            'scroll',
            updateHeaderState,
            {
                passive: true,
            }
        );

        return () => {
            window.removeEventListener(
                'scroll',
                updateHeaderState
            );
        };
    }, []);

    useEffect(() => {
        return () => {
            if (
                languageTimerRef.current !== null
            ) {
                window.clearTimeout(
                    languageTimerRef.current
                );

                languageTimerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const preservedScrollY =
            preservedScrollYRef.current;

        if (preservedScrollY === null) {
            return undefined;
        }

        let firstFrameId;
        let secondFrameId;

        firstFrameId =
            window.requestAnimationFrame(
                () => {
                    secondFrameId =
                        window.requestAnimationFrame(
                            () => {
                                window.scrollTo({
                                    top: preservedScrollY,
                                    left: 0,
                                    behavior: 'instant',
                                });

                                preservedScrollYRef.current =
                                    null;
                            }
                        );
                }
            );

        return () => {
            window.cancelAnimationFrame(
                firstFrameId
            );

            if (secondFrameId) {
                window.cancelAnimationFrame(
                    secondFrameId
                );
            }
        };
    }, [normalizedPathname]);

    const navLinks = useMemo(() => {
        if (isRussian) {
            return [
                {
                    label: 'Главная',
                    href: '/main_ru',
                },
                {
                    label: 'Студия',
                    href: '/studio_ru',
                },
                {
                    label: 'Проекты',
                    href: '/projects_ru',
                },
                {
                    label: 'Контакты',
                    href: '/contacts_ru',
                },
                {
                    label: 'Политика',
                    href: '/privacy_policy_ru',
                },
                {
                    label: 'От скуки',
                    href: '/bored_ru',
                },
                /*{
                    label: 'Настройки',
                    href: '/settings_ru',
                },*/
            ];
        }

        return [
            {
                label: 'Home',
                href: '/main',
            },
            {
                label: 'Studio',
                href: '/studio',
            },
            {
                label: 'Projects',
                href: '/projects',
            },
            {
                label: 'Contacts',
                href: '/contacts',
            },
            {
                label: 'Policy',
                href: '/privacy_policy',
            },
            {
                label: 'AntiBoredom',
                href: '/bored',
            },
            /*{
                label: 'Settings',
                href: '/settings',
            },*/
        ];
    }, [isRussian]);

    const performLanguageNavigation =
        useCallback(() => {
            const targetLanguage =
                isRussian ? 'en' : 'ru';

            const localizedPath =
                getLocalizedPath(
                    normalizedPathname,
                    targetLanguage
                );

            const queryString =
                searchParams.toString();

            const destination =
                queryString
                    ? `${localizedPath}?${queryString}`
                    : localizedPath;

            preservedScrollYRef.current =
                window.scrollY;

            startLanguageTransition(() => {
                router.replace(
                    destination,
                    {
                        scroll: false,
                    }
                );
            });
        }, [
            isRussian,
            normalizedPathname,
            router,
            searchParams,
        ]);

    const toggleLanguage = () => {
        if (languageButtonDisabled) {
            return;
        }

        if (
            languageTimerRef.current !== null
        ) {
            window.clearTimeout(
                languageTimerRef.current
            );

            languageTimerRef.current = null;
        }

        /*
         * Сначала запускаем вращение глобуса.
         *
         * Переход выполняется только после завершения
         * анимации, поэтому смена маршрута не может
         * уничтожить вращение.
         */
        setIsLanguageAnimating(true);

        languageTimerRef.current =
            window.setTimeout(() => {
                languageTimerRef.current = null;

                setIsLanguageAnimating(false);

                performLanguageNavigation();
            }, LANGUAGE_ANIMATION_DURATION);
    };

    return (
        <header
            className={cn(
                [
                    'fixed inset-x-0 top-0 z-[1000]',
                    'px-3 pt-3',
                    'transition-[padding,transform]',
                    'duration-500',
                    'sm:px-5',
                ],
                scrolled && 'pt-2'
            )}
        >
            <svg
                className="
          pointer-events-none
          absolute
          h-0
          w-0
          overflow-hidden
        "
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <filter
                        id="raf-navbar-liquid"
                        x="-30%"
                        y="-90%"
                        width="160%"
                        height="280%"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.015 0.06"
                            numOctaves="2"
                            seed="17"
                            result="noise"
                        />

                        <feGaussianBlur
                            in="noise"
                            stdDeviation="1.1"
                            result="softNoise"
                        />

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
                            <feDistantLight
                                azimuth="225"
                                elevation="48"
                            />
                        </feSpecularLighting>

                        <feComposite
                            in="specular"
                            in2="SourceAlpha"
                            operator="in"
                            result="specularCut"
                        />

                        <feBlend
                            in="displaced"
                            in2="specularCut"
                            mode="screen"
                        />
                    </filter>
                </defs>
            </svg>

            <div
                data-raf-header-shell="true"
                className={cn(
                    [
                        'raf-liquid-header-panel',
                        'relative mx-auto',
                        'isolate overflow-hidden',
                        'flex min-h-16 w-full',
                        'max-w-[96rem]',
                        'items-center justify-between',
                        'gap-2',
                        'rounded-[1.75rem]',
                        'border border-white/18',
                        'bg-white/[0.018]',
                        'px-3',
                        'text-white',

                        'shadow-[0_1rem_3.5rem_rgba(0,0,0,.24),inset_0_1px_0_rgba(255,255,255,.28),inset_0_-1px_0_rgba(255,255,255,.06)]',


                        'transition-[background-color,border-color,box-shadow]',
                        'duration-500',

                        'before:pointer-events-none',
                        'before:absolute',
                        'before:inset-0',
                        'before:-z-10',
                        'before:rounded-[inherit]',
                        'before:bg-[linear-gradient(135deg,rgba(255,255,255,.13),rgba(255,255,255,.035)_38%,rgba(255,255,255,.015)_62%,rgba(255,255,255,.09))]',

                        'after:pointer-events-none',
                        'after:absolute',
                        'after:inset-x-[10%]',
                        'after:top-0',
                        'after:-z-10',
                        'after:h-px',
                        'after:bg-gradient-to-r',
                        'after:from-transparent',
                        'after:via-white/65',
                        'after:to-transparent',

                        'sm:px-4',
                        'lg:gap-3',
                        'xl:px-5',
                    ],
                    scrolled && [
                        'border-white/22',
                        'bg-white/[0.026]',
                        'shadow-[0_1.4rem_4.5rem_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.3),inset_0_-1px_0_rgba(255,255,255,.07)]',
                    ]
                )}
            >
                <Link
                    href={
                        isRussian
                            ? '/main_ru'
                            : '/main'
                    }
                    scroll={false}
                    className="
            relative
            z-20
            shrink-0
            whitespace-nowrap
            text-xs
            font-semibold
            tracking-[-0.04em]
            text-white
            sm:text-sm
            xl:text-base
          "
                >
                    Raf&lt;/&gt;Console{' '}

                    <span
                        className="
              hidden
              font-normal
              text-white/45
              2xl:inline
            "
                    >
            Studio
          </span>
                </Link>

                <Navbar
                    navLinks={navLinks}
                    isRussian={isRussian}
                    pathname={normalizedPathname}
                />

                <div
                    className="
            relative
            z-20
            flex
            shrink-0
            items-center
          "
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        disabled={languageButtonDisabled}
                        className={cn(
                            styles.languageButton,
                            isLanguageAnimating &&
                            styles.languageButtonAnimating,
                            [
                                'h-10',
                                'w-10',
                                'rounded-full',
                                'border',
                                'border-white/10',
                                'bg-white/[0.05]',
                                'text-white/75',
                                'hover:bg-white/15',
                                'hover:text-white',
                                'disabled:opacity-55',
                            ]
                        )}
                        aria-label={
                            isRussian
                                ? 'Switch to English'
                                : 'Переключить на русский'
                        }
                        aria-busy={
                            languageButtonDisabled
                        }
                    >
            <span
                className={
                    styles.languageIconContainer
                }
            >
              <Globe
                  className={
                      styles.languageGlobe
                  }
              />
            </span>
                    </Button>
                </div>
            </div>
        </header>
    );
}