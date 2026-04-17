"use client"

import React, { useState } from "react";
import Image from "next/image";
import { 
  Trophy, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Sword, 
  Target, 
  Medal, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  Settings,
  User as UserIcon,
  Search,
  Users
} from "lucide-react";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  user: any;
  registrations: any[];
  matches: any[];
}

type TabType = "overview" | "tournaments" | "matches" | "settings";

export function DashboardContent({ user, registrations, matches }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Tournaments", value: registrations.length, icon: Medal, color: "text-red-500", bg: "bg-red-500/5" },
    { label: "Matches Played", value: matches.length, icon: Target, color: "text-blue-500", bg: "bg-blue-500/5" },
    { label: "Victories", value: matches.filter(m => (m as any).winnerUserId === user.id || (m as any).winnerTeam?.captainId === user.id).length, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/5" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "tournaments", label: "My Tournaments", icon: Medal },
    { id: "matches", label: "Battle History", icon: Activity },
    { id: "settings", label: "Profile", icon: Settings },
  ];

  return (
    <div className="space-y-10">
      {/* Managed Tab Navigation */}
      <div className="overflow-x-auto pb-4 -mb-4 no-scrollbar">
        <nav className="flex items-center gap-2 p-1.5 bg-zinc-900/40 border border-white/5 rounded-2xl w-fit shrink-0">
          {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all relative overflow-hidden",
              activeTab === tab.id 
                ? "text-white" 
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className={cn("size-4", activeTab === tab.id ? "text-red-600" : "text-zinc-600")} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-white/[0.03] border-b-2 border-red-600"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
        </nav>
      </div>

      {/* Tab Content Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Profile Card Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <UserIcon className="size-32" />
                   </div>
                   <div className="relative z-10 space-y-6">
                      <div className="size-20 rounded-3xl border-2 border-red-600/20 p-1 relative overflow-hidden">
                         <Image 
                            src={user.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} 
                            className="object-cover grayscale brightness-125" 
                            alt="User Profile" 
                            fill
                            sizes="80px"
                         />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{user.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600">ID: {user.id.slice(-6)} <span className="text-zinc-700 ml-2">/ PRIME MEMBER</span></p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Stats & Priority Feed */}
              <div className="lg:col-span-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((s, i) => (
                      <div key={i} className="p-8 bg-zinc-900 border border-white/5 rounded-3xl relative group hover:border-white/10 transition-all">
                         <div className={cn("size-10 rounded-2xl mb-4 flex items-center justify-center", s.bg)}>
                            <s.icon className={cn("size-5", s.color)} />
                         </div>
                         <p className="text-4xl font-black text-white tracking-tighter mb-1">{s.value}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{s.label}</p>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-4">Most Recent Action</h3>
                    {registrations[0] ? (
                       <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2rem] flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                             <div className="size-16 rounded-3xl bg-zinc-950 flex items-center justify-center border border-white/5">
                                <Medal className="size-8 text-zinc-800" />
                             </div>
                             <div>
                                <p className="text-[9px] font-bold uppercase text-red-600 tracking-widest mb-1">Latest Registration</p>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tight">{registrations[0].tournament?.title}</h4>
                                <Badge className="bg-white/5 text-zinc-500 text-[8px] border-none mt-2 px-2 uppercase font-black tracking-widest">{registrations[0].status}</Badge>
                             </div>
                          </div>
                          <Link 
                            href={`/tournaments/${registrations[0].tournamentId}`}
                            className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            aria-label={`View details for ${registrations[0].tournament?.title}`}
                          >
                             <ArrowUpRight className="size-6" />
                          </Link>
                       </div>
                    ) : (
                      <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">No recent activity detected.</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          {activeTab === "tournaments" && (
            <div className="space-y-8">
              <header className="flex justify-between items-center bg-zinc-900 border border-white/5 p-8 rounded-[2rem]">
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">My Active Registrations</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Manage your tournament entries and team status.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-black border border-white/5 rounded-xl text-[10px] font-bold text-zinc-400 focus-within:border-red-600 transition-colors">
                       <Search className="size-3" />
                       <input 
                         placeholder="SEARCH TOURNAMENTS" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="bg-transparent border-none outline-none w-40 placeholder:text-zinc-600 text-white"
                         aria-label="Search my tournaments"
                       />
                    </div>
                    <Link href="/tournaments" className="hidden sm:block px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">
                       BROWSE ALL
                    </Link>
                 </div>
              </header>

              <div className="grid grid-cols-1 gap-4">
                {registrations.filter(r => 
                   r.tournament?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   r.tournament?.game.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="p-16 md:p-24 text-center bg-zinc-900/20 rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10">
                    <p className="text-zinc-600 font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">No matching registrations found.</p>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-red-600 font-black italic hover:underline">Clear Search</button>
                    )}
                  </div>
                ) : (registrations as any[]).filter(r => 
                   r.tournament?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   r.tournament?.game.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((reg) => (
                  <div key={reg.id} className="bg-zinc-900/30 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-zinc-900/60 transition-all border-l-4 border-l-transparent hover:border-l-red-600">
                    <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full sm:w-auto">
                       <div className="size-16 md:size-20 rounded-2xl md:rounded-3xl bg-zinc-950 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 relative">
                          {reg.tournament?.imageUrl ? (
                             <Image 
                                src={reg.tournament.imageUrl} 
                                alt={reg.tournament.title || "Tournament Banner"}
                                fill
                                className="object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" 
                                sizes="80px"
                             />
                          ) : (
                             <Medal className="size-10 text-zinc-900" />
                          )}
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-3">
                             <h4 className="text-2xl font-black text-white uppercase tracking-tight">{reg.tournament?.title}</h4>
                             <Badge className="bg-red-600/10 text-red-600 text-[9px] border-none px-2 uppercase font-black">{reg.tournament?.game}</Badge>
                          </div>
                          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                             <div className="flex items-center gap-2">
                                <Users className="size-3 text-red-600" />
                                <span>{reg.tournament?.mode}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Sword className="size-3 text-red-600" />
                                 <span>{reg.team ? reg.team.name : "Solo Entry"}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-12 w-full md:w-auto p-6 md:p-0 bg-white/[0.02] md:bg-transparent rounded-3xl">
                       <div className="flex-1 md:text-right">
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1 italic">Registration Status</p>
                          <div className="flex items-center md:justify-end gap-2">
                            <div className={cn(
                              "size-2 rounded-full",
                              reg.status === 'approved' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                              reg.status === 'rejected' ? 'bg-red-600' : 'bg-amber-500'
                            )} />
                            <span className={cn(
                              "text-[12px] font-black uppercase tracking-widest italic",
                              reg.status === 'approved' ? 'text-green-500' : 
                              reg.status === 'rejected' ? 'text-red-500' : 'text-amber-500'
                            )}>
                              {reg.status}
                            </span>
                          </div>
                       </div>
                       <Link 
                          href={`/tournaments/${reg.tournamentId}`}
                          className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                       >
                          <ArrowUpRight className="size-6" />
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "matches" && (
            <div className="space-y-8">
               <header className="flex justify-between items-center bg-zinc-900 border border-white/5 p-8 rounded-[2rem]">
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Match History</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">A detailed record of your past arena performance.</p>
                 </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.length === 0 ? (
                  <div className="md:col-span-2 p-32 text-center border border-dashed border-white/5 rounded-[3rem]">
                      <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs">No match history recorded yet.</p>
                  </div>
                ) : matches.map((match) => {
                  const isWinner = (match as any).winnerUserId === user.id || (match as any).winnerTeam?.captainId === user.id;
                  return (
                    <div key={match.id} className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2rem] hover:bg-zinc-900/70 transition-all group overflow-hidden relative">
                       {/* Background Outcome Indicator */}
                       <div className={cn(
                         "absolute top-0 right-0 size-24 blur-3xl opacity-10",
                         isWinner ? "bg-green-500" : "bg-red-600"
                       )} />
                       
                       <div className="relative z-10 space-y-6">
                          <header className="flex justify-between items-center border-b border-white/5 pb-4">
                             <div>
                                <p className="text-[12px] font-black text-white uppercase tracking-tight">{match.tournament?.title}</p>
                                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{new Date(match.createdAt).toLocaleDateString()}</p>
                             </div>
                             <Badge className={cn(
                               "border-none text-[9px] font-black uppercase tracking-widest italic px-3",
                               isWinner ? "bg-green-500 text-black" : "bg-red-600 text-white"
                             )}>
                               {isWinner ? "Victory" : "Lost"}
                             </Badge>
                          </header>

                          <div className="flex items-center justify-between gap-6 px-4 py-8 bg-black/40 rounded-2xl border border-white/5">
                             <div className="flex-1 text-center overflow-hidden">
                                <p className={cn(
                                  "text-sm font-black uppercase tracking-tight truncate",
                                  match.userAId === user.id || match.teamA?.captainId === user.id ? "text-red-600" : "text-zinc-500"
                                )}>
                                  {match.userA?.name || match.teamA?.name}
                                </p>
                             </div>
                             <div className="flex flex-col items-center gap-1">
                                <div className="text-2xl font-black italic text-white">{match.scoreA} : {match.scoreB}</div>
                                <div className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">FINAL SCORE</div>
                             </div>
                             <div className="flex-1 text-center overflow-hidden">
                                <p className={cn(
                                  "text-sm font-black uppercase tracking-tight truncate",
                                  match.userBId === user.id || match.teamB?.captainId === user.id ? "text-red-600" : "text-zinc-500"
                                )}>
                                  {match.userB?.name || match.teamB?.name}
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-1 space-y-6">
                  <div className="p-10 bg-zinc-900 border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center gap-6">
                      <div className="size-32 rounded-[2.5rem] bg-zinc-950 border-2 border-red-600/20 p-1 relative overflow-hidden">
                         <Image 
                            src={user.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} 
                            className="object-cover grayscale" 
                            alt={`${user.name}'s Profile Portrait`} 
                            fill
                            sizes="128px"
                         />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{user.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{user.email}</p>
                      </div>
                      <button className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all">
                         Change Avatar
                      </button>
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-6">
                  <div className="p-10 bg-zinc-900 border border-white/5 rounded-[2.5rem] space-y-8">
                     <h3 className="text-xl font-black uppercase text-white tracking-tight">Account Details</h3>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Registered IGN</label>
                           <div className="h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center px-6 text-sm font-bold text-white uppercase italic">
                              {user.name}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Account Status</label>
                           <div className="h-14 bg-black/40 border border-white/5 rounded-2xl flex items-center px-6 text-sm font-bold text-green-500 uppercase italic">
                              VERIFIED PLAYER
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Account ID</label>
                           <div className="h-14 bg-black/30 border border-white/5 rounded-2xl flex items-center px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              {user.id}
                           </div>
                        </div>
                     </div>
                     <button className="px-8 h-14 bg-red-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all active:scale-95 shadow-glow-red">
                        SAVE SETTINGS
                     </button>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
