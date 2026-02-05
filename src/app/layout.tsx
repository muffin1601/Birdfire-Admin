import './globals.css';
import { DM_Sans } from 'next/font/google';
import type { Metadata } from 'next';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'BirdFire Admin',
    template: '%s | BirdFire Admin',
  },
  description:
    'BirdFire administration panel for managing products, categories, orders, inventory, and site content.',
  icons: {
    icon: '/favicon.png'
    // shortcut: '/favicon.ico',
    // apple: '/apple-touch-icon.png',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
