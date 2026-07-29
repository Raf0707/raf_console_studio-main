'use client';

import Link from 'next/link';

import {
  ArrowDownRight,
  BarChart3,
  Code2,
  Github,
  Mail,
  MessageSquare,
  Send,
  Smartphone,
} from 'lucide-react';

import LiquidRafLogo from './LiquidRafLogo';
import styles from './MonochromeHome.module.css';

const CONTENT = {
  ru: {
    eyebrow:
        'Raf</>Console Studio · Digital Product Lab',

    titlePrimary: 'От идеи —',
    titleSecondaryFirst: 'к цифровому',
    titleSecondarySecond: 'продукту',

    subtitle:
        'Проектируем сайты и приложения, в которых технология, архитектура и визуальный язык работают как единая система',

    primaryAction:
        'Обсудить проект',

    secondaryAction:
        'Посмотреть работы',

    scrollHint:
        'Листайте ниже',

    heroMeta: [
      'Web',
      'Mobile',
      'Product design',
    ],

    servicesEyebrow:
        'Направления',

    servicesTitle:
        'Минимализм, наполненный глубиной',

    servicesLead:
        'Чёрный, белый и выразительная шкала серого. Вместо цветовых акцентов — свет, отражения, глубина и движение жидкого стекла',

    services: [
      {
        number: '01',
        icon: Code2,
        title: 'Разработка сайтов',
        text:
            'Быстрые, адаптивные и визуально цельные веб-продукты — от лендинга до сложного сервиса',
        tags: [
          'Архитектура',
          'Интерфейс',
          'Скорость',
        ],
      },
      {
        number: '02',
        icon: Smartphone,
        title: 'Мобильные приложения',
        text:
            'Мультиплатформенные приложения с продуманной логикой, удобной навигацией и единым дизайн-языком',
        tags: [
          'Android',
          'iOS',
          'Flutter',
        ],
      },
      {
        number: '03',
        icon: BarChart3,
        title: 'SEO и продвижение',
        text:
            'Аналитика, контент и развитие продукта, которые превращают внимание аудитории в измеримый результат',
        tags: [
          'Аналитика',
          'Контент',
          'Рост',
        ],
      },
    ],

    aboutEyebrow:
        'О студии',

    aboutTitle:
        'Разрабатываем не отдельные экраны, а цельные цифровые системы',

    aboutParagraphs: [
      'Raf</>Console Studio создаёт мобильные приложения и веб-продукты, которые решают реальные задачи пользователей и бизнеса.',
      'Мы объединяем проектирование, дизайн, разработку и дальнейшее развитие продукта. Поэтому интерфейс не существует отдельно от архитектуры, а визуальная часть поддерживает функциональность.',
      'Результат адаптируется под платформу, сохраняет узнаваемость бренда и остаётся удобным на любом экране.',
    ],

    stats: [
      [
        '01',
        'Единая архитектура',
      ],
      [
        '02',
        'Адаптивный интерфейс',
      ],
      [
        '03',
        'Долгосрочное развитие',
      ],
    ],

    contactEyebrow:
        'Связь',

    contactTitle:
        'Давайте превратим вашу идею в продукт',

    contactLead:
        'Опишите задачу, приложите референсы или готовый дизайн — мы обсудим архитектуру, визуальное направление и план реализации.',

    channels: [
      {
        label: 'GitHub',
        value: 'Raf0707',
        href: 'https://github.com/Raf0707',
        icon: Github,
      },
      {
        label: 'Email',
        value: 'raf_android-dev@mail.ru',
        href: 'https://mailto:raf_android-dev@mail.ru',
        icon: Mail,
      },
      {
        label: 'Telegram',
        value: '@ibn_Rustum',
        href: 'https://t.me/ibn_Rustum',
        icon: Send,
      },
      {
        label: 'WhatsApp',
        value: '+7 916 273 68 56',
        href: 'https://wa.me/79162736856',
        icon: MessageSquare,
      },
    ],

    contactAction:
        'Написать в Telegram',
  },

  en: {
    eyebrow:
        'Raf</>Console Studio · Digital Product Lab',

    titlePrimary: 'From idea',
    titleSecondaryFirst: 'to digital',
    titleSecondarySecond: 'product',

    subtitle:
        'We design websites and applications where technology, architecture and visual language work as one system.',

    primaryAction:
        'Discuss a project',

    secondaryAction:
        'View projects',

    scrollHint:
        'Scroll to explore',

    heroMeta: [
      'Web',
      'Mobile',
      'Product design',
    ],

    servicesEyebrow:
        'Expertise',

    servicesTitle:
        'Minimalism with depth',

    servicesLead:
        'Black, white and a rich grayscale. Instead of colorful accents: light, reflection, depth and liquid-glass motion.',

    services: [
      {
        number: '01',
        icon: Code2,
        title: 'Website development',
        text:
            'Fast, responsive and visually consistent web products — from landing pages to complex services.',
        tags: [
          'Architecture',
          'Interface',
          'Performance',
        ],
      },
      {
        number: '02',
        icon: Smartphone,
        title: 'Mobile applications',
        text:
            'Cross-platform apps with thoughtful logic, clear navigation and a unified design language.',
        tags: [
          'Android',
          'iOS',
          'Flutter',
        ],
      },
      {
        number: '03',
        icon: BarChart3,
        title: 'SEO and promotion',
        text:
            'Analytics, content and product growth that turn audience attention into measurable results.',
        tags: [
          'Analytics',
          'Content',
          'Growth',
        ],
      },
    ],

    aboutEyebrow:
        'About the studio',

    aboutTitle:
        'We design complete digital systems, not isolated screens',

    aboutParagraphs: [
      'Raf</>Console Studio creates mobile applications and web products that solve real user and business problems.',
      'We connect product planning, design, development and ongoing evolution. The interface is never separated from architecture, and the visual layer supports functionality.',
      'The result adapts to every platform, preserves the brand identity and remains comfortable on every screen.',
    ],

    stats: [
      [
        '01',
        'Unified architecture',
      ],
      [
        '02',
        'Responsive interface',
      ],
      [
        '03',
        'Long-term evolution',
      ],
    ],

    contactEyebrow:
        'Contact',

    contactTitle:
        'Let us turn your idea into a product',

    contactLead:
        'Describe the task and attach references or a finished design. We will discuss the architecture, visual direction and implementation plan.',

    channels: [
      {
        label: 'GitHub',
        value: 'Raf0707',
        href: 'https://github.com/Raf0707',
        icon: Github,
      },
      {
        label: 'Email',
        value: 'raf_android-dev@mail.ru',
        href: 'https://mailto:raf_android-dev@mail.ru',
        icon: Mail,
      },
      {
        label: 'Telegram',
        value: '@ibn_Rustum',
        href: 'https://t.me/ibn_Rustum',
        icon: Send,
      },
      {
        label: 'WhatsApp',
        value: '+7 916 273 68 56',
        href: 'https://wa.me/79162736856',
        icon: MessageSquare,
      },
    ],

    contactAction:
        'Message on Telegram',
  },
};

