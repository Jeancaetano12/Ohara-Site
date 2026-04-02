"use client";
import useSWR from 'swr';
import { fetcher } from './fetcher';

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
    id: string;
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
    const { data: profile, error, isLoading, mutate } = useSWR<MemberProfile>(
        discordId ? `/users/${discordId}` : null,
        fetcher
    );
    console.log(profile)
    return {
        profile: profile ?? null,
        loading: isLoading,
        error: error ? error.message : null,
        reload: mutate
    };
}

export function usePrivateProfile() {
    // Pegamos o token para garantir que a requisição só aconteça se ele existir
    const token = typeof window !== 'undefined' ? localStorage.getItem('ohara-token') : null;

    // Se não houver token, passamos `null` e o SWR não tentará fazer o fetch
    const { data: profile, error, isLoading, mutate } = useSWR<MemberProfile>(
        token ? `/users/me` : null,
        fetcher
    );
    console.log(profile)
    return {
        profile: profile ?? null,
        loading: isLoading,
        error: error ? error.message : null,
        reload: mutate
    };
}