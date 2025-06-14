'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export function useSaveGist(gistId: string) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const saveRef = doc(db, 'users', user.uid);
    getDoc(saveRef).then(snap => {
      if (snap.exists()) {
        const saved = snap.data().savedGists || [];
        setIsSaved(saved.includes(gistId));
      }
    });
  }, [user, gistId]);

  const toggleSave = async () => {
    if (!user) return alert('Login to save gists');
    const saveRef = doc(db, 'users', user.uid);
    if (isSaved) {
      await updateDoc(saveRef, { savedGists: arrayRemove(gistId) });
    } else {
      await updateDoc(saveRef, { savedGists: arrayUnion(gistId) });
    }
    setIsSaved(!isSaved);
  };

  return { isSaved, toggleSave };
}
