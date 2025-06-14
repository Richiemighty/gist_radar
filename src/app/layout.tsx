import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
// import { AuthProvider } from '@/context/AuthContext';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GistRadar',
  description: 'Your One-Stop Hub for Trending Gists Across Platforms',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}