export default function MonochromeHome({
                                         locale = 'ru',
                                       }) {
  const copy =
      CONTENT[locale] ?? CONTENT.ru;

  const isRussian =
      locale === 'ru';

  const restartVideo = (event) => {
    const video =
        event.currentTarget;

    video.currentTime = 0;

    const playbackPromise =
        video.play();

    if (
        playbackPromise &&
        typeof playbackPromise.catch ===
        'function'
    ) {
      playbackPromise.catch(() => {});
    }
  };

  return (
      <main className={styles.page}>
        <svg
            className={
              styles.filterDefinitions
            }
            aria-hidden="true"
        >
          <defs>
            <filter
                id="raf-liquid-refraction"
                x="-35%"
                y="-35%"
                width="170%"
                height="170%"
            >
              <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.008 0.018"
                  numOctaves="2"
                  seed="8"
                  result="noise"
              >
                <animate
                    attributeName="baseFrequency"
                    dur="14s"
                    values="
                  0.008 0.018;
                  0.012 0.025;
                  0.008 0.018
                "
                    repeatCount="indefinite"
                />
              </feTurbulence>

              <feGaussianBlur
                  in="noise"
                  stdDeviation="0.6"
                  result="softNoise"
              />

              <feDisplacementMap
                  in="SourceGraphic"
                  in2="softNoise"
                  scale="34"
                  xChannelSelector="R"
                  yChannelSelector="B"
              />
            </filter>
          </defs>
        </svg>

        <section
            className={styles.hero}
            aria-labelledby="hero-title"
        >
          <video
              className={styles.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              onEnded={restartVideo}
          >
            <source
                src="/rafconsole_demo.mp4"
                type="video/mp4"
            />
          </video>

          <div
              className={styles.heroVeil}
              aria-hidden="true"
          />

          <div
              className={styles.heroGrid}
              aria-hidden="true"
          />

          <LiquidRafLogo placement="hero" />

          <div
              className={`
            ${styles.heroContent}
            ${
                  isRussian
                      ? styles.heroContentRussian
                      : styles.heroContentEnglish
              }
          `}
          >
            <p className={styles.eyebrow}>
              {copy.eyebrow}
            </p>

            <h1
                id="hero-title"
                className={`${styles.heroTitle} ${
                    isRussian
                        ? styles.heroTitleRussian
                        : styles.heroTitleEnglish
                }`}
            >
                <span className={styles.heroTitlePrimary}>
                  {copy.titlePrimary}
                </span>

                  <span className={styles.heroTitleSecondary}>
                  <span className={styles.heroTitleLine}>
                    {copy.titleSecondaryFirst}
                  </span>

                  <span className={styles.heroTitleLine}>
                    {copy.titleSecondarySecond}
                  </span>
                </span>
            </h1>

            <p className={styles.heroSubtitle}>
              {copy.subtitle}
            </p>

            <div className={styles.heroActions}>
              <Link
                  href={
                    isRussian
                        ? '/contacts_ru'
                        : '/contacts'
                  }
                  className={`
                ${styles.actionButton}
                ${styles.actionButtonPrimary}
              `}
              >
              <span>
                {copy.primaryAction}
              </span>

                <ArrowDownRight
                    aria-hidden="true"
                />
              </Link>

              <Link
                  href={
                    isRussian
                        ? '/projects_ru'
                        : '/projects'
                  }
                  className={`
                ${styles.actionButton}
                ${styles.actionButtonGhost}
              `}
              >
                {copy.secondaryAction}
              </Link>
            </div>

            <div
                className={styles.heroMeta}
                aria-label={
                  isRussian
                      ? 'Возможности студии'
                      : 'Studio capabilities'
                }
            >
              {copy.heroMeta.map(
                  (item) => (
                      <span key={item}>
                  {item}
                </span>
                  )
              )}
            </div>
          </div>

          <a
              className={styles.scrollHint}
              href="#services"
          >
          <span>
            {copy.scrollHint}
          </span>

            <span
                className={styles.scrollLine}
                aria-hidden="true"
            />
          </a>
        </section>

        <div className={styles.contentSurface}>
          <section
              id="services"
              className={styles.section}
              aria-labelledby="services-title"
          >
            <div className={styles.sectionHeading}>
              <div>
                <p
                    className={
                      styles.sectionEyebrow
                    }
                >
                  {copy.servicesEyebrow}
                </p>

                <h2
                    id="services-title"
                    className={styles.sectionTitle}
                >
                  {copy.servicesTitle}
                </h2>
              </div>

              <p className={styles.sectionLead}>
                {copy.servicesLead}
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {copy.services.map(
                  (service) => {
                    const Icon =
                        service.icon;

                    return (
                        <article
                            className={`
                      ${styles.glassPanel}
                      ${styles.serviceCard}
                    `}
                            key={service.title}
                        >
                          <div
                              className={
                                styles.serviceTopline
                              }
                          >
                      <span
                          className={
                            styles.serviceNumber
                          }
                      >
                        {service.number}
                      </span>

                            <span
                                className={
                                  styles.serviceIcon
                                }
                            >
                        <Icon
                            aria-hidden="true"
                        />
                      </span>
                          </div>

                          <h3>
                            {service.title}
                          </h3>

                          <p>
                            {service.text}
                          </p>

                          <div className={styles.tags}>
                            {service.tags.map(
                                (tag) => (
                                    <span key={tag}>
                            {tag}
                          </span>
                                )
                            )}
                          </div>

                          <div
                              className={
                                styles.cardReflection
                              }
                              aria-hidden="true"
                          />
                        </article>
                    );
                  }
              )}
            </div>
          </section>

          <section
              className={`
            ${styles.section}
            ${styles.aboutSection}
          `}
              aria-labelledby="about-title"
          >
            <div
                className={
                  styles.aboutLogoVisual
                }
                aria-hidden="true"
            >
              <LiquidRafLogo placement="about" />
            </div>

            <div
                className={`
              ${styles.glassPanel}
              ${styles.aboutPanel}
            `}
            >
              <p
                  className={
                    styles.sectionEyebrow
                  }
              >
                {copy.aboutEyebrow}
              </p>

              <h2
                  id="about-title"
                  className={styles.sectionTitle}
              >
                {copy.aboutTitle}
              </h2>

              <div className={styles.aboutCopy}>
                {copy.aboutParagraphs.map(
                    (paragraph) => (
                        <p key={paragraph}>
                          {paragraph}
                        </p>
                    )
                )}
              </div>

              <div className={styles.statsGrid}>
                {copy.stats.map(
                    ([number, label]) => (
                        <div
                            className={styles.stat}
                            key={number}
                        >
                    <span>
                      {number}
                    </span>

                          <p>
                            {label}
                          </p>
                        </div>
                    )
                )}
              </div>
            </div>
          </section>

          <section
              className={`
            ${styles.section}
            ${styles.contactSection}
          `}
              aria-labelledby="contact-title"
          >
            <div className={styles.contactHeader}>
              <p
                  className={
                    styles.sectionEyebrow
                  }
              >
                {copy.contactEyebrow}
              </p>

              <h2
                  id="contact-title"
                  className={styles.contactTitle}
              >
                {copy.contactTitle}
              </h2>

              <p>
                {copy.contactLead}
              </p>

              <a
                  className={`
                ${styles.actionButton}
                ${styles.actionButtonPrimary}
              `}
                  href="https://t.me/ibn_Rustum"
                  target="_blank"
                  rel="noreferrer"
              >
              <span>
                {copy.contactAction}
              </span>

                <ArrowDownRight
                    aria-hidden="true"
                />
              </a>
            </div>

            <div className={styles.contactGrid}>
              {copy.channels.map(
                  (channel) => {
                    const Icon =
                        channel.icon;

                    const external =
                        channel.href.startsWith(
                            'http'
                        );

                    return (
                        <a
                            className={`
                      ${styles.glassPanel}
                      ${styles.contactCard}
                    `}
                            href={channel.href}
                            key={channel.label}
                            target={
                              external
                                  ? '_blank'
                                  : undefined
                            }
                            rel={
                              external
                                  ? 'noreferrer'
                                  : undefined
                            }
                        >
                    <span
                        className={
                          styles.contactIcon
                        }
                    >
                      <Icon
                          aria-hidden="true"
                      />
                    </span>

                          <span
                              className={
                                styles.contactLabel
                              }
                          >
                      {channel.label}
                    </span>

                          <strong>
                            {channel.value}
                          </strong>

                          <ArrowDownRight
                              className={
                                styles.contactArrow
                              }
                              aria-hidden="true"
                          />
                        </a>
                    );
                  }
              )}
            </div>
          </section>
        </div>
      </main>
  );
}