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
/*                                ДАННЫЕ ПРОЕКТОВ                              */
/* -------------------------------------------------------------------------- */

const publishedApps = [
    {
        name: 'Настройки',
        description: 'Быстрый доступ к основным системным настройкам устройства.',
        category: 'tools',
        rating: '2,8',
        url: 'https://www.rustore.ru/catalog/app/raf.console.settings',
    },
    {
        name: 'PDF Reader',
        description: 'Лёгкий и удобный просмотр PDF-документов.',
        category: 'tools',
        rating: '2,7',
        url: 'https://www.rustore.ru/catalog/app/raf.console.pdfreader',
    },
    {
        name: 'Коран с таджвидом',
        description: 'Коран с таджвидом и тафсиром Аль-Мунтахаб Аль-Азхар.',
        category: 'islam',
        rating: '4,5',
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.qurantajweed',
    },
    {
        name: 'Таблицы Шульте',
        description: 'Тренировка внимания, памяти и скорости чтения.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.shultetable',
    },
    {
        name: 'RafBook',
        description: 'Удобная читалка электронных книг с расширенными возможностями.',
        category: 'tools',
        rating: '4,5',
        url: 'https://www.rustore.ru/catalog/app/raf.console.chitalka',
    },
    {
        name: 'Зеркало',
        description: 'Минималистичное карманное зеркало для Android.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.mirror',
    },
    {
        name: 'Тренажер памяти',
        description: 'Упражнения для развития памяти и концентрации.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.tablememory',
    },
    {
        name: 'Дуа для богатства',
        description: '32 дуа для духовного и материального благополучия.',
        category: 'islam',
        rating: '5,0',
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.duaforrichness',
    },
    {
        name: 'Salavat',
        description: 'Салаваты из известных исламских книг и сборников.',
        category: 'islam',
        rating: '4,5',
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.salavat',
    },
    {
        name: 'Аль-Истигфар',
        description: 'Истигфары из Корана и достоверных хадисов.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.alistigfar',
    },
    {
        name: 'Калям Шариф',
        description: 'Аудиотолкование Корана с комментариями на русском языке.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.qalamsharifaudio',
    },
    {
        name: 'Коран за 7 часов',
        description: 'Полное аудиочтение Корана Ахмадом Дибаном.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.quran7hours',
    },
    {
        name: 'Al Asma Ul Husna',
        description: '99 прекрасных имён Аллаха с переводом и описанием.',
        category: 'islam',
        rating: '4,7',
        url: 'https://www.rustore.ru/catalog/app/ru.tabiin.alasmaulhusna',
    },
    {
        name: 'Коранический словарь',
        description: 'Слова Корана с переводом и подробным разбором.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.qurandict',
    },
    {
        name: 'Zickreee',
        description: 'Зикры, дуа, салаваты, азкары и исламские сборники.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.zickreee',
    },
    {
        name: 'Quran Player',
        description: 'Аудиочтение Корана Камилем хазратом Самигуллиным.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.quranplayer',
    },
    {
        name: 'Дуа Исмуль Азам',
        description: 'Дуа, в котором упоминается Величайшее Имя Аллаха.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.duaismalazam',
    },
    {
        name: 'Коран Ахмад Дибан',
        description: 'Аудиочтение Корана чтецом Ахмадом Дибаном.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.quranahmaddiban',
    },
    {
        name: 'R&R Notes',
        description: 'Удобные заметки с динамическим оформлением.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.console.rrnotes',
    },
    {
        name: 'Flashlight Modify',
        description: 'Фонарик с удобной регулировкой яркости.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.flashlight',
    },
    {
        name: 'Saum',
        description: 'Календарь обязательных и добровольных постов.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.saum',
    },
    {
        name: 'Tahajud Calculator',
        description: 'Расчёт времени молитв Духа и Тахаджуд.',
        category: 'islam',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/raf.tabiin.tahajudcalculator',
    },
    {
        name: 'Ramadan',
        description: 'Пост, дуа сухура и ифтара, Ляйлятуль-Кадр и таравих.',
        category: 'islam',
        rating: '5,0',
        url: 'https://www.rustore.ru/catalog/app/ru.tabiin.ramadan',
    },
    {
        name: 'Counters',
        description: 'Универсальные счётчики для зикра, спорта и привычек.',
        category: 'tools',
        rating: null,
        url: 'https://www.rustore.ru/catalog/app/ru.tabiin.counters',
    },
];

