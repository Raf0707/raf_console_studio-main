'use client';
;

import styles from './PrivacyPolicy.module.css';

const navigationItems = [
    {
        id: 'information',
        number: '01',
        title: 'Собираемая информация',
    },
    {
        id: 'usage',
        number: '02',
        title: 'Использование данных',
    },
    {
        id: 'forms',
        number: '03',
        title: 'Формы сайта',
    },
    {
        id: 'security',
        number: '04',
        title: 'Безопасность',
    },
    {
        id: 'third-party',
        number: '05',
        title: 'Сторонние сервисы',
    },
    {
        id: 'international',
        number: '06',
        title: 'Передача данных',
    },
    {
        id: 'rights',
        number: '07',
        title: 'Ваши права',
    },
    {
        id: 'license',
        number: '08',
        title: 'Лицензия',
    },
    {
        id: 'contacts',
        number: '09',
        title: 'Контакты',
    },
];

function ShieldIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 2.5 20 5.8v5.7c0 4.9-3.25 8.64-8 10-4.75-1.36-8-5.1-8-10V5.8L12 2.5Z" />

            <path d="m8.7 12.1 2.1 2.1 4.55-4.55" />
        </svg>
    );
}

function DataIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <ellipse
                cx="12"
                cy="5.5"
                rx="7.5"
                ry="3"
            />

            <path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />

            <path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
        </svg>
    );
}

function AnalyticsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M4 20V10" />
            <path d="M10 20V4" />
            <path d="M16 20v-7" />
            <path d="M22 20H2" />
        </svg>
    );
}

function FormIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <rect
                x="4"
                y="2.5"
                width="16"
                height="19"
                rx="3"
            />

            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h4.5" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="3"
            />

            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            <path d="M12 14.5v2.5" />
        </svg>
    );
}

function NetworkIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path d="M3 12h18" />
            <path d="M12 3c2.5 2.45 3.8 5.45 3.8 9S14.5 18.55 12 21" />
            <path d="M12 3C9.5 5.45 8.2 8.45 8.2 12S9.5 18.55 12 21" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="8"
                r="4"
            />

            <path d="M4.5 21c.55-4.1 3.18-6.2 7.5-6.2s6.95 2.1 7.5 6.2" />
        </svg>
    );
}

function CodeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="m8.5 7-5 5 5 5" />
            <path d="m15.5 7 5 5-5 5" />
            <path d="m13.5 4-3 16" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <rect
                x="2.5"
                y="5"
                width="19"
                height="14"
                rx="3"
            />

            <path d="m4.5 7 6.35 5.15a1.82 1.82 0 0 0 2.3 0L19.5 7" />
        </svg>
    );
}

function TelegramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="m21 4-3.05 15.1a1.15 1.15 0 0 1-1.8.7l-4.65-3.45-2.25 2.2a.8.8 0 0 1-1.36-.52l-.37-4.1L18 6.4 5.1 12.2l-3.2-1.05a.95.95 0 0 1-.03-1.8L19.45 2.6A1.15 1.15 0 0 1 21 4Z" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M8 16 16 8" />
            <path d="M10 8h6v6" />
        </svg>
    );
}

function CheckList({ children }) {
    return (
        <ul className={styles.checkList}>
            {children}
        </ul>
    );
}

function PolicySection({
                           id,
                           number,
                           label,
                           title,
                           icon,
                           children,
                       }) {
    return (
        <section
            id={id}
            className={styles.policySection}
        >
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                    {icon}
                </div>

                <div className={styles.sectionHeading}>
                    <span className={styles.sectionNumber}>
                        {number} · {label}
                    </span>

                    <h2>{title}</h2>
                </div>
            </div>

            <div className={styles.sectionContent}>
                {children}
            </div>
        </section>
    );
}

