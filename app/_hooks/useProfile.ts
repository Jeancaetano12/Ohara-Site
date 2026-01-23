"use client";
import { useState, useEffect, useCallback } from 'react';

export interface Role {
    name: string;
    colorHex: string;
    position: number;
}

export interface Connections {
    provider: string;
    providerId: string;
}

export interface Member {
    discordId: string;
    username: string;
    globalName: string | null;
    serverNickName: string | null;
    avatarUrl: string;
    serverAvatarUrl: string | null;
    bannerUrl: string | null;
    serverBannerUrl: string | null;
    isBot: boolean;
    colorHex: string;
    joinedServerAt: string;
    profile: ProfileData[];
    updatedAt: string;
    roles: Role[];
    connections: Connections[];
}

export interface ProfileData {
    bio: string | null;
    socialLinks: string[] | null;
    AvatarSite: string | null;
    BannerSite: string | null;
}

export interface MemberProfile {
    discordId: string;
    username: string;
    globalName: string | null;
    serverNickName: string | null;
    avatarUrl: string;
    serverAvatarUrl: string | null;
    bannerUrl: string | null;
    serverBannerUrl: string | null;
    isBot: boolean;
    colorHex: string;
    joinedServerAt: string;
    profile: ProfileData | null;
    updatedAt: string;
    roles: Role[];
    connections: Connections[];
}

export function useProfile(discordId: string) {
    const [profile, setProfile] = useState<MemberProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!discordId) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${discordId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-site-key': process.env.NEXT_PUBLIC_SITE_KEY || ''
                }
            });

            if (!response.ok) {
                if (response.status === 404) throw new Error('Membro não encontrado.');
                throw new Error('Erro ao carregar perfil.');
            }
            const data = await response.json();
            console.log('Fetched profile data:', data);
            setProfile(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [discordId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, reload: fetchProfile };
}