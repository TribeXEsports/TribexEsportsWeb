"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Trophy, 
  Sword, 
  Plus, 
  Loader2,
  CheckCircle2,
  ChevronRight,
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MatchEntryFormProps {
  tournamentId: string;
  mode: string;
  game?: string;
  participants: any[];
  matches?: any[];
}

export default function MatchEntryForm({ tournamentId, mode, game, participants, matches = [] }: MatchEntryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [formData, setFormData] = useState({
    sideA: "",
    sideB: "",
    scoreA: 0,
    scoreB: 0,
  });

  const isBR = 
    (game?.toUpperCase().includes("FREE FIRE") || game?.toUpperCase() === "FF") ||
    (game?.toUpperCase().includes("BGMI") || game?.toUpperCase().includes("PUBG")) ||
    mode === "BR" || 
    (mode === "SQUAD" && participants.length > 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sideA === formData.sideB) return alert("Select different contenders");
    
    setIsLoading(true);

    const matchData: any = {
      tournamentId,
      scoreA: formData.scoreA,
      scoreB: formData.scoreB,
      status: "completed"
    };

    if (mode === "SOLO") {
      matchData.userAId = formData.sideA;
      matchData.userBId = formData.sideB;
      matchData.winnerUserId = formData.scoreA > formData.scoreB ? formData.sideA : formData.sideB;
    } else {
      matchData.teamAId = formData.sideA;
      matchData.teamBId = formData.sideB;
      matchData.winnerTeamId = formData.scoreA > formData.scoreB ? formData.sideA : formData.sideB;
    }

    try {
      const res = await fetch("/api/admin/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData)
      });
      if (res.ok) router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isBR) {
      return (
        <div className="space-y-6">
            <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-6">
                <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="size-6 text-primary" />
                </div>
                <div>
                    <h4 className="text-sm font-black italic uppercase text-white">Tournament Scoring System</h4>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Select a match to enter full results</p>
                </div>
                
                <select 
                    value={selectedMatchId} 
                    onChange={e => setSelectedMatchId(e.target.value)}
                    className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl px-4 text-[10px] font-black uppercase italic text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                    <option value="">Choose Match to Score</option>
                    {matches.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.stage || "Standard Match"} // {m.room?.map || "Unknown Map"}</option>
                    ))}
                </select>

                <Link 
                    href={selectedMatchId ? `/admin/matches/${selectedMatchId}/edit` : "#"}
                    className={cn(
                        "w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all",
                        selectedMatchId ? "bg-white text-black hover:bg-primary hover:text-white" : "bg-zinc-900 text-zinc-700 pointer-events-none"
                    )}
                >
                    Open Scoring Interface <ChevronRight className="size-4" />
                </Link>
            </div>
        </div>
      );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <div className="size-10 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-black text-primary italic">VS</span>
            </div>
        </div>

        {/* Side A */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic ml-4 text-primary">Team A (Home)</label>
          <select 
            required
            value={formData.sideA}
            onChange={e => setFormData({...formData, sideA: e.target.value})}
            className="w-full h-14 bg-zinc-950/60 border border-white/5 rounded-2xl px-6 text-[11px] font-bold text-white outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer italic"
          >
            <option value="">Select Participant</option>
            {participants.map(p => (
              <option key={p.id} value={mode === "SOLO" ? p.userId : p.teamId}>
                {mode === "SOLO" ? p.user?.name : p.team?.name}
              </option>
            ))}
          </select>
          <input 
            type="number" 
            placeholder="SCORE"
            value={formData.scoreA}
            onChange={e => setFormData({...formData, scoreA: parseInt(e.target.value) || 0})}
            className="w-full h-14 bg-zinc-950/60 border border-white/5 rounded-2xl px-6 text-2xl font-black italic text-center text-primary placeholder:text-zinc-800 outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Side B */}
        <div className="space-y-4 text-right">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic mr-4">Team B (Away)</label>
          <select 
            required
            value={formData.sideB}
            onChange={e => setFormData({...formData, sideB: e.target.value})}
            className="w-full h-14 bg-zinc-950/60 border border-white/5 rounded-2xl px-6 text-[11px] font-bold text-white outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer italic"
          >
            <option value="">Select Participant</option>
            {participants.map(p => (
              <option key={p.id} value={mode === "SOLO" ? p.userId : p.teamId}>
                {mode === "SOLO" ? p.user?.name : p.team?.name}
              </option>
            ))}
          </select>
          <input 
            type="number" 
            placeholder="SCORE"
            value={formData.scoreB}
            onChange={e => setFormData({...formData, scoreB: parseInt(e.target.value) || 0})}
            className="w-full h-14 bg-zinc-950/60 border border-white/5 rounded-2xl px-6 text-2xl font-black italic text-center text-white placeholder:text-zinc-800 outline-none focus:border-white/20 transition-all"
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] italic flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <>Submit Fast Result <Zap className="size-4" /></>}
      </button>
    </form>
  );
}
