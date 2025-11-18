'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getById, update } from '../../api/postsClient';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  const postId = parseInt(id as string);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: ''
  });

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getById(postId, accessToken!),
    enabled: !isNaN(postId) && !!accessToken,
  });

  const updatePostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; description?: string }) => {
      return update(postId, postData, accessToken!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      router.push(`/posts/${postId}`);
    },
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        description: post.description || ''
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePostMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user || !accessToken) return <div>Loading...</div>;
  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
              <p className="text-gray-600">Update your post content</p>
            </div>
            <Link
              href={`/posts/${postId}`}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 font-medium"
            >
              <span>Cancel</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Brief description of your post"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Write your post content here..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.push(`/posts/${postId}`)}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatePostMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg text-white px-8 py-3 rounded-lg font-medium"
              >
                {updatePostMutation.isPending ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}