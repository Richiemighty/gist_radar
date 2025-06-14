'use client';
import Link from 'next/link';
import { useSaveGist } from '@/hooks/useSaveGist';
import { User, Gist } from '@/types';

type Props = { gist: Gist; user: User | null };

export default function GistCard({ gist, user }: Props) {
  const { isSaved, toggleSave } = useSaveGist(gist.id);

  return (
    <div className="...">
      {/* media and content */}
      <Link href={`/gists/${gist.id}`}>
        {user ? 'Read Full Gist →' : 'Preview →'}
      </Link>
      {user && (
        <button onClick={toggleSave} className="text-xl">
          {isSaved ? '🔖' : '📑'}
        </button>
      )}
    </div>
  );
}
