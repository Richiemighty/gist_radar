'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function Reactions({ gistId }: { gistId: string }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [myReactions, setMyReactions] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return; // Wait until user is available
  
    const load = async () => {
      const docRef = doc(db, 'reactions', gistId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setCounts(data.counts || {});
        const userReacts = data.users?.[user.uid] || [];
        setMyReactions(userReacts);
      }
    };
  
    load();
  }, [gistId, user]);
  
  const toggle = async (emoji: string) => {
    if (!user) return alert('Please login to react');
    const docRef = doc(db, 'reactions', gistId);
    const snap = await getDoc(docRef);
    let data = snap.exists() ? snap.data() : { counts: {}, users: {} };

    const userReacts: string[] = data.users[user.uid] || [];
    const hasReacted = userReacts.includes(emoji);

    if (hasReacted) {
      // remove
      userReacts.splice(userReacts.indexOf(emoji), 1);
      data.counts[emoji] = (data.counts[emoji] ?? 1) - 1;
    } else {
      // add
      userReacts.push(emoji);
      data.counts[emoji] = (data.counts[emoji] ?? 0) + 1;
    }
    data.users[user.uid] = userReacts;

    await setDoc(docRef, data);
    setCounts(data.counts);
    setMyReactions(userReacts);
  };

  const emojis = ['🔥', '😂', '💔', '💯'];

  return (
    <div className="flex gap-4 mb-4">
      {emojis.map(e => (
        <button
          key={e}
          onClick={() => toggle(e)}
          className={`text-2xl transition transform hover:scale-125 ${
            myReactions.includes(e) ? 'opacity-100' : 'opacity-60'
          }`}
        >
          {e} {counts[e] || ''}
        </button>
      ))}
    </div>
  );
}
