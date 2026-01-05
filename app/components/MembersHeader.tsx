// components/MembersHeader.tsx
import SearchBar from './SearchBar';

interface MembersHeaderProps {
  onSearch: (name: string) => void;
  onClear: () => void;
  onRefresh: () => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  isSearching: boolean;
}

export default function MembersHeader({ 
  onSearch, onClear, onRefresh, currentPage, onPageChange, isSearching 
}: MembersHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--separator-color)] mb-8 py-4 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Lado Esquerdo: Título e Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          <h1 className="text-2xl md:text-2xl font-black text-ohara-dark dark:text-ohara-white transition-colors">
            Membros
          </h1>
          <button 
            onClick={onRefresh}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/10 text-ohara-pink dark:text-ohara-blue transition-transform hover:rotate-180 duration-500"
            title="Atualizar lista"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Centro: Barra de Busca (reutilizando seu componente) */}
        <div className="flex-1 max-w-2xl">
          <SearchBar onSearch={onSearch} onClear={onClear} />
        </div>

        {/* Lado Direito: Paginação Rápida */}
        {!isSearching && (
          <div className="flex items-center gap-3 bg-black/20 p-1 rounded-lg border border-[var(--separator-color)]">
            <button 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-ohara-blue/20 disabled:opacity-30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-mono px-2">PG {currentPage}</span>
            <button 
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-md hover:bg-ohara-pink dark:hover:bg-ohara-blue/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}