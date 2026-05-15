'use client';

import { ReactNode } from 'react';

export const metadata = {
  title: 'VetApp - Veteriner Klinik Yönetim Sistemi',
  description: 'Veteriner klinikleri için modern yönetim sistemi',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
