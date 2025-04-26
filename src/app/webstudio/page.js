'use client';

import { Button } from "@/components/ui/button";
import ContactFormWEB from "@/components/layouts/ContactFormWEB";

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
                    We develop high-performance websites starting from 3 weeks and $2,500
                </h1>
            </section>

            {/* Intro Card and Form */}
            <section className="flex flex-col md:flex-row gap-8">
                <div className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-lg p-8 flex-1 space-y-4">
                    <p className="text-lg font-semibold">✅ We'll boost your online presence!</p>
                    <p>Over 5 years of successfully creating and promoting websites</p>
                    <p className="text-lg font-semibold">✅ Modern web technologies</p>
                    <p>Using React, Next.js, and modern frameworks for fast, responsive sites</p>
                    <p className="text-lg font-semibold">✅ Free SEO optimization</p>
                    <p className="font-bold text-green-600">12-month technical support</p>
                </div>

                {/* Form */}
                <ContactFormWEB />
            </section>

            {/* Marketing Banner */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                    Prefer direct communication?<br />
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Contact us directly for a free consultation and project estimate. <br/> <br/>

                        Telegram: @ibn_Rustum <br/> <br/>
                        What's App: +7 916 273 68 56
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="text-center text-xl font-medium space-y-4">
                <p>We don't just build websites - we create digital solutions that drive business growth.</p>
                <p>Our goal is your online success and long-term partnership.</p>
            </section>

            {/* 3 Features */}
            <section className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: "100% your website",
                        text: "Full ownership of all code, designs, and assets transferred to you"
                    },
                    {
                        title: "Performance optimized",
                        text: "Fast loading speeds, SEO-friendly structure, and conversion-focused design"
                    },
                    {
                        title: "Flexible payment",
                        text: "Pay in milestones as we complete each phase of your project"
                    }
                ].map((card, i) => (
                    <div key={i} className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm">{card.text}</p>
                    </div>
                ))}
            </section>

            {/* Tech Advantage */}
            <section className="text-center space-y-6">
                <h2 className="text-3xl font-bold">
                    We develop websites <br /> faster and more cost-effective <br /> than traditional agencies
                </h2>

                <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
                    <p className="text-lg">
                        Using modern frameworks and automation tools, we significantly reduce development time
                        while maintaining high quality standards for design and functionality.
                    </p>
                </div>

                <Button onClick={scrollToForm} className="mt-6">Request project estimate</Button>
            </section>

            {/* 4 Steps */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">4 clear development phases taking from 3 weeks</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Discovery & planning", "Design & prototyping", "Development", "Testing & launch"].map((step, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-4 text-sm font-medium">
                            {step}
                        </div>
                    ))}
                </div>
            </section>

            {/* Target Audiences */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Digital solutions for every business need</h2>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                    {[
                        {
                            title: "Business websites",
                            text: "Professional sites that establish credibility and generate leads..."
                        },
                        {
                            title: "E-commerce platforms",
                            text: "Online stores with seamless shopping experience and payment integration..."
                        },
                        {
                            title: "Web applications",
                            text: "Custom solutions for unique business processes and workflows..."
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
                    We'll develop and execute a comprehensive digital strategy:<br />
                    ensuring maximum online visibility and conversions
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Years of experience in web development and digital marketing. We understand what makes websites successful.
                    </p>
                </div>
            </section>

            {/* Services */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-center">Our web services</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Organic growth through SEO</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Technical SEO optimization</li>
                            <li>Keyword strategy and content optimization</li>
                            <li>On-page SEO enhancements</li>
                            <li>Performance and speed optimization</li>
                        </ul>
                    </div>
                    <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Digital marketing</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Google Analytics and Tag Manager setup</li>
                            <li>Conversion rate optimization</li>
                            <li>PPC campaign management (Google Ads, social media)</li>
                            <li>Content marketing strategy</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}