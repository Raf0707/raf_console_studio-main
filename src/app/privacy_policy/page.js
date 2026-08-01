'use client';

import styles from './PrivacyPolicy.module.css';
;

const navigationItems = [
    {
        id: 'information',
        number: '01',
        title: 'Information collected',
    },
    {
        id: 'usage',
        number: '02',
        title: 'How data is used',
    },
    {
        id: 'forms',
        number: '03',
        title: 'Website forms',
    },
    {
        id: 'security',
        number: '04',
        title: 'Data security',
    },
    {
        id: 'third-party',
        number: '05',
        title: 'Third-party services',
    },
    {
        id: 'international',
        number: '06',
        title: 'International transfer',
    },
    {
        id: 'rights',
        number: '07',
        title: 'Your rights',
    },
    {
        id: 'license',
        number: '08',
        title: 'License',
    },
    {
        id: 'contacts',
        number: '09',
        title: 'Contact us',
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
        <main
            className={styles.page}
            data-raf-refraction-source="true"
        >
            <header className={styles.hero}>


                <div className={styles.heroTop}>
                    <div className={styles.heroIcon}>
                        <ShieldIcon />
                    </div>

                    <div className={styles.documentMeta}>
                        <span>Legal document</span>

                        <span className={styles.metaDivider} />

                        <span>Version 25.07.2026</span>
                    </div>
                </div>

                <div className={styles.heroContent}>
                    <span className={styles.eyebrow}>
                        Raf&lt;/&gt;Console Studio
                    </span>

                    <h1>
                        Privacy

                        <span className={styles.titleSecondary}>
                            Policy
                        </span>
                    </h1>

                    <p>
                        We take personal data protection
                        seriously and clearly explain what
                        information may be collected, how
                        it is used and how it is protected.
                    </p>
                </div>

                <div className={styles.heroFooter}>
                    <div className={styles.updateCard}>
                        <span className={styles.updateLabel}>
                            Last updated
                        </span>

                        <strong>July 25, 2026</strong>
                    </div>

                    <div
                        className={styles.heroStatement}>
                        <span className={styles.statementDot} />

                        We do not sell or transfer personal
                        information to third parties
                    </div>
                </div>
            </header>

            <div className={styles.documentLayout}>
                <aside className={styles.navigation}>
                    <div className={styles.navigationCard}>
                        <div className={styles.navigationHeader}>
                            <span>Contents</span>

                            <span>
                                {navigationItems.length}
                                {' '}
                                sections
                            </span>
                        </div>

                        <nav aria-label="Privacy policy contents">
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
                            At
                            {' '}
                            <strong>
                                Raf&lt;/&gt;Console
                            </strong>
                            , we take your privacy
                            seriously. This Privacy Policy
                            explains how we collect, use
                            and protect your personal
                            information when you use our
                            applications and services.
                        </p>

                        <p>
                            By using our applications and
                            services, you agree to the
                            collection and use of
                            information in accordance with
                            this policy.
                        </p>
                    </section>

                    <PolicySection
                        id="information"
                        number="01"
                        label="Data"
                        title="Information we collect"
                        icon={<DataIcon />}
                    >
                        <p>
                            We collect information to
                            provide, maintain and improve
                            our applications and services.
                            This may include:
                        </p>

                        <CheckList>
                            <li>
                                <strong>
                                    Device information
                                </strong>

                                <span>
                                    Device model, operating
                                    system version and
                                    unique identifiers.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Application usage
                                </strong>

                                <span>
                                    Session duration,
                                    visited screens and
                                    features used.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Crash reports
                                </strong>

                                <span>
                                    Technical information
                                    required to troubleshoot
                                    issues and improve
                                    stability.
                                </span>
                            </li>
                        </CheckList>

                        <div className={styles.notice}>
                            <span className={styles.noticeIcon}>
                                i
                            </span>

                            <p>
                                We may use Firebase
                                Analytics, Firebase
                                Crashlytics, AdMob, Unity
                                Ads and AppLovin. These
                                services may collect
                                additional data under their
                                own privacy policies.
                            </p>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="usage"
                        number="02"
                        label="Processing"
                        title="How we use your information"
                        icon={<AnalyticsIcon />}
                    >
                        <p>
                            The collected information is
                            used exclusively to operate,
                            develop and support our
                            products.
                        </p>

                        <div className={styles.purposeGrid}>
                            <div className={styles.purposeCard}>
                                <span>01</span>

                                <strong>Analytics</strong>

                                <p>
                                    Understanding how our
                                    applications are used
                                    and improving the user
                                    experience.
                                </p>
                            </div>

                            <div className={styles.purposeCard}>
                                <span>02</span>

                                <strong>Advertising</strong>

                                <p>
                                    Delivering personalized
                                    or contextual
                                    advertisements through
                                    advertising services.
                                </p>
                            </div>

                            <div className={styles.purposeCard}>
                                <span>03</span>

                                <strong>
                                    Troubleshooting
                                </strong>

                                <p>
                                    Identifying and fixing
                                    technical issues using
                                    crash report data.
                                </p>
                            </div>
                        </div>

                        <div className={styles.primaryNotice}>
                            <ShieldIcon />

                            <div>
                                <strong>
                                    Personal data is not sold
                                    or transferred
                                </strong>

                                <p>
                                    We do not sell or transfer your
                                    personal information to third parties.
                                </p>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="forms"
                        number="03"
                        label="Website"
                        title="Website forms and consent to data processing"
                        icon={<FormIcon />}
                    >
                        <p>
                            When you submit a request
                            through the
                            Raf&lt;/&gt;Console Studio
                            website, we may process the
                            information entered in the
                            form, including your name,
                            contact details, preferred
                            communication method, project
                            description, comments and
                            attached files.
                        </p>

                        <h3>
                            Purposes of data processing
                        </h3>

                        <CheckList>
                            <li>
                                <strong>
                                    Reviewing requests
                                </strong>

                                <span>
                                    Reviewing your request
                                    and preparing a
                                    response.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Contacting you
                                </strong>

                                <span>
                                    Communication through
                                    Email, phone, WhatsApp,
                                    Telegram or MAX.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Preparing a proposal
                                </strong>

                                <span>
                                    Clarifying project
                                    requirements and
                                    estimating costs and
                                    delivery time.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Providing services
                                </strong>

                                <span>
                                    Performing the
                                    requested work and
                                    maintaining related
                                    business correspondence.
                                </span>
                            </li>

                            <li>
                                <strong>
                                    Legal obligations
                                </strong>

                                <span>
                                    Compliance with
                                    applicable legal,
                                    accounting and tax
                                    obligations.
                                </span>
                            </li>
                        </CheckList>

                        <p>
                            For these purposes, we may
                            collect, record, organize,
                            store, update, retrieve, use,
                            transfer to contractors and
                            services involved in processing
                            the request, anonymize,
                            restrict and delete submitted
                            personal data.
                        </p>

                        <div className={styles.consentCard}>
                            <span className={styles.consentIndex}>
                                Consent
                            </span>

                            <p>
                                By selecting the personal
                                data consent checkbox and
                                submitting the form, you
                                confirm that you have read
                                this Privacy Policy and
                                freely consent to the
                                processing of the submitted
                                data for the purposes
                                described above.
                            </p>

                            <p>
                                Consent remains valid until
                                the purposes of processing
                                are achieved or until it is
                                withdrawn. You may withdraw
                                your consent at any time by
                                contacting us using the
                                details provided below.
                            </p>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="security"
                        number="04"
                        label="Protection"
                        title="Data security"
                        icon={<LockIcon />}
                    >
                        <p>
                            We implement standard security
                            measures to protect your
                            information from unauthorized
                            access, alteration or
                            disclosure.
                        </p>

                        <div className={styles.securityGrid}>
                            <div>
                                <span className={styles.securityLine} />

                                <strong>
                                    Transmission security
                                </strong>

                                <p>
                                    Data is protected while
                                    being transferred
                                    between your device and
                                    the services we use.
                                </p>
                            </div>

                            <div>
                                <span className={styles.securityLine} />

                                <strong>
                                    Storage security
                                </strong>

                                <p>
                                    Technical measures are
                                    used to reduce the risk
                                    of unauthorized access.
                                </p>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="third-party"
                        number="05"
                        label="Partners"
                        title="Third-party services"
                        icon={<NetworkIcon />}
                    >
                        <p>
                            Our applications integrate
                            with third-party services to
                            extend functionality and
                            improve the user experience.
                        </p>

                        <div className={styles.serviceList}>
                            <div className={styles.serviceItem}>
                                <span>F</span>

                                <div>
                                    <strong>Firebase</strong>

                                    <p>
                                        Analytics,
                                        diagnostics and
                                        crash reporting.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.serviceItem}>
                                <span>AD</span>

                                <div>
                                    <strong>
                                        AdMob, Unity Ads and
                                        AppLovin
                                    </strong>

                                    <p>
                                        Displaying
                                        personalized or
                                        contextual
                                        advertisements.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p>
                            These services collect and
                            process data according to their
                            own privacy policies. We
                            recommend reviewing those
                            policies to understand their
                            data practices.
                        </p>
                    </PolicySection>

                    <PolicySection
                        id="international"
                        number="06"
                        label="Geography"
                        title="International data transfer"
                        icon={<NetworkIcon />}
                    >
                        <p>
                            Your information may be
                            transferred to and processed
                            in countries other than your
                            country of residence.
                        </p>

                        <div className={styles.worldCard}>
                            <span className={styles.worldOrbit} />
                            <span className={styles.worldOrbitSecondary} />

                            <NetworkIcon />

                            <div>
                                <strong>
                                    Protection remains in
                                    place regardless of
                                    region
                                </strong>

                                <p>
                                    We take appropriate
                                    measures to maintain a
                                    suitable level of data
                                    protection during such
                                    transfers.
                                </p>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="rights"
                        number="07"
                        label="Control"
                        title="Your rights"
                        icon={<UserIcon />}
                    >
                        <p>
                            We aim to provide transparency
                            and give users information
                            about how their data is
                            handled.
                        </p>

                        <div className={styles.warningNotice}>
                            <span>!</span>

                            <p>
                                Data deletion is not
                                supported in our current
                                applications. If you have
                                questions about the
                                collection or processing of
                                data, you may contact us for
                                additional information.
                            </p>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="license"
                        number="08"
                        label="Open source"
                        title="License information"
                        icon={<CodeIcon />}
                    >
                        <p>
                            All our projects are governed
                            by the GNU General Public
                            License version 3.0.
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
                                    The license grants
                                    users the freedom to
                                    use, modify and
                                    distribute the software
                                    under the terms of the
                                    GPL.
                                </p>

                                <a
                                    href="https://www.gnu.org/licenses/gpl-3.0.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open license text

                                    <ArrowIcon />
                                </a>
                            </div>
                        </div>
                    </PolicySection>

                    <PolicySection
                        id="contacts"
                        number="09"
                        label="Feedback"
                        title="Contact us"
                        icon={<MailIcon />}
                    >
                        <p>
                            If you have any questions about
                            this Privacy Policy or our data
                            practices, contact us through
                            one of the channels below.
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
                                href="https://t.me/raf_console_official"
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
                                        @raf_console_official
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

                            <strong>Privacy Policy</strong>
                        </div>

                        <span>
                            Revision dated 25.07.2026
                        </span>
                    </footer>
                </article>
            </div>
        </main>
    );
}