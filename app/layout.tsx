import './globals.css';
import React from 'react';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'FIDS Asset Management System | Angkasa Pura Indonesia',
  description: 'Enterprise Asset Management & Operations SLA Portal for Flight Information Display Systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-100 text-slate-800 min-h-screen antialiased selection:bg-sky-500 selection:text-white" style={{ backgroundColor: '#f1f5f9' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
