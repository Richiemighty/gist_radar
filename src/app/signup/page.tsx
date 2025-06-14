'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        username: username.trim(),
        email: cred.user.email,
        role: 'gistlover',
        createdAt: serverTimestamp(),
        savedGists: [],
      });
      router.push('/login');
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Signup failed');
        }
        }
      };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg animate-fade-in space-y-6"
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold text-indigo-700 text-center">Create Account</h2>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        {[
          { type: 'text', placeholder: 'Username', state: username, setter: setUsername, autoComplete: 'username' },
          { type: 'email', placeholder: 'Email', state: email, setter: setEmail, autoComplete: 'email' },
          { type: 'password', placeholder: 'Password', state: password, setter: setPassword, autoComplete: 'new-password' },
        ].map((field) => (
          <input
            key={field.placeholder}
            type={field.type}
            name={field.autoComplete}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            value={field.state}
            onChange={(e) => field.setter(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
