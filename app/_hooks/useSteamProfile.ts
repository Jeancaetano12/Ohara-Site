"use client";
import { useState, useEffect, useCallback } from "react";

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
    const [summary, setSummary] = useState<SteamSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async () => {
        console.log(`dicordId usado para summary: ${discordId}`)
        if (!discordId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${discordId}/steam/summary`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-site-key": process.env.NEXT_PUBLIC_SITE_KEY || "",
                    },
                }
            );
            if (response.status === 404) {
                setSummary(null);
                return;
            }
            if (!response.ok) throw new Error("Erro ao buscar perfil Steam.");
            const data: SteamSummary = await response.json();
            setSummary(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [discordId]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

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