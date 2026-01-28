// app/auth/success/page.tsx
"use client";

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../_context/AuthContext';

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, user } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current || user) return;
    const token = searchParams.get('token');
    if (token) {
      processedRef.current = true;
      login(token);
    } else {
      router.push('/');
    }
  }, [searchParams, login, user, router]);

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