import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CampusFind | University Lost & Found Recovery Platform',
  description: 'Reconnecting students and staff with their lost belongings intelligently and securely across campus.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased selection:bg-sky-500 selection:text-white flex flex-col">
        <AppProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
