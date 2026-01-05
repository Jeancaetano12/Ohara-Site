// page.tsx
"use client";
import { useState } from 'react';
import { useMembers, useSearchMember } from '../../_hooks/useMembers';
import MembersHeader from '@/app/components/MembersHeader';
import MemberCard from '../../components/MemberCard';

export default function MembrosPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { members, loading: loadingList, page, setPage, refresh: refreshList } = useMembers();
  const { member: searchResults, loading: loadingSearch, searchMember } = useSearchMember();

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
    <div className="min-h-screen bg-[var(--bg-color)]">
      <MembersHeader 
        onSearch={handleSearch}
        onClear={handleClear}
        onRefresh={handleRefresh}
        currentPage={page}
        onPageChange={setPage}
        isSearching={isSearching}
      />

      <main className="p-0 max-w-[1200px] mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-ohara-blue border-t-transparent rounded-full animate-spin mb-4" />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
            {displayMembers.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        )}
        
        {isSearching && displayMembers.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 py-10">Nenhum membro encontrado.</p>
        )}
      </main>
    </div>
  );
}