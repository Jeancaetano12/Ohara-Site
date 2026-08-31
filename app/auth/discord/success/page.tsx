// app/auth/discord/success/page.tsx
"use client";

import { useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/app/_context/AuthContext';
import { useRouter } from 'next/navigation';

function AuthSuccessContent() {
  const { login, user } = useAuth();
  const processedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Evita chamadas duplicadas no React Strict Mode
    if (processedRef.current || user) return;
    
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      processedRef.current = true;
      
      // Limpa a URL para que o código temporário não fique visível
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Chama o login passando o código temporário para troca
      login(code);
    } else {
      // Se não tem código, manda pra home
      router.push('/');
    }
  }, [login, user, router]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Autenticando...</h2>
      <p>Estamos conectando você à Comunidade Ohara.</p>
      <div className="flex justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-ohara-blue rounded-full"></div>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-ohara-dark text-white">
      <Suspense fallback={<p>Carregando...</p>}>
        <AuthSuccessContent />
      </Suspense>
    </div>
  );
}