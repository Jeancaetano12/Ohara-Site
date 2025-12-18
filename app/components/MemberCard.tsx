// components/MemberCard.tsx
import React from 'react';
import styles from '../_styles/MemberCard.module.css';
import { Member } from '../_hooks/useMembers';

interface Props {
  member: Member;
}

export default function MemberCard({ member }: Props) {
  // Pega a cor principal do usuário ou usa o Roxo padrão se não tiver
  const userColor = member.colorHex || '#8b5cf6';
  
  // Ordena cargos pela posição (maior posição aparece primeiro)
  const sortedRoles = [...member.roles].sort((a, b) => b.position - a.position);

  // Formata a data de entrada
  const joinDate = new Date(member.joinedServerAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      className={styles.card}
      // Aqui injetamos CSS Variables dinâmicas baseadas na cor do usuário
      style={{ 
        ['--user-glow' as any]: userColor,
        borderColor: `${userColor}40` // 40 é transparência em hex
      } as React.CSSProperties}
    >
      {/* Banner */}
      <div 
        className={styles.bannerArea} 
        style={{ 
          backgroundImage: member.serverBannerUrl ? `url(${member.serverBannerUrl})` : member.bannerUrl ? `url(${member.bannerUrl})` : undefined,
          backgroundColor: member.serverBannerUrl ? 'transparent' : member.bannerUrl ? 'transparent' : userColor // Se não tiver banner, usa cor sólida
        }}
      >
        <div className={styles.avatarWrapper}>
          <img src={member.serverAvatarUrl || member.avatarUrl} alt={member.username} className={styles.avatar} />
        </div>
      </div>

      <div className={styles.content}>
        {/* Nomes */}
        <div className={styles.names}>
          <span className={styles.nickName} style={{ color: userColor }}>
            {member.serverNickName || member.globalName || member.username}
          </span>
          <span className={styles.username}>@{member.username}</span>
        </div>

        {/* Lista de Cargos */}
        <div className={styles.rolesContainer}>
          {sortedRoles.slice(0, 10).map((role) => (
            <span 
              key={role.id} 
              className={styles.roleBadge}
              style={{ color: role.colorHex, borderColor: role.colorHex }}
            >
              {role.name}
            </span>
          ))}
          {sortedRoles.length > 10 && (
            <span className={styles.roleBadge} style={{ color: '#888' }}>
              +{sortedRoles.length - 10}
            </span>
          )}
        </div>
        
        <div className={styles.footer}>
          Membro desde {joinDate}
        </div>
      </div>
    </div>
  );
}