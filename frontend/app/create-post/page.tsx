'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { create } from '../api/postsClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePostPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({ title: '', content: '', description: '' });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; description?: string }) => {
      return create(postData, accessToken!, user?.id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push(user?.role === 'ADMIN' ? '/admin' : '/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate(newPost);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            Create New Post
          </h1>
          <p className="text-gray-600 mb-8">Share your thoughts with the world</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter post title..."
              required
            />

            <input
              type="text"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Brief description (optional)"
            />

            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={8}
              placeholder="Write your post content here..."
              required
            />

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg text-white px-8 py-3 rounded-lg font-medium"
              >
                {createPostMutation.isPending ? 'Creating...' : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={() => router.push(user?.role === 'ADMIN' ? '/admin' : '/dashboard')}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
