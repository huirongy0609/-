import type {Metadata} from 'next';
import {Footer} from '@/components/platform/Footer';
import {Header} from '@/components/platform/Header';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: '中国信托制物业发展平台',
    template: '%s｜中国信托制物业发展平台',
  },
  description: '面向社区治理、信托制物业和资金治理的公共知识基础设施。',
  openGraph: {
    title: '中国信托制物业发展平台',
    description: '可信、开放、可引用的信托制物业知识平台。',
    type: 'website',
    url: '/',
    siteName: '中国信托制物业发展平台',
  },
  twitter: {
    card: 'summary_large_image',
    title: '中国信托制物业发展平台',
    description: '可信、开放、可引用的信托制物业知识平台。',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
