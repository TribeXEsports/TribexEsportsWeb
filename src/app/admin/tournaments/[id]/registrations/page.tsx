"use client"

import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  ShieldX, 
  Loader2, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCcw,
  Trophy,
  LayoutGrid,
  MapPin,
  ChevronRight
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function RegistrationsManagement() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}/registrations`);
      const data = await res.json();
      if (res.ok) setRegistrations(data);
    } catch (error) {
      console.error("Fetch Failure", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [tournamentId]);

  const updateStatus = async (regId: string, status: string) => {
    setIsUpdating(regId);
    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}/registrations`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: regId, status })
      });
      if (res.ok) {
          setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status } : r));
      }
    } catch (error) {
       console.error("Update Failure", error);
    } finally {
       setIsUpdating(null);
    }
  };

  const assignLobbies = async () => {
    if (!confirm("Execute NEXUS Auto Lobby Assignment? This will shuffle confirmed squads.")) return;
    setIsUpdating("AUTO");
    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}/registrations/assign`, {
        method: "POST"
      });
      if (res.ok) {
          await fetchRegistrations();
          alert("Lobby matrix successfully deployed.");
      } else {
          const err = await res.json();
          alert(err.error || "Assignment failure.");
      }
    } catch (error) {
       console.error("Assignment Failure", error);
    } finally {
       setIsUpdating(null);
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = (r.team?.name || r.user?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Participant List</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Manage registrations and lobby assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchRegistrations} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
            <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
          </button>
          <button className="h-12 px-6 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-3">
            <Plus className="size-4" />
            Add Participant
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="SEARCH BY NAME OR TEAM..."
            className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-6 text-[11px] font-black uppercase italic tracking-widest text-white outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
          <select 
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-6 text-[10px] font-black uppercase italic tracking-widest text-white outline-none focus:border-primary/50 appearance-none transition-all cursor-pointer"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="CONFIRMED">CONFIRMED (READY)</option>
            <option value="REJECTED">REJECTED / EXPELLED</option>
          </select>
        </div>
        <button 
          onClick={assignLobbies}
          disabled={!!isUpdating}
          className="h-14 px-10 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] italic shadow-xl shadow-primary/10 hover:translate-y-[-2px] active:translate-y-[2px] transition-all disabled:opacity-50"
        >
          {isUpdating === "AUTO" ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Assign Lobbies"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
            { label: "Total Participants", value: registrations.length, icon: Users },
            { label: "Confirmed Teams", value: registrations.filter(r => r.status === "VERIFIED" || r.status === "CONFIRMED").length, icon: ShieldCheck },
            { label: "Pending Approval", value: registrations.filter(r => r.status === "PENDING_APPROVAL").length, icon: LayoutGrid },
            { label: "Lobby Slots Filled", value: registrations.filter(r => r.lobby).length, icon: MapPin }
        ].map((s, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-3">
                <s.icon className="size-4 text-primary" />
                <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-white italic">{s.value}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-zinc-900/10 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Participant Details</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Status</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Lobby</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
              {loading ? (
                  <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
                      </td>
                  </tr>
              ) : filteredRegistrations.length > 0 ? filteredRegistrations.map((r) => (
                <tr key={r.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-primary/30 transition-colors">
                        {(r.team?.image || r.user?.image) ? (
                            <img src={r.team?.image || r.user?.image} alt="" className="size-full object-cover" />
                        ) : (
                            <Trophy className="size-5 text-zinc-700" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black italic tracking-tight text-white uppercase group-hover:text-primary transition-colors">
                            {r.team?.name || r.user?.name || "UNNAMED"}
                        </p>
                        {r.team && r.user && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[8px] font-black bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded uppercase tracking-widest">Leader</span>
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight italic">{r.user?.name}</span>
                            </div>
                        )}
                        {!r.team && (
                             <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest italic">Solo Participant</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <Badge className={cn(
                         "text-[9px] font-black italic uppercase tracking-widest py-1 px-3",
                         r.status === "VERIFIED" || r.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                         r.status === "REJECTED" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                         "bg-amber-500/10 text-amber-500 border-amber-500/20"
                     )}>
                         {r.status?.replace("_", " ")}
                     </Badge>
                  </td>
                  <td className="px-8 py-6">
                     {r.lobby ? (
                         <div className="flex items-center gap-2">
                             <div className="size-6 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-[10px] font-black text-primary italic">
                                 {r.lobby}
                             </div>
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Slot {r.slot}</span>
                         </div>
                     ) : (
                         <span className="text-[10px] font-bold text-zinc-800 italic uppercase">Awaiting Assignment</span>
                     )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {r.status === "PENDING_APPROVAL" && (
                           <>
                               <button onClick={() => updateStatus(r.id, "VERIFIED")} disabled={!!isUpdating} className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                                   <CheckCircle2 className="size-4" />
                               </button>
                               <button onClick={() => updateStatus(r.id, "REJECTED")} disabled={!!isUpdating} className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                   <XCircle className="size-4" />
                               </button>
                           </>
                       )}
                       <button className="p-2 bg-white/5 border border-white/5 text-zinc-500 rounded-lg hover:bg-white/10 hover:text-white transition-all">
                           <MoreVertical className="size-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={4} className="px-8 py-20 text-center space-y-3">
                          <LayoutGrid className="size-10 text-zinc-800 mx-auto" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">No registrations found for this tournament</p>
                      </td>
                  </tr>
              )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Minimal Framer Motion replacement if not available or just keep basic
function AnimatePresence({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
