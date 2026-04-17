import { prisma } from "@/lib/prisma";
import { 
  Trophy, 
  Target, 
  ShieldCheck, 
  ChevronLeft,
  Medal,
  Zap,
  Calendar,
  Users,
  Swords
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function TournamentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      matches: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!tournament || tournament.status !== "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <Zap className="size-16 text-zinc-800 mx-auto animate-pulse" />
          <h1 className="text-xl font-black italic uppercase tracking-[0.4em] text-zinc-500">Record Not Finalized</h1>
          <Link href="/leaderboard" className="inline-block text-[10px] font-bold text-primary uppercase tracking-widest border-b border-primary/30 pb-1">Return to Archive</Link>
        </div>
      </div>
    );
  }

  const standings = (tournament.finalStandings as any[]) || [];

  return (
    <main className="min-h-screen pb-32">
      <div className="pt-32 px-6 max-w-6xl mx-auto mb-20">
        <Link 
          href="/leaderboard" 
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-primary transition-colors group mb-12"
        >
          <ChevronLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">Back to Hall of Fame</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Header & Winner Spotlight */}
          <div className="lg:col-span-8 space-y-12">
            <header className="space-y-6">
               <div className="flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-primary/30" />
                  <span className="text-[10px] font-black text-primary uppercase italic tracking-widest">{tournament.game} // {tournament.mode}</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                 {tournament.title}
               </h1>
               <div className="flex flex-wrap gap-8 text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(tournament.updatedAt as Date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Archive Verified</span>
                  </div>
               </div>
            </header>

            <div className="p-10 bg-primary/5 border border-primary/10 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Trophy className="size-32 text-primary" />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary flex items-center justify-center rotate-3 shadow-lg shadow-primary/20">
                      <Medal className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic mb-1">Tournament Victor</p>
                      <h2 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tight">{tournament.winnerName || "UNDECLARED"}</h2>
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-white/5" />
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic flex items-center gap-2">
                       <Target className="size-3 text-primary" />
                       Battle Summary
                     </p>
                     <p className="text-lg font-medium text-zinc-300 italic leading-relaxed">
                        {tournament.resultsOverview || "No detailed battle summary recorded for this operation."}
                     </p>
                  </div>
               </div>
            </div>

            {/* Detailed Standings */}
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-1 bg-primary" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Final Standings</h3>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Official Result Table</span>
               </div>

               <div className="bg-[#050505] border border-white/5 rounded-3xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5">
                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Rank</th>
                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Warrior/Team</th>
                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic text-center">Kills</th>
                        <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic text-right">Total Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.length > 0 ? standings.map((row, i) => (
                        <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all">
                          <td className="px-8 py-6">
                             <span className={`text-xl font-black italic ${i === 0 ? 'text-primary' : i === 1 ? 'text-orange-500' : 'text-zinc-600'}`}>
                               #{row.rank.toString().padStart(2, '0')}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-sm font-black italic uppercase text-white tracking-widest">{row.name}</span>
                          </td>
                          <td className="px-8 py-6 text-center text-sm font-bold text-zinc-400">
                             {row.kills}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <span className="text-xl font-black italic text-primary text-glow">{row.points}</span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="py-20 text-center text-zinc-700 italic font-black uppercase text-[10px] tracking-widest">
                            No detailed standings data archived.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>

          {/* Combat History Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
             <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Swords className="size-4 text-primary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Combat History</h3>
                </div>
                
                <div className="space-y-4">
                   {tournament.matches.length > 0 ? tournament.matches.map((match: any) => (
                      <div key={match.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
                         <div className="flex justify-between items-start mb-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary italic">Live Match Result</span>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(match.createdAt).toLocaleTimeString()}</span>
                         </div>
                         <h4 className="text-xs font-black italic uppercase text-white mb-4 tracking-tight line-clamp-1">{match.title}</h4>
                         <div className="flex justify-between items-center bg-black/40 rounded-xl p-3 border border-white/5 group-hover:border-primary/10 transition-all">
                            <div className="text-center flex-1">
                               <p className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Victor</p>
                               <p className="text-[10px] font-black text-white italic uppercase tracking-widest truncate px-2">{match.winnerName || "TBD"}</p>
                            </div>
                         </div>
                      </div>
                   )) : (
                     <div className="p-10 border border-white/5 border-dashed rounded-3xl text-center">
                        <Users className="size-6 text-zinc-800 mx-auto mb-4" />
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700 italic">No live match packets recorded.</p>
                     </div>
                   )}
                </div>
             </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
