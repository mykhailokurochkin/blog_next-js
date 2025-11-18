'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { User } from '../types/User';
import { refresh } from '../api/authClient';

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (u: User, token: string) => {
    setUser(u);
    setAccessToken(token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const cookies = document.cookie.split(';');
      const refreshTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('refreshToken=')
      );
      
      if (refreshTokenCookie) {
        const refreshToken = refreshTokenCookie.split('=')[1];
        if (refreshToken) {
          return await refresh(refreshToken);
        }
      }
      throw new Error('No refresh token found');
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken);
    },
    onError: () => {
      logout();
    },
  });

  useEffect(() => {
    refreshMutation.mutate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading: refreshMutation.isPending }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};