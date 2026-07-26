import { Inter } from 'next/font/google';

import { OfflineManager } from '@/components/pwa';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import GlobalPointerEffects from '@/components/effects/GlobalPointerEffects';
import InitialLoadGate from '@/components/loading/InitialLoadGate';
import RouteResponsiveController from '@/components/responsive/RouteResponsiveController';

import './globals.css';
import './mobile-responsive.css';

export const metadata = {
  title: 'Raf</>Console Studio',
  description: 'Raf</>Console Studio',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/logo.svg',
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
    <html lang="en" className="dark" suppressHydrationWarning>
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

          <Header />
          <div id="raf-page-root">{children}</div>
          <Footer />

          {/* Глобальные волны, плазма и остальные pointer-анимации сохранены. */}
          <GlobalPointerEffects />
        </ThemeProvider>
      </body>
    </html>
  );
}
