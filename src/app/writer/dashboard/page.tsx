'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WriterDashboard() {
  const { user } = useAuth();
  const [gists, setGists] = useState<any[]>([]);
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
      setGists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchGists();
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gist permanently?')) return;
    await deleteDoc(doc(db, 'gists', id));
    setGists(prev => prev.filter(g => g.id !== id));
  };

  if (loading) return <p className="p-6 text-center">Loading your gists…</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Your Gists</h1>
      <Link
        href="/writer/create"
        className="inline-block mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        + New Gist
      </Link>

      {gists.length === 0 ? (
        <p>You have no gists yet. Click “New Gist” to get started.</p>
      ) : (
        <div className="space-y-4">
          {gists.map(g => (
            <div key={g.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{g.title}</h2>
                <p className="text-sm text-gray-500">{g.category} • {new Date(g.createdAt?.toDate()).toLocaleDateString()}</p>
              </div>
              <div className="space-x-2">
                <Link
                  href={`/writer/edit/${g.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
