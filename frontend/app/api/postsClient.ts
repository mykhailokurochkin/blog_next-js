import axios from 'axios';
import { Post } from '../types/Post';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const postsClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreatePostData {
  title: string;
  content: string;
  description?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  description?: string;
}

export const getAll = async (accessToken: string): Promise<Post[]> => {
  try {
    const response = await postsClient.get('/posts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data.posts || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch posts');
  }
}

export const getById = async (id: number, accessToken: string): Promise<Post> => {
  try {
    const response = await postsClient.get(`/posts/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data.post;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch post');
  }
}

export const create = async (postData: CreatePostData, accessToken: string, userId: number): Promise<Post> => {
  try {
    const response = await postsClient.post('/posts', postData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        userId: userId.toString(),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to create post');
  }
}

export const update = async (id: number, postData: UpdatePostData, accessToken: string): Promise<Post> => {
  try {
    const response = await postsClient.put(`/posts/${id}`, postData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update post');
  }
}

export const remove = async (id: number, accessToken: string): Promise<void> => {
  try {
    await postsClient.delete(`/posts/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to delete post');
  }
}