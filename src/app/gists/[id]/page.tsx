'use client';

import { db } from '@/lib/firebase';
import { use } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Comments from '@/components/Comments';
import Reactions from '@/components/Reactions';
import type { Gist } from '@/app/types';  // <-- import your Gist type

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [gist, setGist] = useState<Gist | null>(null);  // <-- typed state instead of any
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchGist = async () => {
      const docSnap = await getDoc(doc(db, 'gists', id));
      if (docSnap.exists()) {
        // Type assertion to Gist (except createdAt might need special handling)
        const data = docSnap.data() as Omit<Gist, 'id'>;
        setGist({ id: docSnap.id, ...data });
      } else {
        setGist(null);
      }
      setLoading(false);
    };

    fetchGist();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this gist?');
    if (!confirmDelete) return;

    await deleteDoc(doc(db, 'gists', id));
    router.push('/dashboard');
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!gist) return <p className="p-6 text-center">Gist not found 🧐</p>;

  return (
    <main className="max-w-2xl mx-auto bg-white p-6 shadow rounded space-y-4 animate-fadeIn">
      <h1 className="text-2xl font-bold text-indigo-600">{gist.title}</h1>
      <p className="text-gray-500 text-sm">
        {gist.createdAt?.toDate
          ? new Date(gist.createdAt.toDate()).toLocaleString()
          : new Date(gist.createdAt).toLocaleString()}
      </p>

      {gist.mediaUrl && (
        <div className="max-h-96 overflow-hidden rounded">
          {gist.mediaUrl.endsWith('.mp4') ? (
            <video src={gist.mediaUrl} controls className="w-full" />
          ) : (
            <img src={gist.mediaUrl} alt={gist.title} className="object-cover w-full" />
          )}
        </div>
      )}

      {gist.embedLink && (
        <div className="aspect-video mb-4">
          <iframe
            src={gist.embedLink}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="prose prose-indigo">{gist.content}</div>

      <div>
        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
          {gist.category}
        </span>
      </div>

      {user?.uid === gist.authorId && (
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete Gist
        </button>
      )}

      <hr />
      <Reactions gistId={id} />
      <hr />
      <Comments gistId={id} />
    </main>
  );
}
