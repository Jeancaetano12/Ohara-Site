// components/MemberCard.tsx
import React from 'react';
import { Member } from '../_hooks/useMembers';

interface Props {
  member: Member;
}

export default function MemberCard({ member }: Props) {
  const userColor = member.colorHex || '#8b5cf6';
  
  const sortedRoles = [...member.roles].sort((a, b) => b.position - a.position);

  const joinDate = new Date(member.joinedServerAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    /* Container Pai: Define o padding que será a largura da borda e esconde o transbordamento do gradiente */
    <div className="group relative p-[2px] flex flex-col overflow-hidden transition-all duration-500 ease-out rounded-xl hover:-translate-y-2">
      
      {/* Camada da Borda Infinita: Gira ao fundo e só aparece no hover */}
      <div 
        className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 animate-border-spin transition-opacity duration-500 pointer-events-none"
        style={{ 
          background: `conic-gradient(from 0deg, transparent 0%, ${userColor}, transparent 100%)` 
        }}
      />

      {/* Camada Interna (O Card Real): Fica por cima do gradiente giratório */}
      <div 
        className="relative z-10 flex flex-col w-full h-full overflow-hidden rounded-[10px] bg-[var(--bg-color)] border border-[var(--separator-color)]"
        style={{ '--user-color': userColor } as React.CSSProperties}
      >
        
        {/* Banner Area */}
        <div 
          className="relative w-full h-[130px] bg-center bg-cover"
          style={{ 
            backgroundImage: member.serverBannerUrl ? `url(${member.serverBannerUrl})` : member.bannerUrl ? `url(${member.bannerUrl})` : 'none',
            backgroundColor: (!member.serverBannerUrl && !member.bannerUrl) ? userColor : '#2d1b4e'
          }}
        >
          {/* Avatar Wrapper */}
          <div className="absolute w-[90px] h-[90px] rounded-full border-[3px] border-[var(--bg-color)] left-5 -bottom-10 overflow-hidden bg-[var(--bg-color)]">
            <img 
              src={member.serverAvatarUrl || member.avatarUrl} 
              alt={member.username} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-2 px-5 pb-5 pt-[50px]">
          <div className="flex flex-col">
            <span 
              className="text-lg font-black transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--user-color)]" 
              style={{ color: userColor }}
            >
              {member.serverNickName || member.globalName || member.username}
            </span>
            <span className="font-mono text-sm text-gray-500">
              @{member.username}
            </span>
          </div>

          {/* Roles */}
          <div className="flex flex-wrap gap-2 mt-2">
            {sortedRoles.slice(0, 6).map((role) => (
              <span 
                key={role.id} 
                className="flex items-center gap-1.5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-tighter rounded-md border border-white/5 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1"
                style={{ 
                  color: role.colorHex, 
                  borderColor: `${role.colorHex}`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: role.colorHex }} />
                {role.name}
              </span>
            ))}
          </div>
          
          <div className="pt-4 mt-auto text-xs text-gray-600 border-t border-[var(--separator-color)]">
            Membro desde {joinDate}
          </div>
        </div>
      </div>
    </div>
  );
}