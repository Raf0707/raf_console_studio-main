import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import styles from './HomeHero.module.css';

const HERO_COPY = {
  ru: {
    eyebrow: 'Raf</>Console Studio · Digital Product Lab',
    title: 'От идеи — к цифровому продукту',
    infoLabel: 'Что мы создаём',
    infoText:
      'Проектируем сайты и приложения, в которых технология, архитектура и визуальный язык работают как единая система.',
    discuss: 'Обсудить проект',
    webTitle: 'Высокопроизводительные сайты',
    webText:
      'Быстрые адаптивные веб-продукты с чистой архитектурой и точным визуальным языком.',
    mobileTitle: 'Высокопроизводительные мобильные приложения',
    mobileText:
      'Приложения для Android и iOS с быстрым откликом, понятной логикой и надёжной архитектурой.',
    viewProjects: 'Посмотреть проекты',
  },
  en: {
    eyebrow: 'Raf</>Console Studio · Digital Product Lab',
    title: 'From idea to digital product',
    infoLabel: 'What we create',
    infoText:
      'We design websites and applications where technology, architecture and visual language work as one coherent system.',
    discuss: 'Discuss a project',
    webTitle: 'High-performance websites',
    webText:
      'Fast responsive web products with clean architecture and a precise visual language.',
    mobileTitle: 'High-performance mobile applications',
    mobileText:
      'Android and iOS applications with fast response, clear logic and reliable architecture.',
    viewProjects: 'View projects',
  },
};

function WebsiteVisual() {
  return (
    <div className={styles.websiteVisual} aria-hidden="true">
      <div className={styles.browserFrame}>
        <div className={styles.browserToolbar}>
          <span />
          <span />
          <span />
          <div className={styles.browserAddress} />
        </div>

        <div className={styles.browserCanvas}>
          <div className={styles.browserSidebar}>
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className={styles.browserContent}>
            <div className={styles.browserHeadline} />
            <div className={styles.browserCopy} />
            <div className={styles.browserCopyShort} />

            <div className={styles.browserTiles}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.laptopBase} />
    </div>
  );
}

function MobileVisual() {
  return (
    <div className={styles.mobileVisual} aria-hidden="true">
      <div className={styles.phoneFrame}>
        <div className={styles.phoneSpeaker} />
        <div className={styles.phoneScreen}>
          <div className={styles.phoneStatus}>
            <span />
            <span />
          </div>
          <div className={styles.phoneHeroBlock} />
          <div className={styles.phoneRows}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.phoneDock}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeHero({ locale = 'ru' }) {
  const isRussian = locale === 'ru';
  const copy = HERO_COPY[locale] ?? HERO_COPY.ru;
  const projectsHref = isRussian ? '/projects_ru/' : '/projects/';
  const contactsHref = isRussian ? '/contacts_ru/' : '/contacts/';

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>

        <h1 id="hero-title" className={styles.title}>
          {copy.title}
        </h1>

        <div className={styles.cards}>
          <article className={`${styles.card} ${styles.infoCard}`}>
            <div className={styles.infoTopline}>
              <span className={styles.infoIcon} aria-hidden="true">i</span>
              <span className={styles.infoLabel}>{copy.infoLabel}</span>
            </div>

            <p className={styles.infoText}>{copy.infoText}</p>

            <Link className={styles.textLink} href={contactsHref}>
              <span>{copy.discuss}</span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </article>

          <Link
            className={`${styles.card} ${styles.productCard} ${styles.webCard}`}
            href={projectsHref}
            aria-label={copy.webTitle}
          >
            <WebsiteVisual />

            <div className={styles.cardFooter}>
              <div>
                <h2>{copy.webTitle}</h2>
                <p>{copy.webText}</p>
              </div>
              <span className={styles.cardArrow} aria-hidden="true">
                <ArrowUpRight />
              </span>
            </div>
          </Link>

          <Link
            className={`${styles.card} ${styles.productCard} ${styles.mobileCard}`}
            href={projectsHref}
            aria-label={copy.mobileTitle}
          >
            <MobileVisual />

            <div className={styles.cardFooter}>
              <div>
                <h2>{copy.mobileTitle}</h2>
                <p>{copy.mobileText}</p>
              </div>
              <span className={styles.cardArrow} aria-hidden="true">
                <ArrowUpRight />
              </span>
            </div>
          </Link>
        </div>

        <Link className={styles.projectsLink} href={projectsHref}>
          <span>{copy.viewProjects}</span>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
