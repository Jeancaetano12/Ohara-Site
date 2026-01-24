"use client";
import { useState } from 'react';
import { useAuth } from '../_context/AuthContext';
import { X, Save, Github, Instagram, Linkedin, Loader2 } from 'lucide-react';
import { SlSocialSpotify } from "react-icons/sl";
import { ImSteam } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";
import { useNotification } from '../_context/NotificationContext';

export default function EditProfileModal({ profile, onClose, onRefresh, userColor }: any) {
    const token = localStorage.getItem('ohara-token');
    const { notify } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bio: profile.profile?.bio || '',
        socialLinks: {
            github: profile.profile?.socialLinks?.github || '',
            instagram: profile.profile?.socialLinks?.instagram || '',
            twitter: profile.profile?.socialLinks?.twitter || '',
            linkedin: profile.profile?.socialLinks?.linkedin || '',
            steam: profile.profile?.socialLinks?.steam || '',
            spotify: profile.profile?.socialLinks?.spotify || '',
        }
    });

    const updateSocial = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [key]: value
            }
        }))
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.status === 401) {
                useAuth().expire();
                throw new Error('Sessão Expirada.');
            }
            if (!response.ok) throw new Error('Falha ao atualizar perfil');
            
            notify("Perfil atualizado com sucesso!", "success", userColor);
            onRefresh();
            onClose();
        } catch (err) {
            console.error(err);
            notify("Erro ao salvar alterações.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#130b20] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
                    <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Campo Bio */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Sobre Mim</label>
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-ohara-pink/50 transition-colors h-32 resize-none"
                            placeholder="Conte um pouco sobre você..."
                        />
                        <p className="text-right text-xs text-gray-500 mt-1">{formData.bio.length}/240</p>
                    </div>

                    {/* Redes Sociais */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase mb-4">Perfis Sociais</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SocialInput icon={<Github size={18}/>} label="GitHub" value={formData.socialLinks.github} 
                                onChange={(val: string) => updateSocial('github', val)} onClear={() => updateSocial('github', '')} />
                            <SocialInput icon={<Instagram size={18}/>} label="Instagram" value={formData.socialLinks.instagram} 
                                onChange={(val: string) => updateSocial('instagram', val)} onClear={() => updateSocial('instagram', '')} />
                            <SocialInput icon={<FaXTwitter size={18}/>} label="Twitter" value={formData.socialLinks.twitter} 
                                onChange={(val: string) => updateSocial('twitter', val)} onClear={() => updateSocial('twitter', '')} />
                            <SocialInput icon={<Linkedin size={18}/>} label="LinkedIn" value={formData.socialLinks.linkedin}
                                onChange={(val: string) => updateSocial('linkedin', val)} onClear={() => updateSocial('linkedin', '')} />
                            <SocialInput icon={<ImSteam size={18}/>} label="Perfil Steam" value={formData.socialLinks.steam}
                                onChange={(val: string) => updateSocial('steam', val)} onClear={() => updateSocial('steam', '')} />
                            <SocialInput icon={<SlSocialSpotify size={18}/>} label="Spotify" value={formData.socialLinks.spotify}
                                onChange={(val: string) => updateSocial('spotify', val)} onClear={() => updateSocial('spotify', '')} />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="cursor-pointer w-full py-4 text-white font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ boxShadow: `0 0 20px ${userColor}80`,
                            background: `linear-gradient(90deg, ${userColor}, ${userColor})`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 10px ${userColor}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-6 h-6" />
                        ) : (
                            <>
                                <Save size={20} />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Helper para Inputs Sociais
function SocialInput({ icon, label, value, onChange, onClear}: any) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
            <div className="text-gray-400">{icon}</div>
            <input 
                type="url" 
                placeholder={`URL do ${label}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-none text-white text-sm w-full focus:outline-none"
            />
            {value && (
                <button 
                    type="button"
                    onClick={onClear}
                    className="cursor-pointer text-gray-500 hover:text-red-400 transition-colors p-1"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}