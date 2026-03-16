import { useEffect } from "react";
import { useNotification } from "../_context/NotificationContext";

export default function SpotifyProfile() {
    const { notify } = useNotification();

    const vincularSpotify = () => {
        const token = localStorage.getItem('ohara-token');
        if (!token) {
            notify("Você precisa estar logado para vincular o Spotify.", "error");
            return;
        }
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/spotify?state=${token}`
    }

    return (
        <div className="group relative rounded-2xl border bg-zinc-900 overflow-hidden cursor-pointer
                       transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <button className="cursor-pointer px-6 py-3 text-white font-bold rounded-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2 bg-green-500/20 border border-green-500 text-green-500" 
                onClick={vincularSpotify}>Vincular Spotify</button>
        </div>
    )
}