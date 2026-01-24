"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '../_context/ThemeContext';
import { usePathname } from 'next/navigation';
import { useAuth } from '../_context/AuthContext'
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/discord';
  }

  // Helper para links ativos
  const navItemStyles = (path: string) => {
    const isActive = pathname === path;

    return `
      relative transition-all duration-300 font-medium
      ${isActive ? 'text-ohara-pink dark:text-ohara-blue' : 'text-black dark:text-gray-300 hover:text-ohara-pink dark:hover:text-ohara-blue'}

      after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-[2px]
      after:transition-all after:duration-300
      after:bg-ohara-pink dark:after:bg-ohara-blue
      ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      
      ${isActive ? 'shadow-ohara-pink/50 dark:shadow-ohara-blue/50' : ''}`;
  }

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="h-20 bg-white dark:bg-ohara-dark border-b border-gray-200 shadow-sm" />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b transition-all duration-300 bg-white/80 dark:bg-[#130b20]/80 backdrop-blur-mdborder-gray-200 dark:border-[#2d1b4e] shadow-sm dark:shadow-[0_4px_20px_rgba(0,243,255,0.15)]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:grid md:grid-cols-3">
          
          {/* Esquerda: Logo */}
          <Link href="/" className="flex items-center gap-3 group justify-self-start">
            <div className="relative">
              <Image
                src="/OharaDiscordLogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg transition-transform duration-300 group-hover:scale-110 dark:shadow-[0_0_15px_rgba(189,0,255,0.6)]"
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white dark:drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
              Comunidade Ohara
            </span>
          </Link>

          {/* Centro: Navegação Desktop */}
          <nav className="hidden md:flex items-center justify-center gap-8 justify-self-center">
            <Link href="/" className={navItemStyles('/')}>Home</Link>
            <Link href="/pages/membros" className={navItemStyles('/pages/membros')}>Membros</Link>
            <Link href="/pages/comunidade" className={navItemStyles('/pages/comunidade')}>Comunidade</Link>
          </nav>
          
          {/* Direita: Ações */}
          <div className="flex items-center gap-4 justify-self-end">
            {/* BOTÃO DE TEMA */}

            
            {/*<button 
              onClick={toggleTheme}
              className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 hover:rotate-12"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>*/}

            {user ? (
              <div className="relative">
                <div  
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  title={`Logado como: ${user.serverNickName || user.globalName} (Clique para sair)`}
                  className="cursor-pointer w-12 h-12 rounded-full p-0.5 bg-linear-to-tr from-cyan-400 to-purple-500 hover:scale-110 transition-transform"
                >
                  <img src={user.serverAvatarUrl || user.avatarUrl} alt={user.serverNickName || user.globalName } className="w-full h-full object-cover rounded-full border-2 border-white dark:border-[#130b20]" />
                </div>
                {isUserMenuOpen && (
                  <div className='absolute right-0 mt-3 w-48 rounded-lg bg-white dark:bg-[#1b102d] shadow-lg border border-gray-200 dark:border-cyan-900/30 z-50'>
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-cyan-900/30">
                      Logado como <br />
                      <span className='font-bold'>
                        {user.serverNickName || user.globalName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const confirmLogout = window.confirm('Tem certeza que deseja sair?');
                        if (confirmLogout) logout(); 
                      }}
                      className='cursor-pointer w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-500/10 transition'
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={toggleLogin}
                className="cursor-pointer hidden md:flex items-center gap-2 px-6 py-2 border-2 border-ohara-pink text-ohara-pink dark:border-ohara-blue dark:text-ohara-blue font-bold text-sm rounded hover:bg-ohara-pink hover:text-white dark:hover:bg-ohara-blue dark:hover:text-ohara-dark transition-all duration-300 group shadow-[0_0_10px_rgba(217,70,239,0.2)] dark:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="transition-transform group-hover:scale-110"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a11.583 11.583 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                </svg>

                ENTRAR

                <ExternalLink size={14} className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}

            {/* Hamburger Mobile */}
            <button className="md:hidden flex flex-col gap-1.5" onClick={toggleMobileMenu}>
              <span className={`h-1 w-6 rounded transition-all bg-ohara-pink dark:bg-ohara-blue ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`h-1 w-6 rounded transition-all bg-ohara-pink dark:bg-ohara-blue ${isMobileMenuOpen ? 'opacity-0' : ''}`}/>
              <span className={`h-1 w-6 rounded transition-all bg-ohara-pink dark:bg-ohara-blue ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white dark:bg-[#130b20] border-t dark:border-cyan-900/30 ${isMobileMenuOpen ? 'max-height-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col items-center py-4 gap-4">
          <Link href="/" className="w-full text-center py-2 hover:bg-cyan-400/10" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/pages/membros" className="w-full text-center py-2 hover:bg-cyan-400/10" onClick={() => setIsMobileMenuOpen(false)}>Membros</Link>
          <Link href="/pages/comunidade" className="w-full text-center py-2 hover:bg-cyan-400/10" onClick={() => setIsMobileMenuOpen(false)}>Comunidade</Link>
          {!user && (
            <button
              className='mt-2 text-ohara-pink dark:text-ohara-blue font-bold'
              onClick={toggleLogin}
            >
              ENTRAR
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}