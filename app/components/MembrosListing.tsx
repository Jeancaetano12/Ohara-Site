"use client";
import { useMembers, useSearchMember, Member } from "../_hooks/useMembers";
import { useState, useCallback, useRef } from "react";
import Link from "next/link";

// ─── Helpers ────────────────────────────────────────────────────────────────

function displayName(m: Member): string {
    return m.serverNickName || m.globalName || m.username;
}

function avatarSrc(m: Member): string {
    return m.serverAvatarUrl || m.avatarUrl;
}

function bannerSrc(m: Member): string | null {
    return m.serverBannerUrl || m.bannerUrl || null;
}

function accentColor(m: Member): string {
    return m.colorHex || "#8b5cf6";
}

function formatUpdatedAt(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden animate-pulse">
            <div className="h-24 bg-zinc-800" />
            <div className="px-4 pb-5 pt-10 relative">
                <div className="absolute -top-7 left-4 w-14 h-14 rounded-full bg-zinc-700 border-2 border-zinc-900" />
                <div className="h-4 bg-zinc-700 rounded w-2/3 mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-1/3" />
            </div>
        </div>
    );
}

// ─── Member Card ─────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: Member }) {
    const [selected, setSelected] = useState(false);
    const accent = accentColor(member);
    const banner = bannerSrc(member);
    const name = displayName(member);
    const avatar = avatarSrc(member);

    return (
        <div
            onClick={() => setSelected(s => !s)}
            className="group relative rounded-2xl border bg-zinc-900 overflow-hidden cursor-pointer
                       transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
                borderColor: selected ? accent : "rgba(63,63,70,0.7)",
                boxShadow: selected
                    ? `0 0 0 1px ${accent}55, 0 8px 32px ${accent}22`
                    : undefined,
            }}
        >
            {/* Banner / colorHex fallback */}
            <div
                className="relative h-24 w-full overflow-hidden"
                style={
                    !banner
                        ? { background: `linear-gradient(135deg, ${accent}55 0%, ${accent}22 100%)` }
                        : undefined
                }
            >
                {banner && (
                    <img
                        src={banner}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/10 to-transparent" />
                <div
                    className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                    style={{ background: accent, opacity: selected ? 1 : 0.5 }}
                />
            </div>

            {/* Corpo — padding-bottom generoso para que o botão absoluto
                não cubra o texto quando aberto */}
            <div className="px-4 pt-3 pb-5 relative">
                <div
                    className="absolute -top-8 left-4 w-[58px] h-[58px] rounded-full border-[3px] border-zinc-900 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105"
                    style={{ boxShadow: `0 0 0 2px ${accent}88` }}
                >
                    <img
                        src={avatar}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=27272a&color=fff&size=58`;
                        }}
                    />
                </div>

                <div className="mt-7">
                    <p
                        className="font-bold text-sm leading-tight truncate transition-colors duration-200"
                        style={{ color: selected ? accent : "#e4e4e7" }}
                    >
                        {name}
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-0.5 font-mono">
                        upd. {formatUpdatedAt(member.updatedAt)}
                    </p>
                </div>
            </div>

            {/* Botão "Ver perfil" — posição absoluta na base do card.
                Desliza de baixo para cima com max-height, sem empurrar
                nenhum elemento do layout nem afetar os cards vizinhos. */}
            <div
                className="absolute bottom-0 left-0 right-0 overflow-hidden transition-all duration-300 ease-out"
                style={{ maxHeight: selected ? "48px" : "0px" }}
            >
                <Link
                    href={`/pages/perfil/${member.discordId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold
                               tracking-wide transition-opacity duration-200 active:scale-95"
                    style={{
                        background: `linear-gradient(to right, ${accent}40, ${accent}28)`,
                        borderTop: `1px solid ${accent}44`,
                        color: accent,
                        opacity: selected ? 1 : 0,
                    }}
                >
                    Ver perfil
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path
                            d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visiblePages: (number | string)[] =
        totalPages <= 7
            ? pages
            : [
                  ...pages.slice(0, 1),
                  ...(page > 3 ? ["…"] : []),
                  ...pages.slice(Math.max(1, page - 2), Math.min(totalPages - 1, page + 2)),
                  ...(page < totalPages - 2 ? ["…"] : []),
                  ...pages.slice(-1),
              ];

    return (
        <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 border border-zinc-800
                           hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed
                           transition-all duration-150"
            >
                ‹ ant
            </button>

            {visiblePages.map((p, i) =>
                p === "…" ? (
                    <span key={`ellipsis-${i}`} className="text-zinc-600 px-1 text-sm select-none">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        className="w-8 h-8 rounded-lg text-xs font-mono transition-all duration-150 hover:text-zinc-200"
                        style={
                            p === page
                                ? { background: "#8b5cf622", border: "1px solid #8b5cf666", color: "#c4b5fd" }
                                : { border: "1px solid transparent", color: "#71717a" }
                        }
                    >
                        {p}
                    </button>
                )
            )}

            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 border border-zinc-800
                           hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed
                           transition-all duration-150"
            >
                próx ›
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MembrosListing() {
    const { members, loading, error, setPage, page, totalPages } = useMembers(1);
    const { member: searchResults, loading: searchLoading, error: searchError, searchMember } = useSearchMember();

    const [query, setQuery] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = useCallback(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setIsSearchMode(false);
            return;
        }
        setIsSearchMode(true);
        searchMember(trimmed);
    }, [query, searchMember]);

    const handleClear = () => {
        setQuery("");
        setIsSearchMode(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
        if (e.key === "Escape") handleClear();
    };

    const displayedMembers = isSearchMode ? searchResults : members;
    const isLoading = isSearchMode ? searchLoading : loading;
    const currentError = isSearchMode ? searchError : error;

    return (
        <div className="w-full space-y-6">
            {/* ── Barra de busca ── */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                        width="15" height="15" viewBox="0 0 15 15" fill="none"
                    >
                        <path
                            d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.44 9.854l3.353 3.353a1 1 0 0 0 1.414-1.414L10.854 8.44A5.5 5.5 0 1 0 9.44 9.854Z"
                            fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                        />
                    </svg>

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar membro por nome, apelido..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/60
                                   text-sm text-zinc-200 placeholder-zinc-600
                                   focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600
                                   transition-all duration-200"
                    />

                    {query && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>

                <button
                    onClick={handleSearch}
                    disabled={!query.trim()}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/60 text-sm text-zinc-300 font-medium
                               hover:bg-zinc-700 hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed
                               transition-all duration-200 shrink-0 active:scale-95"
                >
                    Buscar
                </button>

                {isSearchMode && (
                    <button
                        onClick={handleClear}
                        className="px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30
                                   text-xs text-violet-400 font-mono hover:bg-violet-500/20 transition-all duration-200 shrink-0"
                    >
                        ✕ limpar
                    </button>
                )}
            </div>

            {/* ── Loading ── */}
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* ── Erro ── */}
            {!isLoading && currentError && (
                <div className="flex flex-col items-center gap-2 py-14 text-zinc-500">
                    <span className="text-3xl">⚠</span>
                    <p className="text-sm">{currentError}</p>
                </div>
            )}

            {/* ── Vazio ── */}
            {!isLoading && !currentError && displayedMembers.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-14 text-zinc-600">
                    <span className="text-3xl opacity-50">◈</span>
                    <p className="text-sm font-mono">
                        {isSearchMode
                            ? `Nenhum membro encontrado para "${query}"`
                            : "Nenhum membro encontrado"}
                    </p>
                </div>
            )}

            {/* ── Grid de cards ── */}
            {!isLoading && !currentError && displayedMembers.length > 0 && (
                <>
                    <p className="text-xs text-zinc-600 font-mono">
                        {isSearchMode
                            ? `${displayedMembers.length} resultado${displayedMembers.length !== 1 ? "s" : ""} para "${query}"`
                            : `Página ${page} de ${totalPages} · ${displayedMembers.length} membros`}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {displayedMembers.map((member) => (
                            <MemberCard key={member.discordId} member={member} />
                        ))}
                    </div>

                    {!isSearchMode && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={(p) => {
                                setPage(p);
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}