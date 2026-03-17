"use client";
import { useState, useEffect, useCallback } from "react";
import { useProfile } from "./useProfile";

export interface SpotifyProfileData {
  name: string;
  spotifyUrl: string;
  followers: number;
  image: string;
}

export interface SpotifyArtist {
  name: string;
  url: string;
  imageUrl: string;
}

export interface SpotifyTrack {
  name: string;
  artist: string;
  albumImageUrl: string;
  url: string;
}

export interface SpotifyData {
  profile: SpotifyProfileData;
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  followingCount: number;
}

export type SpotifyStatus =
  | "loading"          // carregando useProfile
  | "not_linked"       // não tem conexão spotify nas connections
  | "fetching"         // buscando dados do spotify
  | "success"          // dados carregados com sucesso
  | "error";           // erro na requisição spotify

export function useSpotifyProfile(discordId: string) {
  const { profile, loading: profileLoading } = useProfile(discordId);

  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [status, setStatus] = useState<SpotifyStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  // Verifica se o membro tem o Spotify vinculado nas connections
  const hasSpotifyLinked =
    profile?.connections?.some((c) => c.provider === "spotify") ?? false;

  const fetchSpotifyData = useCallback(
    async (signal?: AbortSignal) => {
      if (!discordId || !hasSpotifyLinked) return;

      setStatus("fetching");
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${discordId}/spotify`,
          {
            signal,
            headers: {
              "Content-Type": "application/json",
              "x-site-key": process.env.NEXT_PUBLIC_SITE_KEY || "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar dados do Spotify.");
        }

        const data: SpotifyData = await response.json();
        setSpotifyData(data);
        setStatus("success");
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      }
    },
    [discordId, hasSpotifyLinked]
  );

  useEffect(() => {
    // Ainda carregando o perfil base
    if (profileLoading) {
      setStatus("loading");
      return;
    }

    // Perfil carregado, mas sem Spotify vinculado
    if (!hasSpotifyLinked) {
      setStatus("not_linked");
      return;
    }

    // Tem Spotify vinculado — busca os dados
    const controller = new AbortController();
    fetchSpotifyData(controller.signal);
    return () => controller.abort();
  }, [profileLoading, hasSpotifyLinked, fetchSpotifyData]);

  return {
    spotifyData,
    status,
    error,
    hasSpotifyLinked,
    reload: fetchSpotifyData,
  };
}