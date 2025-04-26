'use client';

import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Navbar({ navLinks, isRussian }) {
  return (
      <Drawer>
        <DrawerTrigger className="flex md:hidden p-3">
          <Menu className="h-6 w-6" />
        </DrawerTrigger>
        <DrawerContent className="h-[90vh]">
          <div className="mx-auto w-full max-w-sm p-6">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                        href={link.href}
                        className="block py-3 px-4 text-lg rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
              ))}
            </ul>

            <div className="mt-8">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  {isRussian ? 'Закрыть меню' : 'Close Menu'}
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
  );
}