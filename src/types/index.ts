export interface Gist {
    id: string;
    title: string;
    content: string;
    category: string;
    mediaUrl?: string;
    embedLink?: string;
    createdBy?: string;
    createdAt: {
      seconds: number;
      nanoseconds: number;
    }; // 🔁 removed `?`
  }
  
  
  export interface User {
    uid: string;
    email: string | null;
    displayName?: string;
    role?: 'writer' | 'gistlover';
  }
  