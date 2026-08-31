// _context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';
import { api } from '../_hooks/fetcher';
import { jwtDecode } from 'jwt-decode';

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
  login: (code: string) => Promise<void>;
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

    // Verifica se temos o token no LocalStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('@ohara:token') : null;

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      setUser({
        sub: decoded.sub,
        discordId: decoded.discordId,
        globalName: decoded.globalName,
        avatarUrl: decoded.avatarUrl,
        username: decoded.username,
        email: decoded.email,
        serverNickName: decoded.serverNickName,
        serverAvatarUrl: decoded.serverAvatarUrl,
      });

      console.log(`${decoded.globalName || decoded.username}, sessão validada.`);

      if (redirectOnSuccess) {
        router.push('/');
        notify('Login realizado com sucesso!', 'success');
      }
    } catch (error) {
      console.error("Token invalido ou expirado", error);
      localStorage.removeItem('@ohara:token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [router, notify]);

  // Executa uma vez quando o provider é montado
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      // Envia o código temporário para o backend para trocar pelo JWT permanente
      const response = await api.post('/auth/exchange', { code });

      // Se o backend retornar o token como "access_token" no JSON:
      const jwt = response.data.access_token;

      if (jwt) {
        console.log(`JWT obtido com sucesso!`);
        localStorage.setItem('@ohara:token', jwt);
        await checkAuth(true); // O checkAuth agora vai ler do localStorage, decodificar e redirecionar
      } else {
        throw new Error("Token não retornado pelo servidor");
      }
    } catch (error) {
      console.error("Falha ao trocar código temporário pelo JWT", error);
      notify('Falha ao autenticar. Tente fazer login novamente.', 'error');
      setUser(null);
      setIsLoading(false);
      router.push('/');
    }
  }, [checkAuth, notify, router]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) { }
    localStorage.removeItem('@ohara:token');
    setUser(null);
    router.push('/');
    notify('Você saiu da sua conta.', 'info');
  }, [router, notify]);

  const expire = useCallback(() => {
    localStorage.removeItem('@ohara:token');
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