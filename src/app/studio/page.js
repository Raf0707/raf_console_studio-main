'use client';

import { Button } from "@/components/ui/button";
import ContactForm from "@/components/layouts/ContactForm";

export default function StudioPage() {
    const scrollToForm = () => {
        const form = document.getElementById("contact-form");
        form?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="space-y-24 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mt-20">
                <h1 className="text-4xl md:text-5xl font-bold">
                    We develop stable mobile applications starting from 6 weeks and $4,500
                </h1>
            </section>

            {/* Intro Card and Form */}
            <section className="flex flex-col md:flex-row gap-8">
                <div className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-lg p-8 flex-1 space-y-4">
                    <p className="text-lg font-semibold">✅ We&#39;ll make your project profitable!</p>
                    <p>Over 5 years of successfully promoting mobile applications</p>
                    <p className="text-lg font-semibold">✅ Cross-platform development</p>
                    <p>with Flutter for iOS, Android and Web</p>
                    <p className="text-lg font-semibold">✅ Free ASO optimization</p>
                    <p className="font-bold text-green-600">12-month warranty</p>
                </div>

                {/* Form */}
                <ContactForm />
            </section>

            {/* Marketing Banner */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                    Don&#39;t want to fill out the form?<br />
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Then contact us directly and get a free consultation and cost estimate without waiting. <br/> <br/>

                        Telegram: @ibn_Rustum <br/> <br/>
                        What&#39;s App: +7 916 273 68 56
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="text-center text-xl font-medium space-y-4">
                <p>We don&#39;t just develop apps - we build your business and establish processes for profit growth.</p>
                <p>Our goal is your app&#39;s profitability and long-term cooperation.</p>
            </section>

            {/* 3 Features */}
            <section className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: "100% your app",
                        text: "The entire project, all accounts and any developments belong to you under contract"
                    },
                    {
                        title: "Reducing payback period",
                        text: "A/B/N testing of app screens, optimization of texts and visuals in app stores will multiply conversion rates"
                    },
                    {
                        title: "Phased project payment",
                        text: "Pay for results. We'll split payment into several stages as the project progresses"
                    }
                ].map((card, i) => (
                    <div key={i} className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm">{card.text}</p>
                    </div>
                ))}
            </section>

            {/* AI Advantage */}
            <section className="text-center space-y-6">
                <h2 className="text-3xl font-bold">
                    We develop apps <br /> 3 times cheaper and faster <br /> than competitors
                </h2>

                <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
                    <p className="text-lg">
                        Using artificial intelligence, we significantly reduce development time.
                        We automate and accelerate most workflows related to marketing, design and coding.
                    </p>
                </div>

                <Button onClick={scrollToForm} className="mt-6">Request cost estimate</Button>
            </section>

            {/* 4 Steps */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">4 simple and clear stages taking from 6 weeks</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Filling out the brief", "Writing technical specifications", "App development", "Testing and publication"].map((step, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-4 text-sm font-medium">
                            {step}
                        </div>
                    ))}
                </div>
            </section>

            {/* Target Audiences */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Invest in ideas and scale profits</h2>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                    {[
                        {
                            title: "For businesses",
                            text: "A mobile app isn't just a trend, but a powerful tool for business expansion..."
                        },
                        {
                            title: "For startups",
                            text: "We understand how important it is to quickly turn ideas into reality, especially for startups..."
                        },
                        {
                            title: "For investors",
                            text: "Investing in mobile apps is an excellent opportunity for high returns..."
                        }
                    ].map((card, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-400">{card.text}</p>
                        </div>
                    ))}
                </div>
                <Button onClick={scrollToForm}>Get consultation</Button>
            </section>

            {/* Marketing Banner */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                    We&#39;ll build and implement an effective advertising strategy for your app:<br />
                    guaranteeing quick payback and maximum ROI
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Over 5 years in mobile app advertising. Worked with apps like AliExpress, Badoo, Yandex Taxi, Samokat, Delivery Club and others.
                    </p>
                </div>
            </section>

            {/* Services */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-center">Our services</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Organic growth through ASO optimization</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Optimizing text metadata in app stores</li>
                            <li>Keyword ranking improvement</li>
                            <li>Review management</li>
                            <li>A/B testing of icons and screenshots</li>
                        </ul>
                    </div>
                    <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Paid traffic acquisition</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Setup and integration of analytics systems (Appsflyer, adjust, branch, Appmetrica)</li>
                            <li>Hypothesis development and ad creative production</li>
                            <li>Creating and managing ad campaigns on Facebook, TikTok, Twitter, Google Ads etc.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}