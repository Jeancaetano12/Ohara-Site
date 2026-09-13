"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { api } from "../../../_hooks/fetcher";
import { useAuth } from "../../../_context/AuthContext";
import { useNotification } from "../../../_context/NotificationContext";

// Importa dinamicamente para evitar erro de SSR do Markdown Editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), { ssr: false });

export default function CreatePostPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { notify } = useNotification();
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [capa, setCapa] = useState<File | null>(null);
    const [eventoId, setEventoId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUploadImagem = async (file: File) => {
        const formData = new FormData();
        formData.append("arquivos", file);

        try {
            const res = await api.post("/postagens/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data.urls[0];
        } catch (error) {
            console.error("Erro ao subir imagem", error);
            notify("Erro ao fazer upload da imagem", "error");
            return null;
        }
    };

    const handlePublicar = async () => {
        if (!title.trim() || !content.trim()) {
            notify("Título e conteúdo são obrigatórios.", "error");
            return;
        }
        if (!user) {
            notify("Você precisa estar logado para publicar.", "error");
            return;
        }

        setLoading(true);
        try {
            let mediaUrls: string[] = [];
            
            if (capa) {
                const url = await handleUploadImagem(capa);
                if (url) mediaUrls.push(url);
            }

            const postData = {
                title,
                content,
                media: mediaUrls,
                eventoId: eventoId || undefined,
                authorId: user.sub
            };

            await api.post("/postagens/create", postData);
            notify("Patch Note publicado com sucesso!", "success");
            router.push("/pages/blog");
        } catch (error: any) {
            console.error(error);
            notify(error.response?.data?.message || "Erro ao criar post", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-ohara-white" style={{ textShadow: "var(--text-glow)" }}>
                Criar Nova Atualização
            </h1>

            <div className="flex flex-col gap-2">
                <label className="text-[var(--text-color)] font-semibold">Título</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Patch 1.2 - Nova Era"
                    className="bg-ohara-dark border border-[var(--separator-color)] text-ohara-white p-3 rounded-lg focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[var(--text-color)] font-semibold">Imagem de Capa</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setCapa(e.target.files?.[0] || null)}
                        className="bg-ohara-dark border border-[var(--separator-color)] text-ohara-white p-2 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-accent)] file:text-white hover:file:bg-ohara-pink"
                    />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[var(--text-color)] font-semibold">ID do Evento (Opcional)</label>
                    <input 
                        type="text"
                        value={eventoId}
                        onChange={(e) => setEventoId(e.target.value)}
                        placeholder="Cole o ID do evento aqui"
                        className="bg-ohara-dark border border-[var(--separator-color)] text-ohara-white p-3 rounded-lg focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-4" data-color-mode="dark">
                <div className="flex justify-between items-end mb-2">
                    <label className="text-[var(--text-color)] font-semibold">Conteúdo (Markdown)</label>
                    
                    {/* Botão de upload no meio do texto */}
                    <label className="cursor-pointer bg-[var(--secondary-accent)] hover:bg-ohara-pink text-white py-1 px-3 rounded text-sm transition-colors shadow-lg">
                        + Inserir Imagem no Texto
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const url = await handleUploadImagem(file);
                                    if (url) {
                                        setContent((prev) => prev + `\n\n![Imagem Adicionada](${url})\n`);
                                    }
                                }
                                e.target.value = '';
                            }}
                        />
                    </label>
                </div>
                
                <div className="border border-[var(--separator-color)] rounded-lg overflow-hidden">
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || "")}
                        height={500}
                        style={{ backgroundColor: 'var(--color-ohara-dark)' }}
                    />
                </div>
            </div>

            <button 
                onClick={handlePublicar}
                disabled={loading}
                className="mt-6 w-full md:w-auto self-end bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-[var(--bg-color)] font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,243,255,0.4)] disabled:opacity-50"
            >
                {loading ? "Publicando..." : "Publicar Patch Note"}
            </button>
        </div>
    );
}
