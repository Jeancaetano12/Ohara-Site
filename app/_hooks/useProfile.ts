"use client";
import { useState, useEffect, useCallback } from 'react';
import { api } from './fetcher';

export interface Role {
    name: string;
    colorHex: string;
    position: number;
}

export interface Connections {
    provider: string;
    providerId: string;
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
    profile: {
        bio: string | null;
        socialLinks: string[] | null;
        AvatarSite: string | null;
        BannerSite: string | null;
    } | null;
    updatedAt: string;
    roles: Role[];
    connections: Connections[];
}

export function useProfile(discordId: string) {
    const [profile, setProfile] = useState<MemberProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!discordId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/users/${discordId}`);
            setProfile(response.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setProfile(null);
            } else {
                setError(err.message || 'Erro ao buscar perfil');
            }
        } finally {
            setLoading(false);
        }
    }, [discordId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        reload: fetchProfile
    };
}

export function usePrivateProfile(isAuthenticated: boolean = true) {
    const [profile, setProfile] = useState<MemberProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!isAuthenticated) {
            setProfile(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/users/me`);
            setProfile(response.data);
        } catch (err: any) {
            if (err.response?.status === 404 || err.response?.status === 401) {
                setProfile(null);
            } else {
                setError(err.message || 'Erro ao buscar perfil privado');
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        reload: fetchProfile
    };
}