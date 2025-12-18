"use client";

import { useState } from 'react';
import styles from '../_styles/Header.module.css';
import Image from 'next/image';
import { useTheme } from '../ThemeContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  // --- MOCK DATA ---
  const mockUser = {
    id: 1,
    name: "Membro do Ohara",
    avatarUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY254am94ZDMzY3B6cW15MXZ5Y3B6cW15MXZ5Y3B6cW15MXZ5YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l4FGpP4lZE6ZISg9W/giphy.gif"
  };
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ''}`}>
      
      <header className={styles.header}>
        
        {/* Esquerda: Logo */}
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/OharaDiscordLogo.png"
            alt="Logo Comunidade Ohara" 
            className={styles.logoImg} 
            width={40}
            height={40}
          />
          <span className={styles.logoText}>Comunidade Ohara</span>
        </Link>

        {/* Centro: Navegação */}
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}  
          >
            Home
          </Link>
          <Link href="/pages/membros" 
            className={`${styles.navLink} ${pathname === '/pages/membros' ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Membros
          </Link>
          <Link href="/pages/comunidade" 
            className={`${styles.navLink} ${pathname === '/pages/comunidade' ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Comunidade
          </Link>
        </nav>

        {/* Direita: Ações (Tema + Usuário) */}
        <div className={styles.userArea}>
          
          {/* Botão de Tema integrado */}
          <button 
            className={styles.themeBtn} 
            onClick={toggleTheme} 
            title={isDarkMode ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          {isLoggedIn ? (
            <div className={styles.avatarContainer} onClick={toggleLogin} title="Logout">
              <img 
                src={mockUser.avatarUrl} 
                alt="Avatar" 
                className={styles.avatarImg} 
              />
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={toggleLogin}>
              Login
            </button>
          )}
          <button 
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerActive : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </header>

    </div>
  );
}