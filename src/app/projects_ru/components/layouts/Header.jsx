'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Header() {
  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    console.log(theme);
  };

  const navLinks = [
    { label: 'Главная', href: '/' },
    { label: 'Студия', href: '/studio' },
    { label: 'Проекты', href: '/projects' },
    { label: 'Контакты', href: '/contacts' },
    { label: 'Политика Конфиденциальности', href: '/privacy_policy' }, // если нужна
  ];

  return (
      <header className='bg-dark border-b border-neutral-200 dark:bg-dark dark:border-neutral-800'>
        <div className='flex justify-between items-center px-4 py-6 md:px-10'>
          <nav>
            <ul className='hidden md:flex gap-10'>
              {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                        href={link.href}
                        className='text-dark dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300'
                    >
                      {link.label}
                    </Link>
                  </li>
              ))}
            </ul>
          </nav>
          <div className='flex gap-3 items-center'>
            <Button
                variant='outline'
                size='icon'
                onClick={changeTheme}
                className='rounded-full'
            >
              <Moon />
            </Button>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <Globe />
            </Button>
          </div>
          <Navbar />
        </div>
      </header>
  );
}
