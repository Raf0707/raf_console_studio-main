'use client';

import { Button } from "@/components/ui/button";
import ContactFormRu from "@/components/layouts_ru/ContactFormRu";

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
                    Разработаем стабильное мобильное приложение от 6 недель и 390 000 ₽
                </h1>
            </section>

            {/* Intro Card and Form */}
            <section className="flex flex-col md:flex-row gap-8">
                <div className="bg-white/70 dark:bg-white/5  rounded-2xl shadow-lg p-8 flex-1 space-y-4">
                    <p className="text-lg font-semibold">✅ Доведем проект до окупаемости!</p>
                    <p>Более 5 лет успешно продвигаем мобильные приложения</p>
                    <p className="text-lg font-semibold">✅ Кросплатформенная разработка</p>
                    <p>на Flutter для iOS, Android и Web</p>
                    <p className="text-lg font-semibold">✅ ASO - оптимизация бесплатно</p>
                    <p className="font-bold text-green-600">Гарантия 12 мес</p>
                </div>

                {/* Form */}
                <ContactFormRu />
            </section>

            {/* Marketing Banner */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                    Не хотите заполнять заявку?<br />
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Тогда свяжитесь с нами напрямую и получите бесплатную консультацию и расчет стоимости вне очереди <br/> <br/>
                        
                        Telegram: @ibn_Rustum <br/> <br/>
                        What&#39;s App: +7 916 273 68 56
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="text-center text-xl font-medium space-y-4">
                <p>Мы не просто разрабатываем приложение, а строим Вам бизнес и налаживаем необходимые процессы для роста его прибыли.</p>
                <p>Наша цель - доходность Вашего приложения и долгосрочное сотрудничество.</p>
            </section>

            {/* 3 Features */}
            <section className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Приложение ваше на 100%",
                        text: "Весь проект, используемые аккаунты и любые наработки принадлежат вам по договору"
                    },
                    {
                        title: "Уменьшаем срок окупаемости",
                        text: "A/B/N тестирование экранов приложения, оптимизация текстов и визуала в магазинах приложений в разы увеличит конверсию в целевое действие"
                    },
                    {
                        title: "Поэтапная оплата проекта",
                        text: "Платите за результат. Разобьем оплату за проект на несколько частей по мере выполнения проекта"
                    }
                ].map((card, i) => (
                    <div key={i} className="bg-white/70 dark:bg-white/5  rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm">{card.text}</p>
                    </div>
                ))}
            </section>

            {/* AI Advantage */}
            <section className="text-center space-y-6">
                <h2 className="text-3xl font-bold">
                    Разрабатываем приложения <br /> в 3 раза дешевле и быстрее, <br /> чем конкуренты
                </h2>

                <div className="bg-white/70 dark:bg-white/5  shadow-md rounded-2xl p-6 max-w-3xl mx-auto">
                    <p className="text-lg">
                        Используя искусственный интеллект мы в разы сокращаем количество часов на создание проектов.
                        Мы автоматизируем и ускоряем большинство рабочих процессов, связанных с маркетингом, дизайном и написанием кода.
                    </p>
                </div>

                <Button onClick={scrollToForm} className="mt-6">Заказать расчет стоимости</Button>
            </section>

            {/* 4 Steps */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">4 простых и понятных этапа займут от 6 недель</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Заполнение брифа", "Написание технического задания", "Разработка приложения", "Тестирование и публикация"].map((step, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/5  shadow-md rounded-2xl p-4 text-sm font-medium">
                            {step}
                        </div>
                    ))}
                </div>
            </section>

            {/* Target Audiences */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Инвестируй в идею и маcштабируй прибыль</h2>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                    {[
                        {
                            title: "Бизнесу",
                            text: "Мобильное приложение - это не просто тренд, но и мощный инструмент для расширения вашего бизнеса..."
                        },
                        {
                            title: "Стартапам",
                            text: "Мы знаем, как важно быстро перевести идею в реальность, особенно для стартапов..."
                        },
                        {
                            title: "Для инвестиций",
                            text: "Инвестирование в мобильные приложения - это отличная возможность получить высокую доходность..."
                        }
                    ].map((card, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/5  rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-400">{card.text}</p>
                        </div>
                    ))}
                </div>
                <Button onClick={scrollToForm}>Получить консультацию</Button>
            </section>

            {/* Marketing Banner */}
            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">
                    Построим и реализуем эффективную рекламную стратегию для вашего приложения:<br />
                    гарантируем быструю окупаемость и максимальный возврат инвестиций
                </h2>

                <div className="bg-muted text-muted-foreground rounded-2xl p-6 max-w-4xl mx-auto">
                    <p className="text-lg">
                        Более 5 лет занимаемся рекламой мобильных приложений. Работали с такими приложениями, как AliExpress, Badoo, Yandex Taxi, Самокат, Delivery Club и др.
                    </p>
                </div>
            </section>

            {/* Services */}
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-center">Наши услуги</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/70 dark:bg-white/5  shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Развитие органики через ASO - оптимизацию</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Оптимизация текстовых метаданных в магазинах приложений</li>
                            <li>Продвижение в топ по ключевым словам</li>
                            <li>Работа с отзывами</li>
                            <li>A/B тестирование иконок и скриншотов</li>
                        </ul>
                    </div>
                    <div className="bg-white/70 dark:bg-white/5  shadow-md rounded-2xl p-6">
                        <h3 className="text-xl font-semibold mb-2">Закупка платного трафика</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                            <li>Настройка и интеграция систем аналитики (Appsflyer, adjust, branch, Appmetrica)</li>
                            <li>Подготовка гипотез и разработка рекламных креативов</li>
                            <li>Создание и управление рекламными кампаниями в Facebook, TikTok, Twitter, Google Ads и др.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
