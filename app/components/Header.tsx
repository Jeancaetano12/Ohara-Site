"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../_context/AuthContext';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import { BsPersonBoundingBox } from "react-icons/bs";
import { MdOutlineLogout } from "react-icons/md";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

const NAV_LINKS = [
  { label: 'Quem Somos', anchor: 'quem-somos' },
  { label: 'Comunidade',  anchor: 'comunidade'  },
  { label: 'Integração',  anchor: 'integracao'  },
  { label: 'Junte-se',   anchor: 'junte-se'    },
];

export default function Header() {
  const { user, logout } = useAuth();
  const router         = useRouter();
  const pathname       = usePathname();

  const [mounted,       setMounted      ] = useState(false);
  const [mobileOpen,    setMobileOpen   ] = useState(false);
  const [userMenuOpen,  setUserMenuOpen ] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [pillStyle,     setPillStyle    ] = useState({ left: 0, width: 0, opacity: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === '/';

  /* ── Detecta seção ativa via IntersectionObserver ── */
  useEffect(() => {
    if (!isHome) return;
    const ids = ['hero', ...NAV_LINKS.map(l => l.anchor)];
    const obs: IntersectionObserver[] = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { threshold: 0.45 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, [isHome, mounted]);

  /* ── Desliza a pill para o item ativo ── */
  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>(`[data-anchor="${activeSection}"]`);
    if (activeEl) {
      setPillStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth, opacity: 1 });
    } else {
      setPillStyle(s => ({ ...s, opacity: 0 }));
    }
  }, [activeSection]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setUserMenuOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const toggleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`;
  };

  if (!mounted) {
    return <div className="h-16 bg-white dark:bg-ohara-dark border-b border-black/5 dark:border-white/5" />;
  }

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white/70 dark:bg-ohara-dark/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5"
      style={{ boxShadow: 'var(--header-shadow)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* ── LOGO ── */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <Image
            src="/ohara-icon.png"
            alt="Ohara"
            width={34}
            height={34}
            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
            style={{ boxShadow: 'var(--logo-glow)' }}
          />
          <span
            className="font-extrabold text-lg tracking-tight text-ohara-dark dark:text-ohara-white"
            style={{ textShadow: 'var(--text-glow)' }}
          >
            Comunidade Ohara
          </span>
        </Link>

        {/* ── NAV COM PILL DESLIZANTE (Desktop) ── */}
        <div
          ref={navRef}
          className="hidden md:flex items-center relative bg-black/5 dark:bg-white/5 rounded-full px-1.5 py-1.5 gap-0.5"
        >
          {/* Pill animada */}
          <span
            aria-hidden
            className="absolute top-1.5 h-[calc(100%-12px)] rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
            style={{
              left:       pillStyle.left,
              width:      pillStyle.width,
              opacity:    pillStyle.opacity,
              background: 'linear-gradient(135deg, var(--color-ohara-pink, #d946ef), var(--color-ohara-blue, #06b6d4))',
              boxShadow:  '0 0 14px 2px color-mix(in srgb, var(--color-ohara-pink, #d946ef) 40%, transparent)',
            }}
          />

          {NAV_LINKS.map(({ label, anchor }) => {
            const isActive = isHome && activeSection === anchor;
            const cls = `
              relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer whitespace-nowrap
              ${isActive
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-ohara-dark dark:hover:text-ohara-white'}
            `;
            return isHome ? (
              <button key={anchor} data-anchor={anchor} onClick={() => scrollToSection(anchor)} className={cls}>
                {label}
              </button>
            ) : (
              <Link key={anchor} data-anchor={anchor} href={`/#${anchor}`} className={cls}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── DIREITA ── */}
        <div ref={menuRef} className="relative">
          {user ? (
            <>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="cursor-pointer flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-ohara-blue via-ohara-pink to-ohara-orange">
                  <img
                    src={user.serverAvatarUrl || user.avatarUrl}
                    alt="Avatar do usuário"
                    className="w-full h-full object-cover rounded-full border-2 border-white dark:border-ohara-dark"
                  />
                </div>

                <span className="hidden md:block font-semibold text-sm text-ohara-dark dark:text-ohara-white max-w-[120px] truncate">
                  {user.serverNickName || user.globalName || user.username}
                </span>
                <IoIosArrowDown className={`transition-transform duration-300 ${userMenuOpen ? "rotate-180" : "rotate-0"}`}/>
              </button>
              {/* Menu do usuário */}
              {userMenuOpen && (
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden bg-white dark:bg-[#1b102d] shadow-xl border border-gray-100 dark:border-white/10 z-50 transition-all duration-200 ease-out
                  ${userMenuOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                >
                  <div className="px-4 py-3 text-xs text-ohara-dark dark:text-ohara-white border-b border-gray-100 dark:border-white/10">
                    {user.username}
                    <span className="font-bold text-ohara-dark dark:text-gray-400 block truncate mt-1">
                      {user.email}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/pages/perfil/${user.discordId}`)}
                    className="cursor-pointer w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition text-gray-700 dark:text-ohara-white"
                  >
                   <BsPersonBoundingBox size={19} className="inline mr-2" /> 
                    Meu Perfil
                  </button>
  
                  <button
                    onClick={() => {
                      if (window.confirm("Tem certeza que deseja sair?")) logout();
                    }}
                    className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-gray-100 dark:border-white/10 z-50 transition"
                  >
                    <MdOutlineLogout size={19} className="inline mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={toggleLogin}
              className="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white hover:scale-105 hover:brightness-110 transition-all duration-300"
              style={{
                  background:
                    "linear-gradient(135deg, var(--color-ohara-pink, #d946ef), var(--color-ohara-blue, #06b6d4))",
                  boxShadow:
                    "0 0 18px 2px color-mix(in srgb, var(--color-ohara-pink, #d946ef) 35%, transparent)",
                }}
            >
              <FaDiscord size={18} />
              Entrar
            </button>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block h-[2px] w-5 rounded-full bg-ohara-dark dark:bg-ohara-white transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-[2px] w-5 rounded-full bg-ohara-dark dark:bg-ohara-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-[2px] w-5 rounded-full bg-ohara-dark dark:bg-ohara-white transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── MENU MOBILE ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white/95 dark:bg-ohara-dark/95 backdrop-blur-xl border-t border-black/5 dark:border-white/5 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-4 py-3 gap-1">
          {NAV_LINKS.map(({ label, anchor }, i) => {
            const isActive = isHome && activeSection === anchor;
            const base = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200";
            return isHome ? (
              <button
                key={anchor}
                onClick={() => { scrollToSection(anchor); setMobileOpen(false); }}
                className={`${base} w-full text-left ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                style={isActive ? { background: 'linear-gradient(135deg, var(--color-ohara-pink,#d946ef), var(--color-ohara-orange,#fb923c))' } : {}}
              >
                <span className="font-mono text-xs opacity-40">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </button>
            ) : (
              <Link
                key={anchor}
                href={`/#${anchor}`}
                onClick={() => setMobileOpen(false)}
                className={`${base} text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5`}
              >
                <span className="font-mono text-xs opacity-40">{String(i + 1).padStart(2, '0')}</span>
                {label}
              </Link>
            );
          })}
          {!user && (
            <button
              onClick={toggleLogin}
              className="mt-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, var(--color-ohara-pink,#d946ef), var(--color-ohara-orange,#fb923c))' }}
            >
              Entrar no Discord
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}