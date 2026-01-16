// page.tsx
"use client";
import { useState } from 'react';
import { useMembers, useSearchMember } from '../../_hooks/useMembers';
import MembersHeader from '@/app/components/MembersHeader';
import MemberCard from '../../components/MemberCard';

export default function MembrosPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { members, loading: loadingList, error: listError, page, setPage, refresh: refreshList } = useMembers();
  const { member: searchResults, loading: loadingSearch, error: searchError, searchMember } = useSearchMember();
  
  const apiError = isSearching ? searchError : listError;

  const handleSearch = (name: string) => {
    setSearchTerm(name);
    setIsSearching(true);
    searchMember(name);
  };

  const handleClear = () => {
    setIsSearching(false);
    setSearchTerm('');
  };

  const handleRefresh = () => {
    if (isSearching && searchTerm) {
      searchMember(searchTerm);
    } else {
      refreshList();
    }
  };

  const displayMembers = isSearching ? searchResults : members;
  const isLoading = isSearching ? loadingSearch : loadingList;

  return (
    <div className="min-h-screen bg-(--bg-color)]">
      <MembersHeader 
        onSearch={handleSearch}
        onClear={handleClear}
        onRefresh={handleRefresh}
        currentPage={page}
        onPageChange={setPage}
        isSearching={isSearching}
      />

      <main className="p-0 max-w-300 mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-ohara-blue border-t-transparent rounded-full animate-spin mb-4" />
          </div>
        ) : apiError ? (
          <div className='flex flex-col items-center justify-center py-20 px-4 text-center'>
            <div className="text-red-500 mb-4 text-5xl">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ops! Algo deu errado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{apiError}</p>
            <button 
              onClick={handleRefresh}
              className="px-6 py-2 bg-ohara-pink dark:bg-ohara-blue text-white rounded-lg dark:hover:bg-cyan-600 transition"
            >
              Tentar novamente
            </button>
          </div>
        ) : displayMembers.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 px-4 text-center'>
            <div className="text-gray-400 mb-4 text-6xl">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Nenhum membro encontrado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Não encontramos resultados para "{searchTerm}". Verifique a ortografia ou tente outro nome.
            </p>
            <button 
              onClick={handleClear}
              className="px-6 py-2 border-2 border-ohara-pink text-ohara-pink dark:border-ohara-blue dark:text-ohara-blue font-bold rounded-lg hover:bg-ohara-pink hover:text-white dark:hover:bg-ohara-blue dark:hover:text-ohara-dark transition"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8'>
            {displayMembers.map((m) => (
              <MemberCard key={m.discordId} member={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}