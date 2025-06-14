import type { Timestamp } from 'firebase/firestore';

export interface Gist {
  id: string;
  title: string;
  category: string;
  coverUrl?: string;
  embedLink?: string;
  blocks?: { heading: string; body: string }[];
  createdAt?: Timestamp;
  authorId: string;
  authorName: string;
}


// app/types.ts
export interface User {
  uid: string;
  username?: string ;
  displayName?: string | null;
  email?: string | null;
  role?: string;
  photoURL?: string | null;
}
