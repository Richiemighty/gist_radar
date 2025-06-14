'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Comments from '@/components/Comments';
import Reactions from '@/components/Reactions';
import RequireAuth from '@/components/RequireAuth';
import type { Gist } from '@/app/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

interface GistDetailsProps {
  params: { id: string };
}

export default function GistDetails({ params }: GistDetailsProps) {
  const { id } = params;
  const [gist, setGist] = useState<Gist | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGist = async () => {
      const snap = await getDoc(doc(db, 'gists', id));
      if (snap.exists()) {
        setGist({ id: snap.id, ...(snap.data() as any) });
      }
      setLoading(false);
    };
    fetchGist();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this gist?')) return;
    await deleteDoc(doc(db, 'gists', id));
    router.push('/');
  };

  if (loading) return <p className="text-center p-10 animate-pulse">Loading…</p>;
  if (!gist) return <p className="text-center p-10">Gist not found.</p>;

  return (
    <RequireAuth>
      <main className="min-h-screen bg-white font-inter px-4 py-8 lg:px-20">
        {gist.coverUrl && (
          <div className="mb-6">
            <Image
              src={gist.coverUrl}
              alt="Cover"
              width={1200}
              height={600}
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          </div>
        )}

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{gist.title}</h1>
          <p className="text-gray-500">
            {gist.createdAt ? gist.createdAt.toDate().toLocaleDateString() : 'Date unknown'}
          </p>
        </header>

        {gist.embedLink && (
          <div className="bg-gray-900 text-white rounded-lg p-4 mb-8 grid grid-cols-[auto,1fr] gap-4 items-start">
            <Image src="/profile-placeholder.png" alt="Profile" width={48} height={48} className="rounded-full" />
            <div>
              <div className="font-semibold">@EmbedPreview</div>
              <div className="text-gray-300 text-sm mb-2">Link Provided</div>
              <a
                href={gist.embedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-300"
              >
                {gist.embedLink}
              </a>
            </div>
          </div>
        )}

        <article className="space-y-12">
          {gist.blocks?.map((block, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold mb-4">{block.heading}</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: block.body }}
              />
            </section>
          ))}
        </article>

        <hr className="my-8" />
        <div className="flex justify-between items-center">
          <Reactions gistId={id} />
          <button onClick={handleDelete} className="text-red-500 hover:underline">Delete</button>
        </div>

        <Comments gistId={id} />
      </main>
    </RequireAuth>
  );
}
