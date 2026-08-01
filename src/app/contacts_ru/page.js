import styles from './ContactsPage.module.css';
;

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
        icon: (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M4.75 5.5h14.5A2.75 2.75 0 0 1 22 8.25v7.5a2.75 2.75 0 0 1-2.75 2.75H4.75A2.75 2.75 0 0 1 2 15.75v-7.5A2.75 2.75 0 0 1 4.75 5.5Zm.17 1.8 6.4 5.18a1.08 1.08 0 0 0 1.36 0l6.4-5.18H4.92Zm15.28 1.16-6.39 5.17a2.88 2.88 0 0 1-3.62 0L3.8 8.46v7.29c0 .52.43.95.95.95h14.5c.52 0 .95-.43.95-.95V8.46Z" />
            </svg>
        ),
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
        title: 'WhatsApp',
        value: '+7 989 116 34 33',
        description:
            'Сообщения и звонки по текущим проектам',
        href: 'https://wa.me/79891163433',
        external: true,
        icon: (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M12.05 2a9.8 9.8 0 0 0-8.49 14.7L2.2 21.8l5.22-1.37A9.8 9.8 0 1 0 12.05 2Zm0 17.82a8 8 0 0 1-4.08-1.11l-.29-.17-3.1.82.83-3.03-.19-.31a8.02 8.02 0 1 1 6.83 3.8Zm4.4-5.98c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.59 1.63-1.16.2-.57.2-1.07.14-1.17-.06-.1-.22-.16-.46-.28Z" />
            </svg>
        ),
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
                    Давайте создадим

                    <span>
                        {' '}
                        что-то значимое
                    </span>
                </h1>

                <p className={styles.subtitle}>
                    Есть проект, идея или предложение
                    о сотрудничестве? Выберите удобный
                    способ и свяжитесь с
                    {' '}
                    Raf&lt;/&gt;Console Studio.
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
                        Вступить в Telegram
                    </span>

                    <ArrowIcon />
                </a>
            </section>
        </main>
    );
}