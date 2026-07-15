import type {Metadata} from 'next';
import {Footer} from '@/components/platform/Footer';
import {Header} from '@/components/platform/Header';
import './globals.css';

export const metadata: Metadata = {
  title: '中国信托制物业发展平台',
  description: '面向社区治理、信托制物业和资金治理的公共知识基础设施。',
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
