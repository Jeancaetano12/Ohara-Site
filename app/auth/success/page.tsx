// app/auth/success/page.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../_context/AuthContext';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, user } = useAuth();

  // Ref para garantir que o login so rode uma vez
  const processedRef = useRef(false)

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
    <div className="flex items-center justify-center h-screen bg-ohara-dark text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Autenticando...</h2>
        <p>Estamos conectando você à Comunidade Ohara.</p>
        {/* Você pode por um spinner/loading aqui */}
      </div>
    </div>
  );
}