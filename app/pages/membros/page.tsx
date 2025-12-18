"use client";

import { useMembers } from '../../_hooks/useMembers'; // Ajuste o caminho
import MemberCard from '../../components/MemberCard'; // Ajuste o caminho
import styles from '../../_styles/MemberCard.module.css'; // Reutilizando container ou criando um novo

export default function MembrosPage() {
  const { members, loading, error, page, setPage, totalPages } = useMembers();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="text-3xl font-bold mb-8 text-ohara-dark dark:text-white">
        Membros da Comunidade
      </h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {loading ? (
        <p className="text-center text-gray-500">Carregando dados da tripulação...</p>
      ) : (
        // Grid Responsivo: 1 coluna no mobile, 2 no tablet, 3 ou 4 no desktop
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {/* Controles de Paginação Simples */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">Página {page}</span>
        <button 
          onClick={() => setPage(page + 1)} 
          // Habilite essa lógica se seu back-end retornar o total de páginas corretamente
          // disabled={page >= totalPages} 
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}