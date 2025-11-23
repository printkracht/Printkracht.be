import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Printkracht • Wrap & belettering calculator',
  description: 'Bereken wrap- en beletteringsprijzen met uren, materiaal, marge en rush toeslag.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="layout">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
