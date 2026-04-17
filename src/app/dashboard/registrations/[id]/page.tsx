import React from "react";
import { prisma } from "@/lib/prisma";
/* @ts-ignore */
const db = prisma as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
    Gamepad2, 
    Users, 
    Trophy, 
    Timer, 
    Hash, 
    Copy, 
    ShieldCheck, 
    ArrowLeft,
    CheckCircle2,
    Calendar,
    Target,
    Zap,
    ExternalLink,
    Info,
    Mail
} from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

async function getRegistrationData(id: string, userId: string) {
    const registration = await db.registration.findUnique({
        where: { id },
        include: {
            tournament: true,
            team: true,
            user: true
        }
    });

    if (!registration) return null;

    // Security: Only allow the registrant or the captain to see the lobby hub
    const isOwner = registration.userId === userId || registration.team?.captainId === userId;
    if (!isOwner) return null;

    // Fetch Match & Room for this specific lobby
    const match = await db.match.findFirst({
        where: { 
            tournamentId: registration.tournamentId,
            stage: { contains: registration.lobby || "LOBBY_PENDING" }
        },
        include: { room: true }
    });

    return { ...registration, match };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LobbyHubPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const userId = (session.user as any).id;
    let reg = await getRegistrationData(id, userId);

    if (!reg) redirect("/dashboard/briefings");
    
    // --- ABSOLUTE FORCE-HEALING ---
    // If the lobby or slot is missing or says PENDING, fix it IMMEDIATELY.
    if (!reg.lobby || !reg.slot || reg.lobby.includes("PENDING")) {
        const { assignNextAvailableSlot } = await import("@/lib/tournament-logic");
        await assignNextAvailableSlot(prisma, reg.tournamentId, reg.id);
        
        // Wait 300ms for DB cache/sync and re-fetch definitively
        await new Promise(res => setTimeout(res, 300));
        reg = await getRegistrationData(id, userId) as any;
    }
    // ----------------------------

    const t = reg.tournament;
    const roster = Array.isArray(reg.rosterData) ? reg.rosterData : [];
    const match = (reg as any).match;
    const room = match?.room;

    // Check if room details are revealed yet
    const isRevealed = room?.revealTime ? new Date(room.revealTime) <= new Date() : true;

    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* 1. NAVIGATION & STATUS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <Link 
                        href="/dashboard/briefings" 
                        className="inline-flex items-center gap-2.5 text-zinc-500 hover:text-white transition-all group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-600/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-widest px-4 py-1.5 flex items-center gap-2">
                            <CheckCircle2 className="size-3" />
                            Confirmed Entry
                        </Badge>
                        <Badge className="bg-white/5 text-zinc-500 border-none text-[9px] font-black uppercase tracking-widest px-4 py-1.5">
                            ID: {reg.id.slice(-8)}
                        </Badge>
                    </div>
                </div>

                {/* 2. MAIN BRIEFING HEADER */}
                <section className="relative p-8 md:p-16 bg-zinc-950 border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                         <Icon icon={GAME_ICONS[t.game] || "solar:gamepad-bold"} className="size-48 md:size-64 text-white" />
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div className="space-y-6 md:space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-zinc-600">
                                    <Gamepad2 className="size-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.game} // {t.type}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter italic outfit-font leading-none">
                                    {t.title}
                                </h1>
                            </div>
                            
                            <div className="flex flex-wrap gap-6">
                                <div className="space-y-1.5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Start Time</p>
                                    <p className="text-lg font-black text-white italic uppercase">{new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="w-px h-10 bg-white/5 mx-2 hidden md:block" />
                                <div className="space-y-1.5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Match Map</p>
                                    <p className="text-lg font-black text-red-600 italic uppercase">{t.mode || "Bermuda"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lobby Access Module */}
                        <div className="p-6 md:p-8 bg-zinc-900/50 border border-white/10 rounded-2xl md:rounded-3xl space-y-6 md:space-y-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Access Status</p>
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter">Lobby Details Open</h3>
                                </div>
                                <ShieldCheck className="size-8 md:size-10 text-emerald-500 opacity-20" />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between px-2">
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Lobby Group</p>
                                        </div>
                                        <div className={cn(
                                            "h-14 border rounded-xl flex items-center px-6 text-lg font-black italic tracking-widest transition-all shadow-inner",
                                            reg.lobby === "FINAL" ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-zinc-950/50 border-white/5 text-primary"
                                        )}>
                                            {reg.lobby === "FINAL" ? "🏆 GRAND FINAL" : `LOBBY ${reg.lobby || "PENDING"}`}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between px-2">
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Assigned Slot</p>
                                        </div>
                                        <div className="h-14 bg-black border border-white/10 rounded-xl flex items-center px-6 text-lg font-black italic text-white shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                            {reg.slot ? `SLOT ${reg.slot}` : "PENDING"}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Room ID</p>
                                        <CopyButton text={room?.roomId && isRevealed ? room.roomId : ""} />
                                    </div>
                                    <div className="h-14 bg-black border border-white/5 rounded-xl flex items-center px-6 text-lg md:text-xl font-black italic tracking-widest text-white shadow-inner">
                                        {room?.roomId && isRevealed ? room.roomId : "WAITING FOR ROOM ID..."}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Room Password</p>
                                        <CopyButton text={room?.roomPassword && isRevealed ? room.roomPassword : ""} />
                                    </div>
                                    <div className="h-14 bg-black border border-white/5 rounded-xl flex items-center px-6 text-sm font-black italic tracking-[0.4em] text-zinc-400">
                                        {room?.roomPassword && isRevealed ? room.roomPassword : (reg.lobby ? "********" : "SECURED")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. ROSTER & INTEL GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Official Roster */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4">
                             <Users className="size-4 text-red-600" />
                             <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Confirmed Roster</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {roster.map((player: any, idx: number) => (
                                 <div key={idx} className="p-5 md:p-6 bg-zinc-900/30 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-zinc-900/50 transition-all">
                                     <div className="flex items-center gap-4">
                                         <div className="size-10 rounded-lg bg-black border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-700 italic">
                                             0{idx + 1}
                                         </div>
                                         <div className="min-w-0">
                                             <p className="text-sm font-black text-white truncate uppercase">{player.nickname || "PLAYER"}</p>
                                             <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">ID: {player.uid || "N/A"}</p>
                                         </div>
                                     </div>
                                     {idx === 0 && (
                                         <Badge className="bg-red-600 text-white border-none text-[7px] font-black tracking-widest h-5">LEADER</Badge>
                                     )}
                                 </div>
                             ))}
                        </div>
                    </div>

                    {/* Arena Instructions */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                             <Info className="size-4 text-zinc-600" />
                             <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">Match Instructions</h2>
                        </div>
                        <div className="p-8 bg-zinc-900 border border-white/5 rounded-[2rem] space-y-6">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                     <span className="text-[10px] font-black text-red-600 shrink-0">1.</span>
                                     <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-wide">
                                         Joining the lobby at least 10 minutes prior to start time is mandatory.
                                     </p>
                                </div>
                                <div className="flex gap-4">
                                     <span className="text-[10px] font-black text-red-600 shrink-0">2.</span>
                                     <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-wide">
                                         Your in-game ID must match the registered UID for verification.
                                     </p>
                                </div>
                                <div className="flex gap-4">
                                     <span className="text-[10px] font-black text-red-600 shrink-0">3.</span>
                                     <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-wide">
                                         Unsportsmanlike conduct or third-party tools will lead to disqualification.
                                     </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

const GAME_ICONS: Record<string, string> = {
    "Valorant": "simple-icons:valorant",
    "Free Fire": "simple-icons:freefire",
    "Apex Legends": "simple-icons:apexlegends",
    "PUBG Mobile": "healthicons:p-mobile",
    "League of Legends": "simple-icons:leagueoflegends",
};

const Icon = ({ icon, className }: { icon: string, className?: string }) => (
    <span className={cn("iconify", className)} data-icon={icon} />
);
