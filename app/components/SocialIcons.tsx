// app/components/SocialIcon.tsx
import { X, Save, Github, Instagram, Linkedin } from 'lucide-react';
import { SlSocialSpotify } from "react-icons/sl";
import { ImSteam } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";

const socialConfig: Record<string, { icon: any; color: string }> = {
  github: { icon: Github, color: '#f0f6fc' },
  instagram: { icon: Instagram, color: '#E4405F' },
  twitter: { icon: FaXTwitter, color: '#f0f6fc' },
  linkedin: { icon: Linkedin, color: '#0A66C2' },
  steam: { icon: ImSteam, color: '#0A66C2' },
  spotify: { icon: SlSocialSpotify, color: '#1DB954' },
};

export default function SocialIcon({ platform }: { platform: string }) {
  const config = socialConfig[platform.toLowerCase()];
  if (!config) return <span>{platform}</span>;

  const Icon = config.icon;
  return <Icon size={20} style={{ color: config.color }} />;
}