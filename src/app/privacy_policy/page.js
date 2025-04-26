'use client';

export default function PrivacyPolicy() {
    return (
        <div className="flex flex-col justify-center pt-[96px] pb-[96px] max-w-3xl mx-auto px-4">
            <h1 className="text-5xl text-center font-extrabold text-black dark:text-white mt-3 mb-12 md:text-6xl">
                Privacy Policy
            </h1>
            <div className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 space-y-6">
                <p><strong>Last updated:</strong> 16.03.2025</p>

                <p>
                    At <strong>Raf&lt;/&gt;Console</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our applications and services. By using our apps, you agree to the collection and use of information in accordance with this policy.
                </p>

                <h2 className="text-2xl font-bold">Information We Collect</h2>
                <p>We collect information to provide, maintain, and improve our applications and services. This may include:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Device information (e.g., model, OS version, and unique identifiers).</li>
                    <li>App usage data (e.g., session duration, features used).</li>
                    <li>Crash reports for troubleshooting and stability improvements.</li>
                </ul>
                <p>
                    We use third-party services such as Firebase Analytics, Firebase Crashlytics, AdMob, Unity Ads, and AppLovin, which may collect additional data based on their own privacy policies.
                </p>

                <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                <p>The information we collect is used for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Analytics: To understand how our apps are used and improve user experience.</li>
                    <li>Advertising: To deliver personalized or contextual advertisements through services like AdMob, Unity Ads, and AppLovin.</li>
                    <li>Troubleshooting: To identify and fix technical issues using crash data from Firebase Crashlytics.</li>
                </ul>
                <p>We do not sell your personal information to third parties.</p>

                <h2 className="text-2xl font-bold">Data Security</h2>
                <p>
                    We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure. Your data is encrypted during transmission and storage.
                </p>

                <h2 className="text-2xl font-bold">Third-Party Services</h2>
                <p>
                    Our applications integrate with third-party services to enhance functionality and user experience. These include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Firebase: For analytics and crash reporting.</li>
                    <li>AdMob, Unity Ads, and AppLovin: For displaying advertisements.</li>
                </ul>
                <p>
                    These services collect and process data according to their own privacy policies. We recommend reviewing these policies to understand their data practices.
                </p>

                <h2 className="text-2xl font-bold">International Data Transfer</h2>
                <p>
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during these transfers.
                </p>

                <h2 className="text-2xl font-bold">Your Rights</h2>
                <p>
                    While we aim to provide transparency and control over your data, it is important to note that data deletion is not supported in our current applications. If you have concerns about data collection, you can reach out to us for more information.
                </p>

                <h2 className="text-2xl font-bold">License Information</h2>
                <p>
                    All our projects are governed by the GNU General Public License (GPL) version 3.0. This license grants users the freedom to use, modify, and distribute the software under the terms of the GPL. For more details, please refer to the full license text at{' '}
                    <a
                        href="https://www.gnu.org/licenses/gpl-3.0.html"
                        className="text-blue-600 dark:text-blue-400 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GNU GPL 3.0
                    </a>.
                </p>

                <h2 className="text-2xl font-bold">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
                <ul className="list-none pl-0 space-y-2">
                    <li>Email: <a href="mailto:raf_android-dev@mail.ru" className="underline text-blue-600 dark:text-blue-400">raf_android-dev@mail.ru</a></li>
                    <li>Telegram: <a href="https://t.me/ibnRustum" className="underline text-blue-600 dark:text-blue-400">@ibnRustum</a></li>
                </ul>
            </div>
        </div>
    );
}
