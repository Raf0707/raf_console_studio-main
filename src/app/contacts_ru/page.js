'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './ContactsPage.module.css';


function VkIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            data-brand="vk"
        >
            <path
                d="M3.2 6.6h3.3c.2 0 .4.1.5.4.8 2.1 1.9 3.8 3 4.7.6.5.9.4.9-.5V7.3c0-.5.2-.7.7-.7h2.5c.4 0 .6.2.6.7v2.8c0 .9.4 1 1 .4.9-.9 1.8-2.1 2.4-3.3.2-.4.5-.6.9-.6h3.2c.6 0 .8.3.5.8-.8 1.5-1.8 2.9-3 4.2-.4.4-.4.7 0 1.1 1.3 1.2 2.4 2.6 3.3 4.1.3.5.1.8-.5.8h-3.5c-.4 0-.7-.2-.9-.5-.7-1-1.5-2-2.4-2.8-.5-.5-.9-.4-.9.4v2.1c0 .5-.2.8-.8.8h-1.5C7.2 17.6 4.5 14.1 2.8 7.4c-.1-.5 0-.8.4-.8Z"
                fill="currentColor"
            />
        </svg>
    );
}

function MailRuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            data-brand="mailru"
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

function MaxIcon() {
    return (
        <img
            src="/max.svg"
            alt=""
            aria-hidden="true"
            draggable="false"
            data-brand="max"
        />
    );
}

function EnvelopeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            data-brand="gmail"
        >
            <path
                d="M4.75 5.5h14.5A2.75 2.75 0 0 1 22 8.25v7.5a2.75 2.75 0 0 1-2.75 2.75H4.75A2.75 2.75 0 0 1 2 15.75v-7.5A2.75 2.75 0 0 1 4.75 5.5Zm.17 1.8 6.4 5.18a1.08 1.08 0 0 0 1.36 0l6.4-5.18H4.92Zm15.28 1.16-6.39 5.17a2.88 2.88 0 0 1-3.62 0L3.8 8.46v7.29c0 .52.43.95.95.95h14.5c.52 0 .95-.43.95-.95V8.46Z"
                fill="currentColor"
            />
        </svg>
    );
}


const contactItems = [
    {
        title: 'GitHub',
        value: '@Raf0707',
        description:
            'Проекты, исходный код и открытая разработка',
        href: 'https://github.com/Raf0707',
        external: true,
        icon: (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M12 2.3a9.9 9.9 0 0 0-3.13 19.3c.5.1.68-.22.68-.48v-1.9c-2.8.61-3.39-1.19-3.39-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1.02.07 1.55 1.04 1.55 1.04.9 1.54 2.37 1.1 2.95.84.09-.65.35-1.1.64-1.35-2.24-.25-4.6-1.12-4.6-4.99 0-1.1.4-2 1.04-2.7-.1-.26-.45-1.28.1-2.66 0 0 .85-.27 2.78 1.03a9.65 9.65 0 0 1 5.06 0c1.93-1.3 2.77-1.03 2.77-1.03.56 1.38.21 2.4.1 2.66.65.7 1.04 1.6 1.04 2.7 0 3.88-2.36 4.73-4.61 4.98.36.31.68.92.68 1.86v2.76c0 .27.18.59.69.49A9.9 9.9 0 0 0 12 2.3Z" />
            </svg>
        ),
    },
    {
        title: 'Email',
        value: 'raf_android-dev@mail.ru',
        description:
            'Деловые предложения и подробные описания проектов',
        href: 'mailto:raf_android-dev@mail.ru',
        external: false,
        icon: <MailRuIcon />,
    },
    {
        title: 'Gmail',
        value: 'raf.console@gmail.com',
        description:
            'Деловые предложения и подробные описания проектов',
        href: 'mailto:raf.console@gmail.com',
        external: false,
        icon: <EnvelopeIcon />,
    },
    {
        title: 'Telegram',
        value: '@raf_console_official',
        description:
            'Самый быстрый способ обсудить идею или сотрудничество',
        href: 'https://t.me/raf_console_official',
        external: true,
        icon: (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M21.66 3.45a1.45 1.45 0 0 0-1.5-.23L3.23 9.75a1.8 1.8 0 0 0 .17 3.42l4.15 1.28 1.6 5.04a1.56 1.56 0 0 0 2.67.58l2.27-2.45 4.1 3.02a1.7 1.7 0 0 0 2.68-1.04l1.74-14.75a1.45 1.45 0 0 0-.95-1.4ZM9.2 13.06l8.78-5.52-7.15 6.84-.55 3.16-1.08-3.4a.88.88 0 0 1 0-1.08Zm9.9 5.56-5.47-4.02 6.95-6.66-1.48 10.68Z" />
            </svg>
        ),
    },
    {
        title: 'VK',
        value: '@raf_console_official',
        description:
            'Самый быстрый способ обсудить идею или сотрудничество',
        href: 'https://vk.ru/raf_console_official',
        external: true,
        icon: <VkIcon />,
    },
    {
        title: 'MAX',
        value: '+7 989 116 34 33',
        description:
            'Сообщения и звонки по текущим проектам',
        href: 'https://max.ru/u/f9LHodD0cOJ7Ixa-3E9mekZ7fo13O0Pzdjm3xIZKMt-X7hkV3ThDFjasFV4',
        external: true,
        icon: <MaxIcon />,
    },
];

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M8 16 16 8m-6 0h6v6" />
        </svg>
    );
}

