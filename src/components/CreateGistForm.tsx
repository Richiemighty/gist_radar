'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';

import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default function CreateGistForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.root.setAttribute('spellcheck', 'false');
    }
  }, [quill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quill) return;

    setLoading(true);

    try {
      let mediaUrl = '';
      if (mediaFile) {
        const mediaRef = ref(storage, `media/${mediaFile.name}-${Date.now()}`);
        const snap = await uploadBytes(mediaRef, mediaFile);
        mediaUrl = await getDownloadURL(snap.ref);
      }

      const content = quill.root.innerHTML;

      await addDoc(collection(db, 'gists'), {
        title,
        content,
        category,
        embedLink,
        mediaUrl,
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">Create a Gist</h1>

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
        <option value="Education">Education</option>
        <option value="Politics">Politics</option>
      </select>

      <input
        type="text"
        placeholder="Embed link (e.g., YouTube, Tweet)"
        className="w-full border px-3 py-2 rounded"
        value={embedLink}
        onChange={e => setEmbedLink(e.target.value)}
      />

      <input
        type="file"
        accept="image/*,video/*"
        className="w-full"
        onChange={e => setMediaFile(e.target.files?.[0] || null)}
      />

      <div>
        <p className="mb-1 font-medium">Content:</p>
        <div ref={quillRef} className="bg-white border rounded h-48" />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post Gist'}
      </button>
    </form>
  );
}
