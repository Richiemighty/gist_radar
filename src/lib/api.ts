import type { Gist } from '@/app/types'; // or wherever your interface is defined
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust import path as needed

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
  return snapshot.docs.map(doc => {
    const data = doc.data() as Omit<Gist, 'id'>; // Cast doc.data() to Gist without id
    return { id: doc.id, ...data };
  });
}


export async function searchGists(queryText: string): Promise<Gist[]> {
  if (!queryText.trim()) return [];

  const q = query(
    collection(db, 'gists'),
    where('title', '>=', queryText),
    where('title', '<=', queryText + '\uf8ff'),
    orderBy('title'),
    limit(5)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data() as Omit<Gist, 'id'>;
    return { id: doc.id, ...data };
  });
}
