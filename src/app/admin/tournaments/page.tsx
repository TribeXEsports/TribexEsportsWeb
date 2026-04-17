"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Settings, 
  Trash2, 
  ExternalLink,
  Plus,
  Gamepad2,
  Calendar,
  Layers,
  Search,
  ChevronRight,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = () => {
    setIsLoading(true);
    fetch("/api/admin/tournaments")
      .then(res => res.json())
      .then(data => {
        setTournaments(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${title}"? This will also remove all registrations and matches.`)) return;

    try {
      const res = await fetch(`/api/admin/tournaments/${id}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        setTournaments(prev => prev.filter(t => t.id !== id));
      } else {
        const error = await res.json();
        alert(`Deletion failed: ${error.details || error.error}`);
      }
    } catch (error) {
      alert("Critical: System failure during deletion protocol.");
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/tournaments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus })
      });
      
      if (res.ok) {
        setTournaments(prev => prev.map(t => t.id === id ? { ...t, isFeatured: !currentStatus } : t));
      }
    } catch (error) {
      console.error("Failed to toggle featured status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming": 
      case "registration":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 italic tracking-widest text-[9px] uppercase">UPCOMING</Badge>;
      case "live": 
        return <Badge className="bg-red-600/10 text-red-600 border-red-600/20 italic tracking-widest text-[9px] uppercase shadow-[0_0_15px_rgba(220,38,38,0.1)]">LIVE NOW</Badge>;
      case "completed": 
        return <Badge className="bg-zinc-800 text-zinc-500 border-white/5 italic tracking-widest text-[9px] uppercase">COMPLETED</Badge>;
      default: 
        return <Badge className="bg-zinc-900 border-white/10 text-white italic tracking-widest text-[9px] uppercase">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="size-2 bg-primary animate-pulse rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Event Management</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                Tournament <span className="text-primary not-italic">Manager</span>
            </h2>
            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] italic max-w-lg">
                Manage your active and historical competitive events with ease and control.
            </p>
        </div>
        <Link 
          href="/admin/tournaments/create" 
          className="flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-primary hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] italic group active:scale-95 overflow-hidden relative"
        >
          <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 group-hover:h-full transition-all duration-500" />
          <Plus className="size-4 group-hover:rotate-90 transition-transform relative z-10" /> 
          <span className="relative z-10">Create Tournament</span>
        </Link>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-zinc-700 group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="SEARCH TOURNAMENTS..." 
                className="w-full h-18 bg-zinc-900/40 border border-white/5 rounded-2xl pl-14 pr-6 text-[11px] font-black uppercase tracking-widest text-zinc-400 outline-none focus:border-primary/30 transition-all placeholder:text-zinc-800"
              />
          </div>
          <div className="flex gap-2">
              <button className="h-18 px-10 bg-zinc-900/40 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/[0.02] transition-all italic">Active Events</button>
              <button className="h-18 px-10 bg-zinc-900/40 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/[0.02] transition-all italic">Archive</button>
          </div>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Tournament Detail</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Configuration</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Registration</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="p-10 h-32 bg-white/[0.01]" />
                  </tr>
                ))
              ) : tournaments.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-32 text-center">
                        <div className="size-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                           <Trophy className="size-10 text-zinc-800" />
                        </div>
                        <p className="text-zinc-600 font-black italic uppercase text-[11px] tracking-[0.5em]">No active tournaments in manager.</p>
                    </td>
                </tr>
              ) : tournaments.map((t) => (
                <tr key={t.id} className="group hover:bg-white/[0.01] transition-all cursor-crosshair">
                  <td className="p-10">
                    <div className="flex items-center gap-6">
                      <div className="size-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-500 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-colors" />
                        <Gamepad2 className="size-7 text-zinc-700 group-hover:text-primary transition-colors relative z-10" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="text-[15px] font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-all duration-300">{t.title}</h4>
                        <div className="flex items-center gap-3">
                           {getStatusBadge(t.status)}
                           {t.isFeatured && <Badge className="bg-amber-500/10 text-amber-500 border-amber-600/20 italic tracking-widest text-[9px] uppercase flex items-center gap-1"><Star className="size-2 fill-amber-500" /> RECOMMENDED</Badge>}
                           <span className="text-[9px] font-black text-zinc-700 tracking-[0.2em] uppercase italic group-hover:text-zinc-500 transition-colors">#{t.id.slice(-8)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                        <Calendar className="size-4 text-primary/40 group-hover:text-primary transition-colors" />
                        <span className="text-[12px] font-black italic uppercase tracking-widest">{new Date(t.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        <Layers className="size-4" />
                        <span className="text-[11px] font-bold italic uppercase tracking-[0.2em]">{t.mode} // {t.game}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="size-9 rounded-full bg-zinc-950 border-2 border-zinc-900 group-hover:border-primary/20 transition-all flex items-center justify-center overflow-hidden">
                                     <div className="size-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
                                        <Users className="size-3.5 text-zinc-700" />
                                     </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[13px] font-black italic uppercase text-white group-hover:text-primary transition-colors tracking-tighter">
                               {t._count.registrations} <span className="text-zinc-600 mx-1 group-hover:text-zinc-500">/</span> {t.maxPlayers}
                            </p>
                            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic group-hover:text-zinc-600 transition-colors">Participants Joined</span>
                        </div>
                    </div>
                  </td>
                  <td className="p-10 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 group-hover:scale-105 duration-300">
                      <button 
                        onClick={() => handleToggleFeatured(t.id, t.isFeatured)}
                        className={cn(
                          "p-4 rounded-xl border transition-all group/btn flex items-center justify-center",
                          t.isFeatured 
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                            : "bg-zinc-900 border-white/5 text-zinc-600 hover:text-amber-500"
                        )}
                      >
                        <Star className={cn("size-4 transition-transform duration-500", t.isFeatured ? "fill-amber-500 scale-110" : "group-hover/btn:scale-125")} />
                      </button>
                      <Link 
                        href={`/admin/tournaments/${t.id}`}
                        className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-zinc-600 hover:text-white hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all group/btn"
                      >
                        <Settings className="size-4 group-hover/btn:rotate-90 transition-transform duration-500" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(t.id, t.title)}
                        className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-zinc-700 hover:text-red-500 hover:border-red-500/30 transition-all transition-transform active:scale-95"
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <Link 
                        href={`/tournaments/${t.id}`}
                        target="_blank"
                        className="p-4 bg-zinc-900 rounded-xl border border-white/5 text-zinc-600 hover:text-primary transition-all"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
