import type { Gist } from '@/app/types'; // or wherever your interface is defined
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
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
