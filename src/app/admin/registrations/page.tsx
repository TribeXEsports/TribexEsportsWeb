"use client"

import React, { useEffect, useState } from "react";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Trophy,
  Mail,
  Loader2,
  Check,
  X,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  UserCircle,
  Hash,
  Gamepad2,
  Receipt,
  Fingerprint
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const GAME_ICONS: Record<string, string> = {
  "Valorant": "simple-icons:valorant",
  "Free Fire": "simple-icons:freefire",
  "Apex Legends": "simple-icons:apexlegends",
  "PUBG Mobile": "healthicons:p-mobile",
  "League of Legends": "simple-icons:leagueoflegends",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedTournaments, setExpandedTournaments] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
      
      if (Array.isArray(data) && data.length > 0) {
          const firstId = data[0].tournament?.id;
          if (firstId) setExpandedTournaments({ [firstId]: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setRegistrations(prev => prev.map(reg => {
            if (reg.id === id) {
                let newStatus = status;
                if (status === "approved") newStatus = "VERIFIED";
                if (status === "rejected") newStatus = "REJECTED";
                if (status === "pending") newStatus = "PENDING_APPROVAL";
                return { ...reg, status: newStatus };
            }
            return reg;
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleTournament = (id: string) => {
      setExpandedTournaments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusDisplay = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "VERIFIED" || s === "APPROVED") return { label: "Verified", icon: <ShieldCheck className="size-3.5 text-emerald-500" />, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (s === "REJECTED") return { label: "Rejected", icon: <XCircle className="size-3.5 text-red-500" />, color: "text-red-500", bg: "bg-red-500/10" };
    return { label: s.replace("_", " "), icon: <Clock className="size-3.5 text-amber-500" />, color: "text-amber-500", bg: "bg-amber-500/10" };
  };

  const filteredRegistrations = registrations.filter(reg => {
      const search = searchQuery.toLowerCase();
      return (
          reg.user?.name?.toLowerCase().includes(search) ||
          reg.user?.username?.toLowerCase().includes(search) ||
          reg.team?.name?.toLowerCase().includes(search) ||
          reg.tournament?.title?.toLowerCase().includes(search)
      );
  });

  const grouped = filteredRegistrations.reduce((acc: any, reg: any) => {
    const tId = reg.tournament?.id || "unknown";
    if (!acc[tId]) {
      acc[tId] = {
        id: tId,
        tournament: reg.tournament,
        count: 0,
        pending: 0,
        entries: []
      };
    }
    acc[tId].entries.push(reg);
    acc[tId].count++;
    if (reg.status === 'PENDING_APPROVAL') acc[tId].pending++;
    return acc;
  }, {});

  const tournamentGroups = Object.values(grouped);

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                Admin <span className="text-red-600">Registrations</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Master Tournament Entry Management Suite</p>
        </div>
        <div className="flex gap-4">
             <div className="px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Live Applications</p>
                <p className="text-xl font-black text-white">{registrations.length}</p>
             </div>
             <div className="px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Awaiting Review</p>
                <p className="text-xl font-black text-amber-500">{registrations.filter(r => r.status === 'PENDING_APPROVAL').length}</p>
             </div>
        </div>
      </header>

      {/* Advanced Filter Bar */}
      <div className="relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by username, team, or unique ID..." 
            className="w-full h-16 bg-zinc-900 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium text-white outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-800"
          />
      </div>

      <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
                <div className="flex items-center justify-center p-32">
                    <Loader2 className="size-10 text-red-600 animate-spin" />
                </div>
            ) : tournamentGroups.length === 0 ? (
                <div className="p-32 text-center bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
                    <Trophy className="size-12 text-zinc-800 mx-auto mb-6 opacity-30" />
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">No matching entries found.</p>
                </div>
            ) : tournamentGroups.map((group: any) => (
                <div key={group.id} className="space-y-4">
                    <button 
                        onClick={() => toggleTournament(group.id)}
                        className={cn(
                            "w-full flex items-center justify-between p-6 rounded-3xl border transition-all",
                            expandedTournaments[group.id] 
                                ? "bg-zinc-950 border-red-600/20 shadow-2xl shadow-red-600/5" 
                                : "bg-zinc-900 border-white/5 hover:border-white/10"
                        )}
                    >
                        <div className="flex items-center gap-6 text-left">
                            <div className="size-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0">
                                <Icon icon={GAME_ICONS[group.tournament?.game] || "solar:gamepad-bold"} className="size-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase text-white tracking-tight">{group.tournament?.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{group.tournament?.game} • {group.count} ENTRIES</span>
                                    {group.pending > 0 && (
                                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] font-bold h-4">
                                            {group.pending} PENDING
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        {expandedTournaments[group.id] ? <ChevronDown className="size-5 text-zinc-600" /> : <ChevronRight className="size-5 text-zinc-600" />}
                    </button>

                    <AnimatePresence>
                        {expandedTournaments[group.id] && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 gap-6 ml-4 md:ml-8"
                            >
                                {group.entries.map((reg: any) => {
                                    const statusObj = getStatusDisplay(reg.status);
                                    const displayName = reg.team?.name || reg.user?.name || "Unknown Entry";
                                    const userTag = reg.user?.username || "anonymous";
                                    
                                    // Parse roster if it exists
                                    const roster = Array.isArray(reg.rosterData) ? reg.rosterData : [];

                                    return (
                                        <div key={reg.id} className="bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/10 transition-colors">
                                            <div className="p-8 flex flex-col lg:flex-row gap-10">
                                                {/* Section 1: Identity */}
                                                <div className="flex gap-6 min-w-[280px]">
                                                    <div className="size-16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0 flex items-center justify-center">
                                                        {reg.user?.image ? (
                                                            <img src={reg.user.image} className="size-full object-cover" />
                                                        ) : (
                                                            <UserCircle className="size-8 text-zinc-800" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-base font-black text-white">{displayName}</h4>
                                                            <Badge className="bg-red-600/10 text-red-500 border-red-600/20 text-[8px] font-bold h-4">
                                                                {reg.team ? "TEAM" : "SOLO"}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[11px]">
                                                            <Fingerprint className="size-3.5 text-red-600" /> @{userTag}
                                                        </div>
                                                        <div className="text-[10px] text-zinc-600 flex items-center gap-2 mt-2">
                                                            <Mail className="size-3" /> {reg.user?.email || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section 2: Game Roster Details */}
                                                <div className="flex-1 space-y-4">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 flex items-center gap-2">
                                                        <Users className="size-3" /> Official Game Roster
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {roster.map((p: any, idx: number) => (
                                                            <div key={idx} className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                                                                <div className="min-w-0">
                                                                    <p className="text-[10px] font-black text-white truncate">{p.nickname || "N/A"}</p>
                                                                    <p className="text-[8px] font-bold text-zinc-600 truncate mt-0.5">UID: {p.uid || "N/A"}</p>
                                                                </div>
                                                                {idx === 0 && <span className="text-[7px] font-black bg-red-600/20 text-red-500 px-1.5 py-0.5 rounded-sm uppercase">Leader</span>}
                                                            </div>
                                                        ))}
                                                        {roster.length === 0 && (
                                                            <p className="text-[10px] text-zinc-700 italic">No roster data provided.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Section 3: Status & Payment Metadata */}
                                                <div className="lg:w-[220px] flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-10">
                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Verification Status</span>
                                                            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black uppercase text-[10px] tracking-tight", statusObj.bg, statusObj.color, "border-white/5")}>
                                                                {statusObj.icon}
                                                                {statusObj.label}
                                                            </div>
                                                        </div>
                                                        {reg.transactionId && (
                                                            <div className="space-y-1">
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700 inline-flex items-center gap-1.5"><Receipt className="size-3" /> Tx Reference</span>
                                                                <p className="text-[10px] font-black text-white break-all">{reg.transactionId}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {reg.status === "PENDING_APPROVAL" ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(reg.id, "approved")}
                                                                    disabled={updatingId === reg.id}
                                                                    className="flex-1 h-11 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-xl font-black uppercase text-[10px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl"
                                                                >
                                                                    {updatingId === reg.id ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                                                    Verify
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(reg.id, "rejected")}
                                                                    disabled={updatingId === reg.id}
                                                                    className="size-11 bg-zinc-900 border border-white/5 text-zinc-600 hover:text-red-500 hover:border-red-500/30 rounded-xl transition-all flex items-center justify-center"
                                                                >
                                                                    <X className="size-5" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleUpdateStatus(reg.id, "pending")}
                                                                disabled={updatingId === reg.id}
                                                                className="w-full h-11 bg-zinc-900/50 border border-white/5 text-zinc-700 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <RotateCcw className="size-4" /> Reset Application
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer: Registration Meta */}
                                            <div className="bg-zinc-900/10 border-t border-white/5 px-8 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <span className="text-[9px] font-bold text-zinc-700 flex items-center gap-1.5"><Clock className="size-3" /> Submitted: {new Date(reg.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[9px] font-bold text-zinc-700 flex items-center gap-1.5 text-zinc-800"><Hash className="size-3" /> {reg.id}</span>
                                                </div>
                                                <Badge variant="outline" className="text-[7px] border-white/5 text-zinc-700 font-bold">REGISTRY-X20</Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
          </AnimatePresence>
      </div>
    </div>
  );
}
