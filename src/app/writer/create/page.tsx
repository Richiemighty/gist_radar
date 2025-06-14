'use client';

import CreateGistForm from '@/components/CreateGistForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WriterCreatePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'writer') router.push('/');
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user || user.role !== 'writer') return null;

  return (
    <main className="px-4 py-6">
        <CreateGistForm user={user} />
    </main>
  );
}
