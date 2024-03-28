import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/navbar/navbar';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/lib/cart.provider';
import AuthProvider from '@/lib/store/auth/auth.provider';
import UseRecordPreviousPath from '@/utils/record-path';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Palugada Store',
  description: 'The best online store for your daily needs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useRecordPreviousPath()
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <UseRecordPreviousPath />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
