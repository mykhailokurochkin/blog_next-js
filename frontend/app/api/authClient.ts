import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const authClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await authClient.post('/auth', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Authentication failed.');
  }
};

export const refresh = async (refreshToken: string): Promise<LoginResponse> => {
  try {
    const response = await authClient.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Token refresh failed.');
  }
};

export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await authClient.post('/auth/logout', { refreshToken });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Logout failed.');
  }
};