"use client";
import { Suspense } from 'react'; // Importação necessária
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldAlert, Home, MessageSquareShare, ArrowLeft } from 'lucide-react';

// 1. Criamos um componente interno para gerenciar a lógica dos params
function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const router = useRouter();

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative overflow-hidden">
        
        {/* Detalhe de Brilho de Fundo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-ohara-pink/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-ohara-blue/20 blur-[80px] rounded-full" />

        {/* Ícone de Alerta Animado */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse" />
          <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl relative">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight uppercase">
          Acesso <span className="text-red-500">Negado</span>
        </h1>
        
        <div className="space-y-4 mb-10">
          {reason === 'user_not_found' ? (
            <p className="text-gray-400 text-lg leading-relaxed">
              Identificamos que você cancelou a autenticação ou <span className="text-ohara-white font-semibold">ainda não faz parte</span> do nosso servidor no Discord.
            </p>
          ) : (
            <p className="text-gray-400 text-lg leading-relaxed">
              Ocorreu um erro inesperado durante o processo de login. Por favor, tente novamente.
            </p>
          )}
          <p className="text-sm text-gray-500 italic">Nenhuma informação sua foi registrada em nosso banco de dados.</p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://discord.gg/3v2KFqySgt" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
          >
            <MessageSquareShare size={20} />
            Entrar no Servidor
          </a>

          <button 
            onClick={() => router.push('/')}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all hover:scale-105"
          >
            <Home size={20} className="text-ohara-blue" />
            Voltar ao Início
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <span className="text-gray-400 font-semibold"> Você ainda pode navegar pelo site livremente sem autenticação.</span>
          </p>
        </div>

        <button 
          onClick={() => router.back()}
          className="cursor-pointer mt-8 text-gray-500 hover:text-ohara-pink text-sm font-medium flex items-center gap-2 transition-colors mx-auto"
        >
          <ArrowLeft size={14} />
          Tentar login novamente
        </button>
      </div>
  );
}

// 2. O export default envolve o conteúdo no boundary de Suspense
export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Suspense fallback={<div className="text-white">Carregando informações do erro...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}