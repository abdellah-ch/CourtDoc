import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';

// import { Cairo, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';

// const cairo = Cairo({
//   subsets: ['arabic', 'latin'],
//   variable: '--font-arabic',
//   weight: ['400', '600', '700'],
//   display: 'swap',
// });

// const poppins = Poppins({
//   subsets: ['latin'],
//   variable: '--font-latin',
//   weight: ['400', '600', '700'],
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: 'تطبيق المراسلات',
  description: 'نظام إدارة الرسائل',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="" dir='rtl'>
      {/* add lated to className */}
      {/* ${cairo.variable} ${poppins.variable} */}
      <body className={` bg-gray-100 text-gray-900`}>

        <LanguageProvider>
          <Toaster />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
