"use client"

import React, { useState } from "react";
import { 
  Trophy, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  TrophyIcon,
  ShieldCheck,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ResultFormProps {
  tournamentId: string;
  initialStatus: string;
  initialWinnerName?: string;
  initialResultsOverview?: string;
  initialStandings?: any[];
  participants: any[];
}

export default function ResultForm({ 
  tournamentId, 
  initialStatus, 
  initialWinnerName, 
  initialResultsOverview,
  initialStandings = [],
  participants 
}: ResultFormProps) {
  const [status, setStatus] = useState(initialStatus);
  const [winnerName, setWinnerName] = useState(initialWinnerName || "");
  const [resultsOverview, setResultsOverview] = useState(initialResultsOverview || "");
  const [standings, setStandings] = useState<any[]>(initialStandings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const addStanding = () => {
    setStandings([...standings, { rank: standings.length + 1, name: "", kills: 0, points: 0 }]);
  };

  const removeStanding = (index: number) => {
    setStandings(standings.filter((_, i) => i !== index));
  };

  const updateStanding = (index: number, field: string, value: any) => {
    const newStandings = [...standings];
    newStandings[index] = { ...newStandings[index], [field]: value };
    setStandings(newStandings);
  };

  const handleUpdate = async (newStatus?: string) => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus || status,
          winnerName,
          resultsOverview,
          finalStandings: standings
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update protocol failed");
      }

      if (newStatus) setStatus(newStatus);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Status Control */}
      <div className="flex flex-wrap gap-4">
        {["upcoming", "live", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => handleUpdate(s)}
            disabled={isSubmitting}
            className={cn(
              "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all border",
              status === s 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-white"
            )}
          >
            {s === status && isSubmitting ? <Loader2 className="size-3 animate-spin mx-auto" /> : s}
          </button>
        ))}
      </div>

      {status === "completed" && (
        <div className="space-y-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic flex items-center gap-2">
                <TrophyIcon className="size-3 text-primary" />
                Tournament Victor / MVP
              </label>
              <input 
                type="text"
                list="participants-list"
                value={winnerName}
                onChange={(e) => setWinnerName(e.target.value)}
                placeholder="SELECT OR ENTER WINNER..."
                className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-[11px] font-black uppercase italic tracking-widest text-white outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic flex items-center gap-2">
                <Target className="size-3 text-primary" />
                Battle Summary
              </label>
              <input 
                type="text"
                value={resultsOverview}
                onChange={(e) => setResultsOverview(e.target.value)}
                placeholder="E.G. DOMINATED WITH 15 KILLS..."
                className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-[11px] font-black uppercase italic tracking-widest text-white outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black italic uppercase tracking-tighter text-white/50">Final Standings Manager</h4>
              <button 
                onClick={addStanding}
                className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-primary/50 transition-all"
              >
                + Add Standing Row
              </button>
            </div>

            <div className="space-y-3">
              {standings.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                  <div className="col-span-1">
                    <input 
                      type="number" 
                      value={row.rank} 
                      onChange={(e) => updateStanding(idx, 'rank', parseInt(e.target.value))}
                      className="w-full bg-transparent text-center font-black italic text-primary outline-none" 
                    />
                  </div>
                  <div className="col-span-5 relative">
                    <input 
                      type="text" 
                      list="participants-list"
                      value={row.name} 
                      onChange={(e) => updateStanding(idx, 'name', e.target.value)}
                      placeholder="NAME..."
                      className="w-full bg-transparent px-4 font-black italic text-white outline-none text-[11px] uppercase tracking-widest" 
                    />
                  </div>
                  <div className="col-span-2">
                     <p className="text-[7px] font-black uppercase tracking-widest text-zinc-600 mb-1 text-center">Kills</p>
                     <input 
                      type="number" 
                      value={row.kills} 
                      onChange={(e) => updateStanding(idx, 'kills', parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-lg py-1 text-center font-bold text-white text-[10px] outline-none" 
                    />
                  </div>
                  <div className="col-span-2">
                     <p className="text-[7px] font-black uppercase tracking-widest text-zinc-600 mb-1 text-center">Points</p>
                     <input 
                      type="number" 
                      value={row.points} 
                      onChange={(e) => updateStanding(idx, 'points', parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-lg py-1 text-center font-bold text-white text-[10px] outline-none" 
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <button 
                      onClick={() => removeStanding(idx)}
                      className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                    >
                      <Target className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => handleUpdate()}
            disabled={isSubmitting}
            className="w-full h-14 bg-white text-black hover:bg-primary hover:text-white transition-all rounded-2xl font-black uppercase italic tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : (
              <>
                <ShieldCheck className="size-4" />
                Finish & Save Tournament
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center gap-3 text-red-500">
              <AlertCircle className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">{error}</span>
            </div>
          )}

          <datalist id="participants-list">
            {participants.map((p) => (
              <option key={p.id} value={p.user?.name || p.team?.name || "Unknown Warrior"} />
            ))}
          </datalist>
        </div>
      )}
    </div>
  );
}

