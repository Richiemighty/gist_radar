'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { searchGists } from '@/lib/api';
import type { Gist, User } from '@/app/types'; // Make sure User includes username
import Image from 'next/image';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Gist[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const sbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      setResults(await searchGists(query));
    };
    if (query.length >= 2) {
      fetch();
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!sbRef.current?.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <nav className="">
      <div className="flex justify-between items-center px-6 py-3 bg-white shadow-md relative z-10">
      <Link href="/" className="text-2xl font-bold text-indigo-600">GistRadar</Link>

      {/* User controls */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link href="/login" className="hover:text-indigo-600 transition">Login</Link>
            <Link href="/signup" className="hover:text-indigo-600 transition">Signup</Link>
          </>
        ) : (
          <>
            {user.role === 'writer' && (
              <Link href="/writer/create"
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              >Write</Link>
            )}

            <ProfileMenu user={user} onLogout={handleLogout} />
          </>
        )}
      </div>

      </div>
            {/* Search bar */}
      {/* <div ref={sbRef} className="relative w-1/3 max-w-md hidden md:block"> */}
      <div
  ref={sbRef}
  className="relative mx-auto w-4/5 lg:w-[70%] block my-2"
>

        <input
          type="text"
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Search gists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {showSearch && results.length > 0 && (
          <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
            {results.map(g => (
              <li key={g.id}>
                <Link
                  href={`/gists/${g.id}`}
                  className="block px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition"
                  onClick={() => {
                    setQuery('');
                    setShowSearch(false);
                  }}
                >
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

    </nav>
  );
}

function ProfileMenu({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Use user's photoURL or fallback avatar
  const profileImage = user.photoURL || '/avatars/logo.png';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Image
          src={profileImage}
          alt="Profile"
          width={32} height={32}
          className="rounded-full"
          unoptimized={true}
        />
        <span className="text-gray-700 font-medium hover:text-indigo-600 transition">
          {user.username}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg py-2 animate-fade-in z-20">
          <Link href="/profile" className="block px-4 py-2 hover:bg-indigo-50">My Profile</Link>
          <Link href="/profile/edit" className="block px-4 py-2 hover:bg-indigo-50">Edit Profile</Link>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
