"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trophy, 
  Users, 
  Calendar, 
  Gamepad2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Radio,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TournamentsClient({ initialTournaments }: { initialTournaments: any[] }) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredTournaments = initialTournaments.filter((t) => {
    if (filter === "ALL") return true;
    return t.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Tactical Header */}
      <header className="relative space-y-8 overflow-hidden py-10">
        {/* Radar Scanning Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary animate-pulse" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-primary animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary rounded-full animate-ping opacity-20" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-1 bg-primary" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Global Tournament Hub</p>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white">
                   Arena <br/><span className="text-glow text-primary">Portal</span>
                </h1>
            </div>
            <div className="max-w-[450px] space-y-6 md:border-l md:border-white/10 md:pl-8">
               <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] italic leading-relaxed">
                   Browse and join the most competitive tournaments in the ecosystem. Secure your spot in the next major event.
               </p>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <ShieldCheck className="size-3 text-primary" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Verified Integrity</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <Zap className="size-3 text-orange-500" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Real-time Updates</span>
                  </div>
               </div>
            </div>
        </div>
      </header>

      {/* Futuristic Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
             {["ALL", "UPCOMING", "LIVE", "COMPLETED"].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={cn(
                   "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shrink-0 border",
                   filter === f 
                     ? "bg-primary text-white border-primary shadow-[0_0_20px_-5px_rgba(220,38,38,0.4)]" 
                     : "bg-white/[0.02] text-zinc-500 border-white/5 hover:text-white hover:border-white/20"
                 )}
               >
                 {f === "LIVE" && <Radio className={cn("size-3", filter === "LIVE" && "animate-pulse")} />}
                 {f === "COMPLETED" && <CheckCircle className="size-3" />}
                 {f}
               </button>
             ))}
          </div>
          
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hidden md:block">
            Showing <span className="text-white">{filteredTournaments.length}</span> Operations
          </div>
      </div>

      {/* Grid: Modern Tactical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5">
             <Trophy className="size-20 text-zinc-900 mx-auto mb-8 animate-pulse" />
             <p className="text-zinc-700 font-black italic uppercase text-sm tracking-[0.4em]">No active deployments in sector. Stand by.</p>
          </div>
        ) : (
          filteredTournaments.map((t: any) => (
            <div key={t.id} className="group relative bg-[#080808] border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all duration-700 flex flex-col shadow-[0_0_50px_-12px_rgba(220,38,38,0.1)] hover:shadow-primary/20 hover:-translate-y-1">
              {/* Image & Status */}
              <div className="h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-[#080808]/20 to-transparent z-10" />
                  <Image 
                    src={t.imageUrl || `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070`} 
                    alt={t.game}
                    fill
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={filteredTournaments.indexOf(t) < 3}
                  />

                  {/* Shimmer Scanline */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20" />

                  <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
                      <div className={cn(
                          "backdrop-blur-md border rounded-xl px-4 py-2 flex items-center gap-2",
                          t.status.toUpperCase() === "LIVE" ? "bg-red-600/20 border-red-500/30 text-red-500" :
                          t.status.toUpperCase() === "COMPLETED" ? "bg-zinc-500/20 border-zinc-500/30 text-zinc-400" :
                          "bg-primary/20 border-primary/30 text-primary"
                      )}>
                        {t.status.toUpperCase() === 'LIVE' && <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />}
                        {t.status.toUpperCase() === 'UPCOMING' && <div className="size-1.5 rounded-full bg-primary animate-pulse" />}
                        <span className="text-[9px] font-black uppercase italic tracking-widest">{t.status}</span>
                      </div>
                  </div>

                  {/* Colored corner glow */}
                  <div className="absolute -top-10 -right-10 size-40 bg-primary/20 blur-[80px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
              </div>

              {/* Card Content */}
              <div className="p-8 flex-1 flex flex-col justify-between relative z-20">
                  <div className="space-y-6">
                      <div className="inline-flex items-center gap-3 text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                          <Gamepad2 className="size-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest italic">{t.game}</span>
                      </div>
                      <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors leading-[0.9]">
                          {t.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                          <div className="space-y-2">
                              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">Match Schedule</p>
                              <div className="flex items-center gap-2 text-white text-xs font-black italic uppercase tracking-tight">
                                  <Calendar className="size-3.5 text-primary" />
                                  {new Date(t.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                          </div>
                          <div className="space-y-2">
                              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">Total Teams</p>
                              <div className="flex items-center gap-2 text-white text-xs font-black italic uppercase tracking-tight">
                                  <Users className="size-3.5 text-primary" />
                                  {t._count.registrations} <span className="text-zinc-600 text-[10px]">/ {t.maxPlayers}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-10">
                      <Link 
                        href={`/tournaments/${t.id}`}
                        className="flex items-center justify-between w-full h-16 bg-white text-black border border-transparent rounded-2xl px-8 group/btn hover:bg-primary hover:text-white transition-all active:scale-[0.98] shadow-xl hover:shadow-primary/20"
                      >
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] italic">
                            {t.status.toUpperCase() === 'COMPLETED' ? 'View Results' : 'View Event Details'}
                         </span>
                         <ArrowRight className="size-5 transition-all group-hover/btn:translate-x-2" />
                      </Link>
                  </div>

                  {/* Decorative background glow */}
                  <div className="absolute -bottom-20 -left-20 size-40 bg-primary/10 blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Tech Corner Accent */}
              <div className="absolute top-0 right-0 size-16 p-6 overflow-hidden pointer-events-none z-30">
                 <div className="absolute top-0 right-0 w-[1px] h-full bg-white/5" />
                 <div className="absolute top-0 right-0 w-full h-[1px] bg-white/5" />
                 <div className="w-full h-full border-t-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
