'use client';

import { Github, Linkedin, Mail, Send } from 'lucide-react';

export default function Page() {
    return (
        <div className='flex flex-col justify-center pt-[96px]'>
            <div className='flex flex-col items-center gap-8'>
                <h1 className='text-5xl text-center font-extrabold text-black dark:text-white mt-3 md:text-7xl'>
                    Raf&lt;/&gt;Console Studio
                </h1>
                <h2 className='text-2xl'>
                    От идеи до реализации
                </h2>
            </div>

            <div className='flex flex-col justify-center mt-[96px] gap-5'>
                <p className='font-bold text-3xl self-center'>Наши проекты и разработки</p>
                <div className='font-medium text-lg text-center p-6 bg-neutral-50 border rounded-2xl dark:bg-neutral-900 dark:border-neutral-800'>
                    Мы занимаемся мобильной разработкой с 2018 года. Наши работы разделены на исламские приложения и полезные инструменты. Все приложения опубликованы в каталоге RuStore.
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/ru.tabiin.alasmaulhusna" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Аль Асма уль Хусна</p>
                    <p>
                        Читайте и запоминайте 99 имен Аллаха на арабском с переводом и описанием на русском
                    </p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/ru.tabiin.ramadan" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Рамадан</p>
                    <p>Отмечайте дни поста в месяц Рамадан, читайте дуа для сухура и ифтара, в ночь Кадр и дуа для намаза таравих</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/ru.tabiin.counters" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Counters</p>
                    <p>Счетчики для зикра, спорта и всего остального...</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.flashlight" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Flashlight Modify</p>
                    <p>
                        Бесплатный фонарик с регулировкой яркости
                    </p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.alistigfar" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Аль-Истигфар</p>
                    <p>Истигфары, встречающиеся в Коране и достоверных хадисах</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.tahajudcalculator" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Tahajud Calculator</p>
                    <p>Расчет времени молитв Духа и Тахаджуд</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.duaforrichness" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Дуа для богатства</p>
                    <p>
                        32 дуа для успеха, финансового и духовного благополучия
                    </p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.salavat" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Салават</p>
                    <p>Салаваты из книг &#34;Даляиль аль-Хайрат&#34; и &#34;Священные месяцы и благословенные дуа&#34;</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.duaismalazam" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Дуа Исмуль Азам</p>
                    <p>Дуа из книги &#34;Священные месяцы и благословенные дуа&#34;, в которой упоминается Величайшее Имя Аллаха</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.qurantajweed" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Коран с таджвидом</p>
                    <p>Коран с таджвидом и тафсиром Аль-Мунтахаб Аль-Азхар</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.console.quranplayer" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Quran Player</p>
                    <p>Аудио чтения Корана: Камиль Хазарат Самигулин</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.console.quranahmaddiban" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Коран Ахмад Дибан</p>
                    <p>Аудио чтения Корана: Ахмад Дибан</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/raf.console.quran7hours" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Коран за 7 часов</p>
                    <p>Коран с таджвидом и аудио 7 часов 28 минут (Чтец Ахмад Дибан)</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.console.chitalka" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>RafBook</p>
                    <p>Погрузитесь в мир приключений, открывая историю своей любимой книги!</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Kotlin
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            Jetpack Compose
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.console.payflashlight" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Фонарик Premium</p>
                    <p>Эксклюзивное сияние для избранных</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Kotlin
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            Jetpack Compose
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/raf.console.settings" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Настройки</p>
                    <p>Ярлык настроек для избранного</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Kotlin
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            Jetpack Compose
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.console.rrnotes" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>R&R Notes</p>
                    <p>Создавайте и храните заметки с динамическими темами</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Kotlin
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            Jetpack Compose
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.tabiin.saum" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Saum</p>
                    <p>Соблюдайте пост в месяц Рамадан, Шавваль, Зуль-Хиджа, Мухаррам и другие. Соблюдайте сунну по понедельникам и четвергам, пост в белые дни, пост Дауда (мир ему), читайте дуа для сухура и ифтара, в ночь Кадр и дуа для намаза таравих</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/raf.console.qalamsharifaudio" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Калям Шариф Аудио</p>
                    <p>Аудиозапись толкования Корана &#34;Калям Шариф&#34; с комментариями на русском</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
                <a href="https://www.rustore.ru/catalog/app/raf.console.zickreee" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Zickreee</p>
                    <p>Поминайте Аллаха многократно
                        Zickreee - поминание Аллаха Всемогущего:

                        - 99 имен Аллаха
                        - Дуа из Корана
                        - Салаваты
                        - Истигфар
                        - Дуа для достатка
                        - Утренние и вечерние азкары
                        - Дуа Исмуль А&#39;зам
                        - 72 дуа Пророка Мухаммада ﷺ
                        - Дуа и зикр после намаза
                        - 33 защитных аята Аль-Хирз (Аналог Манзиля)
                        - Рукъя - лечение аятами Корана
                        - Дуа и зикр на каждый день
                        - Даляиль Аль-Хайрат
                        - Счетчик
                        - Сохраненные</p>
                    <div className='flex gap-2 mt-3 flex-wrap'>
                        <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                            Java
                        </div>
                        <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                            XML
                        </div>
                        <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                            Material3
                        </div>
                    </div>
                </a>
            </div>

            <div className='flex flex-col justify-center mt-[96px] gap-5'>
                <p className='font-bold text-3xl self-center'>Свяжитесь с нами</p>
                <div className='flex flex-col justify-center gap-6'>
                    <p className='font-medium text-lg self-center text-center'>
                        Если у вас есть вопросы или предложения,
                        <br /> вы можете связаться с нами через:
                    </p>
                    <div className='flex gap-7 justify-center'>
                        <a
                            href='https://github.com/Raf0707'
                            className='flex flex-col items-center gap-2'
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
                        >
                            <div className='flex p-4 bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800 rounded-[32px]'>
                                <Send width={24} height={24} />
                            </div>
                            <p className='font-medium text-sm'>Telegram</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}