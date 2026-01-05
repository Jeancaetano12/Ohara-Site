// components/SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (name: string) => void;
  onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      onSearch(trimmedQuery);
    } else {
      handleClear();
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear(); // Isso notificará a page.tsx para voltar ao estado isSearching: false
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full flex items-center gap-2 group">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque pelo nick no servidor ou @ do discord"
          className="w-full px-4 py-2 pl-10 text-sm transition-all border rounded-lg bg-[var(--bg-color)] border-[var(--separator-color)] focus:outline-none focus:ring-2 focus:ring-ohara-pink focus:border-transparent dark:focus:ring-ohara-blue focus:border-transparent text-[var(--text-color)]"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Botão de confirmar pesquisa - Melhora UX Mobile */}
      <button
        type="submit"
        className="px-3 py-2 border border-ohara-pink text-ohara-pink rounded-lg hover:bg-ohara-pink hover:text-white dark:border-ohara-blue/50 dark:text-ohara-blue rounded-lg dark:hover:bg-ohara-blue dark:hover:text-white transition-all text-sm font-bold"
      >
        <span className="hidden md:inline">Buscar</span>
        <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </form>
  );
}