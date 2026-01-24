// _context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useNotification } from './NotificationContext';

// O formato exato do payload que seu Back-end envia
interface DecodedToken {
  sub: string;
  discordId: string;
  globalName: string;
  avatarUrl: string;
  serverNickName: string | null;
  serverAvatarUrl: string | null;
  exp: number; // Data de expiração padrão do JWT
}

interface AuthContextType {
  user: DecodedToken | null;
  login: (token: string) => void;
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

  useEffect(() => {
    // Ao carregar a página, verifica se já tem token salvo
    const storedToken = localStorage.getItem('ohara-token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Token inválido", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('ohara-token', token);
    const decoded = jwtDecode<DecodedToken>(token);
    setUser(decoded);
    router.push('/');
    notify('Login realizado com sucesso!', 'success');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('ohara-token');
    setUser(null);
    router.push('/');
    notify('Você saiu da sua conta.', 'info');
  }, [router]);

  const expire = useCallback(() => {
    localStorage.removeItem('ohara-token');
    setUser(null);
    router.push('/');
    notify('Sessão expirada. Por favor, faça login novamente.', 'info');
  }, [router]);
  return (
    <AuthContext.Provider value={{ user, login, logout, expire, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);