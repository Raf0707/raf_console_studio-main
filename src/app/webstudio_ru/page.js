'use client';

import { Button } from "@/components/ui/button";
import ContactFormWEBRu from "@/components/layouts_ru/ContactFormWEB_ru";

export default function StudioPage() {
    const scrollToForm = () => {
        const form = document.getElementById("contact-form");
        form?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="space-y-24 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Герой-секция */}
            <section className="text-center mt-20">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Разрабатываем эффективные сайты от 3 недель и 150 000 ₽
                </h1>
            </section>

            {/* Интро и форма */}
            <section className="flex flex-col md:flex-row gap-8">
                <div className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-lg p-8 flex-1 space-y-4">
                    <p className="text-lg font-semibold">✅ Увеличим ваше онлайн-присутствие!</p>
                    <p>Более 5 лет успешной разработки и продвижения сайтов</p>
                    <p className="text-lg font-semibold">✅ Современные веб-технологии</p>
                    <p>Используем React, Next.js и современные фреймворки для быстрых и адаптивных сайтов</p>
                    <p className="text-lg font-semibold">✅ Бесплатная SEO-оптимизация</p>
                    <p className="font-bold text-green-600">12 месяцев технической поддержки</p>
                </div>

                {/* Форма */}
                <ContactFormWEBRu />
            </section>

            {/* Баннер с контактами */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                    Предпочитаете живое общение?<br />
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Свяжитесь с нами напрямую для бесплатной консультации и оценки проекта. <br/> <br/>

                        Telegram: @ibn_Rustum <br/> <br/>
                        WhatsApp: +7 916 273 68 56
                    </p>
                </div>
            </section>

            {/* Миссия компании */}
            <section className="text-center text-xl font-medium space-y-4">
                <p>Мы не просто создаем сайты — мы разрабатываем цифровые решения для роста бизнеса.</p>
                <p>Наша цель — ваш онлайн-успех и долгосрочное партнерство.</p>
            </section>

            {/* 3 преимущества */}
            <section className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: "100% ваша собственность",
                        text: "Полное право на весь код, дизайн и активы переходит к вам"
                    },
                    {
                        title: "Оптимизированная работа",
                        text: "Быстрая загрузка, SEO-дружественная структура и дизайн, ориентированный на конверсии"
                    },
                    {
                        title: "Гибкая оплата",
                        text: "Оплата по этапам по мере завершения работ"
                    }
                ].map((card, i) => (
                    <div key={i} className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm">{card.text}</p>
                    </div>
                ))}
            </section>

            {/* Технологическое преимущество */}
            <section className="text-center space-y-6">
                <h2 className="text-3xl font-bold">
                    Разрабатываем сайты <br /> быстрее и выгоднее <br /> традиционных агентств
                </h2>

                <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
                    <p className="text-lg">
                        Используя современные фреймворки и инструменты автоматизации, мы значительно сокращаем сроки разработки,
                        сохраняя высокие стандарты качества дизайна и функциональности.
                    </p>
                </div>

                <Button onClick={scrollToForm} className="mt-6">Запросить оценку проекта</Button>
            </section>

            {/* 4 этапа работы */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">4 четких этапа разработки от 3 недель</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Анализ и планирование", "Дизайн и прототипирование", "Разработка", "Тестирование и запуск"].map((step, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-4 text-sm font-medium">
                            {step}
                        </div>
                    ))}
                </div>
            </section>

            {/* Целевые аудитории */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Цифровые решения для любых бизнес-задач</h2>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                    {[
                        {
                            title: "Корпоративные сайты",
                            text: "Профессиональные решения для укрепления репутации и генерации лидов..."
                        },
                        {
                            title: "Интернет-магазины",
                            text: "Электронная коммерция с удобным интерфейсом и интеграцией платежей..."
                        },
                        {
                            title: "Веб-приложения",
                            text: "Индивидуальные решения для уникальных бизнес-процессов..."
                        }
                    ].map((card, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/5 rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-400">{card.text}</p>
                        </div>
                    ))}
                </div>
                <Button onClick={scrollToForm}>Получить консультацию</Button>
            </section>

            {/* Маркетинговый баннер */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                    Разработаем и реализуем комплексную цифровую стратегию:<br />
                    для максимальной видимости и конверсий
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Годы опыта в веб-разработке и цифровом маркетинге. Мы понимаем, что делает сайты успешными.
                    </p>
                </div>
            </section>

            {/* Услуги */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-center">Наши услуги</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Органический рост через SEO</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Техническая SEO-оптимизация</li>
                            <li>Стратегия ключевых слов и оптимизация контента</li>
                            <li>Внутренняя SEO-оптимизация</li>
                            <li>Повышение скорости и производительности</li>
                        </ul>
                    </div>
                    <div className="bg-white/70 dark:bg-white/5 shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Цифровой маркетинг</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Настройка Google Analytics и Tag Manager</li>
                            <li>Оптимизация коэффициента конверсии</li>
                            <li>Управление рекламными кампаниями (Google Ads, соцсети)</li>
                            <li>Стратегия контент-маркетинга</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}