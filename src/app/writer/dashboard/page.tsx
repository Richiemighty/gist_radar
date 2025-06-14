'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Gist } from '@/app/types';

export default function WriterDashboard() {
  const { user } = useAuth();
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return router.push('/');
    if (user.role !== 'writer') return router.push('/');

    const fetchGists = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'gists'),
        where('createdBy', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const gistsData: Gist[] = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<Gist, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });
      setGists(gistsData);
      setLoading(false);
    };

    fetchGists();
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gist permanently?')) return;
    await deleteDoc(doc(db, 'gists', id));
    setGists(prev => prev.filter(g => g.id !== id));
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 transition-all">Your Gists</h1>
          <Link
            href="/writer/create"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            + New Gist
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading your gists…</p>
        ) : gists.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500">You have no gists yet.</p>
            <p className="text-sm text-gray-400">Click “New Gist” to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gists.map(g => (
              <div
                key={g.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="mb-2 sm:mb-0">
                  <h2 className="text-xl font-medium text-gray-800">{g.title}</h2>
                  <p className="text-sm text-gray-500">
                    {g.category} •{' '}
                    {g.createdAt ? g.createdAt.toDate().toLocaleDateString() : 'Unknown Date'}
                  </p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <Link
                    href={`/writer/edit/${g.id}`}
                    className="text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
