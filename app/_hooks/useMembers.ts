// hooks/useMembers.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from './fetcher';

export interface Role {
  id: string;
  name: string;
  colorHex: string;
  position: number;
}

export interface Member {
  discordId: string;
  username: string;
  globalName: string | null;
  serverNickName: string | null;
  avatarUrl: string;
  serverAvatarUrl: string | null;
  bannerUrl: string | null;
  serverBannerUrl: string | null;
  isBot: boolean;
  colorHex: string;
  joinedServerAt: string;
  updatedAt: string;
  roles: Role[];
}

export function useMembers(initialPage = 1) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => setRefreshTick(prev => prev + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/membros?page=${page}&limit=10`, {
          signal: controller.signal
        });

        const data = response.data;

        if (data.data && Array.isArray(data.data)) {
          setMembers(data.data);
          if (data.meta?.totalPages !== undefined) {
            setTotalPages(data.meta.totalPages);
          }
        } else if (Array.isArray(data)) {
          setMembers(data);
        } else {
          setMembers([]);
          throw new Error('Formato de dados inesperado');
        }

      } catch (err: any) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          return;
        }
        console.error(err);
        setError('Falha ao buscar lista de membros.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
    return () => controller.abort();
  }, [page, refreshTick]);

  return { members, loading, error, setPage, page, totalPages, refresh, setTotalPages };
}

export function useSearchMember() {
  const [member, setMember] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMember = async (name: string) => {
    if (!name || !name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/membros/search?name=${encodeURIComponent(name)}`);
      const data = response.data;

      if (data.data && Array.isArray(data.data)) {
        setMember(data.data);
      } else if (Array.isArray(data)) {
        setMember(data);
      } else {
        setMember([]);
      }
    } catch (err) {
      setError('Falha ao buscar membros.');
      setMember([]);
    } finally {
      setLoading(false);
    }
  };

  return { member, loading, error, searchMember };
}