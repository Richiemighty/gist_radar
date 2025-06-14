// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { db, storage, auth } from '@/lib/firebase';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { uuidv4 } from '@firebase/util';

// export default function CreateGist() {
//   const router = useRouter();

//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState('Twitter');
//   const [content, setContent] = useState('');
//   const [mediaFile, setMediaFile] = useState<File | null>(null);
//   const [sourceUrl, setSourceUrl] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) setMediaFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title || !content) return;

//     setSubmitting(true);
//     let mediaUrl = '';

//     try {
//       if (mediaFile) {
//         const ext = mediaFile.name.split('.').pop();
//         const storageRef = ref(storage, `gists/${auth.currentUser?.uid}/${uuidv4()}.${ext}`);
//         const snapshot = await uploadBytes(storageRef, mediaFile);
//         mediaUrl = await getDownloadURL(snapshot.ref);
//       }

//       await addDoc(collection(db, 'gists'), {
//         title,
//         category,
//         content,
//         mediaUrl,
//         sourceUrl,
//         authorId: auth.currentUser?.uid,
//         createdAt: serverTimestamp(),
//       });

//       router.push('/dashboard');
//     } catch (err) {
//       console.error(err);
//       setSubmitting(false);
//     }
//   };

//   return (
//     <main className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md mt-6 animate-fadeIn">
//       <h1 className="text-2xl font-bold mb-4 text-indigo-600">Create a New Gist</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block font-medium">Title</label>
//           <input
//             className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 transition"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Category</label>
//           <select
//             className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 transition"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             {['TikTok', 'Instagram', 'Twitter', 'Education', 'Politics'].map((cat) => (
//               <option key={cat}>{cat}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Content</label>
//           <textarea
//             className="w-full p-2 h-40 border rounded focus:ring-indigo-500 focus:border-indigo-500 transition"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Media (optional)</label>
//           <input
//             type="file"
//             accept="image/*,video/mp4"
//             onChange={handleMediaChange}
//             className="transition"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Source URL (optional)</label>
//           <input
//             type="url"
//             className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 transition"
//             value={sourceUrl}
//             onChange={(e) => setSourceUrl(e.target.value)}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={submitting}
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-transform transform hover:scale-105"
//         >
//           {submitting ? 'Posting…' : 'Post Gist'}
//         </button>
//       </form>
//     </main>
//   );
// }
