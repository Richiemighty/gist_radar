'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbarPaths = ['/login', '/signup'];

  return (
    <>
      {!hideNavbarPaths.includes(pathname) && <Navbar />}
      {children}
    </>
  );
}
