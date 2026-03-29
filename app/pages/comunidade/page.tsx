"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import MembrosListing from '@/app/components/MembrosListing';

export default function Comunidade() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

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
                    <span className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-700 to-transparent" />
                    <span className="text-xs tracking-[0.25em] uppercase text-zinc-500 font-mono">Comunidade</span>
                    <span className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-700 to-transparent" />
                </div>
            </section>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 px-8">
                {/* Cabeçalho da seção */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ohara-orange/15 border border-ohara-orange/30">
                        <span className="text-sm">👤</span>
                    </div>
                    <h2 className="text-lg font-bold text-zinc-200 tracking-tight">Membros da Comunidade</h2>
                    <span className="h-px flex-1 bg-linear-to-r from-ohara-orange to-transparent" />
                </div>
                <MembrosListing />
            </div>
        </div>
    );
}