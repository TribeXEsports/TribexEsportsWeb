"use client"

import React, { useState, useEffect } from "react";
import { 
  X, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  ShieldCheck,
  Target,
  Trophy,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface PlayerData {
  uid: string;
  nickname: string;
  level: number;
  guild: string;
  verified: boolean;
  loading: boolean;
  error: string;
}

interface FreeFireRegistrationModalProps {
  tournamentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: string;
  game?: string;
}

export default function FreeFireRegistrationModal({ 
  tournamentId, 
  isOpen, 
  onClose,
  onSuccess,
  mode,
  game
}: FreeFireRegistrationModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const isBGMI = game?.toUpperCase().includes("BGMI") || game?.toUpperCase().includes("PUBG");
  const isBR = mode.includes("BR");
  
  const getInitialPlayers = (m: string) => {
    const count = m.includes("SOLO") ? 1 : m.includes("DUO") ? 2 : 5;
    return Array(count).fill(null).map(() => ({ 
      uid: "", nickname: "", level: 0, guild: "", verified: false, loading: false, error: "" 
    }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const [players, setPlayers] = useState<PlayerData[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      setPlayers(getInitialPlayers(mode));
    }
  }, [isOpen, mode]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleUidChange = (index: number, value: string) => {
    // Limit to 12 digits
    const cleanedValue = value.replace(/\D/g, "").slice(0, 12);
    
    setPlayers(prev => {
      const updated = [...prev];
      updated[index] = { 
          ...updated[index], 
          uid: cleanedValue, 
          verified: false, 
          nickname: "", 
          level: 0, 
          guild: "",
          error: "" 
      };
      return updated;
    });

    // Duplicate check
    if (cleanedValue && players.some((p, i) => i !== index && p.uid === cleanedValue)) {
        setPlayers(prev => {
          const updated = [...prev];
          updated[index].error = "Duplicate UID detected";
          return updated;
        });
        return;
    }

    if (cleanedValue.length >= 8) {
      verifyPlayer(index, cleanedValue);
    }
  };

  const verifyPlayer = async (index: number, uid: string) => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], loading: true, error: "" };
      return updated;
    });

    try {
      const res = await fetch(`/api/freefire/info?uid=${uid.trim()}&region=IND`);
      const data = await res.json();

      if (res.ok) {
        setPlayers(prev => {
          // Check if the UID is still the same to avoid race conditions
          if (prev[index].uid !== uid) return prev;
          
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            nickname: data.nickname,
            level: data.level,
            guild: data.guild,
            verified: true,
            loading: false,
          };
          return updated;
        });
      } else {
        setPlayers(prev => {
            if (prev[index].uid !== uid) return prev;
            const updated = [...prev];
            updated[index].error = data?.error || "Invalid UID. Please check and try again.";
            updated[index].loading = false;
            updated[index].verified = false;
            return updated;
        });
      }
    } catch (err) {
      setPlayers(prev => {
          if (prev[index].uid !== uid) return prev;
          const updated = [...prev];
          updated[index].error = "Verification failed";
          updated[index].loading = false;
          return updated;
      });
    }
  };

  const isFormValid = () => {
    if (players.length === 0) return false;
    
    if (mode.includes("SOLO")) return players[0].verified;
    if (mode.includes("DUO")) return players[0].verified && players[1].verified;
    
    // Squads/BR/CS (4 required)
    const mainPlayersValid = players.slice(0, 4).every(p => p.verified);
    const sub = players[4];
    const subValid = !sub || !sub.uid.trim() || sub.verified;
    
    return mainPlayersValid && subValid;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
        setFormError("Mission failure: 4 verified warriors required.");
        return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const payload = {
        tournamentId,
        players: players.filter(p => p.uid.trim() !== "").map(p => ({
          uid: p.uid,
          nickname: p.nickname,
          level: p.level,
          guild: p.guild
        }))
      };

      const res = await fetch("/api/tournaments/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Deployment failed.");
      } else {
        onSuccess();
      }
    } catch (err) {
      setFormError("Satellite interference. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-md pointer-events-auto"
      />
      
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
      >
        <div className="p-6 md:p-12 flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 md:mb-12 shrink-0">
            <div className="flex items-center gap-4 md:gap-6">
               <div className="h-8 md:h-10 w-1 bg-primary rounded-full" />
               <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tight text-white">
                 {isBGMI ? "BGMI" : "Squad"} {isBR ? "Battle Royale" : mode.includes("SOLO") ? "Solo" : mode.includes("DUO") ? "Duo" : "Registration"}
               </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-zinc-600 hover:text-white transition-colors p-2"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Player Grid */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {players.map((player, idx) => (
              <div key={idx} className={`group relative flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${player.verified ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-white/5 hover:border-white/10'}`}>
                
                {/* Number */}
                <span className="text-[10px] font-black italic text-zinc-700 w-6">0{idx + 1}</span>

                {/* UID Field */}
                <div className="relative flex-1">
                  <input 
                    type="text"
                    placeholder={idx === 4 ? "SUBSTITUTE UID" : `PLAYER ${idx + 1} UID`}
                    value={player.uid}
                    maxLength={12}
                    onChange={(e) => handleUidChange(idx, e.target.value)}
                    className="w-full bg-transparent border-none text-[13px] font-black uppercase italic tracking-widest text-white outline-none placeholder:text-zinc-800 h-8"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 group-hover:bg-primary/50 transition-colors" />
                </div>

                {/* Status/Data */}
                <div className="flex-1 flex items-center gap-4 md:gap-8 min-h-[32px]">
                  {player.loading ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="size-3 animate-spin text-primary" />
                       <span className="text-[9px] font-black uppercase text-zinc-600 italic tracking-widest">Verifying...</span>
                    </div>
                  ) : player.verified ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between lg:justify-start lg:gap-8 w-full"
                    >
                       <div className="flex flex-col">
                         <span className="text-[7px] font-bold text-zinc-600 uppercase mb-0.5">Nickname</span>
                         <span className="text-[10px] md:text-[11px] font-black text-white italic">{player.nickname}</span>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[7px] font-bold text-zinc-600 uppercase mb-0.5">Level</span>
                         <span className="text-[10px] md:text-[11px] font-black text-primary italic">LVL {player.level}</span>
                       </div>
                       <div className="hidden sm:flex flex-col">
                         <span className="text-[7px] font-bold text-zinc-600 uppercase mb-0.5">Guild</span>
                         <span className="text-[10px] md:text-[11px] font-black text-zinc-400 italic uppercase">{player.guild || "NONE"}</span>
                       </div>
                       <ShieldCheck className="size-4 text-green-500 ml-auto lg:ml-8" />
                    </motion.div>
                  ) : player.error ? (
                    <div className="flex items-center gap-2">
                       <AlertCircle className="size-3 text-primary" />
                       <span className="text-[9px] font-black uppercase text-primary italic tracking-widest">{player.error}</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-black uppercase text-zinc-800 italic tracking-widest">Awaiting Identity</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8 shrink-0">
             <div className="flex items-center gap-4 max-w-md">
                <div className="h-6 w-[1px] bg-white/10" />
                <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-widest leading-relaxed">
                   Registration is final once submitted. Ensure all UIDs are verified before proceeding.
                </p>
             </div>

             <div className="w-full lg:w-72 space-y-4">
                <button 
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full h-14 bg-primary hover:bg-white text-white hover:text-black disabled:bg-zinc-900 disabled:text-zinc-600 transition-all rounded-sm font-black uppercase italic tracking-[0.2em] text-[11px] relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Confirm Squad Registration"}
                  </span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                {formError && (
                  <p className="text-center text-[9px] font-black text-primary uppercase italic tracking-widest">{formError}</p>
                )}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
