import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* @ts-ignore */
const db = prisma as any;
import { 
  Trophy, 
  Users, 
  Calendar, 
  ChevronLeft, 
  Swords, 
  Activity,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Route
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import MatchEntryForm from "@/app/admin/tournaments/[id]/MatchEntryForm";
import MatchSetupForm from "@/app/admin/tournaments/[id]/MatchSetupForm";
import ResultForm from "@/app/admin/tournaments/[id]/ResultForm";
import AdvancementHub from "@/app/admin/tournaments/[id]/AdvancementHub";
import LobbyRoadmap from "@/app/admin/tournaments/[id]/LobbyRoadmap";
import { calculateBracketLobbies } from "@/lib/tournament-logic";


export default async function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = await db.tournament.findUnique({
    where: { id },
    include: {
      registrations: {
        where: { status: { in: ["VERIFIED", "CONFIRMED"] } },
        include: { user: true, team: true }
      },
      matches: {
        include: {
            teamA: true, teamB: true,
            userA: true, userB: true,
            winnerTeam: true, winnerUser: true,
            room: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <div className="space-y-12 pb-20">
      <Link 
        href="/admin/tournaments" 
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
      </Link>

      <header className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 italic tracking-widest text-[9px] uppercase">{tournament.game}</Badge>
              <Badge className="bg-zinc-800 text-zinc-400 border-white/5 italic tracking-widest text-[9px] uppercase">{tournament.mode}</Badge>
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">{tournament.title}</h2>
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar className="size-4" />
                  <span className="text-xs font-bold uppercase italic tracking-wider">{new Date(tournament.startTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                  <Users className="size-4" />
                  <span className="text-xs font-bold uppercase italic tracking-wider">{tournament.registrations.length} / {tournament.maxPlayers} Approved</span>
              </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 min-w-[300px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 mb-2">Tournament Controls</span>
            <Link 
              href={`/admin/tournaments/${tournament.id}/registrations`} 
              className="w-full h-12 bg-primary/10 border border-primary/20 rounded-xl px-6 flex items-center justify-between group hover:bg-primary transition-all"
            >
              <div className="flex items-center gap-3">
                <Users className="size-4 text-primary group-hover:text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary group-hover:text-white">Player Management</span>
              </div>
              <ChevronRight className="size-4 text-primary group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </Link>
            <ResultForm 
              tournamentId={tournament.id}
              initialStatus={tournament.status}
              initialWinnerName={tournament.winnerName || ""}
              initialResultsOverview={tournament.resultsOverview || ""}
              initialStandings={tournament.finalStandings as any[] || []}
              participants={tournament.registrations}
            />
        </div>

      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Match Control Center */}
        <div className="lg:col-span-2 space-y-8">
            <div className="space-y-12">
                <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10">
                    <MatchSetupForm 
                        tournamentId={tournament.id}
                        game={tournament.game}
                        maxPlayers={tournament.maxPlayers}
                        mode={tournament.mode}
                        teamFormat={tournament.teamFormat || "SQUAD"}
                    />
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3 text-zinc-500">
                            <Swords className="size-5" />
                            Match Result Recorder
                        </h3>
                    </div>
                    <MatchEntryForm 
                      tournamentId={tournament.id} 
                      game={tournament.game}
                      mode={tournament.mode} 
                      participants={tournament.registrations} 
                      matches={tournament.matches}
                    />
                </div>

                {/* Advancement & Qualifier Control Center */}
                {tournament.status !== "COMPLETED" && (() => {
                    const stats = calculateBracketLobbies(
                        tournament.game, 
                        tournament.registrations.length, 
                        undefined, 
                        tournament.teamFormat || "SQUAD"
                    );
                    return (
                        <AdvancementHub 
                            tournamentId={tournament.id}
                            registrations={tournament.registrations}
                            matches={tournament.matches}
                            advancingPerLobby={stats.advancingPerLobby}
                            totalLobbies={stats.lobbies}
                            targetFinalSize={stats.targetFinalSize}
                        />
                    );
                })()}
            </div>

            {/* Matches & Roadmap */}
            <div className="space-y-6">
                <LobbyRoadmap 
                    tournamentId={tournament.id}
                    matches={tournament.matches}
                    registrations={tournament.registrations}
                />
            </div>
        </div>

        {/* Sidebar: Approved Players */}
        <div className="space-y-8">
            <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-3">
                    <Users className="size-4 text-primary" />
                    Approved Players
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {(tournament.registrations as any[]).map((reg: any) => (
                        <div key={reg.id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-primary/40 transition-all duration-300">
                            <div className="size-10 rounded-xl bg-zinc-900 border border-white/5 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                                {reg.user?.image ? <img src={reg.user.image} className="size-full object-cover" /> : <div className="size-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-600 font-bold italic uppercase">{reg.team?.name?.[0] || reg.user?.name?.[0]}</div>}
                            </div>
                            <div className="flex-1 min-w-0 space-y-0.5">
                                <p className="text-[11px] font-black uppercase italic text-white truncate tracking-tight group-hover:text-primary transition-colors">
                                    {tournament.mode === "SOLO" ? reg.user?.name : (reg.team?.name || reg.user?.name)}
                                </p>
                                {tournament.mode !== "SOLO" && reg.team && reg.user && (
                                     <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                         <span className="text-[7px] font-black bg-white/5 text-zinc-500 px-1 py-0.5 rounded uppercase tracking-widest leading-none">Leader</span>
                                         <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight italic truncate">{reg.user?.name}</span>
                                     </div>
                                )}
                                {tournament.mode === "SOLO" && (
                                     <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 italic">Warrior Entry</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] flex items-start gap-4">
                <AlertCircle className="size-5 text-primary shrink-0 mt-1" />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white italic mb-1">Admin Notice</p>
                   <p className="text-[9px] font-black uppercase tracking-widest text-primary/70 leading-relaxed italic">Only approved registrations appear here. Use the participant list to verify more players.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
