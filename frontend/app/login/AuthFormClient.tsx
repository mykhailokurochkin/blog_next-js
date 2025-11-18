'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { login as authLogin } from '../api/authClient';

interface AuthFormClientProps {
  onSuccess?: (userId: number) => void;
}

export default function AuthFormClient({ onSuccess }: AuthFormClientProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const authMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return authLogin(email, password);
    },
    onSuccess: (data) => {
      const accessToken = data.accessToken;
      const userFromApi = data.user;

      if (accessToken && userFromApi) {
        login(userFromApi, accessToken);
        onSuccess?.(userFromApi.id);
        router.push('/dashboard');
      } else {
        setError('Invalid response from server.');
      }
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed.');
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    authMutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Register or Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={authMutation.isPending}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={authMutation.isPending}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={authMutation.isPending}
        >
          {authMutation.isPending ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
