import type {Metadata} from 'next';
import {Footer} from '@/components/platform/Footer';
import {Header} from '@/components/platform/Header';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'TrustPM AI',
    template: '%s | TrustPM AI',
  },
  description: 'Evidence-based AI decision support for transparent and trustworthy property governance.',
  openGraph: {
    title: 'TrustPM AI',
    description: 'Evidence-based AI decision support for transparent and trustworthy property governance.',
    type: 'website',
    url: '/',
    siteName: 'TrustPM AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustPM AI',
    description: 'Evidence-based AI decision support for transparent and trustworthy property governance.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
