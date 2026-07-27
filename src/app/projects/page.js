'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from 'react';
import './ProjectsPage.css';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Globe2,
    MonitorSmartphone,
    Sparkles,
    Star,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                PROJECT DATA                                */
/* -------------------------------------------------------------------------- */

const publishedApps = [
    {
        name: 'Settings',
        description: 'Quick access to essential device system settings.',
        category: 'tools',
        rating: '2.8',
        url: 'https://www.rustore.ru/catalog/app/raf.console.settings',
    },
    {
        name: 'PDF Reader',
        description: 'A lightweight and convenient PDF document viewer.',
        category: 'tools',
        rating: '2.7',
        url: 'https://www.rustore.ru/catalog/app/raf.console.pdfreader',
    },
    {
        name: 'Quran with Tajweed',
        description: 'The Quran with Tajweed and Al-Muntakhab Al-Azhar Tafsir.',
        category: 'islam',
        rating: '4.5',
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.qurantajweed',
    },
    {
        name: 'Schulte Tables',
        description: 'Exercises for attention, memory, and reading speed.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.shultetable',
    },
    {
        name: 'RafBook',
        description: 'A convenient e-book reader with advanced features.',
        category: 'tools',
        rating: '4.5',
        url: 'https://www.rustore.ru/catalog/app/raf.console.chitalka',
    },
    {
        name: 'Mirror',
        description: 'A minimalist pocket mirror for Android.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.mirror',
    },
    {
        name: 'Memory Trainer',
        description: 'Exercises for improving memory and concentration.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.tablememory',
    },
    {
        name: 'Dua for Wealth',
        description: '32 duas for spiritual and material well-being.',
        category: 'islam',
        rating: '5.0',
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.duaforrichness',
    },
    {
        name: 'Salavat',
        description: 'Salawat from well-known Islamic books and collections.',
        category: 'islam',
        rating: '4.5',
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.salavat',
    },
    {
        name: 'Al-Istighfar',
        description: 'Istighfar from the Quran and authentic hadiths.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.alistigfar',
    },
    {
        name: 'Qalam Sharif',
        description: 'Audio interpretation of the Quran with Russian commentary.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.qalamsharifaudio',
    },
    {
        name: 'Quran in 7 Hours',
        description: 'A complete Quran audio recitation by Ahmad Diban.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.quran7hours',
    },
    {
        name: 'Al Asma Ul Husna',
        description: 'The 99 beautiful names of Allah with translations.',
        category: 'islam',
        rating: '4.7',
        url: 'https://www.rustore.ru/catalog/app/ru.tabiin.alasmaulhusna',
    },
    {
        name: 'Quranic Dictionary',
        description: 'Quranic words with translations and detailed analysis.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.qurandict',
    },
    {
        name: 'Zickreee',
        description: 'Dhikr, duas, salawat, adhkar, and Islamic collections.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.zickreee',
    },
    {
        name: 'Quran Player',
        description: 'Quran audio recitation by Kamil Hazrat Samigullin.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.quranplayer',
    },
    {
        name: 'Dua Ismul Azam',
        description: 'A dua mentioning the Greatest Name of Allah.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.duaismalazam',
    },
    {
        name: 'Quran Ahmad Diban',
        description: 'Quran audio recitation by Ahmad Diban.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.quranahmaddiban',
    },
    {
        name: 'R&R Notes',
        description: 'Convenient notes with dynamic visual themes.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.rrnotes',
    },
    {
        name: 'Flashlight Modify',
        description: 'A flashlight with convenient brightness control.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.flashlight',
    },
    {
        name: 'Saum',
        description: 'A calendar for obligatory and voluntary fasting.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.saum',
    },
    {
        name: 'Tahajud Calculator',
        description: 'Calculation of Duha and Tahajjud prayer times.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.tahajudcalculator',
    },
    {
        name: 'Ramadan',
        description: 'Fasting, suhoor and iftar duas, Qadr, and Tarawih.',
        category: 'islam',
        rating: '5.0',
        url: 'https://www.rustore.ru/catalog/app/ru.tabiin.ramadan',
    },
    {
        name: 'Counters',
        description: 'Universal counters for dhikr, sports, and habits.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/ru.tabiin.counters',
    },
];

