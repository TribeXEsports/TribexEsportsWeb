import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, 
  Trophy, 
  Calendar, 
  ShieldCheck, 
  Gamepad2,
  ChevronRight,
  TrendingUp,
  Clock,
  Layout,
  PlusCircle,
  User as UserIcon,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getTeamData(userId: string, role: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        managedTeams: {
          include: {
            members: true,
            _count: { select: { registrations: true } }
          }
        },
        joinedTeams: {
          include: {
            members: true,
            _count: { select: { registrations: true } }
          }
        },
        registrations: {
          include: { tournament: true, team: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    return user;
  } catch {
    return null;
  }
}

export default async function TeamDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;
  const user = await getTeamData(userId, userRole);

  const team = user?.managedTeams?.[0] || user?.joinedTeams?.[0];
  const isCaptain = userRole === "CAPTAIN";

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="size-2 bg-primary animate-pulse rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Warrior Terminal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                Team <span className="text-primary not-italic">Operator</span>
            </h2>
            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] italic max-w-lg leading-relaxed">
                Strategic command for your squad and mission registrations.
            </p>
        </div>
        {!team && isCaptain && (
            <Link 
              href="/team/create" 
              className="flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-primary hover:text-white transition-all shadow-2xl italic group"
            >
              <PlusCircle className="size-4 group-hover:rotate-90 transition-transform" /> 
              <span>Create Your Squad</span>
            </Link>
        )}
      </header>

      {!team ? (
        <div className="p-16 bg-zinc-900/50 border border-white/5 rounded-[3rem] text-center space-y-6">
            <div className="size-24 bg-black border border-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Users className="size-10 text-zinc-800" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-white italic">No Fleet Detected</h3>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                    You have not established a team or been recruited by a captain yet. Initialize your own fleet or wait for an invitation.
                </p>
            </div>
            {isCaptain && (
                <Link 
                    href="/team/create"
                    className="inline-flex h-14 items-center bg-white text-black px-12 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                    Initialize Team
                </Link>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Team Profile & Roster */}
            <div className="space-y-12">
                <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black italic tracking-widest uppercase">
                            Level 01
                        </Badge>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="size-28 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                            {team.image ? (
                                <img src={team.image} className="size-full object-cover" />
                            ) : (
                                <ShieldCheck className="size-12 text-zinc-900" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">{team.name}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Active Duty Squadron</p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                            <span>Intelligence Board // Roster</span>
                            <span>{team.members.length} / {team.rosterLimit} Slots</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {team.members.map((m: any) => (
                                <div key={m.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="size-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
                                            <UserIcon className="size-3.5 text-zinc-700 group-hover:text-primary transition-colors" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">{m.name || m.username || "Warrior"}</span>
                                    </div>
                                    {m.id === team.captainId ? (
                                        <Badge className="bg-primary/5 text-primary border-primary/10 text-[7px] font-black tracking-widest">CAPTAIN</Badge>
                                    ) : (
                                        <Badge className="bg-zinc-950 text-zinc-700 border-white/5 text-[7px] font-black tracking-widest">MEMBER</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                        <Zap className="size-4 text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Daily Recap</h4>
                    </div>
                    <p className="text-[9px] text-zinc-600 leading-relaxed font-bold uppercase tracking-widest italic">
                        Win 3 matches today to unlock the "Arena Alpha" badge for your roster.
                    </p>
                </div>
            </div>

            {/* Right: Missions & Schedule */}
            <div className="lg:col-span-2 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Missions Deployed</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-white">{team._count.registrations}</h4>
                            <Trophy className="size-6 text-zinc-800" />
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Combat Status</p>
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black text-emerald-500 uppercase italic leading-none">Ready</h4>
                            <TrendingUp className="size-6 text-emerald-900/40" />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-white italic">Active Protocols</h3>
                        <Link href="/tournaments" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors underline underline-offset-4 decoration-primary/30">Find Missions</Link>
                    </div>

                    <div className="space-y-4">
                        {user?.registrations?.slice(0, 4).map((r: any) => (
                            <Link 
                                key={r.id}
                                href={`/tournaments/${r.tournamentId}`} 
                                className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-zinc-900/50 hover:bg-white/[0.02] border border-white/5 rounded-[2.5rem] group transition-all gap-6"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="size-16 rounded-3xl bg-black border border-white/5 flex items-center justify-center overflow-hidden">
                                        <Gamepad2 className="size-6 text-zinc-800 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-base font-black uppercase italic tracking-tighter text-white group-hover:text-primary transition-all duration-300">{r.tournament.title}</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="size-3 text-zinc-700" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">{new Date(r.tournament.startTime).toLocaleDateString()}</span>
                                            </div>
                                            <Badge className={cn(
                                                "text-[8px] font-black italic tracking-[0.2em] uppercase",
                                                r.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/5 text-primary border-primary/10"
                                            )}>
                                                {r.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700 opacity-60 group-hover:opacity-100 transition-opacity">Room Status</span>
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-3 text-zinc-800 group-hover:text-primary" />
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Locked</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="size-5 text-zinc-800 group-hover:text-white transition-all group-hover:translate-x-2" />
                                </div>
                            </Link>
                        ))}
                        {user?.registrations?.length === 0 && (
                            <div className="p-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                                <Layout className="size-10 text-zinc-900 mx-auto mb-6" />
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Awaiting Registration Commands</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
