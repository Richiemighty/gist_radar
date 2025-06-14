'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GistCard from '@/components/GistCard';
import type { Gist } from '@/app/types';

export default function ProfilePage() {
  const { user } = useAuth();

  // Use typed state with Gist[] instead of any[]
  const [savedGists, setSavedGists] = useState<Gist[]>([]);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      const q = query(
        collection(db, 'savedGists'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);

      // Explicitly cast doc.data() to DocumentData, then extract gist and cast to Gist
      const saved = snapshot.docs
        .map(doc => doc.data() as DocumentData)
        .map(data => data.gist as Gist);

      setSavedGists(saved);
    };

    fetchSaved();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile & Saved Gists</h1>

      {savedGists.length === 0 ? (
        <p className="text-gray-500">No saved gists yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedGists.map(gist => (
            <GistCard key={gist.id} gist={gist} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
