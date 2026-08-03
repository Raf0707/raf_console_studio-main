import { Suspense } from 'react';
import { Inter } from 'next/font/google';

import { OfflineManager } from '@/components/pwa';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/Header';
import Footer from '@/components/layouts/Footer';
import InitialLoadGate from '@/components/loading/InitialLoadGate';
import LiquidGlassRuntime from '@/components/liquid-glass/LiquidGlassRuntime';
import RouteResponsiveController from '@/components/responsive/RouteResponsiveController';

import './globals.css';
import './mobile-responsive.css';
import '@/components/liquid-glass/liquid-glass.css';
import '@/components/liquid-glass/adaptive-shaders.css';
import '@/components/liquid-glass/privacy-policy-hero.css';
import '@/components/liquid-glass/studio-crystal.css';
import '@/components/liquid-glass/mobile-crystal-drawer.css';
import '@/components/liquid-glass/performance-overrides.css';

export const metadata = {
  title: 'Raf</>Console Studio',
  description: 'Raf</>Console Studio',
  applicationName: 'Raf Console Studio',

  manifest: '/manifest.webmanifest',

  icons: {
    icon: [
      {
        url: '/favicon.ico?v=7',
        type: 'image/x-icon',
        sizes: 'any',
      },
      {
        url: '/favicon.svg?v=7',
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        url: '/favicon-96x96.png?v=7',
        type: 'image/png',
        sizes: '96x96',
      },
      {
        url: '/web-app-manifest-192x192.png?v=7',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/web-app-manifest-512x512.png?v=7',
        type: 'image/png',
        sizes: '512x512',
      },
    ],

    shortcut: [
      {
        url: '/favicon.ico?v=7',
        type: 'image/x-icon',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png?v=7',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },

  appleWebApp: {
    capable: true,
    title: 'Raf Console',
    statusBarStyle: 'black-translucent',
  },

  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-title': 'Raf Console',
  },
};

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const viewport = {
  themeColor: '#080a11',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      className="dark raf-glass-fallback raf-refraction-lite"
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-screen overflow-x-hidden bg-neutral-950 text-white antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <OfflineManager />
          <RouteResponsiveController />
          <InitialLoadGate />

          <div id="raf-liquid-root">
            <Suspense fallback={null}>
              <Header />
              <LiquidGlassRuntime />
            </Suspense>

            <div id="raf-page-root">
              {children}
            </div>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
