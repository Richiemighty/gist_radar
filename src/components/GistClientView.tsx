'use client';

import Comments from '@/components/Comments';
import Reactions from '@/components/Reactions';
import RequireAuth from '@/components/RequireAuth';
import { Gist, User } from '@/types';

interface Props { gist: Gist; user: User | null; }

export default function GistClientView({ gist, user }: Props) {
  return (
    <RequireAuth>
      <main className="max-w-2xl mx-auto bg-white p-6 shadow rounded space-y-4 animate-fadeIn">
        <h1 className="text-2xl font-bold text-indigo-600">{gist.title}</h1>
        <p className="text-gray-500 text-sm">
            {gist.createdAt
                ? new Date(gist.createdAt.seconds * 1000).toLocaleString()
                : 'Unknown date'}
        </p>

        {gist.mediaUrl && (
          <div className="max-h-96 overflow-hidden rounded">
            {gist.mediaUrl.endsWith('.mp4') ? (
              <video src={gist.mediaUrl} controls className="w-full" />
            ) : (
              <img src={gist.mediaUrl} alt={gist.title} className="object-cover w-full" />
            )}
          </div>
        )}

        {gist.embedLink && (
          <div className="aspect-video mb-4">
            <iframe
              src={gist.embedLink}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="prose prose-indigo">{gist.content}</div>

        <div>
          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
            {gist.category}
          </span>
        </div>

        <hr />
        <Reactions gistId={gist.id} />
        <hr />
        <Comments gistId={gist.id} />
      </main>
    </RequireAuth>
  );
}
