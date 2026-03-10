// hooks/useMembers.ts
import { useState, useEffect } from 'react';


// --- Interfaces baseadas no seu JSON ---
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

  const refresh = () => setRefreshTick(prev => prev + 1);

  useEffect(() => {
    console.log("Hook useMembers montado para a página", initialPage);
  },[]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membros?page=${page}&limit=10`, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-site-key': process.env.NEXT_PUBLIC_SITE_KEY || ''
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar membros');

        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          setMembers(data.data);
          if (data.meta?.totalPages !== undefined) {
            setTotalPages(data.meta.totalPages);
          }
        } else if (Array.isArray(data)) {
            setMembers(data);
        } else {
            setMembers([]);
            throw new Error('Formato de dados inesperado', data);
        }

      } catch (err: any) {
        if (err.name === 'AbortError') {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membros/search?name=${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-site-key': process.env.NEXT_PUBLIC_SITE_KEY || ''
        }
      });

      if (!response.ok) throw new Error('Erro ao buscar membros');
      const data = await response.json();

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