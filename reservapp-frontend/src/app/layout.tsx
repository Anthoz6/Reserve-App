'use client';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/authContext';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Toaster />
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
