"use client";
import { useState, useEffect, useCallback } from 'react';
import { api } from './fetcher';
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
  const [isLoading, setIsLoading] = useState(false);
  const [swrError, setSwrError] = useState<Error | null>(null);

  const hasSpotifyLinked =
    profile?.connections?.some((c) => c.provider === "spotify") ?? false;

  const fetchSpotifyData = useCallback(async () => {
    if (!discordId || !hasSpotifyLinked) {
      setSpotifyData(null);
      return;
    }
    setIsLoading(true);
    setSwrError(null);
    try {
      const response = await api.get(`/users/${discordId}/spotify`);
      setSpotifyData(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSpotifyData(null);
      } else {
        setSwrError(err instanceof Error ? err : new Error(err.message || "Erro ao buscar Spotify"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [discordId, hasSpotifyLinked]);

  useEffect(() => {
    fetchSpotifyData();
  }, [fetchSpotifyData]);

  let status: SpotifyStatus = "loading";
  let error: string | null = null;

  if (profileLoading) {
    status = "loading";
  } else if (!hasSpotifyLinked) {
    status = "not_linked";
  } else if (isLoading) {
    status = "fetching";
  } else if (swrError) {
    status = "error";
    error = swrError.message;
  } else if (spotifyData) {
    status = "success";
  }

  return {
    spotifyData: spotifyData ?? null,
    status,
    error,
    hasSpotifyLinked,
    reload: fetchSpotifyData,
  };
}