// lib/api.ts
import { db } from './firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
// import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

import { Gist } from '@/types';

// export async function fetchGists(category?: string) {
//   let q = query(
//     collection(db, 'gists'),
//     orderBy('createdAt', 'desc'),
//   );
//   if (category && category !== 'All') {
//     q = query(q, where('category', '==', category));
//   }
//   const snap = await getDocs(q);
//   return snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
// }

// import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
// import { db } from './firebase';

export async function fetchGists(category: string): Promise<Gist[]> {
  let q;

  if (category === 'All') {
    q = query(collection(db, 'gists'), orderBy('createdAt', 'desc'));
  } else {
    q = query(
      collection(db, 'gists'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
