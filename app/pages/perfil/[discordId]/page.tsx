"use client";

import { useAuth } from '@/app/_context/AuthContext';
import { useProfile } from '@/app/_hooks/useProfile';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
    const params = useParams();
    const discordId = params.discordId as string;

    // Dados do perfil
    const { profile, loading, error } = useProfile(discordId);
    const { user: loggedUser } = useAuth();

    // Verifica se o perfil é do usuário logado
    const isOwner = loggedUser?.discordId === profile?.discordId;
    const userColor = profile?.colorHex || '#8b5cf6';

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-t-transparent border-ohara-blue rounded-full"></div></div>;
    }

    if (error || !profile) {
        return <div className="text-center py-20 text-red-400">Perfil não encontrado.</div>;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-color)] pb-20">
            {/* --- BANNER HEADER --- */}
            <div 
                className="relative w-full h-64 md:h-80 bg-cover bg-center"
                style={{ 
                    backgroundImage: profile.serverBannerUrl ? `url(${profile.serverBannerUrl})` : profile.bannerUrl ? `url(${profile.bannerUrl})` : 'none',
                    backgroundColor: (!profile.serverBannerUrl && !profile.bannerUrl) ? userColor : '#1a1a1a'
                }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            </div>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="max-w-5xl mx-auto px-6 relative -mt-24 z-10">
                
                {/* CABEÇALHO DO PERFIL */}
                <div className="flex flex-col md:flex-row items-end md:items-end gap-6 mb-8">
                    
                    {/* Avatar Grande */}
                    <div className="relative shrink-0">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[var(--bg-color)] overflow-hidden shadow-2xl bg-[var(--bg-color)]">
                            <img 
                                src={profile.serverAvatarUrl || profile.avatarUrl} 
                                alt={profile.username} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Informações e Ações */}
                    <div className="flex-1 pb-4 flex flex-col md:flex-row justify-between items-end gap-4 w-full">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg" style={{ color: userColor }}>
                                {profile.serverNickName || profile.globalName}
                            </h1>
                            <p className="text-gray-300 font-mono text-lg">@{profile.username}</p>
                            
                            {/* Badges / Roles Principais */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {profile.roles.slice(0, 4).map(role => (
                                    <span key={role.name} className="px-2 py-0.5 text-xs font-bold rounded border bg-black/40 backdrop-blur-md" 
                                          style={{color: role.colorHex, borderColor: role.colorHex}}>
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* --- AQUI ESTÁ A LÓGICA DE EDIÇÃO --- */}
                        <div className="flex gap-3">
                            {isOwner && (
                                <Link 
                                    href="/pages/perfil/editar" // Você precisará criar essa rota futuramente
                                    className="flex items-center gap-2 px-6 py-2 bg-ohara-pink/90 hover:bg-ohara-pink text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-ohara-pink/50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Editar Perfil
                                </Link>
                            )}
                            
                            {/* Botão de Compartilhar (Para todos) */}
                            <button className="p-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* GRID DE INFORMAÇÕES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Coluna Esquerda: Sobre */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Box Bio */}
                        <div className="bg-black/20 border border-[var(--separator-color)] rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">📝</span> Sobre Mim
                            </h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {profile.profile?.bio || "Nenhuma biografia disponível."}
                            </p>
                        </div>

                        {/* Conexões / Links */}
                        <div className="bg-black/20 border border-[var(--separator-color)] rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-4">Conexões</h2>
                            <div className="flex gap-4">
                                {/* Exemplo de renderização de links se existirem */}
                                {profile.profile?.socialLinks?.length ? (
                                    profile.profile.socialLinks.map(link => (
                                        <a key={link} href={link} target="_blank" className="text-ohara-blue hover:underline">{link}</a>
                                    ))
                                ) : (
                                    <span className="text-gray-500 italic">Nenhuma conexão pública.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Detalhes do Servidor */}
                    <div className="space-y-6">
                        <div className="bg-black/20 border border-[var(--separator-color)] rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-4">Estatísticas</h2>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex justify-between">
                                    <span>Entrou em:</span>
                                    <span className="font-mono text-white">
                                        {new Date(profile.joinedServerAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Cargos:</span>
                                    <span className="font-mono text-white">{profile.roles.length}</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Lista completa de cargos */}
                        <div className="bg-black/20 border border-[var(--separator-color)] rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Todos os Cargos</h2>
                            <div className="flex flex-wrap gap-1.5">
                                {profile.roles.map(role => (
                                    <span key={role.name} className="px-2 py-0.5 text-[10px] uppercase font-bold rounded border border-white/10 bg-black/40 text-gray-300"
                                    style={{ borderLeft: `3px solid ${role.colorHex}` }}>
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}