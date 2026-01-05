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
  id: string;
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
  roles: Role[];
}

interface UseMembersResponse {
  members: Member[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  setPage: (page: number) => void;
  page: number;
}

export function useMembers(initialPage = 1) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = () => setRefreshTick(prev => prev + 1);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membros?page=${page}&limit=10`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-site-key': process.env.NEXT_PUBLIC_SITE_KEY || ''
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar membros');

        const data = await response.json();
        
        // Ajuste aqui conforme o retorno exato do seu back-end. 
        // Supondo que ele retorne { data: [], totalPages: 10 } ou headers de paginação
        console.log('Dados recebidos do back-end:', data);
        if (data.data && Array.isArray(data.data)) {
          setMembers(data.data);
        } else if (Array.isArray(data)) {
            setMembers(data);
        } else {
            setMembers([]);
            throw new Error('Formato de dados inesperado', data);
        }
        
        // Se o back-end não retorna o total de páginas no corpo, você pode precisar ajustar
        // setTotalPages(data.totalPages || 1);

      } catch (err) {
        setError('Falha ao carregar lista de membros.');
        console.error(err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [page, refreshTick]);

  return { members, loading, error, setPage, page, totalPages, refresh };
}

export function useSearchMember() {
  const [member, setMember] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Receba o nome diretamente na função de busca
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
      console.log('Dados recebidos pela busca por nome:', data);
      if (data.data && Array.isArray(data.data)) {
        setMember(data.data);
      } else if (Array.isArray(data)) {
        setMember(data);
      } else {
        setMember([]);
      }
    } catch (err) {
      setError('Falha ao buscar membros.');
      console.error(err);
      setMember([]);
    } finally {
      setLoading(false);
    }
  };

  return { member, loading, error, searchMember };
}