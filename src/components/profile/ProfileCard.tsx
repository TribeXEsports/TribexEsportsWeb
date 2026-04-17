"use client"

import React from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  Settings,
  ExternalLink,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";
import Link from "next/link";

interface ProfileCardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
    youtubeUrl?: string | null;
  };
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const username = user.username;
      if (!username) {
        alert("Please set a unique username in Settings to enable sharing your Pro Card.");
        return;
      }
      
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/profile/${username}`;
      
      navigator.clipboard.writeText(shareUrl);
      alert(`Pro Card link copied: ${shareUrl}`);
    }
  };

  return (
    <div className="group relative">
       {/* Card Outer Glow */}
       <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-primary/40 to-primary/20 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
       
       <div className="relative bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
          {/* Top Decorative Bar */}
          <div className="h-1.5 w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="p-10 md:p-14 space-y-10">
             {/* Identity Stack */}
             <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                   <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full" />
                   <div className="size-32 md:size-40 rounded-full border-2 border-white/5 p-1 relative z-10 bg-zinc-950">
                       <Image 
                          src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.name || 'tribex'}`} 
                          alt={`${user.name || 'Athlete'}'s Avatar`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 128px, 160px"
                       />
                   </div>
                   <div className="absolute bottom-2 right-2 size-5 bg-green-500 rounded-full border-4 border-[#080808] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>

                <div className="space-y-4">
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic mb-2">Verified Athlete</span>
                      <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-tight">
                         {user.username || user.name?.split(' ')[0]}
                      </h2>
                      <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                         {user.name}
                      </p>
                   </div>
                </div>
             </div>

             {/* Socials & Actions */}
             <div className="flex flex-col items-center space-y-8">
                <div className="flex items-center gap-4">
                   {[
                     { Icon: Twitter, url: user.twitterUrl },
                     { Icon: Instagram, url: user.instagramUrl },
                     { Icon: Youtube, url: user.youtubeUrl }
                   ].map((social, i) => (
                      <button 
                        key={i} 
                        onClick={() => social.url && window.open(social.url.startsWith('http') ? social.url : `https://${social.url}`, '_blank')}
                        disabled={!social.url}
                        className={`size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center transition-all group ${
                          social.url 
                            ? "hover:bg-white/10 hover:border-primary/30 text-zinc-500 hover:text-white" 
                            : "opacity-20 cursor-not-allowed text-zinc-800"
                        }`}
                      >
                         <social.Icon className="size-5 transition-transform group-hover:scale-110" />
                      </button>
                   ))}
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                   <Link 
                    href="/settings"
                    className="flex items-center justify-center gap-3 h-14 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:text-white transition-all group"
                   >
                     <Settings className="size-4 text-zinc-600 group-hover:text-primary transition-colors" />
                     Configure
                   </Link>
                   <button 
                    className="flex items-center justify-center gap-3 h-14 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:text-white transition-all group"
                    onClick={handleShare}
                   >
                     <ExternalLink className="size-4 text-zinc-600 group-hover:text-primary transition-colors" />
                     Share Card
                   </button>
                </div>

                <div className="pt-4 flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity duration-700">
                   <ShieldCheck className="size-4 text-primary" />
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white italic">Tribex Global Network Integrity Verified</span>
                </div>
             </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="absolute bottom-0 right-0 p-8 pointer-events-none opacity-5 grayscale">
             <Image src="/logo.png" className="w-20 h-auto" alt="Tribex Logo Watermark" width={80} height={80} />
          </div>
       </div>
    </div>
  );
};
