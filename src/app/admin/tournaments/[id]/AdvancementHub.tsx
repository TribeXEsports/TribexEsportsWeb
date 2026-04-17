"use client"

import React, { useState, useMemo } from "react";
import { 
  Trophy, 
  TrendingUp, 
  ChevronRight, 
  Zap, 
  Users, 
  ShieldCheck, 
  Target,
  Skull,
  Loader2,
  Crown
} from "lucide-react";
import { calculateTournamentStandings } from "@/lib/tournament-logic";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AdvancementHubProps {
  tournamentId: string;
  registrations: any[];
  matches: any[];
  advancingPerLobby: number;
  totalLobbies: number;
  targetFinalSize: number;
}

export default function AdvancementHub({ 
  tournamentId, 
  registrations, 
  matches, 
  advancingPerLobby, 
  totalLobbies,
  targetFinalSize
}: AdvancementHubProps) {
  const router = useRouter();
  const [isPromoting, setIsPromoting] = useState(false);
  const [sourceLobby, setSourceLobby] = useState("A");
  const [promoCount, setPromoCount] = useState(advancingPerLobby || 6);
  const [statusMsg, setStatusMsg] = useState("");

  // Get unique lobby names (excluding FINAL)
  const lobbies = useMemo(() => {
    const set = new Set(registrations.map(p => p.lobby).filter(l => l && l !== "FINAL" && !l.includes("PENDING")));
    return Array.from(set).sort();
  }, [registrations]);

  // Calculate standings for the current lobby view
  const currentStandings = useMemo(() => {
    return calculateTournamentStandings(matches, registrations, sourceLobby);
  }, [matches, registrations, sourceLobby]);

  const handlePromote = async () => {
    if (!confirm(`Confirm: Promote Top ${promoCount} Teams from Lobby ${sourceLobby} to Grand Finals?`)) return;
    
    setIsPromoting(true);
    setStatusMsg("");
    
    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceLobby, count: promoCount })
      });
      
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`SUCCESS: ${data.promotedCount} Teams promoted to Final!`);
        router.refresh();
      } else {
        setStatusMsg(`EROR: ${data.error}`);
      }
    } catch (error) {
       setStatusMsg("Critical Error in Promotion Bridge");
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 space-y-10 group/hub overflow-hidden relative">
      {/* Background Pulse */}
      <div className="absolute -top-10 -right-10 size-40 bg-primary/5 blur-[50px] group-hover/hub:bg-primary/10 transition-colors" />

      <header className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5 relative z-10">
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                    <TrendingUp className="size-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Qualifier Advancement <span className="text-primary not-italic">Hub</span></h3>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">Leaderboard Logic & Automatic Promotion Control</p>
                </div>
            </div>

            {/* Advancement Intelligence Plan */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3">
                <Target className="size-3 text-primary" />
                <p className="text-[8px] font-black uppercase italic text-zinc-400 tracking-widest">
                    Plan: Top <span className="text-primary font-bold">{advancingPerLobby}</span> per Lobby &times; {totalLobbies} Lobbies &approx; {targetFinalSize} Finale Slots
                </p>
            </div>
        </div>

        <div className="w-full lg:w-auto flex flex-col md:flex-row items-stretch gap-4">
            <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Promote Top</p>
                    <input 
                        type="number" value={promoCount}
                        onChange={e => setPromoCount(parseInt(e.target.value) || 0)}
                        className="bg-transparent text-xl font-black italic text-primary w-12 text-center outline-none border-b border-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <Users className="size-5 text-primary opacity-20" />
            </div>

            <button 
               onClick={handlePromote}
               disabled={isPromoting || currentStandings.length === 0}
               className="h-16 px-8 bg-white text-zinc-950 hover:bg-primary hover:text-white transition-all rounded-2xl font-black uppercase tracking-widest text-[10px] italic flex items-center justify-center gap-3 active:scale-95 disabled:opacity-20 shadow-2xl"
            >
               {isPromoting ? <Loader2 className="size-4 animate-spin text-zinc-400" /> : <>PROMOTE TO FINAL <Crown className="size-4" /></>}
            </button>
        </div>
      </header>

      {/* Advancement Standings Table */}
      <div className="space-y-4 relative z-10">
          {statusMsg && (
             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                 <ShieldCheck className="size-4" />
                 {statusMsg}
             </div>
          )}

          <div className="grid grid-cols-1 gap-3">
             {/* Table Headers */}
             <div className="grid grid-cols-12 px-8 py-4 opacity-30">
                 <div className="col-span-1 text-[8px] font-black uppercase tracking-widest text-zinc-400 italic">Rank</div>
                 <div className="col-span-5 text-[8px] font-black uppercase tracking-widest text-zinc-400 italic">Participant Team</div>
                 <div className="col-span-2 text-center text-[8px] font-black uppercase tracking-widest text-zinc-400 italic">Match P.</div>
                 <div className="col-span-2 text-center text-[8px] font-black uppercase tracking-widest text-zinc-400 italic">Elims</div>
                 <div className="col-span-2 text-right text-[8px] font-black uppercase tracking-widest text-zinc-400 italic">Total Pts.</div>
             </div>

             {currentStandings.map((team, idx) => (
                <div 
                    key={team.registrationId}
                    className={cn(
                        "grid grid-cols-12 items-center px-8 py-5 border rounded-3xl transition-all duration-300",
                        idx < promoCount ? "bg-primary/5 border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.02)]" : "bg-black/20 border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
                    )}
                >
                    <div className="col-span-1">
                        <div className={cn(
                            "size-8 rounded-lg flex items-center justify-center font-black italic tracking-tighter text-sm",
                            idx === 0 ? "bg-amber-500/20 text-amber-500" : "bg-zinc-950 border border-white/5 text-zinc-600"
                        )}>
                            #{idx + 1}
                        </div>
                    </div>
                    
                    <div className="col-span-5 flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-black italic uppercase tracking-tighter text-white">{team.name}</span>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-[8px] font-black uppercase tracking-widest italic", idx < promoCount ? "text-emerald-500" : "text-zinc-700")}>
                                    {idx < promoCount ? "Potential Qualifiers" : "Elimination Pending"}
                                </span>
                                {team.booyahs > 0 && <span className="text-[7px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded uppercase font-black italic">{team.booyahs} Win{team.booyahs > 1 ? "s" : ""}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 text-center">
                        <span className="text-xs font-black italic text-zinc-500">{team.matchesPlayed} Matches</span>
                    </div>

                    <div className="col-span-2 text-center flex items-center justify-center gap-1.5 grayscale opacity-30">
                        <Skull className="size-3 text-red-500" />
                        <span className="text-xs font-black italic text-zinc-200">{team.totalKills}</span>
                    </div>

                    <div className="col-span-2 text-right">
                         <div className="flex flex-wrap gap-1 justify-end mb-1">
                            {team.history.map((h: any, i: number) => (
                                <div key={i} className="size-1.5 rounded-full bg-white/10" title={`P${h.placement} | K${h.kills}`} />
                            ))}
                         </div>
                         <span className="text-2xl font-black italic text-white tracking-tighter">{team.totalPoints}</span>
                    </div>
                </div>
             ))}

             {currentStandings.length === 0 && (
                <div className="p-20 border border-dashed border-white/5 rounded-[3rem] text-center flex flex-col items-center gap-4 opacity-30">
                    <Target className="size-12 text-zinc-800" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Aggregate Intelligence Waiting for Results</p>
                </div>
             )}
          </div>
      </div>
    </div>
  );
}
