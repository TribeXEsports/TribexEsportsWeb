"use client"

import React, { useState, useEffect } from "react";
import { Activity, Users, Trophy, Trash2, Zap, RefreshCw, ChevronRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StressTestPage() {
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [userCount, setUserCount] = useState(100);
    const [simulateSlotting, setSimulateSlotting] = useState(false);
    const [targetTournament, setTargetTournament] = useState("");
    const [cleanupConfirm, setCleanupConfirm] = useState(false);

    useEffect(() => {
        fetch("/api/admin/tournaments")
            .then(r => r.json())
            .then(data => setTournaments(data))
            .finally(() => setIsLoading(false));
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
    };

    const runAction = async (action: string, data: any = {}) => {
        setIsRunning(true);
        addLog(`Initiating ${action} for ${data.count || userCount} units...`);
        setProgress(10);

        try {
            const res = await fetch("/api/admin/stress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, simulateSlotting, ...data })
            });
            const result = await res.json();
            
            if (res.ok) {
                addLog(`Success: ${action} complete. Created: ${result.count}. ${result.slotted ? `Slotted: ${result.slotted}` : ""}`);
                setProgress(100);
            } else {
                addLog(`Error: ${result.error}`);
                setProgress(0);
            }
        } catch (e: any) {
            addLog(`Error: ${e.message}`);
            setProgress(0);
        } finally {
            setIsRunning(false);
            setTimeout(() => setProgress(0), 3000);
        }
    };

    const purgeData = async () => {
        if (!cleanupConfirm) {
            setCleanupConfirm(true);
            return;
        }

        setIsRunning(true);
        addLog("NUCLEAR PURGE INITIATED...");
        setProgress(30);

        try {
            const res = await fetch("/api/admin/stress", { method: "DELETE" });
            const result = await res.json();
            
            if (res.ok) {
                addLog(`WIPE COMPLETE: Deleted ${result.results.users || 0} users, ${result.results.registrations || 0} registrations.`);
                setProgress(100);
            } else {
                addLog(`Purge Error: ${result.error}`);
            }
        } catch (e: any) {
            addLog(`Purge Error: ${e.message}`);
        } finally {
            setIsRunning(false);
            setCleanupConfirm(false);
            setTimeout(() => setProgress(0), 3000);
        }
    };

    if (isLoading) return <div className="p-12 text-zinc-500 animate-pulse">Loading Environment...</div>;

    return (
        <div className="space-y-10 pb-24 font-sans max-w-6xl">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                    <Activity className="size-8 text-primary" />
                    Stress Test <span className="text-primary">Hub</span>
                </h2>
                <div className="flex items-center gap-2">
                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
                        Simulate high-concurrency event load. 
                    </p>
                    {userCount > 5000 && (
                        <span className="text-red-500 text-[9px] font-black uppercase px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md animate-pulse">
                            Heavy Load Warning
                        </span>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Controls */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Action Card 1: User Generation */}
                    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-6 overflow-hidden relative group">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                                <Users className="size-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white">Bulk User Spawning</h3>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Generate huge player databases.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-1">Participant Count</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={userCount} 
                                    onChange={(e) => setUserCount(parseInt(e.target.value) || 0)}
                                    className="w-full h-14 bg-black border border-white/10 rounded-2xl px-6 text-xl font-black text-white focus:border-blue-500 transition-all outline-none"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 font-black text-[10px] uppercase">Players</div>
                            </div>
                        </div>

                        <button 
                            onClick={() => runAction("GENERATE_USERS", { count: userCount })}
                            disabled={isRunning || userCount <= 0}
                            className="w-full h-14 bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                        >
                            {isRunning ? <RefreshCw className="size-4 animate-spin" /> : <Zap className="size-4" />}
                            Execute Spawning Sequence
                        </button>
                    </div>

                    {/* Action Card 2: Tournament Siege */}
                    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-6 overflow-hidden relative group">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
                                <Trophy className="size-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white">Tournament Siege</h3>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Flood registrants into an active event.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-1">Target Event</label>
                                <select 
                                    value={targetTournament}
                                    onChange={(e) => setTargetTournament(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl px-5 h-12 text-xs font-bold text-white uppercase tracking-widest focus:border-emerald-500/50 outline-none transition-all"
                                >
                                    <option value="">CHOOSE TOURNAMENT</option>
                                    {tournaments.map(t => (
                                        <option key={t.id} value={t.id}>{t.title} ({t.teamFormat})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className={cn("size-5", simulateSlotting ? "text-emerald-500" : "text-zinc-600")} />
                                    <div>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-tight">Bracket Slotting</h4>
                                        <p className="text-[8px] font-bold text-zinc-600 uppercase">Auto-assign lobby slots</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSimulateSlotting(!simulateSlotting)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all",
                                        simulateSlotting ? "bg-emerald-600 text-white" : "bg-white/5 text-zinc-700"
                                    )}
                                >
                                    {simulateSlotting ? "ENABLED" : "DISABLED"}
                                </button>
                            </div>
                            {userCount > 200 && simulateSlotting && (
                                <p className="text-[9px] text-amber-500 font-bold italic px-2">
                                    Note: Slotting is limited to the first 200 entries at this scale for stability.
                                </p>
                            )}
                        </div>

                        <button 
                            onClick={() => runAction("REGISTER_TOURNAMENT", { count: userCount, tournamentId: targetTournament })}
                            disabled={isRunning || !targetTournament || userCount <= 0}
                            className="w-full h-14 bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                        >
                             <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                            Launch High-Volume Ingress
                        </button>
                    </div>
                </div>

                {/* Status & Logs */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Console */}
                    <div className="bg-black border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[524px]">
                        <div className="p-4 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Execution Console</span>
                            <div className="flex gap-1">
                                <div className="size-2 rounded-full bg-red-500/20" />
                                <div className="size-2 rounded-full bg-yellow-500/20" />
                                <div className="size-2 rounded-full bg-green-500/20" />
                            </div>
                        </div>
                        <div className="flex-1 p-6 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-2">
                            {logs.length === 0 ? (
                                <p className="text-zinc-700 italic">Waiting for command input...</p>
                            ) : (
                                logs.map((log, i) => (
                                    <p key={i} className={cn(
                                        "leading-relaxed",
                                        log.includes("Error") && "text-red-400",
                                        log.includes("Success") && "text-emerald-400",
                                        log.includes("WIPE") && "text-yellow-400 font-bold"
                                    )}>
                                        {log}
                                    </p>
                                ))
                            )}
                        </div>
                        {progress > 0 && (
                            <div className="h-1 bg-zinc-800 relative">
                                <div 
                                    className="absolute inset-y-0 left-0 bg-primary transition-all duration-500" 
                                    style={{ width: `${progress}%` }} 
                                />
                            </div>
                        )}
                    </div>

                    {/* Cleanup Section */}
                    <div className="bg-red-600/5 border border-red-600/20 rounded-3xl p-8 space-y-4">
                        <div className="flex items-center gap-3 text-red-400 mb-2">
                            <AlertTriangle className="size-5" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest">Infrastructure Cleanup</h4>
                        </div>
                        <p className="text-[10px] font-medium text-zinc-500 uppercase leading-relaxed tracking-wider">
                            Instantly purge all <span className="text-red-400">STRESS_TEST_</span> and <span className="text-red-400">SIM_</span> prefixed records from the database.
                        </p>
                        <button 
                            onClick={purgeData}
                            disabled={isRunning}
                            className={cn(
                                "w-full h-14 font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all flex items-center justify-center gap-2",
                                cleanupConfirm 
                                    ? "bg-red-600 text-white animate-pulse" 
                                    : "bg-white/5 text-red-500 hover:bg-red-600 hover:text-white"
                            )}
                        >
                            {cleanupConfirm ? <ShieldCheck className="size-5" /> : <Trash2 className="size-4" />}
                            {cleanupConfirm ? "CONFIRM NUCLEAR PURGE" : "Wipe Test Data"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
