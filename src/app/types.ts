import type { Timestamp } from 'firebase/firestore';


export interface Gist {
    id: string;
    title: string;
    content: string;
    category: string;
    authorId: string;          // author user id
    mediaUrl?: string;         // optional media url (image/video)
    embedLink?: string;        // optional embedded iframe link  
    createdAt?: Timestamp;
    // Add other fields you expect in your gist documents here
  }
  