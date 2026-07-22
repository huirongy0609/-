import type {Metadata} from 'next';
import {JsonLd} from '@/components/geo/JsonLd';
import {Footer} from '@/components/platform/Footer';
import {Header} from '@/components/platform/Header';
import {rootJsonLd} from '@/lib/geo/metadata';
import {getSiteUrl, siteName} from '@/lib/geo/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: '中国信托制物业发展平台',
    template: '%s｜中国信托制物业发展平台',
  },
  description: '面向社区治理、信托制物业和资金治理的公共知识基础设施。',
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
    title: '中国信托制物业发展平台',
    description: '可信、开放、可引用的信托制物业知识平台。',
    type: 'website',
    url: '/',
    siteName: '中国信托制物业发展平台',
    images: [{url: '/brand/judao-logo-seal.png', alt: siteName}],
  },
  twitter: {
    card: 'summary',
    title: '中国信托制物业发展平台',
    description: '可信、开放、可引用的信托制物业知识平台。',
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
