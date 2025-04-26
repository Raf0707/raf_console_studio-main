'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    let newPath;

    if (pathname === '/') {
      newPath = isRussian ? '/main' : '/main_ru';
    } else if (isRussian) {
      newPath = pathname.replace('_ru', '');
    } else {
      const lastSlashIndex = pathname.lastIndexOf('/');
      if (lastSlashIndex === pathname.length - 1) {
        newPath = pathname.slice(0, -1) + '_ru/';
      } else {
        newPath = pathname + '_ru';
      }
    }

    router.push(newPath || '/');
  };

  const isRussian = pathname.endsWith('_ru') || pathname.includes('_ru/');

  const navLinks = isRussian
      ? [
        { label: 'Главная', href: '/main_ru' },
        { label: 'Студия мобильных приложений', href: '/studio_ru' },
        { label: 'Веб-Студия', href: '/webstudio_ru' },
        { label: 'Проекты', href: '/projects_ru' },
        { label: 'Контакты', href: '/contacts_ru' },
        { label: 'Политика конфиденциальности', href: '/privacy_policy_ru' },
      ]
      : [
        { label: 'Home', href: '/main' },
        { label: 'App Studio', href: '/studio' },
        { label: 'WEB Studio', href: '/webstudio' },
        { label: 'Projects', href: '/projects' },
        { label: 'Contacts', href: '/contacts' },
        { label: 'Privacy Policy', href: '/privacy_policy' },
      ];

  if (!isMounted) return null;

  return (
      <header className={cn(
          'sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b',
          isScrolled && 'shadow-sm'
      )}>
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <Link
              href={isRussian ? '/main_ru' : '/main'}
              className="text-xl font-bold tracking-tight"
          >
            Raf&lt;/&gt;Console Studio<span className="text-primary"></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        'text-sm transition-colors hover:text-primary',
                        pathname === link.href
                            ? 'text-black font-bold'
                            : 'text-foreground/60 font-medium'
                    )}
                >
                  {link.label}
                </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={changeTheme}
                className="rounded-full"
            >
              <Moon className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="rounded-full"
                aria-label={isRussian ? 'Switch to English' : 'Переключить на русский'}
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">{isRussian ? 'EN' : 'RU'}</span>
            </Button>

            {/* Передаем navLinks в Navbar */}
            <Navbar navLinks={navLinks} isRussian={isRussian} />
          </div>
        </div>
      </header>
  );
}