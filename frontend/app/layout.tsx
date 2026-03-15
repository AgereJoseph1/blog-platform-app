import './globals.css';
import type { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'Blog Platform',
  description: 'Simple blog platform frontend',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
