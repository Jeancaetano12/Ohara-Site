"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../../../_hooks/fetcher";

interface Post {
    id: string;
    tittle: string;
    content: string;
    media: string[];
    author: {
        globalName: string | null;
        avatarUrl: string;
    };
    createdAt: string;
    updatedAt: string;
    evento: {
        nomeEvento: string;
    } | null;
}

export default function LerPostPage() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/postagens/${params.id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Erro ao carregar o post:", error);
                router.push("/pages/blog");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-t-ohara-pink border-ohara-dark rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return <div className="text-center text-ohara-white py-12">Post não encontrado.</div>;
    }

    const capaUrl = post.media && post.media.length > 0 ? post.media[0] : null;

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <Link 
                href="/pages/blog" 
                className="inline-flex items-center text-[var(--accent-color)] hover:text-ohara-pink mb-6 transition-colors font-semibold"
            >
                ← Voltar para o Feed
            </Link>

            <article className="bg-ohara-dark border border-[var(--separator-color)] rounded-2xl overflow-hidden shadow-lg">
                {capaUrl && (
                    <div className="w-full h-64 md:h-96 relative">
                        <img 
                            src={capaUrl} 
                            alt={post.tittle} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                
                <div className="p-8 md:p-12">
                    {post.evento && (
                        <div className="inline-block bg-[var(--secondary-accent)] text-white px-3 py-1 rounded-full text-xs font-bold mb-4">
                            Evento: {post.evento.nomeEvento}
                        </div>
                    )}
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-ohara-white mb-6" style={{ textShadow: "var(--text-glow)" }}>
                        {post.tittle}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[var(--separator-color)]">
                        <img 
                            src={post.author.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                            alt="Autor" 
                            className="w-12 h-12 rounded-full border-2 border-[var(--accent-color)]"
                        />
                        <div>
                            <p className="text-ohara-white font-semibold">{post.author.globalName || "Autor Desconhecido"}</p>
                            <p className="text-[var(--text-color)] text-sm">
                                {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-ohara-white prose-a:text-[var(--accent-color)] hover:prose-a:text-ohara-pink prose-img:rounded-xl prose-img:shadow-md">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>
        </div>
    );
}
