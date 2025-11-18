'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getById, remove } from '../../api/postsClient';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function PostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getById(Number(id), accessToken || ''),
    enabled: !!id && !!accessToken,
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) throw new Error('No access token');
      return remove(Number(id), accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/admin');
    },
  });

  const handleDeletePost = () => {
    deletePostMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors duration-200"
          >
            ← Back to Posts
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              {post.author && (
                <span className="mr-4">
                  <span className="font-medium">Author:</span> {post.author}
                </span>
              )}
              <span>
                <span className="font-medium">Date:</span> {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            {post.description && (
              <div className="text-lg text-gray-600 mb-6 leading-relaxed">
                {post.description}
              </div>
            )}
          </div>

          {post.content && (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          )}

          {!post.content && !post.description && (
            <div className="text-center py-12">
              <p className="text-gray-500">This post has no content yet.</p>
            </div>
          )}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mt-6 flex gap-4 justify-end">
            <Link
                  href={`/edit-post/${post.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 font-medium"
                >
                  Edit Post
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deletePostMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg text-white px-6 py-3 rounded-lg font-medium"
                >
                  Delete Post
                </button>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Post</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{post?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={deletePostMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
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
