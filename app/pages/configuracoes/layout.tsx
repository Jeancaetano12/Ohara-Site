"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import { FaLink } from "react-icons/fa";

export default function ConfigLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', href: '/pages/configuracoes', icon: <LayoutDashboard size={18} /> },
    ];

    return (
        <div className="flex min-h-screen bg-ohara-dark text-white">
            {/* SIDEBAR */}
            <aside className="w-60 border-r border-white/5 bg-white/[0.03] backdrop-blur-xl p-5 hidden md:flex flex-col gap-6">
                <div className="px-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-center"
                        style={{ color: '#6b5e8a' }}>
                        Configurações
                    </p>
                </div>

                <nav className="flex flex-col gap-1.5">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'text-ohara-pink border border-ohara-pink/30 bg-ohara-pink/10'
                                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                                    }`}
                                style={isActive ? {
                                    boxShadow: '0 0 16px rgba(217,70,239,0.08)'
                                } : {}}
                            >
                                <span className={isActive ? 'text-ohara-pink' : 'text-gray-600'}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* CONTEÚDO DINÂMICO */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}