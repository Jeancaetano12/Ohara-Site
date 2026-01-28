"use client";

import { Check, Info, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
  color?: string; // Para suportar a cor dinâmica do perfil
}

export default function Toast({ message, type = 'success', onClose, duration = 3000, color }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const iconMap = {
    success: <Check className="w-5 h-5 text-green-400" />,
    error: <Info className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-ohara-blue" />,
  };

  return (
    <div className="relative z-100 translate-x-1/2 md:translate-x-0 animate-in fade-in slide-in-from-top-4 duration-300">
        <div 
            className="bg-white/10 dark:bg-[#1b102d]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-70"
            style={color ? { borderLeft: `4px solid ${color}`, boxShadow: `0 10px 30px -10px ${color}66` } : {}}
        >
            <div className="p-2 bg-black/30 rounded-xl animate-pulse">
                {color ? <Check className="w-5 h-5" style={{ color }} /> : iconMap[type]}
            </div>
            <p className="text-white font-medium text-sm flex-1">{message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4 cursor-pointer" />
            </button>
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden w-full">
            <div 
                className="h-full bg-current transition-all linear"
                style={{ 
                    backgroundColor: color || '#06b6d4', 
                    animation: `shrink ${duration}ms linear forwards` 
                }}
            />
        </div>
    </div>
  );
}