export default function ContactPage() {
    const [titleShineMode, setTitleShineMode] =
        useState('idle');

    const titleShineTimerRef =
        useRef(null);

    useEffect(() => {
        return () => {
            if (titleShineTimerRef.current !== null) {
                window.clearTimeout(
                    titleShineTimerRef.current,
                );
            }
        };
    }, []);

    const handleTitleMouseEnter = () => {
        if (titleShineTimerRef.current !== null) {
            window.clearTimeout(
                titleShineTimerRef.current,
            );
        }

        setTitleShineMode('forward');
    };

    const handleTitleMouseLeave = () => {
        if (titleShineTimerRef.current !== null) {
            window.clearTimeout(
                titleShineTimerRef.current,
            );
        }

        setTitleShineMode('reverse');

        titleShineTimerRef.current =
            window.setTimeout(() => {
                setTitleShineMode('idle');
                titleShineTimerRef.current = null;
            }, 920);
    };

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.eyebrow}>
                    <span
                        className={styles.statusDot}
                    />

                    Открыты для новых проектов
                </div>

                <h1 className={styles.title}>
                    <span className={styles.titlePrimary}>
                        Давайте создадим
                    </span>

                    <span
                        className={[
                            styles.titleSecondary,
                            titleShineMode === 'forward'
                                ? styles.titleSecondaryForward
                                : '',
                            titleShineMode === 'reverse'
                                ? styles.titleSecondaryReverse
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        onMouseEnter={handleTitleMouseEnter}
                        onMouseLeave={handleTitleMouseLeave}
                    >
                        <span
                            className={
                                styles.titleSecondaryText
                            }
                            data-shine-text="что-то значимое"
                        >
                            что-то значимое
                        </span>
                    </span>
                </h1>

                <p className={styles.subtitle}>
                    Есть проект, идея или предложение
                    о сотрудничестве? Выберите удобный
                    способ и свяжитесь с
                    {' '}
                    Raf&lt;/&gt;Console Studio
                </p>
            </section>

            <section
                className={styles.contactsGrid}
                aria-label="Способы связи"
            >
                {contactItems.map(
                    (item, index) => (
                        <a
                            key={item.title}
                            href={item.href}
                            target={
                                item.external
                                    ? '_blank'
                                    : undefined
                            }
                            rel={
                                item.external
                                    ? 'noopener noreferrer'
                                    : undefined
                            }
                            className={
                                styles.contactCard
                            }
                            style={{
                                '--card-index':
                                index,
                            }}
                        >
                            <span
                                className={
                                    styles.cardShine
                                }
                            />

                            <span
                                className={
                                    styles.iconShell
                                }
                            >
                                {item.icon}
                            </span>

                            <span
                                className={
                                    styles.cardContent
                                }
                            >
                                <span
                                    className={
                                        styles.cardTitle
                                    }
                                >
                                    {item.title}
                                </span>

                                <span
                                    className={
                                        styles.cardDescription
                                    }
                                >
                                    {
                                        item.description
                                    }
                                </span>

                                <span
                                    className={
                                        styles.cardValue
                                    }
                                >
                                    {item.value}
                                </span>
                            </span>

                            <span
                                className={
                                    styles.arrowShell
                                }
                            >
                                <ArrowIcon />
                            </span>
                        </a>
                    )
                )}
            </section>

            <section
                className={styles.developerCard}
            >
                <span
                    className={
                        styles.developerGlow
                    }
                />

                <div
                    className={
                        styles.developerMark
                    }
                    aria-hidden="true"
                >
                    <span>&lt;/&gt;</span>
                </div>

                <div
                    className={
                        styles.developerContent
                    }
                >
                    <span
                        className={
                            styles.sectionLabel
                        }
                    >
                        Разработчикам
                    </span>

                    <h2>
                        Создавайте продукты вместе
                        с нашей студией
                    </h2>

                    <p>
                        Присоединяйтесь к сообществу
                        разработчиков, чтобы
                        участвовать в проектах
                        студии, партнёрских
                        программах и технических
                        обсуждениях.
                    </p>
                </div>

                <a
                    href="https://t.me/rafConsoleStudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                        styles.developerButton
                    }
                >
                    <span>
                        Группа в Telegram
                    </span>

                    <ArrowIcon />
                </a>
            </section>
        </main>
    );
}