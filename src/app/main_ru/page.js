'use client';

import { Github, Mail, Send, MessageSquare } from 'lucide-react';

export default function Home() {
    return (
        <div className='flex flex-col justify-center pt-[96px]'>
            <div className='flex flex-col items-center gap-8'>
                <h1 className='text-2xl text-center font-extrabold text-black dark:text-white mt-3 md:text-7xl'>
                    От идеи до результата
                </h1>
                <h2 className='text-2xl'>
                    Вместе с <span className='font-bold'>Raf&lt;/&gt;Console</span>
                </h2>
            </div>
            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <div className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Разработка сайтов</p>
                    <p>
                        Индивидуальные решения для вашего бизнеса: функционально, стильно,
                        эффективно
                    </p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Скорость
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            Дизайн
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Удобство
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Разработка мобильных приложений</p>
                    <p>Превращаем ваши идеи в мощные инструменты для роста</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Android
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            iOS
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Аврора
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>CEO: реклама и продвижение</p>
                    <p>Больше клиентов, больше продаж, больше прибыли!</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Аналитика
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            Контент
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Продвижение
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-center mt-[96px] gap-5'>
                <p className='font-bold text-3xl self-center'>О нас</p>
                <div className='font-medium text-lg text-center p-6 bg-neutral-50 border rounded-2xl dark:bg-neutral-900 dark:border-neutral-800'>
                    <br/>Привет! Мы - Raf&lt;/&gt;Console Studio - студия разработки мобильных приложений.<br/>

                    <br/>Наша цель — разрабатывать полезные и удобные приложения, которые решают реальные проблемы пользователей.<br/>

                    <br/>Мы специализируемся на разработке мультиплатформенных приложений для Android и iOS с использованием технологий Flutter и FlutterFlow.<br/>

                    <br/>Мы не просто разрабатываем приложение, а строим Вам бизнес и налаживаем необходимые процессы для роста его прибыли. Наша цель - доходность Вашего приложения и долгосрочное сотрудничество.<br/>
                </div>
            </div>
            <div className='flex flex-col justify-center mt-[96px] gap-5'>
                <p className='font-bold text-3xl self-center'>Связь с нами</p>
                <div className='flex flex-col justify-center gap-6'>
                    <p className='font-medium text-lg self-center text-center'>
                        Если у вас есть вопросы или предложения,
                        <br /> не стесняйтесь связаться с нами через:
                    </p>
                    <div className='flex gap-3 justify-center'>
                        <a
                            href='https://github.com/Raf0707'
                            className='flex flex-col items-center gap-2'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <div className='flex p-4 bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800 rounded-[32px]'>
                                <Github width={24} height={24} />
                            </div>
                            <p className='font-medium text-sm'>Github</p>
                        </a>
                        <a
                            href='mailto:raf_android-dev@mail.ru'
                            className='flex flex-col items-center gap-2'
                        >
                            <div className='flex p-4 bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800 rounded-[32px]'>
                                <Mail width={24} height={24} />
                            </div>
                            <p className='font-medium text-sm'>Email</p>
                        </a>
                        <a
                            href='https://t.me/ibn_Rustum'
                            className='flex flex-col items-center gap-2'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <div className='flex p-4 bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800 rounded-[32px]'>
                                <Send width={24} height={24} />
                            </div>
                            <p className='font-medium text-sm'>Telegram</p>
                        </a>
                        <a
                            href='https://wa.me/79162736856'
                            className='flex flex-col items-center gap-2'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <div className='flex p-4 bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800 rounded-[32px]'>
                                <MessageSquare width={24} height={24} />
                            </div>
                            <p className='font-medium text-sm'>WhatsApp</p>
                        </a>
                    </div>
                    <p className='font-medium text-lg self-center text-center mt-4'>
                        WhatsApp: <a href="tel:+79162736856" className="text-blue-600 dark:text-blue-400 hover:underline">+7 916 273 68 56</a>
                    </p>

                    <p className='font-medium text-lg self-center text-center mt-4'>
                        Telegram: <a href="https://t.me/ibn_Rustum" className="text-blue-600 dark:text-blue-400 hover:underline">@ibn_Rustum</a>
                    </p>

                    <p className='font-medium text-lg self-center text-center mt-4'>
                        Email: <a href="mailto:raf_android-dev@mail.ru" className="text-blue-600 dark:text-blue-400 hover:underline">raf_android-dev@mail.ru</a>
                    </p>
                </div>
            </div>
        </div>
    );
}