'use client';

import { useEffect, useState } from 'react';
import { fetchGists } from '@/lib/api';
import GistCard from '@/components/GistCard';
import { useAuth } from '@/context/AuthContext';
import type { Gist } from '@/types';

const categories = ['All', 'Twitter', 'TikTok', 'Instagram', 'Education', 'Politics'];

export default function Home() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('All');
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchGists(selected)
      .then((data: Gist[]) => setGists(data))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <main className="bg-white min-h-screen p-4">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full transition ${
              selected === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading gists…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gists.map(g => (
            <GistCard key={g.id} gist={g} user={user} />
          ))}
        </div>
      )}
    </main>
  );
}
