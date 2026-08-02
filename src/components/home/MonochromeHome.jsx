'use client';

import Link from 'next/link';

import {
  ArrowDownRight,
  BarChart3,
  Code2,
  Github,
  ContactRound,
  Mail,
  Phone,
  Send,
  Smartphone,
} from 'lucide-react';

// Старый жидкий логотип сохранён для быстрого возврата.
// import LiquidRafLogo from './LiquidRafLogo';
import RafMinimalizmLogo from './RafMinimalizmLogo';
import styles from './MonochromeHome.module.css';


function VkIcon(props) {
  return (
      <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          {...props}
      >
        <path
            d="M3.2 6.6h3.3c.2 0 .4.1.5.4.8 2.1 1.9 3.8 3 4.7.6.5.9.4.9-.5V7.3c0-.5.2-.7.7-.7h2.5c.4 0 .6.2.6.7v2.8c0 .9.4 1 1 .4.9-.9 1.8-2.1 2.4-3.3.2-.4.5-.6.9-.6h3.2c.6 0 .8.3.5.8-.8 1.5-1.8 2.9-3 4.2-.4.4-.4.7 0 1.1 1.3 1.2 2.4 2.6 3.3 4.1.3.5.1.8-.5.8h-3.5c-.4 0-.7-.2-.9-.5-.7-1-1.5-2-2.4-2.8-.5-.5-.9-.4-.9.4v2.1c0 .5-.2.8-.8.8h-1.5C7.2 17.6 4.5 14.1 2.8 7.4c-.1-.5 0-.8.4-.8Z"
            fill="currentColor"
        />
      </svg>
  );
}

function MaxIcon({
                   className = '',
                   ...props
                 }) {
  return (
      <img
          src="/max.svg"
          alt=""
          className={className}
          draggable="false"
          {...props}
      />
  );
}

function MailRuIcon(props) {
  return (
      <svg
          data-brand="mailru"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          {...props}
      >
        <path
            d="M12 4.2a7.8 7.8 0 1 0 4.8 14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
        <path
            d="M16.8 8.4v5.2c0 1.1.6 1.7 1.5 1.7 1 0 1.7-.8 1.7-2.2V12a8 8 0 0 0-8-8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
        <circle
            cx="12"
            cy="12"
            r="3.7"
            stroke="currentColor"
            strokeWidth="1.7"
        />
      </svg>
  );
}

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
        href: 'mailto:raf_android-dev@mail.ru',
        icon: MailRuIcon,
      },
      {
        label: 'Gmail',
        value: 'raf.console@gmail.com',
        href: 'mailto:raf.console@gmail.com',
        icon: Mail,
      },
      {
        label: 'Telegram',
        value: '@raf_console_official',
        href: 'https://t.me/raf_console_official',
        icon: Send,
      },
      {
        label: 'VK',
        value: '@raf_console_official',
        href: 'https://vk.ru/raf_console_official',
        icon: VkIcon,
      },
      {
        label: 'MAX',
        value: '+7 989 116 34 33',
        href: 'https://max.ru/u/f9LHodD0cOJ7Ixa-3E9mekZ7fo13O0Pzdjm3xIZKMt-X7hkV3ThDFjasFV4',
        icon: MaxIcon,
      },
    ],

    contactAction:
        'Написать в Telegram',

    saveContactAction:
        'Сохранить контакт',

    callAction:
        'Позвонить',


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
        href: 'mailto:raf_android-dev@mail.ru',
        icon: MailRuIcon,
      },
      {
        label: 'Gmail',
        value: 'raf.console@gmail.com',
        href: 'mailto:raf.console@gmail.com',
        icon: Mail,
      },
      {
        label: 'Telegram',
        value: '@raf_console_official',
        href: 'https://t.me/raf_console_official',
        icon: Send,
      },
      {
        label: 'VK',
        value: '@raf_console_official',
        href: 'https://vk.ru/raf_console_official',
        icon: VkIcon,
      },
      {
        label: 'MAX',
        value: '+7 989 116 34 33',
        href: 'https://max.ru/u/f9LHodD0cOJ7Ixa-3E9mekZ7fo13O0Pzdjm3xIZKMt-X7hkV3ThDFjasFV4',
        icon: MaxIcon,
      },
    ],

    contactAction:
        'Message on Telegram',

    saveContactAction:
        'Save contact',

    callAction:
        'Call',
  },
};

