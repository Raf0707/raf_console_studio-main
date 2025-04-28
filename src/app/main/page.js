'use client';

import { Github, Mail, Send, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
      <div className='flex flex-col justify-center pt-[96px]'>
        <div className='flex flex-col items-center gap-8'>
          <h1 className='text-2xl text-center font-extrabold text-black dark:text-white mt-3 md:text-7xl'>
            From Idea to Result
          </h1>
          <h2 className='text-2xl'>
            Together with <span className='font-bold'>Raf&lt;/&gt;Console</span>
          </h2>
        </div>
        <div className='grid grid-cols-1 gap-4 mt-[96px] md:grid-cols-3'>
          <div className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
            <p className='text-2xl font-bold'>Website Development</p>
            <p>
              Custom solutions for your business: functional, stylish, effective
            </p>
            <div className='flex gap-2 mt-3 flex-wrap'>
              <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                Speed
              </div>
              <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                Design
              </div>
              <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                Usability
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
            <p className='text-2xl font-bold'>Mobile App Development</p>
            <p>We turn your ideas into powerful growth tools</p>
            <div className='flex gap-2 mt-3 flex-wrap'>
              <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                Android
              </div>
              <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                iOS
              </div>
              <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                Aurora
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center gap-4 p-8 rounded-2xl bg-neutral-50 border dark:bg-neutral-900 dark:border-neutral-800'>
            <p className='text-2xl font-bold'>CEO: Advertising and Promotion</p>
            <p>More clients, more sales, more profit!</p>
            <div className='flex gap-2 mt-3 flex-wrap'>
              <div className='py-2 px-3 rounded-3xl bg-blue-500 text-white font-medium'>
                Analytics
              </div>
              <div className='py-2 px-3 self-center rounded-3xl bg-rose-500 text-white font-medium'>
                Content
              </div>
              <div className='py-2 px-3 rounded-3xl bg-violet-500 text-white font-medium'>
                Promotion
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-center mt-[96px] gap-5'>
          <p className='font-bold text-3xl self-center'>About Us</p>
          <div className='font-medium text-lg text-center p-6 bg-neutral-50 border rounded-2xl dark:bg-neutral-900 dark:border-neutral-800'>
            <br />Hi! We are Raf&lt;/&gt;Console Studio — a mobile app development studio.<br />

            <br />Our goal is to create useful and user-friendly applications that solve real user problems.<br />

            <br />We specialize in developing cross-platform applications for Android and iOS using Flutter and FlutterFlow technologies.<br />

            <br />We don’t just build apps — we help you build your business and establish processes for growing its revenue. Our goal is your app’s profitability and long-term collaboration.<br />
          </div>
        </div>
        <div className='flex flex-col justify-center mt-[96px] gap-5'>
          <p className='font-bold text-3xl self-center'>Contact us</p>
          <div className='flex flex-col justify-center gap-6'>
            <p className='font-medium text-lg self-center text-center'>
              If you have any questions or suggestions,
              <br /> feel free to contact us via:
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
