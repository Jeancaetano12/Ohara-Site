"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '../ThemeContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const mockUser = {
    id: 1,
    name: "Membro do Ohara",
    avatarUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY254am94ZDMzY3B6cW15MXZ5Y3B6cW15MXZ5Y3B6cW15MXZ5YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l4FGpP4lZE6ZISg9W/giphy.gif"
  };

  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

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
    <header className="sticky top-0 z-50 w-full border-b transition-all duration-300 
      bg-white/80 dark:bg-[#130b20]/80 backdrop-blur-md
      border-gray-200 dark:border-[#2d1b4e]
      shadow-sm dark:shadow-[0_4px_20px_rgba(0,243,255,0.15)]">
      
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
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 hover:rotate-12"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>

            {isLoggedIn ? (
              <div 
                onClick={toggleLogin}
                className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-500 cursor-pointer hover:scale-110 transition-transform"
              >
                <img src={mockUser.avatarUrl} alt="User" className="w-full h-full object-cover rounded-full border-2 border-white dark:border-[#130b20]" />
              </div>
            ) : (
              <button 
                onClick={toggleLogin}
                className="hidden md:block px-6 py-2 border border-ohara-pink text-ohara-pink dark:border-ohara-blue dark:text-ohara-blue font-bold text-sm rounded hover:bg-ohara-pink hover:text-white dark:hover:bg-ohara-blue dark:hover:text-[#0f0518] transition-all duration-300"
              >
                ENTRAR
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
          <button className="mt-2 text-ohara-pink dark:text-ohara-blue font-bold" onClick={toggleLogin}>ENTRAR</button>
        </nav>
      </div>
    </header>
  );
}