'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import {
    ArrowRight,
    BadgeCheck,
    Bot,
    Braces,
    Browser,
    ChartNoAxesCombined,
    Check,
    ChevronDown,
    CircleDollarSign,
    Code2,
    Gauge,
    Gem,
    Globe2,
    Layers3,
    LayoutTemplate,
    MessageSquare,
    MonitorSmartphone,
    Rocket,
    SearchCheck,
    Send,
    ShieldCheck,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Store,
    TestTube2,
    WandSparkles,
} from 'lucide-react';

const iconMap = {
    ownership: ShieldCheck,
    growth: ChartNoAxesCombined,
    payment: CircleDollarSign,
    business: Store,
    startup: Rocket,
    investment: Gauge,
    brief: MessageSquare,
    specification: Braces,
    development: Code2,
    testing: TestTube2,
    corporate: Globe2,
    ecommerce: ShoppingCart,
    webapp: Browser,
    seo: SearchCheck,
    landing: LayoutTemplate,
};

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function GlassSurface({
                                 children,
                                 className,
                                 as: Component = 'div',
                                 interactive = false,
                             }) {
    return (
        <Component
            className={cn(
                'raf-studio-liquid-card relative overflow-hidden rounded-[2rem] border border-transparent bg-black/[0.22]',
                'shadow-[0_28px_90px_-40px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.1)]',
                'backdrop-blur-md backdrop-saturate-125',
                interactive &&
                'transition duration-500 hover:bg-black/[0.28]',
                className,
            )}
        >
            <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-white/[0.06] blur-3xl" />
            <div className="relative z-10">{children}</div>
        </Component>
    );
}

function SectionHeading({ eyebrow, title, description, align = 'center' }) {
    const centered = align === 'center';

    return (
        <div
            className={cn(
                'space-y-4',
                centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl',
            )}
        >
            {eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                    {eyebrow}
                </p>
            ) : null}

            <h2 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                {title}
            </h2>

            {description ? (
                <p className="text-pretty text-base leading-7 text-white/55 sm:text-lg">
                    {description}
                </p>
            ) : null}
        </div>
    );
}

function GlassButton({ children, onClick, href, variant = 'primary', className }) {
    const styles = cn(
        'raf-studio-glass-button group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300',
        variant === 'primary'
            ? 'bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.38),0_14px_32px_-16px_rgba(255,255,255,.22)] backdrop-blur-md hover:bg-white/[0.2]'
            : 'bg-white/[0.06] text-white backdrop-blur-md hover:bg-white/[0.11]',
        className,
    );

    const content = (
        <>
            {children}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </>
    );

    if (href) {
        return (
            <a href={href} className={styles}>
                {content}
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick} className={styles}>
            {content}
        </button>
    );
}

