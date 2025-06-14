'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: Timestamp;
}

interface CommentsProps {
  gistId: string;
}

export default function Comments({ gistId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('gistId', '==', gistId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) =>
          ({
            id: doc.id,
            user: doc.data().user,
            text: doc.data().text,
            createdAt: doc.data().createdAt,
          } as Comment)
      );
      setComments(fetchedComments);
    });

    return () => unsubscribe();
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

      {comments.map((c) => (
        <div key={c.id} className="border-b pb-2">
          <p className="text-sm text-gray-600">
            <strong>{c.user}</strong> ·{' '}
            {c.createdAt?.toDate
              ? new Date(c.createdAt.toDate()).toLocaleString()
              : 'Just now'}
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
