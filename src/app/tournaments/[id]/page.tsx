import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* @ts-ignore */
const db = prisma as any;
import { 
  Trophy, 
  Calendar, 
  Users, 
  Gamepad2, 
  ChevronLeft,
  Info,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import MatchRoomList from "@/components/tournaments/MatchRoomList";
import RegisterButton from "@/app/tournaments/[id]/RegisterButton";
import LeaderboardCard from "@/components/tournaments/LeaderboardCard";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TournamentUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  const userId = (session?.user as any)?.id;

  const tournamentPromise = db.tournament.findUnique({
    where: { id },
    include: {
      _count: { 
        select: { 
            registrations: { 
                where: { status: { in: ["VERIFIED", "CONFIRMED"] } } 
            } 
        } 
      },
      matches: {
        include: { room: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  const registrationPromise = userId ? db.registration.findFirst({
    where: { 
      tournamentId: id,
      OR: [
        { userId: userId },
        { team: { captainId: userId } }
      ]
    }
  }) : Promise.resolve(null);

  const [tournament, userRegistration] = await Promise.all([tournamentPromise, registrationPromise]);

  if (!tournament) return <div>Tournament not found</div>;

  const matches = (tournament as any).matches || [];

  const features = [
    { label: "Platform", value: tournament.game === "Valorant" ? "Riot PC" : "Mobile / Emul", icon: Target },
    { label: "Anticheat", value: "TribeShield Active", icon: ShieldCheck },
    { label: "Prizepool", value: tournament.prizePool || "Rank Superiority", icon: Trophy },
    { label: "Format", value: `${tournament.type} // ${tournament.teamFormat}`, icon: Zap },
  ];

  return (
    <main className="relative min-h-screen pt-32 pb-20 px-6 bg-black">
      {/* 1. MINIMALIST DEPTH */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        <Link 
          href="/tournaments" 
          className="inline-flex items-center gap-2.5 text-zinc-500 hover:text-white transition-all group"
        >
          <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Global Lobby</span>
        </Link>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
          <div className="lg:col-span-3 space-y-16">
              <header className="space-y-6">
                  <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{tournament.game}</span>
                      <span className="text-zinc-800">/</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tournament.mode}</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.1] uppercase outfit-font italic">
                      {tournament.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2.5 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-zinc-400">
                          <Calendar className="size-3.5" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">{new Date(tournament.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-zinc-400">
                          <Users className="size-3.5" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">{tournament._count.registrations} / {tournament.maxPlayers} SIGNED UP</span>
                      </div>
                  </div>
              </header>

              <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <h3 className="text-xl font-black uppercase tracking-tight text-white outfit-font italic">Tournament Overview</h3>
                  </div>
                  <div className="prose prose-invert max-w-4xl">
                      <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                          {tournament.description || "Official tournament details and overview."}
                      </p>
                  </div>
                  {tournament.rules && (
                      <div className="bg-zinc-900/30 p-8 border border-white/5 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 text-zinc-500">
                              <ShieldCheck className="size-4" />
                              <h4 className="text-[10px] font-bold uppercase tracking-widest">Competition Rules</h4>
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap font-medium border-l-2 border-primary/20 pl-6 py-1">{tournament.rules}</p>
                      </div>
                  )}
              </div>

              {/* Professional Feature Modules */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((f, i) => (
                      <div key={i} className="p-6 bg-zinc-900/50 border border-white/5 rounded-xl space-y-3 hover:bg-zinc-900 transition-all cursor-default">
                          <f.icon className="size-4 text-zinc-500" />
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">{f.label}</p>
                              <p className="text-sm font-black text-white italic uppercase tracking-tight">{f.value}</p>
                          </div>
                      </div>
                  ))}
              </div>

              {(tournament as any).mapPool?.length > 0 && (
                  <div className="bg-zinc-900/30 p-8 border border-white/5 rounded-2xl space-y-6">
                      <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Official Maps</h4>
                          <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400 font-black uppercase tracking-widest">
                            {tournament.game} POOL
                          </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3">
                          {(tournament as any).mapPool.map((map: string, i: number) => (
                              <div key={i} className="px-5 py-3 bg-zinc-950 border border-white/5 rounded-xl flex items-center gap-3 group hover:border-primary/20 transition-all">
                                  <span className="text-[10px] font-black text-primary italic">0{i + 1}</span>
                                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{map}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <div className="space-y-10">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <Target className="size-5 text-primary" />
                          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Leaderboard</h3>
                      </div>
                      <div className="h-px bg-white/5 flex-1 mx-8 hidden md:block" />
                  </div>
                  <LeaderboardCard tournamentId={tournament.id} targetFinalSize={tournament.targetFinalSize} />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white outfit-font italic">Upcoming Matches</h3>
                </div>
                <MatchRoomList initialMatches={matches} />
              </div>
          </div>

          <aside className="relative lg:pt-16 shrink-0">
              <div className="sticky top-32 space-y-4">
                  <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl shadow-xl space-y-6">
                      <div className="space-y-1 px-1 border-b border-white/5 pb-4">
                          <h3 className="text-sm font-black uppercase tracking-tight text-white outfit-font italic">Registration</h3>
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">TRIBEX Official Lobby</p>
                      </div>
                      <RegisterButton tournament={tournament} userRegistration={userRegistration} />
                      <div className="pt-4 space-y-4">
                          <div className="flex flex-wrap gap-2 group">
                              <div className="px-2 py-0.5 bg-zinc-900 border border-white/5 rounded text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Fair Play Verified</div>
                              <div className="px-2 py-0.5 bg-zinc-900 border border-white/5 rounded text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Official Entry</div>
                          </div>
                          <p className="text-[9px] font-bold text-zinc-700 leading-relaxed uppercase tracking-wider italic">
                            By entering, you confirm acceptance of TRIBEX competitive requirements and arena protocols.
                          </p>
                      </div>
                  </div>
              </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
