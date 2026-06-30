import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PokéApp — Prueba Técnica',
  description: 'Explorador de Pokémon construido con Next.js y la PokéAPI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Providers>
          <header className="bg-red-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
              <img src="/pokeball.svg" alt="Logo" className="w-8 h-8" />
              <h1 className="text-xl font-bold tracking-wide">PokéApp</h1>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
