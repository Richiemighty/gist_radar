'use client';

import Link from 'next/link';
import { useSaveGist } from '@/hooks/useSaveGist';
// import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function GistCard({ gist, user }: { gist: any; user: any }) {
  const { isSaved, toggleSave } = useSaveGist(gist.id);

  return (
    <div className="bg-white border rounded shadow hover:shadow-md transition overflow-hidden relative">
      {gist.mediaUrl && (
        <div className="h-48 overflow-hidden">
          {gist.mediaUrl.endsWith('.mp4') ? (
            <video src={gist.mediaUrl} controls className="w-full h-full object-cover" />
          ) : (
            <Image src={gist.mediaUrl} alt={gist.title} width={500} height={300}  className="w-full h-full object-cover" />
          )}
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-indigo-700">{gist.title}</h2>
        <p className="text-gray-600 text-sm mb-2">{gist.category}</p>
        <p className="text-gray-700 text-sm line-clamp-3">{gist.content}</p>

        <div className="mt-3 flex justify-between items-center">
          <Link
            href={`/gists/${gist.id}`}
            className="text-indigo-600 text-sm hover:underline"
          >
            {user ? 'Read Full Gist →' : 'Preview →'}
          </Link>

          {user && (
            <button
              onClick={toggleSave}
              title={isSaved ? 'Unsave Gist' : 'Save Gist'}
              className="text-xl"
            >
              {isSaved ? '🔖' : '📑'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
