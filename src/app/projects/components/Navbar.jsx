'use client';

import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
      <Drawer>
        <DrawerTrigger className="flex md:hidden p-3">
          <Menu className="h-6 w-6" />
        </DrawerTrigger>
        <DrawerContent className="h-[90vh]">
          <div className="mx-auto w-full max-w-sm p-6">
            <ul className="space-y-4">
              <li>
                <a href="/" className="block py-3 px-4 text-lg rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Main
                </a>
              </li>
              <li>
                <a href="/appstudio" className="block py-3 px-4 text-lg rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  AppStudio
                </a>
              </li>
              <li>
                <a href="/webstudio" className="block py-3 px-4 text-lg rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  WebStudio
                </a>
              </li>
              <li>
                <a href="/projects" className="block py-3 px-4 text-lg rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="/contacts" className="block py-3 px-4 text-lg rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Contacts
                </a>
              </li>
              <li>
                <a href="/privacy" className="block py-3 px-4 text-lg rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close Menu
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
  );
}