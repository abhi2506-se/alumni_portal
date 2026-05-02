// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Alumni Portal – Connect, Grow, Inspire',
    template: '%s | Alumni Portal',
  },
  description: 'The official alumni network platform – connect with peers, find mentors, discover jobs, and grow professionally.',
  keywords: ['alumni', 'networking', 'mentorship', 'jobs', 'college', 'students'],
  authors: [{ name: 'Alumni Portal Team' }],
  creator: 'Alumni Portal',
  manifest: '/manifest.json',
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         process.env.NEXTAUTH_URL,
    title:       'Alumni Portal – Connect, Grow, Inspire',
    description: 'The official alumni network platform.',
    siteName:    'Alumni Portal',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Alumni Portal',
    description: 'Connect with alumni, find mentors, discover opportunities.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfaf5' },
    { media: '(prefers-color-scheme: dark)',  color: '#0d1129' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#3b5ff4', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
