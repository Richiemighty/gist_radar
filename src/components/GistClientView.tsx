'use client';

import Image from 'next/image';
import Link from 'next/link';
import Comments from '@/components/Comments';
import Reactions from '@/components/Reactions';
import RequireAuth from '@/components/RequireAuth';
import type { Gist } from '@/app/types';
import { useAuth } from '@/context/AuthContext';

export default function GistClientView({ gist, id }: { gist: Gist; id: string }) {
  const { user } = useAuth();
  const isAuthor = user?.uid === gist.authorId;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Gist link copied to clipboard!');
    } catch {
      alert('Failed to copy link.');
    }
  };

  return (
    <RequireAuth>
      <main className="max-w-3xl mx-auto bg-white p-6 shadow rounded space-y-6 animate-fadeIn">
        {/* 🔵 Cover Image */}
        {gist.coverUrl && (
          <div className="rounded-lg overflow-hidden max-h-96">
            <Image
              src={gist.coverUrl}
              alt="Gist cover"
              width={1000}
              height={500}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* 🔵 Title & Date */}
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">{gist.title}</h1>
          <p className="text-gray-500 text-sm">
            {gist.createdAt
              ? gist.createdAt.toDate().toLocaleString()
              : 'Unknown date'}
          </p>
        </div>

        {/* 🔵 Embed Link Preview */}
        {gist.embedLink && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={gist.embedLink}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* 🔵 Block Sections */}
        {(gist.blocks ?? []).length > 0 && (
          <article className="space-y-10">
            {(gist.blocks ?? []).map((block, index) => (
              <section key={index}>
                <h2 className="text-2xl font-semibold mb-2">{block.heading}</h2>
                <div
                  className="prose prose-indigo max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.body }}
                />
              </section>
            ))}
          </article>
        )}

        {/* 🔵 Category */}
        <div>
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            {gist.category}
          </span>
        </div>

        {/* 🔵 Action Buttons */}
        <div className="flex justify-between items-center mt-6 gap-4">
          {/* Author-only Edit Button */}
          {isAuthor && (
            <Link
              href={`/edit/${id}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded transition"
            >
              Edit Gist
            </Link>
          )}

          {/* Share Button (All users) */}
          <button
            onClick={handleShare}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded transition"
          >
            Share Gist
          </button>
        </div>

        {/* 🔵 Reactions & Comments */}
        <hr />
        <Reactions gistId={id} />
        <hr />
        <Comments gistId={id} />
      </main>
    </RequireAuth>
  );
}