export default function MonochromeHome({
                                         locale = 'ru',
                                       }) {
  const copy =
      CONTENT[locale] ?? CONTENT.ru;

  const isRussian =
      locale === 'ru';


  const saveContact = () => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Console;Raf</>;;;',
      'FN:Raf</>Console',
      'ORG:Raf</>Console',
      'TITLE:Сайты и мобильные приложения под ключ',
      'TEL;TYPE=CELL:+79891163433',
      'NOTE:Сайты и мобильные приложения под ключ',
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob(
        [vCard],
        {
          type: 'text/vcard;charset=utf-8',
        },
    );

    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = url;
    downloadLink.download = 'Raf-Console.vcf';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  /*
   * Обработчик старого видеофона сохранён вместе с прежним вариантом hero.
   * Для быстрого возврата раскомментируйте его и блок <video> ниже.
   *
   * const restartVideo = (event) => {
   *   const video = event.currentTarget;
   *   video.currentTime = 0;
   *
   *   const playbackPromise = video.play();
   *
   *   if (
   *       playbackPromise &&
   *       typeof playbackPromise.catch === 'function'
   *   ) {
   *     playbackPromise.catch(() => {});
   *   }
   * };
   */

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
          {/*
           * ПРЕЖНИЙ ВАРИАНТ ПЕРВОГО ЭКРАНА СОХРАНЁН.
           * Для возврата видеофона раскомментируйте этот блок вместе с
           * restartVideo выше и снова подключите LiquidRafLogo в импортах.
           *
           * <video
           *     className={styles.heroVideo}
           *     autoPlay
           *     loop
           *     muted
           *     playsInline
           *     preload="auto"
           *     disablePictureInPicture
           *     aria-hidden="true"
           *     onEnded={restartVideo}
           * >
           *   <source
           *       src="/rafconsole_demo.mp4"
           *       type="video/mp4"
           *   />
           * </video>
           *
           * <div
           *     className={styles.heroVeil}
           *     aria-hidden="true"
           * />
           *
           * <div
           *     className={styles.heroGrid}
           *     aria-hidden="true"
           * />
           *
           * <LiquidRafLogo placement="hero" />
           */}

          <div
              className={styles.minimalHeroGrid}
              aria-hidden="true"
          />

          <RafMinimalizmLogo
              placement="hero"
              className={styles.heroDesktopLogo}
          />

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
            <div className={styles.heroIntro}>
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
            </div>

            <div
                className={styles.heroMobileLogoSlot}
                aria-hidden="true"
            >
              <RafMinimalizmLogo
                  placement="hero"
                  className={styles.heroMobileLogo}
              />
            </div>

            <div className={styles.heroAfterLogo}>
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
              {/*
               * Старый вариант оставлен для быстрого переключения:
               * <LiquidRafLogo placement="about" />
               */}
              <RafMinimalizmLogo placement="about" />
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

              <div className={styles.contactActions}>
                <a
                    className={`
                  ${styles.actionButton}
                  ${styles.actionButtonPrimary}
                `}
                    href="https://t.me/raf_console_official"
                    target="_blank"
                    rel="noreferrer"
                >
                  <span>
                    {copy.contactAction}
                  </span>

                  <Send aria-hidden="true" />
                </a>

                <button
                    type="button"
                    className={`
                  ${styles.actionButton}
                  ${styles.actionButtonGhost}
                  ${styles.mobileContactAction}
                `}
                    onClick={saveContact}
                >
                  <span>
                    {copy.saveContactAction}
                  </span>

                  <ContactRound aria-hidden="true" />
                </button>

                <a
                    className={`
                  ${styles.actionButton}
                  ${styles.actionButtonGhost}
                  ${styles.mobileContactAction}
                `}
                    href="tel:+79891163433"
                >
                  <span>
                    {copy.callAction}
                  </span>

                  <Phone aria-hidden="true" />
                </a>
              </div>
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