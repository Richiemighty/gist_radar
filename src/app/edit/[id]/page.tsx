'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';
import type { Gist } from '@/app/types';

type GistWithId = Gist & { id: string };

export default function EditGistPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id')!;
  const { user } = useAuth();

  const [gist, setGist] = useState<GistWithId | null>(null);
  const [title, setTitle] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<{ heading: string; body: string }[]>([]);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'gists', id));
      if (!snap.exists()) return router.push('/');
  
      const data = snap.data() as Omit<Gist, 'id'>;
  
      if (data.authorId !== user?.uid) return router.push('/');
  
      setGist({ ...data, id: snap.id });
      setTitle(data.title);
      setBlocks(data.blocks || []);
    })();
  }, [id, user, router]);
    
  const handleAddBlock = () => setBlocks([...blocks, { heading: '', body: '' }]);

  const handleBlockChange = (idx: number, field: 'heading' | 'body', val: string) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[idx][field] = val;
    setBlocks(updatedBlocks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gist) return;

    let coverUrl = gist.coverUrl;

    if (coverFile) {
      const uploadResult = await uploadBytes(
        ref(storage, `covers/${coverFile.name}-${Date.now()}`),
        coverFile
      );
      coverUrl = await getDownloadURL(uploadResult.ref);
    }

    await updateDoc(doc(db, 'gists', id), { title, coverUrl, blocks });
    router.push(`/gists/${id}`);
  };

  if (!gist) return <p className="p-6 text-center">Loading or unauthorized…</p>;

  return (
    <main className="max-w-3xl mx-auto bg-white p-6 shadow rounded space-y-6">
      <h1 className="text-2xl font-bold">Edit Gist</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
        />

        <div>
          <h2 className="font-semibold mb-2">Content Blocks</h2>
          {blocks.map((blk, i) => (
            <div key={i} className="space-y-2 mb-4 border p-3 rounded bg-gray-50">
              <input
                type="text"
                placeholder="Block title"
                className="w-full border px-2 py-1 rounded"
                value={blk.heading}
                onChange={(e) => handleBlockChange(i, 'heading', e.target.value)}
                required
              />
              <textarea
                placeholder="Block content (HTML allowed)"
                className="w-full border px-2 py-1 rounded h-24"
                value={blk.body}
                onChange={(e) => handleBlockChange(i, 'body', e.target.value)}
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddBlock}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            + Add Block
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
