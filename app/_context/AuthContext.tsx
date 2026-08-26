// _context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';
import { api } from '../_hooks/fetcher';

interface DecodedToken {
  sub: string;
  discordId: string;
  globalName: string | null;
  avatarUrl: string;
  username: string;
  email?: string;
  serverNickName: string | null;
  serverAvatarUrl: string | null;
}

interface AuthContextType {
  user: DecodedToken | null;
  login: () => void;
  checkAuth: (redirectOnSuccess?: boolean) => Promise<void>;
  logout: () => void;
  expire: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotification();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async (redirectOnSuccess = false) => {
    setIsLoading(true);
    try {
      const response = await api.get('/users/me');
      const profile = response.data;
      if (profile) {
        setUser({
          sub: profile.id,
          discordId: profile.discordId,
          globalName: profile.globalName,
          avatarUrl: profile.avatarUrl,
          username: profile.username,
          email: profile.email,
          serverNickName: profile.serverNickName,
          serverAvatarUrl: profile.serverAvatarUrl,
        });
        if (redirectOnSuccess) {
           router.push('/');
           notify('Login realizado com sucesso!', 'success');
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [router, notify]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async () => {
    await checkAuth(true);
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
        await api.post('/auth/logout'); 
    } catch (e) { }
    setUser(null);
    router.push('/');
    notify('Você saiu da sua conta.', 'info');
  }, [router, notify]);

  const expire = useCallback(() => {
    setUser(null);
    router.push('/');
    notify('Sessão expirada. Por favor, faça login novamente.', 'info');
  }, [router, notify]);

  return (
    <AuthContext.Provider value={{ user, login, checkAuth, logout, expire, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);