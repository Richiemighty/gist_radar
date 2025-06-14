'use client';

import { useEffect, useState } from 'react';
import { fetchGists } from '@/lib/api';
import GistCard from '@/components/GistCard';
import { useAuth } from '@/context/AuthContext';
import type { Gist } from '@/app/types';

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
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 transition-all duration-300">
            Discover & Share Gists
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Explore trending insights and bite-sized ideas from all over the internet.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-300 ease-in-out border ${
                selected === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gist Grid */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading gists…</p>
        ) : gists.length === 0 ? (
          <p className="text-center text-gray-400 italic">No gists found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {gists.map(g => (
              <div key={g.id} className="transition-transform transform hover:-translate-y-1 duration-300 ease-in-out">
                <GistCard gist={g} user={user} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
