'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    usePathname,
    useSearchParams,
} from 'next/navigation';

import styles from './NavigationLoadingProvider.module.css';

const NavigationLoadingContext =
    createContext(null);

function waitForPaint() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}

function isModifiedEvent(event) {
    return (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    );
}

function isInternalNavigationLink(link) {
    if (!(link instanceof HTMLAnchorElement)) {
        return false;
    }

    if (
        link.target === '_blank' ||
        link.hasAttribute('download')
    ) {
        return false;
    }

    const rawHref = link.getAttribute('href');

    if (
        !rawHref ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:')
    ) {
        return false;
    }

    let destination;

    try {
        destination = new URL(
            link.href,
            window.location.href,
        );
    } catch {
        return false;
    }

    return (
        destination.origin ===
        window.location.origin
    );
}

export function useNavigationLoading() {
    const context = useContext(
        NavigationLoadingContext,
    );

    if (!context) {
        throw new Error(
            'useNavigationLoading must be used inside NavigationLoadingProvider',
        );
    }

    return context;
}

export default function NavigationLoadingProvider({
                                                      children,
                                                  }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] =
        useState(false);

    const navigationIdRef = useRef(0);
    const timeoutRef = useRef(null);
    const mountedRef = useRef(false);

    const startLoading = useCallback(() => {
        navigationIdRef.current += 1;

        window.clearTimeout(
            timeoutRef.current,
        );

        setIsLoading(true);

        /*
         * Защита от зависшего loader при ошибке маршрута.
         */
        timeoutRef.current =
            window.setTimeout(() => {
                setIsLoading(false);
            }, 12000);

        return navigationIdRef.current;
    }, []);

    const finishLoading =
        useCallback(async () => {
            const currentNavigationId =
                navigationIdRef.current;

            /*
             * Ждём, пока новый экран:
             * 1. попадёт в DOM;
             * 2. завершит layout;
             * 3. будет нарисован браузером.
             */
            await waitForPaint();

            /*
             * Даём тяжёлым клиентским компонентам
             * завершить первый layout.
             */
            await new Promise((resolve) => {
                window.setTimeout(resolve, 80);
            });

            if (
                currentNavigationId !==
                navigationIdRef.current
            ) {
                return;
            }

            window.clearTimeout(
                timeoutRef.current,
            );

            setIsLoading(false);
        }, []);

    /*
     * После фактической смены маршрута
     * закрываем loader только после paint.
     */
    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }

        finishLoading();
    }, [
        pathname,
        searchParams,
        finishLoading,
    ]);

    /*
     * Loader запускается сразу при pointerdown,
     * ещё до того, как Next.js начнёт переход.
     *
     * Капля навбара при этом уже перемещается,
     * а старый экран сразу закрывается loader-ом.
     */
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (
                event.button !== 0 ||
                isModifiedEvent(event)
            ) {
                return;
            }

            const link =
                event.target?.closest?.('a');

            if (
                !isInternalNavigationLink(link)
            ) {
                return;
            }

            const destination = new URL(
                link.href,
                window.location.href,
            );

            const currentUrl =
                `${window.location.pathname}${window.location.search}`;

            const destinationUrl =
                `${destination.pathname}${destination.search}`;

            if (
                destinationUrl === currentUrl
            ) {
                return;
            }

            startLoading();
        };

        document.addEventListener(
            'pointerdown',
            handlePointerDown,
            true,
        );

        return () => {
            document.removeEventListener(
                'pointerdown',
                handlePointerDown,
                true,
            );
        };
    }, [startLoading]);

    useEffect(() => {
        return () => {
            window.clearTimeout(
                timeoutRef.current,
            );
        };
    }, []);

    const value = useMemo(
        () => ({
            isLoading,
            startLoading,
            finishLoading,
        }),
        [
            isLoading,
            startLoading,
            finishLoading,
        ],
    );

    return (
        <NavigationLoadingContext.Provider
            value={value}
        >
            {children}

            <div
                className={`${styles.routeLoader} ${
                    isLoading
                        ? styles.routeLoaderVisible
                        : ''
                }`}
                aria-hidden={!isLoading}
                aria-busy={isLoading}
            >
                <div
                    className={styles.loaderBackdrop}
                />

                <div className={styles.loaderContent}>
                    <div
                        className={styles.liquidLoader}
                        aria-hidden="true"
                    >
            <span
                className={styles.loaderDrop}
            />

                        <span
                            className={styles.loaderRing}
                        />

                        <span
                            className={styles.loaderRing}
                        />

                        <span
                            className={styles.loaderRing}
                        />
                    </div>

                    <span className={styles.loaderText}>
            Загрузка
          </span>
                </div>
            </div>
        </NavigationLoadingContext.Provider>
    );
}