const workingApps = [
    {
        name: 'Projects',
        description: 'An application for managing projects, tasks, and notes.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'NataSchool',
        description: 'An online English language school.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Azan.ru',
        description: 'A mobile application for an Islamic information portal.',
        platforms: ['android', 'ios'],
        category: 'islam',
    },
    {
        name: 'Irayganat',
        description: 'An online store for Muslim clothing.',
        platforms: ['android', 'ios'],
        category: 'islam',
    },
    {
        name: 'RafBook',
        description: 'A new-generation multilingual e-book reader.',
        platforms: ['ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Notebook',
        description: 'Notes, lists, and convenient information organization.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Raf</>Console Studio Blog',
        description: 'The studio blog application with projects and publications.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Liven Energy',
        description: 'A mobile service for an energy company.',
        platforms: ['android'],
        category: 'tools',
    },
    {
        name: 'Darul Wahda',
        description: 'An application for the Ingush publisher DARUL WAHDA.',
        platforms: ['android', 'ios'],
        category: 'islam',
    },
    {
        name: 'Durusu Shifahiya',
        description:
            'Arabic lessons, flashcards, images, and progressive lesson dialogues.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'islam',
    },
    {
        name: 'ODLAR ÇAY EVİ',
        description: 'A teahouse application with a menu and guest information.',
        platforms: ['android', 'ios'],
        category: 'tools',
    },
    {
        name: 'MediaTrain',
        description: 'An application for generating images and videos.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
];

const publishedSites = [
    {
        name: 'Zickreee',
        description: 'Remembrance of Allah, duas, and Islamic collections.',
        url: 'https://zickreee.onrender.com',
    },
    {
        name: 'Dalail al Khairat',
        description: 'A digital edition of the famous book of salawat.',
        url: 'https://dalail-al-khairat.onrender.com',
    },
    {
        name: 'Rinat Akhmedzhanov',
        description: 'A professional website for a real estate expert.',
        url: 'https://rinat-realty-expert.onrender.com',
    },
    {
        name: 'RinatDom',
        description: 'Construction of modern country houses.',
        url: 'https://rinat-dom.onrender.com',
    },
    {
        name: 'MangoSell',
        description: 'Fresh mango delivery in Moscow and the Moscow Region.',
        url: 'https://mangosell.web.app/',
    },
];

const workingSites = [
    {
        name: 'Irayganat',
        description: 'An online store for Muslim clothing.',
    },
    {
        name: 'Liven Energy',
        description: 'A web service for an energy company.',
    },
    {
        name: 'Darul Wahda',
        description: 'The website of the Ingush publisher DARUL WAHDA.',
    },
    {
        name: 'ODLAR ÇAY EVİ',
        description: 'A teahouse website with a menu and guest information.',
    },
];

/* -------------------------------------------------------------------------- */
/*                                  COMPONENTS                                */
/* -------------------------------------------------------------------------- */

const glassPanel = [
    'border border-white/[0.12]',
    'bg-white/[0.045]',
    'shadow-[0_1.5rem_5rem_-2.5rem_rgba(255,255,255,0.16),0_2rem_6rem_-3rem_rgba(0,0,0,0.95)]',
    'backdrop-blur-[28px]',
    'backdrop-saturate-[115%]',
].join(' ');

function SegmentButton({ options, value, onChange, label }) {
    return (
        <div
            aria-label={label}
            className={`project-segment ${options.length === 2 ? 'project-segment--split' : 'project-segment--scroll'}
                grid min-w-0 gap-1 rounded-[1.35rem]
                border border-white/[0.09]
                bg-black/30 p-1.5 shadow-inner shadow-black/40
            `}
            style={{
                gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
            }}
        >
            {options.map((option) => {
                const active = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`
                            project-segment__button relative isolate min-w-0 overflow-hidden
                            rounded-[1rem] px-3 py-3
                            text-sm font-semibold
                            transition-all duration-500 ease-out
                            focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-white/60
                            ${
                            active
                                ? `
                                        bg-white text-black
                                        shadow-[0_0_2rem_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]
                                    `
                                : `
                                        text-white/55
                                        hover:bg-white/[0.07]
                                        hover:text-white
                                    `
                        }
                        `}
                    >
                        <span className="project-segment__label relative z-10 truncate">
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function formatPlatform(platform) {
    if (platform === 'android') {
        return 'Android';
    }

    if (platform === 'ios') {
        return 'iOS';
    }

    if (platform === 'windows') {
        return 'Windows';
    }

    if (platform === 'macos') {
        return 'macOS';
    }

    return platform;
}

function ProjectCard({ project, type, status }) {
    const cardRef = useRef(null);

    const [ripple, setRipple] = useState(null);
    const [pressed, setPressed] = useState(false);

    const clickable =
        status === 'published' &&
        Boolean(project.url);

    const handlePointerMove = (event) => {
        const card = cardRef.current;

        if (!card) {
            return;
        }

        const rect = card.getBoundingClientRect();

        card.style.setProperty(
            '--pointer-x',
            `${event.clientX - rect.left}px`
        );

        card.style.setProperty(
            '--pointer-y',
            `${event.clientY - rect.top}px`
        );
    };

    const handlePointerDown = (event) => {
        const card = cardRef.current;

        if (!card) {
            return;
        }

        const rect = card.getBoundingClientRect();

        setPressed(true);

        setRipple({
            id: Date.now(),
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const handlePointerUp = () => {
        setPressed(false);
    };

    const Wrapper = clickable ? 'a' : 'article';

    const wrapperProps = clickable
        ? {
            href: project.url,
            target: '_blank',
            rel: 'noreferrer',
        }
        : {};

    return (
        <Wrapper
            {...wrapperProps}
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`
                project-card group relative isolate flex min-h-[19rem]
                overflow-hidden rounded-[2rem]
                border border-white/[0.11]
                bg-[linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.018)_48%,rgba(0,0,0,0.22))]
                p-6 text-left
                shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2rem_5rem_-3rem_rgba(255,255,255,0.12),0_2.5rem_5rem_-2rem_rgba(0,0,0,0.85)]
                backdrop-blur-[26px]
                transition-[transform,border-color,box-shadow,background-color]
                duration-500 ease-out
                hover:-translate-y-2
                hover:border-white/[0.26]
                hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.11),rgba(255,255,255,0.028)_48%,rgba(0,0,0,0.16))]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.23),0_0_3rem_-1.2rem_rgba(255,255,255,0.22),0_3rem_6rem_-2.5rem_rgba(0,0,0,0.96)]
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-white/60
                ${pressed ? 'scale-[0.985]' : 'scale-100'}
                ${clickable ? 'cursor-pointer' : 'cursor-default'}
            `}
            style={{
                '--pointer-x': '50%',
                '--pointer-y': '50%',
            }}
        >
            <span
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0 -z-10
                    opacity-0 transition-opacity duration-500
                    group-hover:opacity-100
                "
                style={{
                    background:
                        'radial-gradient(20rem circle at var(--pointer-x) var(--pointer-y), rgba(255,255,255,0.17), rgba(255,255,255,0.055) 28%, transparent 67%)',
                }}
            />

            <span
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3
                    bg-gradient-to-t from-black/35 via-black/10 to-transparent
                "
            />

            <span
                aria-hidden="true"
                className="
                    pointer-events-none absolute -inset-y-1/2 -left-[80%] -z-10
                    w-[58%] rotate-[18deg]
                    bg-gradient-to-r
                    from-transparent via-white/[0.12] to-transparent
                    blur-md
                    transition-transform duration-[1100ms] ease-out
                    group-hover:translate-x-[410%]
                "
            />

            <span
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-x-[8%] top-0 h-px
                    bg-gradient-to-r
                    from-transparent via-white/55 to-transparent
                    opacity-60 transition-opacity duration-500
                    group-hover:opacity-100
                "
            />

            {ripple && (
                <span
                    key={ripple.id}
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute z-0
                        h-8 w-8 rounded-full
                        border border-white/50 bg-white/[0.12]
                        animate-[project-ripple_850ms_ease-out_forwards]
                    "
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            )}

            <div className="relative z-10 flex w-full flex-col">
                <div className="flex items-start justify-between gap-4">
                    <div
                        className="
                            flex h-12 w-12 shrink-0 items-center justify-center
                            rounded-[1.15rem]
                            border border-white/[0.13]
                            bg-white/[0.055]
                            shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1rem_2rem_-1.4rem_rgba(255,255,255,0.3)]
                            transition-all duration-500
                            group-hover:border-white/[0.3]
                            group-hover:bg-white/[0.1]
                            group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_2rem_-0.8rem_rgba(255,255,255,0.28)]
                        "
                    >
                        {type === 'site' ? (
                            <Globe2 className="h-5 w-5 text-white/75" />
                        ) : (
                            <MonitorSmartphone className="h-5 w-5 text-white/75" />
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {project.rating && (
                            <span
                                className="
                                    inline-flex items-center gap-1.5
                                    rounded-full border border-white/[0.14]
                                    bg-white/[0.06] px-2.5 py-1
                                    text-xs font-bold text-white/72
                                "
                            >
                                <Star className="h-3.5 w-3.5 fill-white/70" />
                                {project.rating}
                            </span>
                        )}

                        {clickable && (
                            <ArrowUpRight
                                className="
                                    h-5 w-5 text-white/30
                                    transition-all duration-500
                                    group-hover:-translate-y-1
                                    group-hover:translate-x-1
                                    group-hover:text-white
                                "
                            />
                        )}
                    </div>
                </div>

                <div className="mt-7">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3
                            className="
                                text-xl font-black tracking-[-0.035em]
                                text-white
                                transition-[text-shadow] duration-500
                                group-hover:[text-shadow:0_0_1.5rem_rgba(255,255,255,0.22)]
                            "
                        >
                            {project.name}
                        </h3>

                        <span
                            className="
                                rounded-full border border-white/[0.1]
                                bg-black/20 px-2.5 py-1
                                text-[0.65rem] font-bold uppercase
                                tracking-[0.14em] text-white/38
                                transition-colors duration-500
                                group-hover:border-white/[0.18]
                                group-hover:text-white/58
                            "
                        >
                            {type === 'site'
                                ? 'Website'
                                : status === 'published'
                                    ? 'Android'
                                    : 'Project'}
                        </span>
                    </div>

                    <p
                        className="
                            mt-3 text-sm leading-6 text-white/55
                            transition-colors duration-500
                            group-hover:text-white/72
                        "
                    >
                        {project.description}
                    </p>
                </div>

                {project.platforms && (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {project.platforms.map((platform) => (
                            <span
                                key={platform}
                                className="
                                    rounded-full border border-white/[0.09]
                                    bg-white/[0.035] px-2.5 py-1
                                    text-xs font-semibold text-white/48
                                    transition-all duration-400
                                    group-hover:border-white/[0.16]
                                    group-hover:bg-white/[0.065]
                                    group-hover:text-white/68
                                "
                            >
                                {formatPlatform(platform)}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                    <span
                        className="
                            inline-flex items-center gap-2
                            text-xs font-bold text-white/42
                            transition-colors duration-500
                            group-hover:text-white/65
                        "
                    >
                        {status === 'published' ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <Clock3 className="h-4 w-4" />
                        )}

                        {status === 'published'
                            ? 'Open project'
                            : 'In development'}
                    </span>

                    <span
                        aria-hidden="true"
                        className="
                            h-px flex-1
                            bg-gradient-to-r
                            from-white/[0.16] to-transparent
                            transition-all duration-700
                            group-hover:from-white/[0.34]
                        "
                    />
                </div>
            </div>
        </Wrapper>
    );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

function ProjectsLoadingState() {
    return (
        <div
            className="projects-loading"
            role="status"
            aria-live="polite"
            aria-label="Loading projects"
        >
            <div
                className="projects-loading__indicator"
                aria-hidden="true"
            >
                <span className="projects-loading__ring projects-loading__ring--outer" />
                <span className="projects-loading__ring projects-loading__ring--middle" />
                <span className="projects-loading__ring projects-loading__ring--inner" />
                <span className="projects-loading__core" />
            </div>

            <h3 className="projects-loading__title">
                Loading projects
            </h3>

            <p className="projects-loading__description">
                Preparing the selected section and checking available projects.
            </p>
        </div>
    );
}

export default function Page() {
    const [section, setSection] = useState('apps');
    const [platform, setPlatform] = useState('android');
    const [category, setCategory] = useState('all');
    const [appStatus, setAppStatus] = useState('published');
    const [siteStatus, setSiteStatus] = useState('published');

    const [isProjectsLoading, setIsProjectsLoading] =
        useState(false);

    const [isFilterPending, startFilterTransition] =
        useTransition();

    const loadingTimerRef = useRef(null);
    const loadingRequestRef = useRef(0);

    useEffect(() => {
        return () => {
            if (loadingTimerRef.current !== null) {
                window.clearTimeout(loadingTimerRef.current);
            }
        };
    }, []);

    const runProjectFilterChange = useCallback((updateState) => {
        /*
         * Каждый новый клик отменяет завершение предыдущей загрузки.
         * Благодаря идентификатору устаревший таймер не сможет
         * вернуть старое состояние интерфейса.
         */
        loadingRequestRef.current += 1;

        const requestId = loadingRequestRef.current;

        if (loadingTimerRef.current !== null) {
            window.clearTimeout(loadingTimerRef.current);
        }

        /*
         * Сначала включаем загрузчик.
         * Панель SegmentButton при этом остаётся смонтированной.
         */
        setIsProjectsLoading(true);

        /*
         * Состояние выбранного сегмента меняем сразу.
         * Именно это состояние является источником истины
         * для выбранной кнопки и стеклянного пузырька.
         */
        updateState();

        /*
         * Расчёт и перерисовку списка выполняем отдельно.
         */
        startFilterTransition(() => {
            loadingTimerRef.current = window.setTimeout(() => {
                if (loadingRequestRef.current !== requestId) {
                    return;
                }

                setIsProjectsLoading(false);
                loadingTimerRef.current = null;
            }, 320);
        });
    }, []);

    const handleSectionChange = useCallback((nextSection) => {
        runProjectFilterChange(() => {
            setSection(nextSection);

            /*
             * При переходе между главными разделами
             * сразу устанавливаем настоящий начальный набор,
             * а не только визуальное положение пузырька.
             */
            if (nextSection === 'apps') {
                setPlatform('android');
                setCategory('all');
                setAppStatus('published');
            } else {
                setSiteStatus('published');
            }
        });
    }, [runProjectFilterChange]);

    const handlePlatformChange = useCallback((nextPlatform) => {
        runProjectFilterChange(() => {
            setPlatform(nextPlatform);
        });
    }, [runProjectFilterChange]);

    const handleCategoryChange = useCallback((nextCategory) => {
        runProjectFilterChange(() => {
            setCategory(nextCategory);
        });
    }, [runProjectFilterChange]);

    const handleAppStatusChange = useCallback((nextStatus) => {
        runProjectFilterChange(() => {
            setAppStatus(nextStatus);
        });
    }, [runProjectFilterChange]);

    const handleSiteStatusChange = useCallback((nextStatus) => {
        runProjectFilterChange(() => {
            setSiteStatus(nextStatus);
        });
    }, [runProjectFilterChange]);

    const visibleProjects = useMemo(() => {
        if (section === 'sites') {
            return siteStatus === 'published'
                ? publishedSites
                : workingSites;
        }

        if (appStatus === 'moderation') {
            return [];
        }

        const source =
            appStatus === 'published'
                ? publishedApps
                : workingApps;

        return source.filter((project) => {
            const platformMatches =
                appStatus === 'published'
                    ? platform === 'android'
                    : project.platforms.includes(platform);

            const categoryMatches =
                category === 'all' ||
                project.category === category;

            return platformMatches && categoryMatches;
        });
    }, [
        section,
        platform,
        category,
        appStatus,
        siteStatus,
    ]);

    const showProjectsLoader =
        isProjectsLoading || isFilterPending;

    const currentStatus =
        section === 'sites'
            ? siteStatus
            : appStatus;

    const sectionTitle =
        section === 'apps'
            ? 'Applications'
            : 'Websites';

    const statusTitle =
        currentStatus === 'published'
            ? 'Published projects'
            : currentStatus === 'moderation'
                ? 'In review'
                : 'Projects in development';

    return (
        <main
            className="projects-page

                bg-transparent pb-24 pt-32 text-white
            "
        >
            <style jsx global>{`
                @keyframes project-ripple {
                    0% {
                        width: 2rem;
                        height: 2rem;
                        opacity: 0.55;
                    }

                    100% {
                        width: 42rem;
                        height: 42rem;
                        opacity: 0;
                    }
                }

                @keyframes monochrome-drift-one {
                    0%,
                    100% {
                        transform: translate3d(-8%, -4%, 0) scale(1);
                        opacity: 0.18;
                    }

                    50% {
                        transform: translate3d(11%, 8%, 0) scale(1.16);
                        opacity: 0.28;
                    }
                }

                @keyframes monochrome-drift-two {
                    0%,
                    100% {
                        transform: translate3d(8%, 6%, 0) scale(1.05);
                        opacity: 0.13;
                    }

                    50% {
                        transform: translate3d(-12%, -7%, 0) scale(1.22);
                        opacity: 0.24;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        scroll-behavior: auto !important;
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-0 -z-30
                    opacity-[0.055]
                    [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)]
                    [background-size:4.5rem_4.5rem]
                    [mask-image:linear-gradient(to_bottom,black,transparent_92%)]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute -left-[18rem] top-[5rem] -z-20
                    h-[42rem] w-[42rem] rounded-full
                    bg-white/[0.12] blur-[10rem]
                    animate-[monochrome-drift-one_16s_ease-in-out_infinite]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute -right-[20rem] top-[28rem] -z-20
                    h-[46rem] w-[46rem] rounded-full
                    bg-white/[0.09] blur-[11rem]
                    animate-[monochrome-drift-two_19s_ease-in-out_infinite]
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute left-[25%] top-[68%] -z-20
                    h-[32rem] w-[32rem] rounded-full
                    bg-white/[0.055] blur-[9rem]
                    animate-[monochrome-drift-one_22s_ease-in-out_infinite_reverse]
                "
            />

            <section className="projects-shell mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                <div className="projects-hero mx-auto flex max-w-5xl flex-col items-center text-center">
                    <div
                        className={`
                            mb-7 inline-flex items-center gap-2
                            rounded-full px-4 py-2
                            text-sm font-bold text-white/68
                            ${glassPanel}
                        `}
                    >
                        <Sparkles className="h-4 w-4" />
                        Raf&lt;/&gt;Console Studio
                    </div>

                    <h1
                        className="
        max-w-5xl text-balance
        text-4xl font-semibold tracking-[-0.015em]
        leading-[1.08] text-white
        sm:text-6xl
        lg:text-7xl
    "
                    >
                        Projects that turn ideas
                        <span className="mt-2 block font-normal text-white/42">
        into digital products
    </span>
                    </h1>

                    <p
                        className="
                            mt-6 max-w-3xl text-pretty
                            text-base leading-7 text-white/48
                            sm:text-lg
                        "
                    >
                        Mobile applications and websites — from published
                        products to large cross-platform solutions currently
                        in development.
                    </p>
                </div>

                <div
                    className={`
                        projects-filters relative mx-auto mt-12 w-full max-w-5xl
                        overflow-hidden rounded-[2.25rem] p-3 sm:p-4
                        ${glassPanel}
                    `}
                >
                    <span
                        aria-hidden="true"
                        className="
                            pointer-events-none absolute inset-x-0 top-0 h-px
                            bg-gradient-to-r
                            from-transparent via-white/45 to-transparent
                        "
                    />

                    <SegmentButton
                        label="Project type"
                        value={section}
                        onChange={handleSectionChange}
                        options={[
                            {
                                value: 'apps',
                                label: 'Applications',
                            },
                            {
                                value: 'sites',
                                label: 'Websites',
                            },
                        ]}
                    />

                    {section === 'apps' ? (
                        <div className="mt-3 grid gap-3">
                            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                                <SegmentButton
                                    label="Platform"
                                    value={platform}
                                    onChange={handlePlatformChange}
                                    options={[
                                        {
                                            value: 'android',
                                            label: 'Android',
                                        },
                                        {
                                            value: 'ios',
                                            label: 'iOS',
                                        },
                                        {
                                            value: 'windows',
                                            label: 'Windows',
                                        },
                                        {
                                            value: 'macos',
                                            label: 'macOS',
                                        },
                                    ]}
                                />

                                <SegmentButton
                                    label="Category"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    options={[
                                        {
                                            value: 'all',
                                            label: 'All',
                                        },
                                        {
                                            value: 'islam',
                                            label: 'Islam',
                                        },
                                        {
                                            value: 'tools',
                                            label: 'Useful tools',
                                        },
                                    ]}
                                />
                            </div>

                            <SegmentButton
                                label="Application status"
                                value={appStatus}
                                onChange={handleAppStatusChange}
                                options={[
                                    {
                                        value: 'published',
                                        label: 'Published',
                                    },
                                    {
                                        value: 'moderation',
                                        label: 'In review',
                                    },
                                    {
                                        value: 'working',
                                        label: 'In progress',
                                    },
                                ]}
                            />
                        </div>
                    ) : (
                        <div className="mt-3">
                            <SegmentButton
                                label="Website status"
                                value={siteStatus}
                                onChange={handleSiteStatusChange}
                                options={[
                                    {
                                        value: 'published',
                                        label: 'Published',
                                    },
                                    {
                                        value: 'working',
                                        label: 'In progress',
                                    },
                                ]}
                            />
                        </div>
                    )}
                </div>

                <div className="projects-heading mt-12 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <p
                            className="
                                text-sm font-bold uppercase
                                tracking-[0.2em] text-white/32
                            "
                        >
                            {sectionTitle}
                        </p>

                        <h2
                            className="
                                mt-2 text-3xl font-black
                                tracking-[-0.04em] text-white
                                sm:text-4xl
                            "
                        >
                            {statusTitle}
                        </h2>
                    </div>

                    <div
                        className={`
                            inline-flex items-center gap-2
                            rounded-full px-4 py-2
                            text-sm font-bold text-white/58
                            ${glassPanel}
                        `}
                    >
                        {section === 'apps' ? (
                            <MonitorSmartphone className="h-4 w-4" />
                        ) : (
                            <Globe2 className="h-4 w-4" />
                        )}

                        {showProjectsLoader ? (
                            <span>Loading</span>
                        ) : (
                            <span>
                                {visibleProjects.length}{' '}
                                {visibleProjects.length === 1
                                    ? 'project'
                                    : 'projects'}
                            </span>
                        )}
                    </div>
                </div>

                {showProjectsLoader ? (
                    <ProjectsLoadingState />
                ) : visibleProjects.length > 0 ? (
                    <div className="projects-grid mt-7 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {visibleProjects.map((project) => (
                            <ProjectCard
                                key={`${section}-${currentStatus}-${project.name}`}
                                project={project}
                                type={
                                    section === 'sites'
                                        ? 'site'
                                        : 'app'
                                }
                                status={currentStatus}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className={`
                            projects-empty mt-7 flex min-h-72 flex-col items-center
                            justify-center rounded-[2rem] p-8 text-center
                            ${glassPanel}
                        `}
                    >
                        <div
                            className="
                                flex h-16 w-16 items-center justify-center
                                rounded-[1.5rem]
                                border border-white/[0.1]
                                bg-white/[0.04]
                            "
                        >
                            <Clock3 className="h-7 w-7 text-white/42" />
                        </div>

                        <h3 className="mt-5 text-2xl font-black text-white">
                            Nothing here yet
                        </h3>

                        <p className="mt-3 max-w-xl leading-7 text-white/45">
                            There are currently no applications under review.
                            New projects will appear here after submission to
                            the store.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}