import type {Metadata} from 'next';
import {JsonLd} from '@/components/geo/JsonLd';
import {Footer} from '@/components/platform/Footer';
import {Header} from '@/components/platform/Header';
import {rootJsonLd} from '@/lib/geo/metadata';
import {getSiteUrl, siteDescription, siteName} from '@/lib/geo/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteName,
    template: `%s｜${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: '/',
    types: {'application/rss+xml': '/feed.xml'},
  },
  icons: {
    icon: '/brand/judao-logo-seal.png',
    apple: '/brand/judao-logo-seal.png',
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: 'website',
    url: '/',
    siteName,
    images: [{url: '/brand/judao-logo-seal.png', alt: siteName}],
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
    images: ['/brand/judao-logo-seal.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>
        <JsonLd data={rootJsonLd} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
