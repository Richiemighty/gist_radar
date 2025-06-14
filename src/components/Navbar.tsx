'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };


  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link href="/" className="text-xl font-bold">GistRadar</Link>

      <div className="space-x-4 flex items-center">
        {!user ? (
          <>
            <Link href="/login" className="hover:text-indigo-600 transition">Login</Link>
            <Link href="/signup" className="hover:text-indigo-600 transition">Signup</Link>
          </>
        ) : (
          <>
            {/* Only writers can see this */}
            {user.role === 'writer' && (
              <Link
                href="/writer/create"
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              >
                Write
              </Link>
            )}

            {/* Common to all logged-in users */}
            <Link
              href="/profile"
              className="hover:text-indigo-600 transition"
            >
              Profile
            </Link>

            <button
              onClick={(handleLogout)}
              className="text-red-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
