'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

type ContentBlock = {
  heading: string;
  body: string;
};

export default function CreateGistForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { heading: '', body: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (!quill) return;
  
    quill.root.setAttribute('spellcheck', 'false');
  
    const handler = () => {
      setBlocks(prev =>
        prev.map((b, idx) =>
          idx === activeBlockIndex ? { ...b, body: quill.root.innerHTML } : b
        )
      );
    };
  
    quill.on('text-change', handler);
  
    return () => {
      quill.off('text-change', handler); // clean up
    };
  }, [quill, activeBlockIndex]);
  
  useEffect(() => {
    if (quill && blocks[activeBlockIndex]) {
      quill.root.innerHTML = blocks[activeBlockIndex].body || '';
    }
  }, [activeBlockIndex]);

  const handleBlockHeadingChange = (idx: number, value: string) => {
    const newBlocks = [...blocks];
    newBlocks[idx].heading = value;
    setBlocks(newBlocks);
  };

  const addNewBlock = () => {
    setBlocks([...blocks, { heading: '', body: '' }]);
    setActiveBlockIndex(blocks.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quill) return;

    setLoading(true);

    try {
      let coverUrl = '';
      if (coverFile) {
        const coverRef = ref(storage, `covers/${coverFile.name}-${Date.now()}`);
        const snap = await uploadBytes(coverRef, coverFile);
        coverUrl = await getDownloadURL(snap.ref);
      }

      await addDoc(collection(db, 'gists'), {
        title,
        category,
        coverUrl,
        blocks,
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
      });

      router.push('/');
    } catch (err) {
      console.error('Error creating gist:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Create Gist</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full border px-3 py-2 rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <select
        className="w-full border px-3 py-2 rounded"
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        <option value="Twitter">Twitter</option>
        <option value="TikTok">TikTok</option>
        <option value="Instagram">Instagram</option>
        <option value="Politics">Politics</option>
        <option value="Education">Education</option>
      </select>

      <div>
        <label className="font-medium block mb-1">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setCoverFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Content Blocks</h3>

        <div className="flex flex-col space-y-6">
          {blocks.map((block, idx) => (
            <div key={idx} className="p-4 border rounded bg-gray-50">
              <label className="block font-medium mb-1">
                Block Heading
              </label>
              <input
                type="text"
                value={block.heading}
                onChange={(e) => handleBlockHeadingChange(idx, e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
                placeholder={`e.g., What Happened?`}
              />

              {activeBlockIndex === idx && (
                <>
                  <label className="block font-medium mb-1">
                    Block Content
                  </label>
                  <div ref={quillRef} className="bg-white border rounded h-48" />
                </>
              )}

              {activeBlockIndex !== idx && (
                <button
                  type="button"
                  className="text-indigo-600 underline mt-2"
                  onClick={() => setActiveBlockIndex(idx)}
                >
                  Edit This Block
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
          onClick={addNewBlock}
        >
          Add New Block
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded"
      >
        {loading ? 'Posting...' : 'Post Gist'}
      </button>
    </form>
  );
}
