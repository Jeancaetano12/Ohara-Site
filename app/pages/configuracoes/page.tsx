"use client";
import { usePrivateProfile } from "@/app/_hooks/useProfile";
import { User, Activity, ShieldCheck } from "lucide-react";

export default function DashBoard() {
    const { profile, loading, error } = usePrivateProfile();

    const isDev = profile?.roles.some(role => role.name === "Dev");
    const devRole = profile?.roles.find(role => role.name === "Dev");

    // devColor tem prioridade quando o usuário é Dev
    const accentColor = isDev && devRole?.colorHex
        ? devRole.colorHex
        : (profile?.colorHex || '#8b5cf6');

    const accentBg = `${accentColor}18`;
    const accentBorder = `${accentColor}35`;

    if (loading) return (
        <div className="flex items-center gap-3 text-ohara-blue animate-pulse py-10">
            <div className="w-5 h-5 border-2 border-ohara-blue border-t-transparent rounded-full animate-spin" />
            Carregando dados...
        </div>
    );

    if (error) return (
        <div className="text-red-400 py-10">Erro ao carregar dados: {error}</div>
    );

    const statCards = [
        {
            icon: <User size={16} />,
            label: 'Nome de Exibição',
            value: profile?.serverNickName || profile?.globalName || profile?.username || '—',
        },
        {
            icon: <ShieldCheck size={16} />,
            label: 'Permissões',
            value: `${profile?.roles.length ?? 0} cargos ativos`,
        },
        {
            icon: <Activity size={16} />,
            label: 'Status',
            value: 'Conta Verificada',
        },
    ];

    return (
        <div className="max-w-4xl space-y-8">
            {/* Cabeçalho */}
            <header className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black tracking-tight text-white">
                        Overview do Perfil
                    </h1>
                    {isDev && (
                        <span
                            className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                            style={{
                                color: accentColor,
                                background: accentBg,
                                borderColor: accentBorder,
                            }}
                        >
                            Dev
                        </span>
                    )}
                </div>
                <p className="text-sm" style={{ color: '#6b5e8a' }}>
                    Gerencie suas informações e veja o status da sua conta.
                </p>
            </header>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-2xl p-5 transition-all"
                        style={{
                            background: accentBg,
                            border: `0.5px solid ${accentBorder}`,
                        }}
                    >
                        <div className="mb-3" style={{ color: accentColor }}>
                            {card.icon}
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                            style={{ color: '#6b5e8a' }}>
                            {card.label}
                        </p>
                        <p className="text-base font-bold text-white">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Área reservada para conteúdo futuro */}
            <div
                className="w-full h-96 rounded-2xl flex items-center justify-center"
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `0.5px dashed ${accentBorder}`,
                }}
            >
                <p className="text-sm font-mono italic" style={{ color: '#3d2d5c' }}>Em desenvolvimento</p>
            </div>
        </div>
    );
}