"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SlSocialSpotify } from "react-icons/sl";
import { X, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/_context/AuthContext';
import { BsPersonBoundingBox } from "react-icons/bs";

export default function SpotifyErrorPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 selection:bg-ohara-pink/30">

      {/* Container Principal Glassmorphism */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 max-w-3xl w-full text-center shadow-2xl relative overflow-hidden">

        {/* Detalhe de Brilho de Fundo (Cores do Perfil) */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-ohara-pink/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-ohara-blue/20 blur-[100px] rounded-full" />

        {/* Visualização da Conexão com Erro (Centralizado) */}
        <div className="relative flex items-center justify-center gap-6 md:gap-12 mb-12">

          {/* Logo da Ohara (Site) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-ohara-pink blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="bg-ohara-dark/60 border border-white/10 rounded-3xl relative transition-transform hover:scale-110">
              <Image src="/ohara-icon.png" alt="Ohara Icon" width={120} height={120} className="rounded-2xl" />
            </div>
          </div>

          {/* Linha de Conexão com X de Erro */}
          <div className="relative flex-1 h-[2px] bg-white/10 max-w-[150px]">
            {/* Ícone de Erro (X) Centralizado na Linha */}
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ohara-dark p-2 rounded-full border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <X size={20} className="text-red-500" />
            </div>
            {/* Efeito Visual de "Corte" ou Falha */}
            <div className="absolute inset-0 bg-gradient-to-r from-ohara-pink via-red-500 to-ohara-pink opacity-50 blur-sm" />
          </div>

          {/* Logo do Spotify */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#1DB954] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="bg-[#1DB954]/10 border border-[#1DB954]/20 p-4 rounded-3xl relative transition-transform hover:scale-110">
              {/* Usando o ícone do Spotify que já mapeamos */}
              <SlSocialSpotify size={64} className="text-[#1DB954]" />
            </div>
          </div>
        </div>

        {/* Texto do Erro */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter uppercase drop-shadow-sm">
          Falha na Conexão com <span className="text-[#1DB954]">Spotify</span>
        </h1>

        <div className="space-y-4 mb-12 max-w-xl mx-auto">
          <p className="text-gray-300 text-lg leading-relaxed">
            Não estamos conseguindo vincular contas do spotify com nosso serviço no momento devido a uma limitação do próprio spotify.<p className="font-extrabold underline"> Esse recurso vai ser removido em breve.</p>
          </p>
          <p className="text-sm text-gray-500 italic">Nenhuma informação adicional foi registrada em nosso banco de dados.</p>
        </div>

        {/* Ações (Alinhado com o padrão de botões que criamos) */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">

          <button
            onClick={() => router.push(`/pages/perfil/${user?.discordId}`)}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <BsPersonBoundingBox size={20} />
            Voltar para seu perfil
          </button>

          <button
            onClick={() => router.back()}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 text-ohara-dark font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-ohara-blue/20"
            style={{ background: `linear-gradient(90deg, #1DB954, #1ED760)` }}
          >
            <RefreshCw size={22} className="animate-spin-slow" />
            Tentar Reconectar
          </button>
        </div>

        {/* Link Sutil para o Perfil (Como feedback visual) */}
        <button
          onClick={() => router.push('/')}
          className="cursor-pointer mt-10 text-gray-500 hover:text-ohara-pink text-sm font-medium flex items-center gap-2 transition-colors mx-auto"
        >
          <ArrowLeft size={14} />
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}