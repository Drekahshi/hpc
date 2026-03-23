import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { WalletProvider } from '@/context/wallet-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthLayout } from '@/components/auth-layout';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'JANI - Blockchain-Powered Conservation',
  description: 'Incentivize and verify environmental conservation efforts with JANI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <FirebaseClientProvider>
          <WalletProvider>
              <AuthLayout>
                {children}
              </AuthLayout>
          </WalletProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