const workingApps = [
    {
        name: 'Projects',
        description: 'Приложение для управления проектами, задачами и заметками.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'NataSchool',
        description: 'Онлайн-школа английского языка.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Азан.ру',
        description: 'Мобильное приложение исламского информационного портала.',
        platforms: ['android', 'ios'],
        category: 'islam',
    },
    {
        name: 'Irayganat',
        description: 'Интернет-магазин мусульманской одежды.',
        platforms: ['android', 'ios'],
        category: 'islam',
    },
    {
        name: 'RafBook',
        description: 'Мультиязычная читалка электронных книг нового поколения.',
        platforms: ['ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Блокнот',
        description: 'Заметки, списки и удобная организация информации.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Raf</>Console Studio Blog',
        description: 'Приложение блога студии с проектами и публикациями.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
    {
        name: 'Liven Energy',
        description: 'Мобильный сервис энергетической компании.',
        platforms: ['android'],
        category: 'tools',
    },
    {
        name: 'Darul Wahda',
        description: 'Приложение ингушского издательства DARUL WAHDA.',
        platforms: ['android', 'ios'],
        category: 'islam',
    },
    {
        name: 'Дурусу Шифахия',
        description:
            'Уроки арабского языка, карточки, изображения и диалоги по системе лесенки.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'islam',
    },
    {
        name: 'ODLAR ÇAY EVİ',
        description: 'Приложение чайханы с меню и информацией для гостей.',
        platforms: ['android', 'ios'],
        category: 'tools',
    },
    {
        name: 'MediaTrain',
        description: 'Приложение для генерации изображений и видео.',
        platforms: ['android', 'ios', 'windows', 'macos'],
        category: 'tools',
    },
];

const publishedSites = [
    {
        name: 'Zickreee',
        description: 'Поминания Аллаха, дуа и исламские сборники.',
        url: 'https://zickreee.onrender.com',
    },
    {
        name: 'Dalail al Khairat',
        description: 'Цифровая версия книги салаватов.',
        url: 'https://dalail-al-khairat.onrender.com',
    },
    {
        name: 'Ринат Ахмеджанов',
        description: 'Сайт эксперта по недвижимости.',
        url: 'https://rinat-realty-expert.onrender.com',
    },
    {
        name: 'РинатДом',
        description: 'Строительство современных загородных домов.',
        url: 'https://rinat-dom.onrender.com',
    },
    {
        name: 'MangoSell',
        description: 'Свежее манго с доставкой по Москве и Московской области.',
        url: 'https://mangosell.web.app/',
    },
];

const workingSites = [
    {
        name: 'Irayganat',
        description: 'Интернет-магазин мусульманской одежды.',
    },
    {
        name: 'Liven Energy',
        description: 'Веб-сервис энергетической компании.',
    },
    {
        name: 'Darul Wahda',
        description: 'Сайт ингушского издательства DARUL WAHDA.',
    },
    {
        name: 'ODLAR ÇAY EVİ',
        description: 'Сайт чайханы с меню и информацией для гостей.',
    },
];

/* -------------------------------------------------------------------------- */
/*                                  КОМПОНЕНТЫ                                 */
/* -------------------------------------------------------------------------- */

const glassPanel = [
    'border border-white/[0.12]',
    'bg-white/[0.045]',
    'shadow-[0_1.5rem_5rem_-2.5rem_rgba(255,255,255,0.16),0_2rem_6rem_-3rem_rgba(0,0,0,0.95)]',
    'backdrop-blur-[28px]',
    'backdrop-saturate-[115%]',
].join(' ');

function SegmentButton({
                           options,
                           value,
                           onChange,
                           label,
                           columns,
                       }) {
    return (
        <div
            aria-label={label}
            className={`project-segment ${options.length === 2 ? 'project-segment--split' : 'project-segment--scroll'}
                grid min-w-0 gap-1 rounded-[1.35rem]
                border border-white/[0.075]
                bg-white/[0.018] p-1.5
                shadow-[inset_0_1px_0_rgba(255,255,255,0.045),inset_0_-1px_0_rgba(0,0,0,0.2)]
                backdrop-blur-xl
            `}
            style={{
                gridTemplateColumns:
                    columns ??
                    `repeat(${options.length}, minmax(0, 1fr))`,
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
                            focus-visible:ring-2
                            focus-visible:ring-white/60
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
                        <span className="project-segment__label relative z-10 block whitespace-nowrap">
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

    const clickable = status === 'published' && Boolean(project.url);

    const handlePointerMove = (event) => {
        const card = cardRef.current;

        if (!card) {
            return;
        }

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty('--pointer-x', `${x}px`);
        card.style.setProperty('--pointer-y', `${y}px`);
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
                project-card group relative isolate flex min-h-[19rem] overflow-hidden
                rounded-[2rem] border border-white/[0.11]
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
                focus-visible:ring-2
                focus-visible:ring-white/60
                ${pressed ? 'scale-[0.985]' : 'scale-100'}
                ${clickable ? 'cursor-pointer' : 'cursor-default'}
            `}
            style={{
                '--pointer-x': '50%',
                '--pointer-y': '50%',
            }}
        >
            {/* Свет, который следует за курсором */}
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

            {/* Мягкое затемнение по нижнему краю */}
            <span
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3
                    bg-gradient-to-t from-black/35 via-black/10 to-transparent
                "
            />

            {/* Движущаяся световая волна при наведении */}
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

            {/* Верхний стеклянный блик */}
            <span
                aria-hidden="true"
                className="
                    pointer-events-none absolute inset-x-[8%] top-0 h-px
                    bg-gradient-to-r
                    from-transparent via-white/55 to-transparent
                    opacity-60
                    transition-opacity duration-500
                    group-hover:opacity-100
                "
            />

            {/* Волна при нажатии */}
            {ripple && (
                <span
                    key={ripple.id}
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute z-0
                        h-8 w-8 rounded-full border border-white/50
                        bg-white/[0.12]
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
                            rounded-[1.15rem] border border-white/[0.13]
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
                                    inline-flex items-center gap-1.5 rounded-full
                                    border border-white/[0.14]
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
                                text-xl font-black tracking-[-0.035em] text-white
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
                                ? 'Сайт'
                                : status === 'published'
                                    ? 'Android'
                                    : 'Проект'}
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
                            ? 'Открыть проект'
                            : 'В разработке'}
                    </span>

                    <span
                        aria-hidden="true"
                        className="
                            h-px flex-1 bg-gradient-to-r
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
/*                                   СТРАНИЦА                                  */
/* -------------------------------------------------------------------------- */

function ProjectsLoadingState() {
    return (
        <div
            className="projects-loading"
            role="status"
            aria-live="polite"
            aria-label="Загрузка проектов"
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
                Загружаем проекты
            </h3>

            <p className="projects-loading__description">
                Подготавливаем выбранный раздел и проверяем доступные проекты.
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
            ? 'Приложения'
            : 'Сайты';

    const statusTitle =
        currentStatus === 'published'
            ? 'Опубликованные проекты'
            : currentStatus === 'moderation'
                ? 'На модерации'
                : 'Проекты в работе';

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

                @keyframes monochrome-line {
                    0% {
                        transform: translateX(-120%);
                        opacity: 0;
                    }

                    25% {
                        opacity: 0.4;
                    }

                    75% {
                        opacity: 0.4;
                    }

                    100% {
                        transform: translateX(120%);
                        opacity: 0;
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

            {/* Фоновая сетка */}
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

            {/* Серые световые области */}
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
                        Проекты, превращающие идеи
                        <span className="mt-2 block font-normal text-white/42">
        в цифровые продукты
    </span>
                    </h1>

                    <p
                        className="
                            mt-6 max-w-3xl text-pretty
                            text-base leading-7 text-white/48
                            sm:text-lg
                        "
                    >
                        Мобильные приложения и сайты — от опубликованных
                        продуктов до крупных кроссплатформенных решений,
                        находящихся в разработке.
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
                        label="Тип проекта"
                        value={section}
                        onChange={handleSectionChange}
                        options={[
                            {
                                value: 'apps',
                                label: 'Приложения',
                            },
                            {
                                value: 'sites',
                                label: 'Сайты',
                            },
                        ]}
                    />

                    {section === 'apps' ? (
                        <div className="mt-3 grid gap-3">
                            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                                <SegmentButton
                                    label="Платформа"
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
                                    label="Категория"
                                    value={category}
                                    onChange={handleCategoryChange}
                                    columns="0.72fr 0.82fr 1.7fr"
                                    options={[
                                        {
                                            value: 'all',
                                            label: 'Все',
                                        },
                                        {
                                            value: 'islam',
                                            label: 'Ислам',
                                        },
                                        {
                                            value: 'tools',
                                            label: 'Полезные инструменты',
                                        },
                                    ]}
                                />
                            </div>

                            <SegmentButton
                                label="Статус приложения"
                                value={appStatus}
                                onChange={handleAppStatusChange}
                                options={[
                                    {
                                        value: 'published',
                                        label: 'Опубликованные',
                                    },
                                    {
                                        value: 'moderation',
                                        label: 'На модерации',
                                    },
                                    {
                                        value: 'working',
                                        label: 'В работе',
                                    },
                                ]}
                            />
                        </div>
                    ) : (
                        <div className="mt-3">
                            <SegmentButton
                                label="Статус сайта"
                                value={siteStatus}
                                onChange={handleSiteStatusChange}
                                options={[
                                    {
                                        value: 'published',
                                        label: 'Опубликованные',
                                    },
                                    {
                                        value: 'working',
                                        label: 'В работе',
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
                            <span>Загрузка</span>
                        ) : (
                            <span>
                                {visibleProjects.length}{' '}
                                {getProjectsWord(visibleProjects.length)}
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
                                rounded-[1.5rem] border border-white/[0.1]
                                bg-white/[0.04]
                            "
                        >
                            <Clock3 className="h-7 w-7 text-white/42" />
                        </div>

                        <h3 className="mt-5 text-2xl font-black text-white">
                            Пока здесь пусто
                        </h3>

                        <p className="mt-3 max-w-xl leading-7 text-white/45">
                            Сейчас приложений на модерации нет. Новые проекты
                            появятся здесь после отправки в магазин.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}

function getProjectsWord(count) {
    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'проектов';
    }

    if (lastDigit === 1) {
        return 'проект';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'проекта';
    }

    return 'проектов';
}