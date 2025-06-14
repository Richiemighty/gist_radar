'use client';

import Link from 'next/link';
import { useSaveGist } from '@/hooks/useSaveGist';
import Image from 'next/image';
import type { Gist } from '@/app/types';

export default function GistCard({
  gist,
  user,
}: {
  gist: Gist;
  user: { uid: string } | null;
}) {
  const { isSaved, toggleSave } = useSaveGist(gist.id);

  const displayMedia = gist.coverUrl || gist.coverUrl;
  const firstBlock = gist.blocks?.[0];

  return (
    <div className="bg-white border rounded shadow hover:shadow-md transition overflow-hidden relative">
      {displayMedia && (
        <div className="h-48 overflow-hidden">
          {displayMedia.endsWith('.mp4') ? (
            <video src={displayMedia} controls className="w-full h-full object-cover" />
          ) : (
            <Image
              src={displayMedia}
              alt={gist.title}
              width={500}
              height={300}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-indigo-700">{gist.title}</h2>
        <p className="text-gray-600 text-sm mb-2">{gist.category}</p>

        {/* Block preview */}
        {firstBlock && (
          <div className="text-sm text-gray-800 space-y-1 line-clamp-4">
            <h3 className="font-semibold">{firstBlock.heading}</h3>
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: firstBlock.body }}
            />
          </div>
        )}

        <div className="mt-3 flex justify-between items-center">
          <Link href={`/gists/${gist.id}`} className="text-indigo-600 text-sm hover:underline">
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
