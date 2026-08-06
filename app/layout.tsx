import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { brandConfig } from '@/config/brand';
import { AppProviders } from '@/providers';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

const googleSans = localFont({
  src: '../public/fonts/GoogleSansFlex.ttf',
  variable: '--font-google-sans',
  display: 'swap',
  weight: '300 700',
});

export const metadata: Metadata = {
  title: {
    default: brandConfig.name,
    template: `%s | ${brandConfig.name}`,
  },
  description: brandConfig.description,
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-accent selection:text-primary">
        <AppProviders>
          {children}
          <Toaster position="top-center" richColors />
        </AppProviders>
      </body>
    </html>
  );
}