function ServiceSegment({ activeService, labels, onChange }) {
    const items = [
        { id: 'mobile', label: labels.mobile, icon: Smartphone },
        { id: 'web', label: labels.web, icon: Globe2 },
    ];

    return (
        <div
            className="
            mx-auto flex w-full max-w-xl flex-col gap-1.5
            rounded-[2rem] bg-black/25 p-1.5
            shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_22px_60px_-34px_rgba(0,0,0,.95)]
            backdrop-blur-md
            sm:flex-row sm:gap-0 sm:rounded-full
          "
        >
            {items.map((item, index) => {
                const Icon = item.icon;
                const active = activeService === item.id;

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onChange(item.id)}
                        aria-pressed={active}
                        className={cn(
                            'relative flex min-h-14 w-full items-center justify-center gap-2 px-4 text-sm font-semibold transition duration-300 sm:min-h-12 sm:flex-1 sm:rounded-full sm:text-base',
                            index === 0
                                ? 'rounded-[1.55rem] rounded-tl-[0.45rem]'
                                : 'rounded-[1.55rem] rounded-br-[0.45rem]',
                            active
                                ? 'bg-white text-black shadow-[0_10px_30px_-16px_rgba(255,255,255,.55)]'
                                : 'text-white/55 hover:bg-white/[0.06] hover:text-white',
                        )}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

function Hero({ content, activeService, segmentLabels, onServiceChange, onPrimaryAction }) {
    const isWeb = activeService === 'web';

    return (
        <section className="relative flex min-h-[82svh] items-center pt-28 sm:pt-32">
            <div className="mx-auto w-full max-w-7xl space-y-10">
                <ServiceSegment
                    activeService={activeService}
                    labels={segmentLabels}
                    onChange={onServiceChange}
                />

                <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_.88fr]">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55 shadow-sm backdrop-blur-xl">
                            <Sparkles className="h-4 w-4" />
                            {content.badge}
                        </div>

                        <div className="space-y-5">
                            <h1 className="text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
    <span className="block">
        {content.titlePrimary}
    </span>

                                <span className="mt-[0.08em] block text-[0.84em] font-medium leading-none text-white/[0.42]">
        {content.titleSecondary}
    </span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-pretty text-lg leading-8 text-white/55 lg:mx-0">
                                {content.subtitle}
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                            <GlassButton onClick={onPrimaryAction}>{content.primaryAction}</GlassButton>
                            <GlassButton href="#process" variant="secondary">
                                {content.secondaryAction}
                            </GlassButton>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-3">
                            {content.metrics.map((metric) => (
                                <div key={metric.label} className="min-w-0 text-center lg:text-left">
                                    <p className="text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                                        {metric.value}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-white/45">{metric.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <GlassSurface className="mx-auto w-full max-w-xl p-3 sm:p-4">
                        <div className="rounded-[1.55rem] bg-gradient-to-br from-white/[0.055] via-white/[0.018] to-black/20 p-5 sm:p-7">
                            <div className="mb-7 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
                                </div>
                                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-medium text-white/50">
                                    Raf&lt;/&gt;Console Studio
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <PreviewTile
                                        icon={isWeb ? MonitorSmartphone : Smartphone}
                                        label={content.preview.product}
                                        large
                                    />
                                    <PreviewTile icon={isWeb ? LayoutTemplate : Layers3} label={content.preview.architecture} />
                                </div>
                                <div className="space-y-4 sm:pt-12">
                                    <PreviewTile icon={WandSparkles} label={content.preview.design} />
                                    <PreviewTile icon={isWeb ? SearchCheck : Bot} label={content.preview.ai} large />
                                </div>
                            </div>
                        </div>
                    </GlassSurface>
                </div>
            </div>
        </section>
    );
}

function PreviewTile({ icon: Icon, label, large = false }) {
    return (
        <div
            className={cn(
                'raf-studio-liquid-card group relative overflow-hidden rounded-[1.4rem] border border-transparent bg-black/12 p-5 shadow-[0_14px_30px_-24px_rgba(0,0,0,.62)] backdrop-blur-sm',
                large ? 'min-h-44' : 'min-h-32',
            )}
        >
            <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.08]">
                    <Icon className="h-5 w-5 text-white/75" />
                </div>
                <p className="max-w-40 text-sm font-semibold leading-5 text-white/70">{label}</p>
            </div>
            <span className="pointer-events-none absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-white/[0.05] blur-2xl transition group-hover:scale-125" />
        </div>
    );
}

function Intro({ content, form }) {
    return (
        <section id="contact-form" className="grid scroll-mt-28 gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <GlassSurface className="p-7 sm:p-9">
                <p className="mb-7 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                    {content.eyebrow}
                </p>

                <div className="space-y-7">
                    {content.items.map((item) => (
                        <div key={item.title} className="flex gap-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                <Check className="h-4 w-4" />
              </span>
                            <div>
                                <h3 className="font-semibold tracking-[-0.02em] text-white">{item.title}</h3>
                                <p className="mt-1 text-sm leading-6 text-white/50">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="raf-studio-glass-button mt-8 inline-flex items-center gap-2 rounded-full bg-white/[0.12] px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                    <BadgeCheck className="h-4 w-4" />
                    {content.warranty}
                </div>
            </GlassSurface>

            <GlassSurface className="p-3 sm:p-4">
                <div data-raf-shader-ignore="true">
                    {form}
                </div>
            </GlassSurface>
        </section>
    );
}

function FeatureGrid({ content }) {
    return (
        <section className="space-y-10">
            <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.description}
            />

            <div className="grid gap-5 md:grid-cols-3">
                {content.items.map((item, index) => {
                    const Icon = iconMap[item.icon] || Gem;

                    return (
                        <GlassSurface key={item.title} interactive className="h-full p-7">
                            <div className="flex h-full flex-col">
                                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.07]">
                    <Icon className="h-5 w-5 text-white/75" />
                  </span>
                                    <span className="text-xs font-medium text-white/25">0{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-white/50">{item.text}</p>
                            </div>
                        </GlassSurface>
                    );
                })}
            </div>
        </section>
    );
}

function AiSection({ content, onAction }) {
    return (
        <section>
            <GlassSurface className="raf-studio-no-outer-outline p-7 sm:p-10 lg:p-12">
                <div className="grid items-center gap-10 lg:grid-cols-[1fr_.8fr]">
                    <div>
                        <SectionHeading
                            eyebrow={content.eyebrow}
                            title={content.title}
                            description={content.description}
                            align="left"
                        />
                        <GlassButton onClick={onAction} className="mt-8">
                            {content.action}
                        </GlassButton>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {content.points.map((point) => (
                            <div
                                key={point}
                                className="raf-studio-liquid-card flex min-h-28 items-start gap-3 rounded-[1.4rem] border border-transparent bg-white/[0.03] p-5 backdrop-blur-sm"
                            >
                                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-white/65" />
                                <p className="text-sm font-medium leading-6 text-white/65">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassSurface>
        </section>
    );
}

function Process({ content }) {
    return (
        <section id="process" className="scroll-mt-28 space-y-10">
            <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.description}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {content.items.map((item, index) => {
                    const Icon = iconMap[item.icon] || Code2;

                    return (
                        <GlassSurface key={item.title} interactive className="h-full p-6">
                            <div className="flex h-full flex-col">
                                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.07]">
                    <Icon className="h-4 w-4" />
                  </span>
                                    <span className="text-sm font-semibold text-white/25">{index + 1}</span>
                                </div>
                                <h3 className="font-semibold tracking-[-0.02em] text-white">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-white/50">{item.text}</p>
                            </div>
                        </GlassSurface>
                    );
                })}
            </div>
        </section>
    );
}

function Audience({ content, onAction }) {
    return (
        <section className="space-y-10">
            <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.description}
            />

            <div className="grid gap-5 md:grid-cols-3">
                {content.items.map((item) => {
                    const Icon = iconMap[item.icon] || Store;

                    return (
                        <GlassSurface key={item.title} interactive className="p-7">
                            <Icon className="h-6 w-6 text-white/65" />
                            <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-white/50">{item.text}</p>
                        </GlassSurface>
                    );
                })}
            </div>

            <div className="text-center">
                <GlassButton onClick={onAction}>{content.action}</GlassButton>
            </div>
        </section>
    );
}

function Services({ content }) {
    return (
        <section className="space-y-10">
            <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.description}
            />

            <div className="grid gap-5 lg:grid-cols-2">
                {content.items.map((service) => (
                    <GlassSurface key={service.title} className="p-7 sm:p-8">
            <span className="inline-flex rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {service.tag}
            </span>
                        <h3 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-white">{service.title}</h3>
                        <ul className="mt-6 space-y-3">
                            {service.items.map((item) => (
                                <li key={item} className="flex gap-3 text-sm leading-6 text-white/55">
                                    <Check className="mt-1 h-4 w-4 shrink-0 text-white/65" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassSurface>
                ))}
            </div>
        </section>
    );
}

function DirectContact({ content }) {
    return (
        <section>
            <GlassSurface className="p-8 text-center sm:p-10">
                <SectionHeading
                    eyebrow={content.eyebrow}
                    title={content.title}
                    description={content.text}
                />

                <div className="mt-8 flex justify-center gap-4">
                    <a
                        href="https://t.me/ibn_Rustum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="raf-studio-glass-button flex min-w-28 flex-col items-center gap-3 rounded-[1.5rem] bg-white/[0.05] p-4 transition hover:bg-white/[0.1]"
                    >
                        <Send className="h-5 w-5" />
                        <span className="text-sm font-medium">Telegram</span>
                    </a>

                    <a
                        href="https://wa.me/79162736856"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="raf-studio-glass-button flex min-w-28 flex-col items-center gap-3 rounded-[1.5rem] bg-white/[0.05] p-4 transition hover:bg-white/[0.1]"
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span className="text-sm font-medium">WhatsApp</span>
                    </a>
                </div>
            </GlassSurface>
        </section>
    );
}

function Faq({ content }) {
    return (
        <section className="space-y-10">
            <SectionHeading eyebrow={content.eyebrow} title={content.title} />

            <div className="mx-auto max-w-4xl space-y-3">
                {content.items.map((item) => (
                    <details
                        key={item.question}
                        className="raf-studio-liquid-card raf-studio-no-outer-outline group rounded-[1.5rem] border-0 bg-black/[0.2] px-6 py-5 backdrop-blur-sm"
                    >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                            {item.question}
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50">{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

const STUDIO_SERVICE_STORAGE_KEY = 'raf-console-studio-service';

function normalizeStudioService(value, fallback = 'mobile') {
    if (value === 'mobile' || value === 'web') {
        return value;
    }

    return fallback === 'web' ? 'web' : 'mobile';
}

export function AppStudioGlass({ content, forms, initialService = 'mobile' }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const serviceFromQuery = searchParams.get('service');
    const normalizedInitialService = normalizeStudioService(initialService);

    const [activeService, setActiveService] = useState(() =>
        normalizeStudioService(serviceFromQuery, normalizedInitialService),
    );

    useEffect(() => {
        if (serviceFromQuery === 'mobile' || serviceFromQuery === 'web') {
            setActiveService(serviceFromQuery);
            window.localStorage.setItem(
                STUDIO_SERVICE_STORAGE_KEY,
                serviceFromQuery,
            );
            return;
        }

        const storedService = window.localStorage.getItem(
            STUDIO_SERVICE_STORAGE_KEY,
        );

        if (storedService === 'mobile' || storedService === 'web') {
            setActiveService(storedService);
            return;
        }

        setActiveService(normalizedInitialService);
    }, [normalizedInitialService, serviceFromQuery]);

    const handleServiceChange = (nextService) => {
        const normalizedService = normalizeStudioService(
            nextService,
            normalizedInitialService,
        );

        setActiveService(normalizedService);
        window.localStorage.setItem(
            STUDIO_SERVICE_STORAGE_KEY,
            normalizedService,
        );

        const params = new URLSearchParams(searchParams.toString());
        params.set('service', normalizedService);

        const queryString = params.toString();
        const destination = queryString
            ? `${pathname}?${queryString}`
            : pathname;

        router.replace(destination, {
            scroll: false,
        });
    };

    const activeContent = useMemo(
        () => content.services[activeService],
        [activeService, content.services],
    );

    const activeForm = forms[activeService];

    const scrollToForm = () => {
        document.getElementById('contact-form')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <main className="raf-studio-page relative isolate min-h-screen overflow-hidden bg-transparent text-white">

            <style jsx global>{`
                .raf-studio-liquid-card {
                    position: relative;
                    isolation: isolate;

                    /*
                     * Жёстко ограничиваем все псевдоэлементы границами
                     * конкретной карточки. Блик больше не может рисоваться
                     * поверх соседних элементов или фона страницы.
                     */
                    overflow: hidden !important;
                    overflow: clip !important;
                    contain: paint;
                    clip-path: inset(0 round 1.5rem);

                    transform: none;
                    translate: none;
                    scale: 1 1;
                    transform-origin: center;
                    transition:
                            scale 620ms cubic-bezier(0.2, 0.88, 0.18, 1),
                            border-radius 620ms cubic-bezier(0.2, 0.88, 0.18, 1),
                            background-color 420ms ease,
                            box-shadow 420ms ease !important;
                    will-change: scale, border-radius;
                }

                /*
                 * Плавный блик перенесён с главной страницы.
                 * Он проходит через карточку непрерывно, без остановки
                 * и без резкого ускорения в центре.
                 */
                .raf-studio-liquid-card::before {
                    position: absolute;
                    z-index: 0;

                    inset: -50% auto -50% -48%;
                    width: 44%;

                    pointer-events: none;
                    content: '';

                    border-radius: inherit;

                    /*
                     * В покое световая полоса полностью невидима.
                     * Она появляется только внутри анимации прохода.
                     */
                    opacity: 0;

                    background:
                            linear-gradient(
                                    90deg,
                                    transparent,
                                    rgba(255, 255, 255, 0.86),
                                    transparent
                            );

                    transform: rotate(18deg);

                    will-change: left, opacity;
                }

                .raf-studio-liquid-card:hover::before {
                    animation:
                            rafStudioLightSweep
                            900ms
                            cubic-bezier(0.2, 0.7, 0.2, 1)
                            both;
                }

                .raf-studio-liquid-card::after {
                    position: absolute;
                    z-index: 0;
                    top: 5%;
                    bottom: 5%;
                    left: 0;
                    width: 1px;
                    pointer-events: none;
                    content: '';
                    border-radius: 999px;
                    background:
                            linear-gradient(
                                    180deg,
                                    transparent,
                                    rgba(255, 255, 255, 0.68) 20%,
                                    rgba(255, 255, 255, 0.3) 72%,
                                    transparent
                            );
                    box-shadow:
                            0 0 0.7rem rgba(255, 255, 255, 0.28),
                            0 0 1.6rem rgba(255, 255, 255, 0.12);
                    opacity: 0.68;
                }

                .raf-studio-liquid-card:hover {
                    animation:
                            rafStudioLiquidHover
                            780ms
                            cubic-bezier(0.2, 0.88, 0.18, 1)
                            both;
                }

                .raf-studio-liquid-card:hover::after {
                    animation:
                            rafStudioEdgeFlow
                            900ms
                            cubic-bezier(0.2, 0.88, 0.18, 1)
                            both;
                }

                .raf-studio-liquid-card > * {
                    position: relative;
                    z-index: 2;
                }

                /*
                 * Убираем только внешнюю обводку у большого AI-блока
                 * и карточек FAQ. Внутреннее стекло, блики и жидкая
                 * деформация продолжают работать.
                 */
                .raf-studio-no-outer-outline {
                    border: 0 !important;
                    overflow: hidden !important;
                    overflow: clip !important;
                    contain: paint;
                    clip-path: inset(0 round 2rem);
                    outline: 0 !important;
                    box-shadow:
                            0 1.8rem 5rem -3.4rem rgba(0, 0, 0, 0.72) !important;
                }

                details.raf-studio-liquid-card {
                    clip-path: inset(0 round 1.5rem);
                }

                .raf-studio-no-outer-outline.raf-studio-liquid-card {
                    clip-path: inset(0 round 2rem);
                }

                .raf-studio-no-outer-outline::after {
                    display: none !important;
                    content: none !important;
                }

                .raf-studio-glass-button {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    border: 0 !important;
                    box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.34),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.12),
                            0 0.8rem 2rem -1.2rem rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(6px) saturate(118%);
                    -webkit-backdrop-filter: blur(6px) saturate(118%);
                }

                .raf-studio-glass-button::before {
                    position: absolute;
                    z-index: -1;
                    inset: -45% auto -45% -42%;
                    width: 36%;
                    pointer-events: none;
                    content: '';
                    background:
                            linear-gradient(
                                    90deg,
                                    transparent,
                                    rgba(255, 255, 255, 0.62),
                                    transparent
                            );
                    transform: skewX(-22deg);
                    transition:
                            left 620ms cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .raf-studio-glass-button:hover::before {
                    left: 122%;
                }

                .raf-studio-glass-button:hover {
                    animation:
                            rafStudioButtonDrop
                            620ms
                            cubic-bezier(0.2, 0.88, 0.18, 1)
                            both;
                }

                @keyframes rafStudioLightSweep {
                    0% {
                        left: -48%;
                        opacity: 0;
                    }

                    8% {
                        opacity: 0.12;
                    }

                    18% {
                        opacity: 0.38;
                    }

                    78% {
                        opacity: 0.38;
                    }

                    92% {
                        opacity: 0.12;
                    }

                    100% {
                        left: 125%;
                        opacity: 0;
                    }
                }

                @keyframes rafStudioLiquidHover {
                    0% {
                        scale: 1 1;
                    }
                    18% {
                        scale: 0.992 1.012;
                    }
                    40% {
                        scale: 1.026 0.982;
                    }
                    61% {
                        scale: 1.012 1.004;
                    }
                    79% {
                        scale: 1.021 0.991;
                    }
                    100% {
                        scale: 1.016 0.996;
                    }
                }

                @keyframes rafStudioEdgeFlow {
                    0% {
                        opacity: 0.68;
                        transform: translateX(0) scaleY(1);
                    }
                    32% {
                        opacity: 1;
                        transform: translateX(0.18rem) scaleY(0.82);
                    }
                    58% {
                        opacity: 0.56;
                        transform: translateX(-0.08rem) scaleY(1.1);
                    }
                    100% {
                        opacity: 0.78;
                        transform: translateX(0) scaleY(1);
                    }
                }

                @keyframes rafStudioButtonDrop {
                    0% {
                        transform: scaleX(1) scaleY(1);
                    }
                    18% {
                        transform: scaleX(0.97) scaleY(1.04);
                    }
                    38% {
                        transform: scaleX(1.045) scaleY(0.965);
                    }
                    62% {
                        transform: scaleX(0.99) scaleY(1.015);
                    }
                    100% {
                        transform: scaleX(1) scaleY(1);
                    }
                }

                @media (hover: none), (pointer: coarse) {
                    .raf-studio-liquid-card:hover,
                    .raf-studio-liquid-card:hover::before,
                    .raf-studio-liquid-card:hover::after,
                    .raf-studio-glass-button:hover {
                        animation: none !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .raf-studio-liquid-card,
                    .raf-studio-liquid-card::before,
                    .raf-studio-liquid-card::after,
                    .raf-studio-glass-button {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>
            <div className="mx-auto w-full max-w-[96rem] space-y-28 px-4 pb-28 sm:px-6 lg:space-y-36 lg:px-8">
                <Hero
                    content={activeContent.hero}
                    activeService={activeService}
                    segmentLabels={content.segment}
                    onServiceChange={handleServiceChange}
                    onPrimaryAction={scrollToForm}
                />

                <Intro content={activeContent.intro} form={activeForm} />
                <FeatureGrid content={activeContent.features} />
                <AiSection content={activeContent.ai} onAction={scrollToForm} />
                <Process content={activeContent.process} />
                <Audience content={activeContent.audience} onAction={scrollToForm} />
                <Services content={activeContent.services} />
                <DirectContact content={content.directContact} />
                <Faq content={activeContent.faq} />
            </div>
        </main>
    );
}