export default function PrivacyPolicy() {
    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                <span className={styles.heroGlow} />

                <div className={styles.heroTop}>
                    <div className={styles.heroIcon}>
                        <ShieldIcon />
                    </div>

                    <div className={styles.documentMeta}>
                        <span>Юридический документ</span>

                        <span className={styles.metaDivider} />

                        <span>Версия 25.07.2026</span>
                    </div>
                </div>

                <div className={styles.heroContent}>
                    <span className={styles.eyebrow}>
                        Raf&lt;/&gt;Console Studio
                    </span>

                    <h1>
                        Политика

                        <span className={styles.titleSecondary}>
                            конфиденциальности
                        </span>
                    </h1>

                    <p>
                        Мы серьёзно относимся к защите
                        персональных данных и открыто
                        объясняем, какая информация может
                        собираться, как она используется
                        и каким образом обеспечивается её
                        безопасность.
                    </p>
                </div>

                <div className={styles.heroFooter}>
                    <div className={styles.updateCard}>
                        <span className={styles.updateLabel}>
                            Последнее обновление
                        </span>

                        <strong>25 июля 2026 года</strong>
                    </div>

                    <div className={styles.heroStatement}>
                        <span className={styles.statementDot} />

                        Мы не продаём персональные данные
                        третьим лицам
                    </div>
                </div>
            </header>

            <div className={styles.documentLayout}>
                <aside className={styles.navigation}>
                    <div className={styles.navigationCard}>
                        <div className={styles.navigationHeader}>
                            <span>Содержание</span>

                            <span>
                                {navigationItems.length}
                                {' '}
                                разделов
                            </span>
                        </div>

                        <nav aria-label="Содержание политики">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={styles.navigationLink}
                                >
                                    <span>
                                        {item.number}
                                    </span>

                                    <strong>
                                        {item.title}
                                    </strong>
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                <article className={styles.document}>
                    <section className={styles.introduction}>
                        <span className={styles.introductionMark}>
                            &lt;/&gt;
                        </span>

                        <p>
                            В
                            {' '}
                            <strong>
                                Raf&lt;/&gt;Console
                            </strong>
                            {' '}
                            мы серьёзно относимся к вашей
                            конфиденциальности. Настоящая
                            Политика конфиденциальности
                            объясняет, как мы собираем,
                            используем и защищаем вашу
                            личную информацию при
                            использовании наших приложений
                            и сервисов.
                        </p>

                        <p>
                            Используя наши приложения и
                            сервисы, вы соглашаетесь со
                            сбором и использованием
                            информации в соответствии с
                            настоящей политикой.
                        </p>
                    </section>

                    <PolicySection
                        id="information"
                        number="01"
                        label="Данные"
                        title="Собираемая информация"
                        icon={<DataIcon />}
                    >
                        <p>
                            Мы собираем информацию для
                            предоставления, поддержки и
                            улучшения наших приложений и
                            сервисов. Это может включать:
                        </p>

                        <CheckList>
                            <li>
                                <strong>
                                    Информация об устройстве
                                </strong>

                                <span>
                                    Модель устройства,
                                    версия операционной
                                    системы и уникальные
                                    идентификаторы.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Использование приложения
                                </strong>

                                <span>
                                    Продолжительность
                                    сеанса, открываемые
                                    экраны и используемые
                                    функции.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Отчёты о сбоях
                                </strong>

                                <span>
                                    Технические данные,
                                    необходимые для
                                    устранения ошибок и
                                    повышения стабильности.
                                </span>
                            </li>
                        </CheckList>

                        <div className={styles.notice}>
                            <span className={styles.noticeIcon}>
                                i
                            </span>

                            <p>
                                Мы можем использовать
                                Firebase Analytics,
                                Firebase Crashlytics,
                                AdMob, Unity Ads и AppLovin.
                                Эти сервисы могут собирать
                                дополнительные данные на
                                основании собственных
                                политик конфиденциальности.
                            </p>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="usage"
                        number="02"
                        label="Обработка"
                        title="Как мы используем информацию"
                        icon={<AnalyticsIcon />}
                    >
                        <p>
                            Собранная информация
                            используется исключительно для
                            обеспечения работы, развития и
                            поддержки наших продуктов.
                        </p>

                        <div className={styles.purposeGrid}>
                            <div className={styles.purposeCard}>
                                <span>01</span>

                                <strong>Аналитика</strong>

                                <p>
                                    Понимание того, как
                                    используются приложения,
                                    и улучшение
                                    пользовательского
                                    опыта.
                                </p>
                            </div>

                            <div className={styles.purposeCard}>
                                <span>02</span>

                                <strong>Реклама</strong>

                                <p>
                                    Показ персонализированной
                                    или контекстной рекламы
                                    через рекламные сервисы.
                                </p>
                            </div>

                            <div className={styles.purposeCard}>
                                <span>03</span>

                                <strong>
                                    Устранение неполадок
                                </strong>

                                <p>
                                    Выявление и исправление
                                    технических проблем на
                                    основании данных о
                                    сбоях.
                                </p>
                            </div>
                        </div>

                        <div className={styles.primaryNotice}>
                            <ShieldIcon />

                            <div>
                                <strong>
                                    Персональные данные не
                                    продаются
                                </strong>

                                <p>
                                    Мы не продаём вашу
                                    личную информацию
                                    третьим лицам.
                                </p>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="forms"
                        number="03"
                        label="Сайт"
                        title="Формы сайта и согласие на обработку данных"
                        icon={<FormIcon />}
                    >
                        <p>
                            При отправке заявки через сайт
                            Raf&lt;/&gt;Console Studio мы
                            можем обрабатывать сведения,
                            которые вы указали в форме:
                            имя, контактные данные,
                            выбранный способ связи,
                            описание проекта, комментарий,
                            а также приложенные к заявке
                            файлы.
                        </p>

                        <h3>
                            Цели обработки данных
                        </h3>

                        <CheckList>
                            <li>
                                <strong>
                                    Рассмотрение заявки
                                </strong>

                                <span>
                                    Изучение обращения и
                                    подготовка ответа.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Связь с пользователем
                                </strong>

                                <span>
                                    Связь по Email,
                                    телефону, WhatsApp,
                                    Telegram или MAX.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Подготовка предложения
                                </strong>

                                <span>
                                    Уточнение требований к
                                    проекту, расчёт
                                    стоимости и сроков.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Оказание услуг
                                </strong>

                                <span>
                                    Выполнение заказанных
                                    работ и ведение деловой
                                    переписки.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Юридические обязанности
                                </strong>

                                <span>
                                    Исполнение требований
                                    законодательства,
                                    бухгалтерского и
                                    налогового учёта.
                                </span>
                            </li>
                        </CheckList>

                        <p>
                            Для достижения указанных целей
                            могут выполняться сбор, запись,
                            систематизация, накопление,
                            хранение, уточнение, извлечение,
                            использование, передача
                            привлекаемым исполнителям и
                            сервисам, обезличивание,
                            блокирование и удаление
                            персональных данных.
                        </p>

                        <div className={styles.consentCard}>
                            <span className={styles.consentIndex}>
                                Согласие
                            </span>

                            <p>
                                Устанавливая флажок
                                согласия на обработку
                                персональных данных и
                                отправляя форму, вы
                                подтверждаете, что
                                ознакомились с настоящей
                                Политикой
                                конфиденциальности и
                                добровольно соглашаетесь на
                                обработку переданных данных
                                в перечисленных целях.
                            </p>

                            <p>
                                Согласие действует до
                                достижения целей обработки
                                либо до его отзыва. Вы
                                можете отозвать согласие в
                                любое время, направив
                                обращение по контактным
                                данным, указанным ниже.
                            </p>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="security"
                        number="04"
                        label="Защита"
                        title="Безопасность данных"
                        icon={<LockIcon />}
                    >
                        <p>
                            Мы применяем стандартные меры
                            безопасности для защиты вашей
                            информации от
                            несанкционированного доступа,
                            изменения или раскрытия.
                        </p>

                        <div className={styles.securityGrid}>
                            <div>
                                <span className={styles.securityLine} />

                                <strong>
                                    Защита при передаче
                                </strong>

                                <p>
                                    Данные защищаются во
                                    время передачи между
                                    устройством и
                                    используемыми сервисами.
                                </p>
                            </div>

                            <div>
                                <span className={styles.securityLine} />

                                <strong>
                                    Защита при хранении
                                </strong>

                                <p>
                                    Применяются технические
                                    меры для снижения риска
                                    несанкционированного
                                    доступа.
                                </p>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="third-party"
                        number="05"
                        label="Партнёры"
                        title="Сторонние сервисы"
                        icon={<NetworkIcon />}
                    >
                        <p>
                            Наши приложения интегрированы
                            со сторонними сервисами для
                            расширения функциональности и
                            улучшения пользовательского
                            опыта.
                        </p>

                        <div className={styles.serviceList}>
                            <div className={styles.serviceItem}>
                                <span>F</span>

                                <div>
                                    <strong>Firebase</strong>

                                    <p>
                                        Аналитика,
                                        диагностика и
                                        формирование отчётов
                                        о сбоях.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.serviceItem}>
                                <span>AD</span>

                                <div>
                                    <strong>
                                        AdMob, Unity Ads и
                                        AppLovin
                                    </strong>

                                    <p>
                                        Отображение
                                        персонализированной
                                        или контекстной
                                        рекламы.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p>
                            Эти сервисы собирают и
                            обрабатывают данные в
                            соответствии с собственными
                            политиками конфиденциальности.
                            Мы рекомендуем ознакомиться с
                            ними, чтобы лучше понимать
                            применяемые практики обработки
                            данных.
                        </p>
                    </PolicySection>

                    <PolicySection
                        id="international"
                        number="06"
                        label="География"
                        title="Международная передача данных"
                        icon={<NetworkIcon />}
                    >
                        <p>
                            Ваша информация может
                            передаваться и обрабатываться в
                            странах, отличных от страны
                            вашего проживания.
                        </p>

                        <div className={styles.worldCard}>
                            <span className={styles.worldOrbit} />
                            <span className={styles.worldOrbitSecondary} />

                            <NetworkIcon />

                            <div>
                                <strong>
                                    Защита сохраняется вне
                                    зависимости от региона
                                </strong>

                                <p>
                                    Мы принимаем необходимые
                                    меры для обеспечения
                                    соответствующего уровня
                                    защиты данных при таких
                                    передачах.
                                </p>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="rights"
                        number="07"
                        label="Контроль"
                        title="Ваши права"
                        icon={<UserIcon />}
                    >
                        <p>
                            Мы стремимся обеспечить
                            прозрачность и предоставить
                            пользователям информацию о
                            работе с их данными.
                        </p>

                        <div className={styles.warningNotice}>
                            <span>!</span>

                            <p>
                                Удаление данных не
                                поддерживается в наших
                                текущих приложениях. При
                                возникновении вопросов о
                                сборе или обработке данных
                                вы можете связаться с нами
                                для получения дополнительной
                                информации.
                            </p>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="license"
                        number="08"
                        label="Открытый код"
                        title="Информация о лицензии"
                        icon={<CodeIcon />}
                    >
                        <p>
                            Все наши проекты
                            распространяются под лицензией
                            GNU General Public License
                            версии 3.0.
                        </p>

                        <div className={styles.licenseCard}>
                            <div className={styles.licenseMark}>
                                GPL
                                <span>3.0</span>
                            </div>

                            <div className={styles.licenseContent}>
                                <strong>
                                    GNU General Public
                                    License
                                </strong>

                                <p>
                                    Лицензия предоставляет
                                    пользователям свободу
                                    использования,
                                    модификации и
                                    распространения
                                    программного обеспечения
                                    на условиях GPL.
                                </p>

                                <a
                                    href="https://www.gnu.org/licenses/gpl-3.0.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Открыть текст лицензии

                                    <ArrowIcon />
                                </a>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="contacts"
                        number="09"
                        label="Обратная связь"
                        title="Свяжитесь с нами"
                        icon={<MailIcon />}
                    >
                        <p>
                            Если у вас есть вопросы о
                            настоящей Политике
                            конфиденциальности или наших
                            практиках работы с данными,
                            свяжитесь с нами удобным
                            способом.
                        </p>

                        <div className={styles.contactGrid}>
                            <a
                                href="mailto:raf_android-dev@mail.ru"
                                className={styles.contactCard}
                            >
                                <span className={styles.contactIcon}>
                                    <MailIcon />
                                </span>

                                <span className={styles.contactContent}>
                                    <small>Email</small>

                                    <strong>
                                        raf_android-dev@mail.ru
                                    </strong>
                                </span>

                                <span className={styles.contactArrow}>
                                    <ArrowIcon />
                                </span>
                            </a>

                            <a
                                href="https://t.me/ibn_Rustum"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contactCard}
                            >
                                <span className={styles.contactIcon}>
                                    <TelegramIcon />
                                </span>

                                <span className={styles.contactContent}>
                                    <small>Telegram</small>

                                    <strong>
                                        @ibn_Rustum
                                    </strong>
                                </span>

                                <span className={styles.contactArrow}>
                                    <ArrowIcon />
                                </span>
                            </a>
                        </div>
                    </PolicySection>

                    <footer className={styles.documentFooter}>
                        <div>
                            <span>Raf&lt;/&gt;Console Studio</span>

                            <strong>
                                Политика конфиденциальности
                            </strong>
                        </div>

                        <span>
                            Редакция от 25.07.2026
                        </span>
                    </footer>
                </article>
            </div>
        </main>
    );
}