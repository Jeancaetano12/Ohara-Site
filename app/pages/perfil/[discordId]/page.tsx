"use client";

import { useAuth } from '@/app/_context/AuthContext';
import { useProfile } from '@/app/_hooks/useProfile';
import { useParams } from 'next/navigation';
import { useNotification } from '@/app/_context/NotificationContext';
import Toast  from '@/app/components/Toast';
import { Share2, Edit3, Calendar, ShieldCheck, Info, Check } from 'lucide-react';
import { useState } from 'react';
import EditProfileModal from '@/app/components/EditProfileModal';
import SocialIcon from '@/app/components/SocialIcons';

export default function ProfilePage() {
    const { notify } = useNotification();
    const params = useParams();
    const discordId = params.discordId as string;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { profile, loading, error, reload } = useProfile(discordId);
    const { user: loggedUser } = useAuth();
    const [copied, setCopied] = useState(false);
    const [showToast, setShowToast] = useState<React.ReactNode>(null);
    const isOwner = loggedUser?.discordId === profile?.discordId;
    const userColor = profile?.colorHex || '#8b5cf6';

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            notify("Link do perfil copiado!", "success", userColor);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Falha ao copiar o link: ', err)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-12 h-12 border-4 border-ohara-blue border-t-transparent rounded-full mb-4"></div>
                <p className="text-ohara-blue animate-pulse font-medium">Carregando perfil...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <Info className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ops! Perfil não encontrado</h2>
                <p className="text-gray-400 max-w-xs">O membro que você procura não existe ou a API está temporariamente fora do ar.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ohara-dark pb-20 selection:bg-ohara-pink/30">
            {/* --- BANNER --- */}
            <div className="relative w-full h-64 md:h-96 overflow-hidden bg-ohara-dark">
                {/* Camada 1: Fundo com Desfoque (Garante que não fiquem espaços vazios e disfarça a baixa resolução) */}
                <div className="absolute inset-0 scale-110 blur-3xl opacity-50 transition-all duration-700"
                    style={{ 
                        backgroundImage: profile.serverBannerUrl ? `url(${profile.serverBannerUrl})` : profile.bannerUrl ? `url(${profile.bannerUrl})` : 'none',
                        backgroundColor: userColor,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }} 
                />
                {/* Camada 2: A Imagem Real (limitamos o upscale para não perder nitidez) */}
                <div 
                    className="absolute inset-0 bg-no-repeat bg-cover md:bg-contain bg-center transition-all duration-500"
                    style={{ 
                        backgroundImage: profile.serverBannerUrl ? `url(${profile.serverBannerUrl})` : profile.bannerUrl ? `url(${profile.bannerUrl})` : 'none',
                    }}
                />
                {/* Camada 3: Overlay de Gradiente (Dá profundidade e melhora leitura do nome) */}
                <div className="absolute inset-0 bg-linear-to-t from-ohara-dark via-ohara-dark/20 to-black/40"></div>
                
                {/* Detalhe de linha neon na base do banner */}
                <div 
                    className="absolute bottom-0 left-0 w-full h-0.5 opacity-50 shadow-[0_-2px_10px_rgba(255,255,255,0.3)]"
                    style={{ backgroundColor: userColor }}
                ></div>

            </div>

            {/* --- CONTEÚDO --- */}
            <main className="max-w-6xl mx-auto px-4 relative -mt-16 md:-mt-24 z-10">
                
                {/* CABEÇALHO INTEGRADO */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        
                        {/* Avatar com Anel de Cor Dinâmica */}
                        <div className="relative group">
                            <div 
                                className="w-36 h-36 md:w-52 md:h-52 rounded-full p-1.5 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_40px_var(--profile-color)]"
                                style={{ background: `linear-gradient(50deg, ${userColor}, ${userColor})` }}
                            >
                                <img 
                                    src={profile.serverAvatarUrl || profile.avatarUrl} 
                                    alt={profile.username} 
                                    className="w-full h-full object-cover rounded-full border-4 border-ohara-dark"
                                />
                            </div>
                        </div>

                        {/* Nome e Redes Sociais */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                {profile.serverNickName || profile.globalName || profile.username}
                            </h1>
                            {profile.isBot &&(
                                <span className="bg-ohara-blue/20 text-ohara-blue text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-ohara-blue/30">BOT</span>
                            )}

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                                {profile.profile?.socialLinks && Object.entries(profile.profile.socialLinks).map(([platform, url]) => {
                                    if (!url) return null;
                                        return (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative p-3 bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
                                                title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                style={{ borderColor: `${userColor}44`,
                                                    ['--user-color' as any]: userColor,
                                                }}
                                            >
                                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur-md" style={{backgroundColor: 'var(--user-color)'}}/>
                                                <div className="relative z-10 transition-transform group-hover:scale-110">
                                                    <SocialIcon platform={platform} />
                                                </div>
                                            </a>
                                        )}
                                    )}    
                            </div>
                        </div>

                        {/* Ações */}
                        <div className="flex gap-3 w-full md:w-auto">
                            {isOwner && (
                                <button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="cursor-pointer px-6 py-3 text-white font-bold rounded-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                                    style={{
                                        background: `linear-gradient(50deg, ${userColor}, ${userColor})`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 10px ${userColor}`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Editar
                                </button>
                            )}
                            <button 
                                onClick={handleShare}
                                className={`cursor-pointer p-3 rounded-xl transition-all border flex items-center gap-2 ${
                                    copied 
                                    ? 'bg-green-500/20 border-green-500 text-green-500' 
                                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                }`}
                                title="Copiar link do perfil"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                    </>
                                ) : (
                                    <Share2 className="w-5 h-5" />
                                )}
                            </button>

                            {showToast && (
                                <Toast 
                                    message="Link do perfil copiado!" 
                                    type="success" 
                                    onClose={() => setShowToast(null)} 
                                    color={userColor}
                                />
                            )}
                        </div>
                    </div>

                    {/* ESTATÍSTICAS RÁPIDAS (Desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                        <StatBox 
                            icon={<Calendar style={{ color: `${userColor}` }} />} 
                            label="Entrou no servidor em" 
                            value={new Date(profile.joinedServerAt).toLocaleDateString('pt-BR')} 
                        />
                        <StatBox 
                            icon={<ShieldCheck style={{ color: `${userColor}` }} />} 
                            label="Cargos no Discord" 
                            value={`${profile.roles.length} Atribuições`} 
                        />
                    </div>
                </div>

                {/* CORPO DA PÁGINA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    
                    {/* Bio e Conteúdo */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 rounded-full" style={{background: `${userColor}`}}></span>
                                Sobre Mim
                            </h3>
                            <p className="text-gray-400 leading-relaxed italic">
                                {profile.profile?.bio || "Este membro prefere manter o mistério e ainda não escreveu uma descrição."}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar: Detalhes */}
                    <aside className="space-y-6">
                        <section className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6">
                            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6">Todos os Cargos</h3>
                            <div className="flex flex-wrap gap-2">
                            {profile.roles.map(role => (
                                <span 
                                    key={role.name}
                                    className="px-3 py-1.5 rounded-lg bg-black/40 text-[11px] font-bold border border-white/5 transition-transform hover:scale-105"
                                    style={{ borderLeft: `3px solid ${role.colorHex}`, color: role.colorHex }}
                                >
                                    {role.name}
                                </span>
                            ))}
                        </div>
                        </section>
                    </aside>
                </div>
            </main>

            {isEditModalOpen && (
                <EditProfileModal 
                    profile={profile} 
                    userColor={userColor}
                    onClose={() => setIsEditModalOpen(false)}
                    onRefresh={reload}
                />
            )}
        </div>
    );
}



// Subcomponente para organizar as estatísticas
function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
            <div className="p-2 bg-ohara-dark rounded-lg border border-white/5">
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-sm text-white font-mono">{value}</p>
            </div>
        </div>
    );
}