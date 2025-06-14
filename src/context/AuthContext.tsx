'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

type CustomUser = {
  uid: string;
  email: string | null;
  username: string; // Add username here (required)
  role: 'writer' | 'gistlover';
  photoURL?: string | null;
  displayName?: string | null;
};

const AuthContext = createContext<{ user: CustomUser | null }>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: userData.username || 'User', // <-- Get username from Firestore or fallback
          role: userData.role || 'gistlover',
          photoURL: firebaseUser.photoURL || null,
          
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
