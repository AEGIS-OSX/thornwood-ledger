import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thornwood Ledger',
  description: 'Thornwood Ledger — chain-of-custody ledger for regional grain co-operatives. Faster settlement, transparent grade arbitration.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thornwoodledger.com'),
  keywords: ['grain ledger', 'chain of custody', 'grain co-operative', 'settlement', 'grade arbitration'],
  openGraph: {
    title: 'Thornwood Ledger',
    description: 'Chain-of-custody ledger for regional grain co-operatives. Faster settlement, transparent grade arbitration.',
    type: 'website',
    siteName: 'Thornwood Ledger',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thornwood Ledger',
    description: 'Chain-of-custody ledger for regional grain co-operatives. Faster settlement, transparent grade arbitration.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
