"use client"

import React, { useState, useEffect, useMemo } from "react";
import { 
  Trophy, 
  Target, 
  Loader2, 
  ShieldCheck, 
  Users, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Skull,
  LayoutGrid,
  Zap,
  Crown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { calculateBrPoints } from "@/lib/tournament-logic";

interface BrResultFormProps {
  tournamentId: string;
  matchId: string;
  game: string;
  lobbyName?: string;
}

export default function BrResultForm({ tournamentId, matchId, game, lobbyName: initialLobby }: BrResultFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allParticipants, setAllParticipants] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [pointPreset, setPointPreset] = useState("FFWS");
  const [activeLobby, setActiveLobby] = useState(initialLobby || "A");

  // Get unique lobby names for the selector
  const lobbies = useMemo(() => {
    const set = new Set(allParticipants.map(p => p.lobby || p.stage || "A"));
    return Array.from(set).sort();
  }, [allParticipants]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Registrations
        const regRes = await fetch(`/api/admin/tournaments/${tournamentId}/registrations`);
        const regData = await regRes.json();
        
        // 2. Fetch Match Details (to get existing results)
        const matchRes = await fetch(`/api/admin/matches/${matchId}`);
        const matchData = await matchRes.json();
        const existingResults = (matchData?.roundResults as any[]) || [];
        
        if (Array.isArray(regData)) {
          setAllParticipants(regData);
          
          // Pre-populate results grid with existing data if possible
          const initialResults = regData.map(p => {
            const rawLobby = p.lobby || p.stage || "A";
            const normalizedLobby = rawLobby.replace(/Lobby\s+/i, "");
            
            // Look for existing result for this specific registration
            const existing = existingResults.find(r => r.registrationId === p.id);

            return {
              registrationId: p.id,
              teamName: p.team?.name || p.user?.name || "Unknown",
              lobby: normalizedLobby,
              slot: p.slot || 0,
              placement: existing?.placement || 0,
              kills: existing?.kills || 0,
              points: existing?.points || 0,
              isBooyah: existing?.placement === 1
            };
          });
          setResults(initialResults);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tournamentId]);

  // Filter and Sort results for the current lobby view
  const currentLobbyResults = useMemo(() => {
    return results
      .filter(r => r.lobby === activeLobby)
      .sort((a, b) => {
        // High points first
        if (b.points !== a.points) return b.points - a.points;
        // Better placement second (if points are tied)
        if (a.placement !== b.placement && a.placement > 0 && b.placement > 0) return a.placement - b.placement;
        // Slot number as fallback
        return (a.slot || 0) - (b.slot || 0);
      });
  }, [results, activeLobby]);

  const updateResult = (regId: string, field: string, value: any) => {
    setResults(prev => prev.map(r => {
      if (r.registrationId !== regId) return r;
      
      const updated = { ...r, [field]: value };
      
      // If Booyah is checked, force placement to 1
      if (field === "isBooyah" && value === true) updated.placement = 1;
      
      // Auto-calculate points
      const { totalPoints } = calculateBrPoints(game, updated.placement, updated.kills, pointPreset);
      updated.points = totalPoints;
      
      return updated;
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/matches/${matchId}/result`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: results.filter(r => r.points > 0 || r.placement > 0) })
      });
      if (res.ok) {
        alert("Scores saved successfully.");
        router.refresh();
      }
    } catch (error) {
      console.error("Submission Failure", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="size-6 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header & Style Selector */}
      <header className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Match Result Hub</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">Manual Scoring Management Control</p>
          </div>
          
          {/* Lobby Selector Chips */}
          <div className="flex flex-wrap gap-2">
            {lobbies.length > 0 ? lobbies.map(l => (
              <button 
                key={l}
                onClick={() => setActiveLobby(l)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic border",
                  activeLobby === l 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                    : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                )}
              >
                Lobby {l}
              </button>
            )) : <span className="text-[9px] font-bold text-zinc-700 uppercase italic">Assign lobbies to participants first</span>}
          </div>
        </div>

        <div className="flex items-center gap-4 bg-zinc-950/40 p-4 rounded-3xl border border-white/5">
          <div className="flex flex-col gap-1 items-end mr-4">
             <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest italic">Scoring Method</span>
             <select 
                value={pointPreset} 
                onChange={e => setPointPreset(e.target.value)}
                className="bg-transparent text-[11px] font-black uppercase italic text-primary outline-none cursor-pointer"
             >
                <option value="FFWS">FFWS SYSTEM</option>
                <option value="BGIS">BGIS SYSTEM</option>
                <option value="KILL_HEAVY">KILL HEAVY</option>
             </select>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="h-14 px-10 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3 italic active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <>SAVE ALL RESULTS <ShieldCheck className="size-4" /></>}
          </button>
        </div>
      </header>

      {/* Results Grid / Slot Hub */}
      <div className="grid grid-cols-1 gap-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-10 py-5 bg-white/[0.03] border border-white/5 rounded-3xl">
            <div className="col-span-1 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Slot</div>
            <div className="col-span-4 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Team Identity</div>
            <div className="col-span-2 text-center text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Rank / Pos.</div>
            <div className="col-span-2 text-center text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Eliminations</div>
            <div className="col-span-3 text-right text-[9px] font-black uppercase tracking-widest text-zinc-600 italic px-4 text-primary">Live Dashboard</div>
        </div>

        {currentLobbyResults.map((r, i) => {
          // Check for rank conflicts
          const hasRankConflict = r.placement > 0 && currentLobbyResults.some(other => other.registrationId !== r.registrationId && other.placement === r.placement);
          
          return (
            <div 
              key={r.registrationId} 
              className={cn(
                "grid grid-cols-12 items-center px-10 py-5 bg-zinc-900/40 border rounded-[2rem] group transition-all duration-500",
                r.points > 0 ? "border-primary/20 bg-primary/[0.02]" : "border-white/5",
                i === 0 && r.points > 0 ? "border-amber-500/30 bg-amber-500/[0.03] scale-[1.02]" : ""
              )}
            >
                {/* Slot Display */}
                <div className="col-span-1">
                   <div className="size-10 bg-zinc-950 border border-white/5 rounded-2xl flex items-center justify-center font-black italic text-[11px] text-zinc-600 group-hover:text-primary transition-colors">
                      {r.slot || "-"}
                   </div>
                </div>

                {/* Team Info */}
                <div className="col-span-4 flex items-center gap-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{r.teamName}</span>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateResult(r.registrationId, "isBooyah", !r.isBooyah)}
                            className={cn(
                              "text-[8px] font-black uppercase italic tracking-widest px-2 py-0.5 rounded-md transition-all flex items-center gap-1",
                              r.isBooyah ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-500 hover:text-white"
                            )}
                          >
                            <Crown className="size-2" /> Booyah
                          </button>
                          <span className="text-[8px] font-black text-zinc-700 uppercase italic">Lobby {r.lobby}</span>
                       </div>
                    </div>
                </div>
                
                {/* Placement Input */}
                <div className="col-span-2 px-6">
                    <div className="relative">
                      <input 
                          type="number" 
                          min="1" 
                          value={r.placement || ""} 
                          onChange={e => updateResult(r.registrationId, "placement", parseInt(e.target.value) || 0)}
                          className={cn(
                            "w-full h-12 bg-zinc-950 border rounded-2xl text-center text-sm font-black italic outline-none transition-all",
                            hasRankConflict ? "border-red-500 text-red-500 bg-red-500/5 animate-pulse" : "border-white/5 text-emerald-500 focus:border-emerald-500/40"
                          )}
                          placeholder="RANK"
                      />
                      {hasRankConflict && <span className="absolute -top-1 -right-1 size-3 bg-red-600 rounded-full flex items-center justify-center text-[6px] font-black text-white italic">!</span>}
                    </div>
                </div>

                {/* Kills Input */}
                <div className="col-span-2 px-6">
                    <input 
                        type="number" 
                        min="0"
                        value={r.kills || ""} 
                        onChange={e => updateResult(r.registrationId, "kills", parseInt(e.target.value) || 0)}
                        className="w-full h-12 bg-zinc-950 border border-white/5 rounded-2xl text-center text-sm font-black italic text-red-500 placeholder:text-zinc-900 outline-none focus:border-red-500/40 transition-all"
                        placeholder="KILLS"
                    />
                </div>

                {/* Point Prediction */}
                <div className="col-span-3 flex items-center justify-end gap-5 px-4">
                    <div className="text-right">
                        <p className="text-[8px] font-black italic text-zinc-700 uppercase tracking-widest mb-1">Total Score</p>
                        <div className="flex items-center justify-end gap-2">
                           <span className="text-[9px] font-bold text-zinc-600 italic">+{r.kills * (pointPreset === "KILL_HEAVY" ? 2 : 1)} K</span>
                           <span className="text-2xl font-black italic text-white leading-none tracking-tighter">{r.points}</span>
                        </div>
                    </div>
                    {i === 0 && r.points > 0 ? (
                      <div className="size-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                         <Trophy className="size-6 text-amber-500 animate-bounce shadow-amber-500/40" />
                      </div>
                    ) : (
                      <div className={cn("size-12 rounded-2xl border flex items-center justify-center transition-all", r.points > 0 ? "bg-primary/5 border-primary/20" : "bg-zinc-950 border-white/5")}>
                         <Zap className={cn("size-5", r.points > 0 ? "text-primary " : "text-zinc-800")} />
                      </div>
                    )}
                </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && currentLobbyResults.length === 0 && (
          <div className="p-32 border border-dashed border-white/5 rounded-[4rem] text-center space-y-6 bg-zinc-950/20">
              <div className="size-20 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center mx-auto opacity-20">
                 <LayoutGrid className="size-10 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">Lobby {activeLobby} is Empty</p>
                <p className="text-[9px] font-bold text-zinc-800 uppercase italic">No participants have been assigned to this lobby yet.</p>
              </div>
          </div>
      )}
    </div>
  );
}
