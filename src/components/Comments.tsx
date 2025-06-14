'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface Comment { id: string; user: string; text: string; createdAt: any; }

export default function Comments({ gistId }: { gistId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('gistId', '==', gistId),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => setComments(snap.docs.map(d => ({ id: d.id, ...d.data() }) as Comment)));
  }, [gistId]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Login to comment');
    await addDoc(collection(db, 'comments'), {
      gistId,
      user: user.email,
      text,
      createdAt: serverTimestamp(),
    });
    setText('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      {comments.map(c => (
        <div key={c.id} className="border-b pb-2">
          <p className="text-sm text-gray-600">
            <strong>{c.user}</strong> · {new Date(c.createdAt.toDate()).toLocaleString()}
          </p>
          <p>{c.text}</p>
        </div>
      ))}

      <form onSubmit={handleComment} className="mt-4 flex flex-col gap-2">
        <textarea
          className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="self-end bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
