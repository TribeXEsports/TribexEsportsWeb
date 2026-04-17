import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Plus, 
  Trophy, 
  Users, 
  Activity, 
  Calendar, 
  Gamepad2,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function getOrganizerStats(organizerId: string) {
  const [tournaments, registrations] = await Promise.all([
    prisma.tournament.findMany({
      where: { organizerId },
      include: { _count: { select: { registrations: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.registration.findMany({
      where: { tournament: { organizerId } },
      include: { tournament: true, team: true }
    })
  ]);

  return { tournaments, registrations };
}

export default async function OrganizerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ORGANIZER") {
    redirect("/");
  }

  const { tournaments, registrations } = await getOrganizerStats((session.user as any).id);
  const activeEvents = tournaments.filter((t: any) => t.status === "LIVE" || t.status === "REGISTRATION").length;
  const pendingRegs = registrations.filter((r: any) => r.status === "PENDING_APPROVAL").length;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="size-2 bg-amber-500 animate-pulse rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 italic">Organizer Command Hub</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                Event <span className="text-amber-500 not-italic">Operator</span>
            </h2>
            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] italic max-w-lg leading-relaxed">
                Management terminal for your hosted leagues and daily scrim missions.
            </p>
        </div>
        <Link 
          href="/admin/tournaments/create" 
          className="flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-amber-500 hover:text-white transition-all shadow-2xl italic group"
        >
          <Plus className="size-4 group-hover:rotate-90 transition-transform" /> 
          <span>Host New Event</span>
        </Link>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total Hosted</p>
              <div className="flex items-center justify-between">
                <h4 className="text-3xl font-black text-white">{tournaments.length}</h4>
                <Trophy className="size-6 text-zinc-800" />
              </div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Active Missions</p>
              <div className="flex items-center justify-between">
                <h4 className="text-3xl font-black text-amber-500">{activeEvents}</h4>
                <Activity className="size-6 text-amber-900/40" />
              </div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] space-y-4 border-amber-500/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pending Review</p>
              <div className="flex items-center justify-between">
                <h4 className="text-3xl font-black text-white">{pendingRegs}</h4>
                <AlertCircle className="size-6 text-amber-500/30" />
              </div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Growth Rate</p>
              <div className="flex items-center justify-between">
                <h4 className="text-3xl font-black text-white">+12%</h4>
                <TrendingUp className="size-6 text-emerald-500/20" />
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Events Table */}
          <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-white italic">Recent Deployments</h3>
                <Link href="/admin/tournaments" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">View All Archive</Link>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600">Mission Name</th>
                            <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600">Roster Capacity</th>
                            <th className="p-8 text-[9px] font-black uppercase tracking-widest text-zinc-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tournaments.slice(0, 5).map((t: any) => (
                            <tr key={t.id} className="group hover:bg-white/[0.01] transition-all">
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-black border border-white/5 flex items-center justify-center">
                                            <Gamepad2 className="size-5 text-zinc-800 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase text-white group-hover:text-amber-500 transition-colors tracking-tight">{t.title}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{t.game} // {t.mode}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-2">
                                        <Users className="size-3 text-zinc-700" />
                                        <span className="text-[11px] font-black text-white">{t._count.registrations} / {t.maxPlayers}</span>
                                    </div>
                                </td>
                                <td className="p-8 text-right">
                                    <Link 
                                        href={`/admin/tournaments/${t.id}`}
                                        className="inline-flex size-10 items-center justify-center bg-black border border-white/5 rounded-xl text-zinc-600 hover:text-white hover:border-amber-500/30 transition-all"
                                    >
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
              </div>
          </div>

          {/* Quick Actions / Recent Activity */}
          <aside className="space-y-12">
                <div className="space-y-8">
                    <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-white italic px-2">Rapid Response</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button className="flex items-center justify-between p-6 bg-zinc-900 hover:bg-white/[0.02] border border-white/5 rounded-2xl group transition-all">
                             <div className="flex items-center gap-4">
                                <Plus className="size-4 text-zinc-600 group-hover:text-amber-500 transition-all" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Quick Match Room</span>
                             </div>
                             <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] font-black italic">PRO</Badge>
                        </button>
                        <button className="flex items-center justify-between p-6 bg-zinc-900 hover:bg-white/[0.02] border border-white/5 rounded-2xl group transition-all">
                             <div className="flex items-center gap-4">
                                <Calendar className="size-4 text-zinc-600 group-hover:text-amber-500 transition-all" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Schedule Sync</span>
                             </div>
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="size-4 text-amber-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Protocol Reminder</h4>
                    </div>
                    <p className="text-[9px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest italic">
                        All match results must be updated within 60 minutes of completion to ensure leaderboard accuracy.
                    </p>
                </div>
          </aside>
      </div>
    </div>
  );
}
