import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atlas',
  description: 'Market and portfolio simulator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
