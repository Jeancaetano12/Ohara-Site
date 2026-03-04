"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import MembrosListing from '@/app/components/MembrosListing';
import DocumentacaoListing from '@/app/components/DocumentacaoListing';
// Placeholder components — será trabalhado separadamente

type ActiveView = 'membros' | 'documentacao' | null;

export default function Comunidade() {
    const pathname = usePathname();
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    function handleViewChange(view: ActiveView) {
        if (activeView === view) {
            setActiveView(null);
            return;
        }
        setActiveView(view);
        // Pequeno delay para o componente montar antes de scrollar
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
    }

    return (
        <div className="min-h-screen text-zinc-100">
            {/* Hero / Boas-vindas */}
            <section className="relative px-6 md:px-20 pt-20 pb-16 overflow-hidden">
                {/* Glow decorativo de fundo */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full
                               bg-gradient-radial from-orange-600/20 via-red-700/10 to-transparent blur-3xl"
                />

                {/* Linha decorativa topo */}
                <div className="relative z-10 mb-10 flex items-center gap-4">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                    <span className="text-xs tracking-[0.25em] uppercase text-zinc-500 font-mono">Comunidade</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                </div>

                {/* Conteúdo central */}
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5
                                   bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-tight">
                        Bem-vindo à<br />
                        <span className="bg-gradient-to-r from-ohara-pink to-ohara-orange bg-clip-text text-transparent">
                            nossa comunidade
                        </span>
                    </h1>

                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
                        Este é o espaço para exibir os membros da comunidade — Um lugar para explorar perfis com personalidade
                        e acompanhar as atividades que acontecem aqui.
                    </p>

                    {/* Botões de navegação */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {/* Botão Membros */}
                        <button
                            onClick={() => handleViewChange('membros')}
                            className={`
                                group relative flex items-center gap-3 px-6 py-3.5 rounded-xl
                                font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer
                                ${activeView === 'membros'
                                    ? 'bg-gradient-to-r from-ohara-pink to-ohara-orange text-white shadow-lg shadow-orange-700/30 scale-[1.02]'
                                    : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:border-ohara-orange hover:text-orange-300 hover:bg-zinc-800'
                                }
                            `}
                        >
                            <span className={`text-lg transition-transform duration-300 ${activeView === 'membros' ? 'scale-110' : 'group-hover:scale-110'}`}>
                                👤
                            </span>
                            Visitar Membros
                        </button>

                        {/* Botão Documentação */}
                        <button
                            onClick={() => handleViewChange('documentacao')}
                            className={`
                                group relative flex items-center gap-3 px-6 py-3.5 rounded-xl
                                font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer
                                ${activeView === 'documentacao'
                                    ? 'bg-gradient-to-r from-ohara-pink to-ohara-blue text-white shadow-lg shadow-sky-700/30 scale-[1.02]'
                                    : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:border-ohara-blue hover:text-sky-300 hover:bg-zinc-800'
                                }
                            `}
                        >
                            <span className={`text-lg transition-transform duration-300 ${activeView === 'documentacao' ? 'scale-110' : 'group-hover:scale-110'}`}>
                                📋
                            </span>
                            Documentação
                        </button>
                    </div>
                </div>

                {/* Divisor decorativo inferior */}
                <div className="relative z-10 mt-14 flex items-center gap-4">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                </div>
            </section>

            {/* Área dos componentes — ponto de scroll alvo */}
            <div ref={contentRef} className="scroll-mt-6 px-6 md:px-20 pb-24">
                {/* Nenhuma view ativa — estado vazio */}
                {!activeView && (
                    <div className="flex flex-col items-center gap-3 py-16 text-zinc-600">
                        <span className="text-4xl opacity-40">◈</span>
                        <p className="text-sm font-mono tracking-widest uppercase">
                            Selecione uma seção acima
                        </p>
                    </div>
                )}

                {/* View: Membros */}
                {activeView === 'membros' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Cabeçalho da seção */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ohara-orange/15 border border-ohara-orange/30">
                                <span className="text-sm">👤</span>
                            </div>
                            <h2 className="text-lg font-bold text-zinc-200 tracking-tight">Membros da Comunidade</h2>
                            <span className="h-px flex-1 bg-gradient-to-r from-ohara-orange to-transparent" />
                        </div>
                        <MembrosListing />
                    </div>
                )}

                {/* View: Documentação */}
                {activeView === 'documentacao' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Cabeçalho da seção */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ohara-blue/15 border border-ohara-blue/30">
                                <span className="text-sm">📋</span>
                            </div>
                            <h2 className="text-lg font-bold text-zinc-200 tracking-tight">Documentação do Servidor</h2>
                            <span className="h-px flex-1 bg-gradient-to-r from-ohara-blue to-transparent" />
                        </div>
                        <DocumentacaoListing />
                    </div>
                )}
            </div>
        </div>
    );
}