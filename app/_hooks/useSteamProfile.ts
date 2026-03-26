"use client";
import { useCallback } from "react";
import useSWR from 'swr';
import { fetcher } from './fetcher';

export interface SteamProfileData {
    steamId: string;
    personaname: string;
    avatar: string;
    profileUrl: string;
}

export interface SteamGame {
    appId: number;
    name: string;
    playtimeHours: number;
    coverUrl: string;
    iconUrl: string;
}

export interface SteamSummary {
    steamProfile: SteamProfileData;
    favoriteGames: SteamGame[] | null;
}

export interface SteamGamesResponse {
    isPrivate: boolean;
    totalGames: number;
    games: SteamGame[];
}

export function useSteamProfile(discordId: string) {
    const { data: summary, error: swrError, isLoading, mutate: fetchSummary } = useSWR<SteamSummary | null>(
        discordId ? `/users/${discordId}/steam/summary` : null,
        fetcher
    );

    const loading = isLoading;
    const error = swrError ? swrError.message : null;

    const fetchGames = useCallback(async (): Promise<SteamGamesResponse | null> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${discordId}/steam/games`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-site-key": process.env.NEXT_PUBLIC_SITE_KEY || "",
                    },
                }
            );
            console.log(`DiscordId enviado no fetchGames ${discordId}`)
            if (!response.ok) throw new Error("Erro ao buscar jogos.");
            return await response.json();
        } catch {
            return null;
        }
    }, [discordId]);

    const saveShowcase = useCallback(
        async (games: SteamGame[]): Promise<boolean> => {
            const token = localStorage.getItem("ohara-token");
            try {
                const payload = {
                    games: games.map((g) => ({
                        appId: g.appId,
                        name: g.name,
                        playtimeHours: g.playtimeHours,
                        coverUrl: g.coverUrl,
                        iconUrl: g.iconUrl,
                    })),
                };
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/me/steam/showcase`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );
                if (!response.ok) throw new Error("Falha ao salvar showcase.");
                await fetchSummary();
                return true;
            } catch {
                return false;
            }
        },
        [fetchSummary]
    );

    const registerSteam = useCallback(
        async (steamUrl: string): Promise<boolean> => {
            const token = localStorage.getItem("ohara-token");
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/me/steam/add`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ steamUrl }),
                    }
                );
                if (!response.ok) throw new Error("Erro ao registrar Steam.");

                setTimeout(() => {
                    window.location.reload();
                }, 1500);

                return true;
            } catch {
                return false;
            }
        },
        [fetchSummary]
    );

    return { summary, loading, error, fetchGames, saveShowcase, reload: fetchSummary, registerSteam };
}