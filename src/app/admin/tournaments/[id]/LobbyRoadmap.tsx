"use client"

import React, { useMemo, useState } from "react";
import { 
  Trophy, 
  Map as MapIcon, 
  ChevronRight, 
  ChevronDown,
  LayoutGrid,
  Users,
  Target,
  Skull,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Zap,
  Sword,
  Swords
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { calculateTournamentStandings } from "@/lib/tournament-logic";

interface LobbyRoadmapProps {
  tournamentId: string;
  matches: any[];
  registrations: any[];
}

export default function LobbyRoadmap({ tournamentId, matches, registrations }: LobbyRoadmapProps) {
  const [expandedLobby, setExpandedLobby] = useState<string | null>(null);

  // Group matches by Lobby/Stage
  const lobbyGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    matches.forEach(m => {
      // Basic stage name parsing (e.g., "Lobby A")
      const stage = m.stage || "General";
      if (!groups[stage]) groups[stage] = [];
      groups[stage].push(m);
    });

    // Sort stages alphabetically but put FINAL at the bottom
    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => {
        if (a.includes("FINAL")) return 1;
        if (b.includes("FINAL")) return -1;
        return a.localeCompare(b);
      })
    );
  }, [matches]);

  const lobbies = Object.keys(lobbyGroups);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
          <LayoutGrid className="size-5 text-primary" />
          Tournament Phases & Standings
        </h3>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden md:block">Matches grouped by Lobby / Round</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {lobbies.length === 0 ? (
          <div className="p-20 text-center bg-zinc-950/20 border border-dashed border-white/5 rounded-[3rem]">
             <p className="text-zinc-600 font-bold uppercase tracking-widest text-[11px]">No matches have been created yet.</p>
          </div>
        ) : lobbies.map(lobbyKey => {
          const lobbyMatches = lobbyGroups[lobbyKey];
          const isFinal = lobbyKey.toUpperCase().includes("FINAL");
          
          // Calculate cumulative rankings for this lobby only
          // Filter registrations that belong to this lobby
          const lobbyNameShorthand = lobbyKey.replace(/Lobby\s+/i, "");
          const standings = calculateTournamentStandings(lobbyMatches, registrations, lobbyNameShorthand);
          
          const isExpanded = expandedLobby === lobbyKey;

          return (
            <div 
              key={lobbyKey} 
              className={cn(
                "group/card border transition-all duration-700 overflow-hidden rounded-[2.5rem]",
                isFinal ? "bg-amber-500/[0.03] border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.03)]" : "bg-zinc-900/40 border-white/5"
              )}
            >
              {/* Box Header - Standings Summary */}
              <div 
                onClick={() => setExpandedLobby(isExpanded ? null : lobbyKey)}
                className="cursor-pointer p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "size-14 rounded-2xl flex items-center justify-center border transition-all",
                    isFinal ? "bg-amber-500 border-amber-400/50" : "bg-zinc-950 border-white/10 group-hover/card:border-primary/40"
                  )}>
                    {isFinal ? <Trophy className="size-7 text-white" /> : <Users className="size-7 text-primary" />}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-1.5">{lobbyKey}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2">
                         <Swords className="size-3" /> {lobbyMatches.length} Match Points
                      </span>
                      <div className="size-1 bg-zinc-800 rounded-full" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2 whitespace-nowrap">
                         <Target className="size-3" /> Qualifier Result
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 pr-2">
                    {standings.slice(0, 4).map((topTeam, idx) => (
                       <div key={idx} className="size-10 rounded-xl bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-lg">
                          {topTeam.name?.[0] || "?"}
                       </div>
                    ))}
                  </div>
                  <div className="w-px h-10 bg-white/5 mx-2" />
                  <button className="size-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <ChevronDown className={cn("size-5 transition-transform duration-500", isExpanded ? "rotate-180" : "")} />
                  </button>
                </div>
              </div>

              {/* Box Content - Real-time Standings + Match Timeline */}
              {isExpanded && (
                <div className="border-t border-white/5 p-8 space-y-10 animate-in slide-in-from-top-4 duration-500">
                  
                  {/* Standings Table (Limited to top 15 for readability) */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">Overall Rankings</p>
                        <p className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">LIVE STANDINGS</p>
                     </div>
                     <div className="grid grid-cols-12 px-6 py-4 bg-zinc-950/60 rounded-2xl border border-white/5 gap-4">
                        <div className="col-span-1 text-[8px] font-bold uppercase text-zinc-600">Rank</div>
                        <div className="col-span-5 text-[8px] font-bold uppercase text-zinc-600">Team Identity</div>
                        <div className="col-span-2 text-center text-[8px] font-bold uppercase text-zinc-600">Elims</div>
                        <div className="col-span-2 text-center text-[8px] font-bold uppercase text-zinc-600">Pts</div>
                        <div className="col-span-2 text-center text-[8px] font-bold uppercase text-zinc-600">History</div>
                     </div>
                     <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {standings.map((team, idx) => (
                           <div key={team.registrationId} className="grid grid-cols-12 items-center px-6 py-1 gap-4 opacity-80 hover:opacity-100 transition-opacity">
                              <div className="col-span-1 font-black text-sm text-zinc-500">#{idx + 1}</div>
                              <div className="col-span-5 text-[11px] font-bold uppercase tracking-tight text-white truncate">{team.name}</div>
                              <div className="col-span-2 text-center text-[10px] font-bold text-red-500">{team.totalKills}</div>
                              <div className="col-span-2 text-center text-[11px] font-black text-emerald-500">{team.totalPoints}</div>
                              <div className="col-span-2 flex items-center justify-center gap-1">
                                 {team.history.map((h: any, i: number) => (
                                    <div key={i} className="size-1.5 rounded-full bg-primary/40" title={`${h.placement}P | ${h.kills}K | ${h.points}Pts`} />
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Match List (Timeline) */}
                  <div className="space-y-4 border-t border-white/5 pt-8">
                     <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic px-2">Match History</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lobbyMatches.map((m) => (
                           <div key={m.id} className="bg-zinc-950/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 group/match hover:border-primary/30 transition-all">
                              <div className="flex items-center justify-between">
                                 <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl group-hover/match:text-primary transition-colors">
                                    <MapIcon className="size-4" />
                                 </div>
                                 <Link 
                                    href={`/admin/matches/${m.id}/edit`}
                                    className="text-[9px] font-black uppercase bg-primary text-white px-3 py-1.5 rounded-lg opacity-0 group-hover/match:opacity-100 transition-all hover:scale-105 active:scale-95"
                                 >
                                    Edit Score
                                 </Link>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-xs font-black uppercase text-white truncate">{m.room?.map || "Standard Match"}</p>
                                 <p className="text-[9px] font-bold text-primary uppercase tracking-widest italic">{m.status}</p>
                              </div>
                              {m.room && (
                                 <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Room ID</span>
                                    <span className="text-[10px] font-black text-white italic">{m.room.roomId}</span>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
