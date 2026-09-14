"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Send, Loader2 } from "lucide-react";
import { api } from "../../../_hooks/fetcher";
import { useAuth } from "../../../_context/AuthContext";
import { useNotification } from "../../../_context/NotificationContext";

interface PostItens {
    tittle: string;
    content: string;
    media: string[];
    eventoId?: string | null;
    discordId: string;
}

const TITLE_MAX = 50;
const CONTENT_MAX = 10000;

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

    // Conta quantas imagens markdown (![alt](url)) existem no texto atual
    const imageCount = useMemo(() => {
        const matches = content.match(/!\[[^\]]*\]\([^)]*\)/g);
        return matches ? matches.length : 0;
    }, [content]);

    const titleLength = title.length;
    const contentLength = content.length;
    const isTitleNearLimit = titleLength >= TITLE_MAX * 0.9;
    const isContentNearLimit = contentLength >= CONTENT_MAX * 0.9;

    const handleTitleChange = (value: string) => {
        setTitle(value.slice(0, TITLE_MAX));
    };

    const handleContentChange = (value: string) => {
        setContent(value.slice(0, CONTENT_MAX));
    };

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

            const postData: PostItens = {
                tittle: title,
                content: content,
                media: mediaUrls,
                eventoId: eventoId || null,
                discordId: user.discordId
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
        <div className="min-h-screen bg-ohara-dark pb-20">
            <main className="max-w-5xl mx-auto px-4 pt-8 flex flex-col gap-6">

                {/* --- TOPO: Voltar + Título da página --- */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.confirm("Deseja sair da criação do post? as alterações serão perdidas.") && router.back()}
                        className="cursor-pointer flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-ohara-white hover:bg-white/10 hover:-translate-x-0.5 transition-all"
                        title="Voltar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-ohara-white tracking-tight" style={{ textShadow: "var(--text-glow)" }}>
                            Criar novo post
                        </h1>
                        <p className="text-sm text-gray-500">Compartilhe novidades, patch notes e eventos com a comunidade.</p>
                    </div>
                </div>

                {/* --- CARD: Informações principais --- */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">

                    {/* Título */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-ohara-white font-semibold">Título</label>
                            <span className={`text-xs font-mono transition-colors ${isTitleNearLimit ? "text-ohara-orange" : "text-gray-500"}`}>
                                {titleLength}/{TITLE_MAX}
                            </span>
                        </div>
                        <input
                            type="text"
                            value={title}
                            maxLength={TITLE_MAX}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Ex: Patch 1.2 - Nova Era"
                            className="bg-black/20 border border-white/10 text-ohara-white p-3 rounded-xl focus:outline-none focus:border-ohara-pink/60 focus:ring-2 focus:ring-ohara-pink/20 transition-all"
                        />
                    </div>

                    {/* Capa + Evento */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-ohara-white font-semibold">Imagem de Capa</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCapa(e.target.files?.[0] || null)}
                                className="bg-black/20 border border-white/10 text-ohara-white p-2 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer file:bg-ohara-pink/80 file:text-white hover:file:bg-ohara-pink transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-ohara-white font-semibold">ID do Evento (Opcional)</label>
                            <input
                                type="text"
                                value={eventoId}
                                onChange={(e) => setEventoId(e.target.value)}
                                placeholder="Cole o ID do evento aqui"
                                className="bg-black/20 border border-white/10 text-ohara-white p-3 rounded-xl focus:outline-none focus:border-ohara-blue/60 focus:ring-2 focus:ring-ohara-blue/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* --- CARD: Conteúdo (Markdown) --- */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-4" data-color-mode="dark">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <label className="text-ohara-white font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-6 rounded-full bg-ohara-pink" />
                            Conteúdo (Markdown)
                        </label>

                        <div className="flex items-center gap-3">
                            {/* Contador de imagens inseridas no texto */}
                            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-ohara-blue/10 border border-ohara-blue/30 text-ohara-blue">
                                <ImageIcon size={14} />
                                {imageCount} {imageCount === 1 ? "imagem" : "imagens"}
                            </span>

                            {/* Contador de caracteres do conteúdo */}
                            <span className={`text-xs font-mono transition-colors ${isContentNearLimit ? "text-ohara-orange" : "text-gray-500"}`}>
                                {contentLength}/{CONTENT_MAX}
                            </span>

                            {/* Botão de upload no meio do texto */}
                            <label className="cursor-pointer flex items-center gap-2 bg-ohara-pink/80 hover:bg-ohara-pink text-white py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors shadow-lg">
                                <ImageIcon size={14} />
                                Inserir Imagem
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await handleUploadImagem(file);
                                            if (url) {
                                                handleContentChange(content + `\n\n![Imagem Adicionada](${url})\n`);
                                            }
                                        }
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-2xl overflow-hidden">
                        <MDEditor
                            value={content}
                            onChange={(val) => handleContentChange(val || "")}
                            height={500}
                            style={{ backgroundColor: 'var(--color-ohara-dark)' }}
                        />
                    </div>
                </div>

                {/* --- AÇÕES --- */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => router.back()}
                        className="cursor-pointer px-6 py-3 rounded-2xl border border-white/10 text-ohara-white font-semibold hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handlePublicar}
                        disabled={loading}
                        className="cursor-pointer flex items-center gap-2 px-8 py-3 rounded-2xl text-white font-bold shadow-[0_0_20px_rgba(217,70,239,0.35)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        style={{ background: "linear-gradient(90deg, var(--color-ohara-pink), var(--color-ohara-blue))" }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Publicando...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Publicar Post
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}