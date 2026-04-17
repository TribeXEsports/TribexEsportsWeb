"use client"

import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Unlock, 
  Map as MapIcon, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Terminal,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MatchRoomListProps {
  initialMatches: any[];
}

export default function MatchRoomList({ initialMatches }: MatchRoomListProps) {
  const [matches, setMatches] = useState(initialMatches);
  const [now, setNow] = useState(new Date());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(type);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (matches.length === 0) return null;

  return (
    <div className="space-y-8 mt-20 border-t border-white/5 pt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Match <span className="text-primary not-italic">Rooms</span></h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Room credentials are revealed before each match</p>
          </div>
          <Badge className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black italic tracking-widest uppercase py-1.5 px-4">
             Live
          </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {matches.map((match: any) => {
          const room = match.room;
          const revealTime = room?.revealTime ? new Date(room.revealTime) : null;
          const isRevealed = revealTime ? now >= revealTime : false;
          const timeLeft = revealTime ? Math.max(0, revealTime.getTime() - now.getTime()) : 0;
          
          const formatTime = (ms: number) => {
            const min = Math.floor(ms / 60000);
            const sec = Math.floor((ms % 60000) / 1000);
            return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
          };

          return (
            <motion.div 
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 group hover:border-primary/20 transition-all overflow-hidden relative"
            >
              {/* Background Glow */}
              <div className={cn(
                "absolute -right-20 -top-20 size-64 blur-[100px] transition-opacity duration-1000",
                isRevealed ? "bg-emerald-500/10 opacity-100" : "bg-primary/5 opacity-50"
              )} />

              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-8 flex-1">
                    <div className="size-20 rounded-3xl bg-black border border-white/5 flex flex-col items-center justify-center p-4">
                        <Terminal className={cn("size-6 mb-2", isRevealed ? "text-emerald-500" : "text-zinc-800")} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Stage</span>
                        <span className="text-[10px] font-black text-white italic uppercase truncate w-full text-center">{match.stage}</span>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                           <Badge className="bg-zinc-950 text-zinc-500 border-white/5 text-[8px] uppercase tracking-widest italic">{room?.map || "TBD"}</Badge>
                           <h4 className="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors">Room {match.id.slice(-4).toUpperCase()}</h4>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-zinc-600">
                                <Clock className="size-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest italic">Room Reveal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={cn("size-1.5 rounded-full animate-pulse", isRevealed ? "bg-emerald-500" : "bg-amber-500")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-widest italic", isRevealed ? "text-emerald-500" : "text-amber-500")}>
                                    {isRevealed ? "REVEALED" : "PENDING"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                   {!isRevealed ? (
                       <div className="w-full lg:w-64 bg-black/40 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
                            <Lock className="size-5 text-zinc-800" />
                            <div className="space-y-1 text-center">
                                <p className="text-[11px] font-black text-white tracking-[0.2em]">{formatTime(timeLeft)}</p>
                                <p className="text-[7px] font-black uppercase tracking-widest text-zinc-600">Until Reveal</p>
                            </div>
                       </div>
                   ) : (
                       <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={() => copyToClipboard(room?.roomId || "", "id")}
                                className="h-16 px-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-start justify-center group/btn hover:bg-emerald-500 hover:text-white transition-all relative overflow-hidden"
                            >
                                <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600 group-hover/btn:text-white/70 mb-1 z-10 transition-colors">Room ID</span>
                                <div className="flex items-center gap-3 z-10">
                                    <span className="text-xs font-black italic uppercase tracking-widest text-white group-hover/btn:text-white transition-colors">{room?.roomId || "ERROR"}</span>
                                    {copiedId === "id" ? <Check className="size-3" /> : <Copy className="size-3 opacity-30" />}
                                </div>
                            </button>

                            <button 
                                onClick={() => copyToClipboard(room?.roomPassword || "", "pass")}
                                className="h-16 px-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-start justify-center group/btn hover:bg-white hover:text-black transition-all relative overflow-hidden"
                            >
                                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500 group-hover/btn:text-black/70 mb-1 z-10 transition-colors">Access Key</span>
                                <div className="flex items-center gap-3 z-10">
                                    <span className="text-xs font-black italic uppercase tracking-widest text-white group-hover/btn:text-black transition-colors">{room?.roomPassword || "ERROR"}</span>
                                    {copiedId === "pass" ? <Check className="size-3" /> : <Copy className="size-3 opacity-30" />}
                                </div>
                            </button>
                       </div>
                   )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
