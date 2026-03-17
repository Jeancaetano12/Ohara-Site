"use client";
import { useNotification } from "../_context/NotificationContext";
import { useAuth } from "../_context/AuthContext";
import { useParams } from "next/navigation";
import { useSpotifyProfile } from "@/app/_hooks/useSpotifyProfile";
import { useProfile } from "@/app/_hooks/useProfile";
import { AiOutlineSpotify } from "react-icons/ai";
import { FiMusic, FiUsers, FiExternalLink, FiMic } from "react-icons/fi";

export default function SpotifyProfile() {
  const { notify } = useNotification();
  const { user: loggedUser } = useAuth();
  const params = useParams();
  const discordId = params.discordId as string;

  const { profile } = useProfile(discordId);
  const { spotifyData, status, error } = useSpotifyProfile(discordId);

  const isOwner = loggedUser?.discordId === profile?.discordId;

  const vincularSpotify = () => {
    const token = localStorage.getItem("ohara-token");
    if (!token) {
      notify("Você precisa estar logado para vincular o Spotify.", "error");
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`;
      return;
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/spotify?state=${token}`;
  };

  /* ─── Loading / Fetching skeleton ─── */
  if (status === "loading" || status === "fetching") {
    return (
      <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-5 flex flex-col gap-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-2.5 w-3/5 rounded-full bg-neutral-800 animate-pulse" />
            <div className="h-2 w-2/5 rounded-full bg-neutral-800 animate-pulse" />
          </div>
        </div>
        {/* Chips skeleton */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-neutral-800 animate-pulse" />
          ))}
        </div>
        {/* Tracks skeleton */}
        <div className="flex flex-col gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-neutral-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* ─── Não vinculado — dono do perfil ─── */
  if (status === "not_linked" && isOwner) {
    return (
      <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] text-center transition-colors duration-200 hover:border-[#1db954]">
        <div className="relative flex items-center justify-center mb-1">
          <AiOutlineSpotify size={40} className="text-[#1db954] relative z-10" />
          <span className="absolute w-14 h-14 rounded-full bg-[#1db954]/10 animate-ping" />
        </div>
        <p className="text-sm font-semibold text-neutral-100">
          Nenhuma conta vinculada
        </p>
        <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed">
          Conecte seu Spotify e mostre sua música para o servidor.
        </p>
        <button
          onClick={vincularSpotify}
          className="mt-2 flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1db954] text-black text-xs font-bold tracking-wide transition-all duration-150 hover:bg-[#1ed760] hover:-translate-y-px cursor-pointer"
        >
          <AiOutlineSpotify size={16} />
          Vincular Spotify
        </button>
      </div>
    );
  }

  /* ─── Não vinculado — visitante ─── */
  if (status === "not_linked" && !isOwner) {
    return (
      <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] text-center">
        <AiOutlineSpotify size={36} className="text-neutral-700" />
        <p className="text-sm font-semibold text-neutral-100">
          Spotify não vinculado
        </p>
        <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed">
          Este membro ainda não conectou sua conta do Spotify.
        </p>
      </div>
    );
  }

  /* ─── Erro ─── */
  if (status === "error") {
    return (
      <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] text-center">
        <p className="text-sm font-semibold text-neutral-100">
          Ops, algo deu errado
        </p>
        <p className="text-xs text-neutral-500">{error}</p>
      </div>
    );
  }

  /* ─── Sucesso ─── */
  if (status === "success" && spotifyData) {
    const { profile: sp, topArtists, topTracks, followingCount } = spotifyData;

    return (
      <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition-colors duration-200 hover:border-[#1db954]">

        {/* ── Header do perfil ── */}
        <a
          href={sp.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-1.5 rounded-xl transition-colors duration-150 hover:bg-neutral-900 no-underline"
        >
          <img
            src={sp.image}
            alt={sp.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#1db954] shrink-0"
          />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-bold text-neutral-100 truncate">
              {sp.name}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <FiUsers size={11} />
              {sp.followers} seguidores &middot; seguindo {followingCount}
            </span>
          </div>
          <AiOutlineSpotify size={22} className="text-[#1db954] shrink-0" />
        </a>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-800 my-3.5" />

        {/* ── Top Artistas ── */}
        <section className="flex flex-col gap-2.5">
          <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 m-0">
            <FiMic size={12} />
            Top Artistas
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {topArtists.map((artist) => (
              <a
                key={artist.url}
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 no-underline transition-all duration-150 hover:border-[#1db954] hover:bg-neutral-950"
              >
                <img
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-[11px] font-medium text-neutral-300 whitespace-nowrap">
                  {artist.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="h-px bg-neutral-800 my-3.5" />

        {/* ── Top Músicas ── */}
        <section className="flex flex-col gap-2.5">
          <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-600 m-0">
            <FiMusic size={12} />
            Top Músicas
          </h4>
          <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
            {topTracks.map((track, i) => (
              <li
                key={track.url}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors duration-100 hover:bg-neutral-900 group"
              >
                <span className="text-[11px] font-semibold text-neutral-700 w-3.5 text-center shrink-0">
                  {i + 1}
                </span>
                <img
                  src={track.albumImageUrl}
                  alt={track.name}
                  className="w-9 h-9 rounded-md object-cover shrink-0"
                />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-neutral-200 truncate">
                    {track.name}
                  </span>
                  <span className="text-[11px] text-neutral-500 truncate">
                    {track.artist}
                  </span>
                </div>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir no Spotify"
                  className="text-[#1db954] opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 flex items-center"
                >
                  <FiExternalLink size={13} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return null;
}