"use client";
import useSWR from 'swr';
import { fetcher } from './fetcher';
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

  // Verifica se o membro tem o Spotify vinculado nas connections
  const hasSpotifyLinked =
    profile?.connections?.some((c) => c.provider === "spotify") ?? false;

  const { data: spotifyData, error: swrError, isLoading, mutate: fetchSpotifyData } = useSWR<SpotifyData>(
    discordId && hasSpotifyLinked ? `/users/${discordId}/spotify` : null,
    fetcher
  );

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