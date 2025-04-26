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
                    From Idea to Implementation
                </h2>
            </div>

            <div className='flex flex-col justify-center mt-[96px] gap-5'>
                <p className='font-bold text-3xl self-center'>Our Projects and Developments</p>
                <div className='font-medium text-lg text-center p-6 bg-neutral-50 border rounded-2xl dark:bg-neutral-900 dark:border-neutral-800'>
                    We&#39;ve been doing Android development since 2020. Our work is divided into Islamic apps and useful tools. All apps are published in the RuStore catalog.
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
                <a href="https://www.rustore.ru/catalog/app/ru.tabiin.alasmaulhusna" className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
                    <p className='text-2xl font-bold'>Al Asma Ul Husna</p>
                    <p>
                        Read and memorize 99 names of Allah in Arabic, with translation and description in Russian
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
                    <p className='text-2xl font-bold'>Ramadan</p>
                    <p>Celebrate the fasting days in the month of Ramadan, read dua for suhoor and iftar, in the night of Qadr and dua for tarawih prayer</p>
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
                    <p>Counters for dhikr, sports and everything else at the very...</p>
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
                        Free Flashlight with Brightness Control
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
                    <p className='text-2xl font-bold'>Al-Istigfar</p>
                    <p>Al-Istighfars found in the Quran and authentic Hadiths</p>
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
                    <p>Calculation of Duha and Tahajjud prayer times</p>
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
                    <p className='text-2xl font-bold'>Dua for Reachness</p>
                    <p>
                        32 Duas for Success, Financial and Spiritual Well-Being
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
                    <p className='text-2xl font-bold'>Salavat</p>
                    <p>Salawat from the books &#34;Dala&#39;il al-Khayrat&#34; and &#34;Sacred Months and Blessed Duas&#34; </p>
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
                    <p className='text-2xl font-bold'>Dua ismul Azam</p>
                    <p>Dua from the book &#34;Sacred Months and Blessed Duas&#34;, in which the Greatest Name of Allah is mentioned</p>
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
                    <p className='text-2xl font-bold'>Quran with Tajweed</p>
                    <p>Quran with Tajweed and Tafsir Al-Muntahab Al-Azhar</p>
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
                    <p>Audio readings of the Koran Reader: Kamil Khazrat Samigulin</p>
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
                    <p className='text-2xl font-bold'>Koran Ahmad Diban</p>
                    <p>Audio readings of the Quran Reciter: Ahmad Diban</p>
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
                    <p className='text-2xl font-bold'>Quran in 7 hours</p>
                    <p>Quran with Tajweed and Audio Quran 7 hours 28 minutes (Reciter Ahmad Diban)</p>
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
                    <p>Dive into the world of adventure as you discover your favorite book&#39;s story!</p>
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
                    <p className='text-2xl font-bold'>Flashlight Premium</p>
                    <p>Exclusive shine for the chosen few</p>
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
                    <p className='text-2xl font-bold'>Settings</p>
                    <p>Settings shortcut for favorites</p>
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
                    <p>Create and store notes with dynamic themes</p>
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
                    <p>Celebrate the fasting days in the month of Ramadan, Shawal, Dhul-Hijjah, Muharram, and others. Perform the sunnah on Mondays and Thursdays, fast on white days, fast the fast of Dawood, peace be upon him, read the dua for suhoor and iftar, in the night of Qadr and the dua of tarawih prayer</p>
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
                    <p className='text-2xl font-bold'>Qalam Sharif Audio</p>
                    <p>Audio recording of the interpretation of the Quran &#34;Kalam Sharif&#34; with comments in Russian</p>
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
                    <p>Remember Allah many times
                        Zickreee - remembrance of Allah Almighty:

                        - 99 names of Allah
                        - Dua from the Quran
                        - Salavat
                        - Istighfar
                        - Dua for wealth
                        - Morning and evening adhkars
                        - Dua ismul A&#39;zam
                        - 72 dua of the Prophet Muhammad Sall-Allahu alayhi wa Sallam
                        - Dua and dhikr after prayer
                        - 33 verses of protection Al-Hirz (Analogue of Manzil)
                        - Ruqya - treatment with verses of the Quran
                        - Dua and dhikr for every day
                        - Dala&#39;il Al-Khayrat
                        - Counter
                        - Saved</p>
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
                <p className='font-bold text-3xl self-center'>Contact us</p>
                <div className='flex flex-col justify-center gap-6'>
                    <p className='font-medium text-lg self-center text-center'>
                        If you have any questions or suggestions,
                        <br /> feel free to contact us via:
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
