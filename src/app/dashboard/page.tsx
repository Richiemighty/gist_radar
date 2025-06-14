'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!user) {
    return <p className="text-center mt-10">Please log in to view the dashboard.</p>;
  }

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {role === 'writer' ? (
        <div className="space-y-4">
          <h2 className="text-xl">Writer Dashboard ✍️</h2>
          <ul className="list-disc pl-5">
            <li><a href="/create-gist" className="text-blue-600 underline">Create a New Gist</a></li>
            <li>View Your Gists (coming soon)</li>
            <li>Edit/Delete Your Gists (coming soon)</li>
          </ul>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-2">GistLover Dashboard 🧑‍💻</h2>
          <p>Saved gists and comments (coming soon)</p>
        </div>
      )}
    </div>
  );
}
