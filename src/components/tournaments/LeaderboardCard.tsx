"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Trophy, 
  Target, 
  Loader2, 
  ShieldCheck, 
  Medal, 
  TrendingUp, 
  Skull,
  LayoutGrid,
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LeaderboardCardProps {
  tournamentId: string;
  targetFinalSize?: number;
}

export default function LeaderboardCard({ tournamentId, targetFinalSize = 12 }: LeaderboardCardProps) {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStandings = async () => {
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/leaderboard`);
      const data = await res.json();
      if (Array.isArray(data)) setStandings(data);
    } catch (error) {
      console.error("Standings Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [tournamentId]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="size-6 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      <header className="flex items-center justify-between px-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black italic uppercase tracking-widest text-zinc-500">Live Leaderboard</h3>
          <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Match Stats // Real-time Update</p>
        </div>
        <div className="flex items-center gap-2">
            <TrendingUp className="size-3 text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase text-zinc-600 italic">Syncing live...</span>
        </div>
      </header>

      <div className="bg-zinc-900/10 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Rank</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Team Name</th>
                <th className="px-8 py-6 text-center text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Wins</th>
                <th className="px-8 py-6 text-center text-[9px] font-black uppercase tracking-widest text-zinc-600 italic px-4">Kills</th>
                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-widest text-zinc-600 italic px-8">Total Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {standings.map((team, idx) => {
                const isQualified = idx < targetFinalSize;
                return (
                  <tr key={team.id} className={cn(
                      "group hover:bg-white/[0.02] transition-colors relative",
                      isQualified ? "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary/50" : "opacity-60"
                  )}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <span className={cn(
                            "text-xl font-black italic leading-none",
                            idx === 0 ? "text-primary text-3xl" : 
                            idx === 1 ? "text-zinc-300 text-2xl" : 
                            idx === 2 ? "text-amber-700 text-xl" : "text-zinc-800"
                        )}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        {idx < 3 && <Medal className={cn(
                            "size-4",
                            idx === 0 ? "text-primary" : idx === 1 ? "text-zinc-400" : "text-amber-700"
                        )} />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden relative">
                                {team.image ? (
                                    <Image 
                                      src={team.image} 
                                      alt={`${team.name} Logo`} 
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                ) : (
                                    <ShieldCheck className="size-4 text-zinc-800" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors">{team.name}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">{team.matches} Matches Played</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-black italic text-zinc-400">{team.wins}</span>
                            <Trophy className={cn("size-3", team.wins > 0 ? "text-amber-500" : "text-zinc-900")} />
                        </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-black italic text-zinc-400">{team.kills}</span>
                            <Skull className={cn("size-3", team.kills > 0 ? "text-red-500" : "text-zinc-900")} />
                        </div>
                    </td>
                    <td className="px-8 py-6 text-right px-8">
                        <div>
                            <span className="text-2xl font-black italic text-white leading-none tracking-tighter">{team.points}</span>
                            {isQualified ? (
                                <Badge className="ml-4 bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest py-0.5">Qualified</Badge>
                            ) : (
                                <Badge className="ml-4 bg-red-500/10 text-red-500 border-none text-[8px] font-black uppercase tracking-widest py-0.5 opacity-50">Eliminated</Badge>
                            )}
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {standings.length === 0 && (
              <div className="p-20 text-center space-y-4">
                  <LayoutGrid className="size-12 text-zinc-900 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">No match data recorded for this tournament yet.</p>
              </div>
          )}
        </div>
      </div>
      
      <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] flex items-start gap-5">
          <Info className="size-5 text-primary shrink-0 mt-1" />
          <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white italic">Tiebreaker Rules</p>
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-500 leading-relaxed italic">
                  Points &gt; Kills &gt; Wins &gt; Best Placement. Updates happen after each match.
              </p>
          </div>
      </div>
    </div>
  );
}
