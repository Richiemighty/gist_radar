export interface Gist {
    id: string;
    title: string;
    content: string;
    category: string;
    authorId: string;          // author user id
    mediaUrl?: string;         // optional media url (image/video)
    embedLink?: string;        // optional embedded iframe link  
    createdAt?: any;  // Firestore timestamps can be tricky, you can type as `any` or `Timestamp` if you import it
    // Add other fields you expect in your gist documents here
  }
  