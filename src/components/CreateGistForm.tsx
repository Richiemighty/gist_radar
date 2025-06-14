'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreateGistForm({ user }: { user: any }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Twitter');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let mediaUrl = '';
    if (media) {
      const storageRef = ref(storage, `media/${Date.now()}-${media.name}`);
      await uploadBytes(storageRef, media);
      mediaUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'gists'), {
      title,
      content,
      category,
      mediaUrl,
      authorId: user.uid,
      createdAt: serverTimestamp(),
    });

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <ReactQuill value={content} onChange={setContent} />

      <select
        className="w-full border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Twitter</option>
        <option>TikTok</option>
        <option>Instagram</option>
        <option>Education</option>
        <option>Politics</option>
      </select>

      <input type="file" onChange={handleMediaChange} />

      {mediaPreview && (
        <div className="mt-2">
          {media?.type.includes('video') ? (
            <video src={mediaPreview} controls className="w-full max-h-60 rounded" />
          ) : (
            <img src={mediaPreview} alt="Preview" className="w-full max-h-60 object-cover rounded" />
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {loading ? 'Posting...' : 'Post Gist'}
      </button>
    </form>
  );
}
