'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Post as PostType } from '../types/Post';
import { getAll, remove } from '../api/postsClient';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getAll(accessToken!),
    enabled: !!accessToken,
  });

  const posts = postsData || [];

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return remove(postId, accessToken!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const handleDeletePost = (postId: number) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete);
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  if (authLoading) return <div>Loading authentication...</div>;
  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
              <p className="text-gray-600">Your personal blog posts and thoughts</p>
            </div>
            {user?.role === 'ADMIN' && (
              <Link
                href="/create-post"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 font-medium"
              >
                <span>Create Post</span>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {Array.isArray(posts) && posts.map((post: PostType) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                  {post.description && (
                    <p className="text-gray-600 mb-3">{post.description}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="mr-4">Date: {new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.author && <span>Author: {post.author}</span>}
                  </div>
                  {post.content && (
                    <p className="text-gray-700">{post.content}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/posts/${post.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                  >
                    View Post
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <>
                      <Link
                        href={`/edit-post/${post.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletePostMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(posts) && posts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Start writing your first post!</p>
          </div>
        )}

        {user?.role === 'ADMIN' && showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletePostMutation.isPending}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
