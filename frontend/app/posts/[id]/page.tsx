'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getById } from '../../api/postsClient';
import { useAuth } from '../../context/AuthContext';

export default function PostDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getById(Number(id), accessToken || ''),
    enabled: !!id && !!accessToken,
  });

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
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors duration-200"
          >
            ← Back to Posts
          </button>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            {/* Meta Information */}
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

            {/* Description */}
            {post.description && (
              <div className="text-lg text-gray-600 mb-6 leading-relaxed">
                {post.description}
              </div>
            )}
          </div>

          {/* Content */}
          {post.content && (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          )}

          {/* No content message */}
          {!post.content && !post.description && (
            <div className="text-center py-12">
              <p className="text-gray-500">This post has no content yet.</p>
            </div>
          )}
        </div>

        {/* Actions for Admin */}
        {user?.role === 'ADMIN' && (
          <div className="mt-6 flex gap-4 justify-end">
            <button
              onClick={() => {/* TODO: Implement edit functionality */}}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Edit Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
