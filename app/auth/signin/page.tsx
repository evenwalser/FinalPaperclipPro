// app/auth/signin/page.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      alert(result.error);
    } else {
      router.push('/');
    }
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-lg">Welcome, {session.user?.name}!</p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">Sign In</h1>
      <button
        onClick={() => signIn('google')}
        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
      >
        Sign in with Google
      </button>
      
      <form onSubmit={handleEmailSignIn} className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          Sign in with Email
        </button>
      </form>
    </div>
  );
}