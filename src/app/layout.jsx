import Script from 'next/script';
import { Inter, Noto_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import SWRProvider from '@/components/providers/SWRProvider';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import './globals.css';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | KoreaMongol',
    default: 'KoreaMongol — Солонгост амьдрах гарын авлага',
  },
  description: 'Монгол иргэдэд зориулсан Солонгос амьдралын бүрэн гарын авлага. Виз, бүртгэл, эмнэлэг, мөнгө шилжүүлэг, хамт олон.',
  keywords: ['Солонгос', 'Монгол', 'виз', 'гарын авлага', 'Korea', 'Mongolia', 'guide', 'KoreaMongol'],
  authors: [{ name: 'KoreaMongol' }],
  creator: 'KoreaMongol',
  publisher: 'KoreaMongol',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'mn_MN',
    url: BASE_URL,
    siteName: 'KoreaMongol',
    title: 'KoreaMongol — Солонгост амьдрах гарын авлага',
    description: 'Монгол иргэдэд зориулсан Солонгос амьдралын бүрэн гарын авлага.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KoreaMongol — Солонгост амьдрах гарын авлага',
    description: 'Монгол иргэдэд зориулсан Солонгос амьдралын бүрэн гарын авлага.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const fontVariables = [
    inter.variable,
    notoSans.variable,
  ].join(' ');

  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
      </head>
      <body className={`${fontVariables} font-sans antialiased`}>
        <AuthProvider>
          <SWRProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-right" richColors />
            </ThemeProvider>
          </SWRProvider>
        </AuthProvider>
        <Analytics />

        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
