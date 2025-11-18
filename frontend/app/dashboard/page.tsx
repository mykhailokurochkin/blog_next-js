'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Post as PostType } from '../types/Post';
import { getAll, create, remove } from '../api/postsClient';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', description: '' });

  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getAll(),
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; description?: string }) => {
      return create(postData, accessToken!, user?.id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsCreating(false);
      setNewPost({ title: '', content: '', description: '' });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return remove(postId, accessToken!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate(newPost);
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  if (authLoading) return <div>Loading authentication...</div>;
  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Last posts</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Post
          </button>
        )}
      </div>

      {isCreating && user?.role === 'ADMIN' && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleCreatePost}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {createPostMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {postsData?.map((post: PostType) => (
          <div key={post.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link href={`/dashboard/${post.id}`}>
                  <h3 className="text-lg font-semibold hover:text-blue-600">{post.title}</h3>
                </Link>
                {post.description && (
                  <p className="text-gray-600 mt-1">{post.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user?.role === 'ADMIN' && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {/* TODO: Implement edit functionality */}}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletePostMutation.isPending}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
