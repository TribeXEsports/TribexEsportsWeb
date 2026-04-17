import React from "react";
import { 
  Trophy, 
  Users, 
  Calendar, 
  ArrowUpRight,
  Target,
  Zap,
  ShieldCheck,
  Search,
  Activity,
  History,
  Terminal
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

async function getStats() {
  const [tournamentCount, userCount, registrationCount, staffCount] = await Promise.all([
    prisma.tournament.count(),
    prisma.user.count(),
    prisma.registration.count(),
    prisma.user.count({ where: { role: "admin" } }),
  ]);

  return {
    tournaments: tournamentCount,
    users: userCount,
    registrations: registrationCount,
    staff: staffCount,
  };
}

async function getRecentActivities() {
  const [tournaments, registrations, users] = await Promise.all([
    prisma.tournament.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { 
        tournament: { select: { title: true } },
        user: { select: { username: true } },
        team: { select: { name: true } }
      }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const activities = [
    ...tournaments.map((t: any) => ({
      id: t.id,
      type: "TOURNAMENT",
      title: `Tournament Created: ${t.title}`,
      time: t.createdAt,
      link: `/admin/tournaments`
    })),
    ...registrations.map((r: any) => ({
      id: r.id,
      type: "REGISTRATION",
      title: `${r.team?.name || r.user?.username || "Agent"} joined ${r.tournament.title}`,
      time: r.createdAt,
      link: `/admin/registrations`
    })),
    ...users.map((u: any) => ({
      id: u.id,
      type: "USER",
      title: `New Warrior Enlisted: ${u.username || u.name || "Private"}`,
      time: u.createdAt,
      link: `/admin/users`
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return activities;
}

function getTimeAgo(date: Date | null | undefined) {
  if (!date) return "Historical";
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
}

export default async function AdminDashboard() {
  const [stats, activities] = await Promise.all([
    getStats(),
    getRecentActivities()
  ]);

  const statCards = [
    { label: "Total Users", value: stats.users, detail: "Registered accounts", icon: Users },
    { label: "Active Tournaments", value: stats.tournaments, detail: "Live / Upcoming", icon: Trophy },
    { label: "New Registrations", value: stats.registrations, detail: "Pending approval", icon: Target },
    { label: "Administrators", value: stats.staff, detail: "Management roles", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-12 pb-20 font-sans">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-sans">
            Admin <span className="text-primary font-sans">Overview</span>
        </h2>
        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">System-wide analytics and real-time activity monitoring.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-white/5 rounded-3xl p-8 relative group hover:border-primary/20 transition-all overflow-hidden shadow-2xl">
            <div className="flex flex-col gap-6 relative z-10">
               <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <div className="p-2 bg-black rounded-lg border border-white/5 group-hover:border-primary/20 transition-colors">
                    <stat.icon className="size-4 text-zinc-600 group-hover:text-primary transition-colors" />
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter">{stat.value}</span>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em]">{stat.detail}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 font-sans">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-[2rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-3">
               <History className="size-4 text-primary" />
               Recent Activities
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">View All Logs</button>
          </div>
          <div className="space-y-2">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.01] transition-all group cursor-pointer bg-black/20">
                <div className="flex items-center gap-5 min-w-0">
                  <div className={cn(
                    "size-2 rounded-full transition-colors shrink-0",
                    activity.type === "TOURNAMENT" ? "bg-primary" : 
                    activity.type === "USER" ? "bg-emerald-500" : "bg-blue-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-zinc-300 truncate uppercase tracking-tight">{activity.title}</p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{getTimeAgo(activity.time)} • ID: {activity.id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <ArrowUpRight className="size-3 text-zinc-700 group-hover:text-primary transition-colors" />
              </div>
            )) : (
              <div className="py-12 text-center">
                 <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">No recent deployments detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* System Search & Quick Actions */}
        <div className="space-y-6 font-sans">
            <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-8 flex flex-col gap-8 shadow-2xl h-full">
                <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-3">
                        <Search className="size-4 text-primary" />
                        Quick Search
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-zinc-700 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find User, Team, or ID..." 
                            className="w-full h-14 bg-black border border-white/10 rounded-xl pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800"
                        />
                    </div>
                </div>
                
                <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Maintenance Mode</p>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">Account Sync / API Status</p>
                        </div>
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
