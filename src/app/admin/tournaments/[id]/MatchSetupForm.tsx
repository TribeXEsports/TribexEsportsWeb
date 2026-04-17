"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Loader2, 
  Gamepad2, 
  Lock, 
  Map as MapIcon, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Monitor,
  Layout,
  Globe,
  Users
} from "lucide-react";
import { CustomDateTimePicker } from "@/components/ui/CustomDateTimePicker";
import { cn } from "@/lib/utils";
import { getLobbyCapacity, getGameTerms } from "@/lib/tournament-logic";

interface MatchSetupFormProps {
  tournamentId: string;
  game: string;
  maxPlayers: number;
  mode: string;
  teamFormat: string;
}

export default function MatchSetupForm({ tournamentId, game, maxPlayers, mode, teamFormat }: MatchSetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showRoom, setShowRoom] = useState(true);

  // Context-Aware Lobby Calculation
  const lobbyCapacity = getLobbyCapacity(game, teamFormat);
  const gameTerms = getGameTerms(game, teamFormat);
  const numLobbies = Math.max(1, Math.ceil(maxPlayers / lobbyCapacity));
  const LOBBY_OPTIONS = Array.from({ length: numLobbies }, (_, i) => String.fromCharCode(65 + i)).concat("FINAL");

  const [formData, setFormData] = useState({
    stage: "Qualifiers",
    targetLobby: LOBBY_OPTIONS[0], 
    matchType: "BR", 
    roomId: "",
    roomPassword: "",
    map: "BERMUDA",
    revealTime: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId,
          stage: formData.stage,
          lobby: formData.targetLobby,
          roomData: showRoom ? {
            roomId: formData.roomId,
            roomPassword: formData.roomPassword,
            map: formData.map,
            revealTime: formData.revealTime
          } : null
        })
      });
      
      if (res.ok) {
        setFormData({ ...formData, roomId: "", roomPassword: "" });
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const MAP_OPTIONS = game === "Valorant" 
    ? ["ASCENT", "BIND", "HAVEN", "ICEBOX", "BREEZE", "FRACTURE", "LOTUS"]
    : ["BERMUDA", "PURGATORY", "KALAHARI", "ALPINE", "NEXTERRA", "ERANGEL", "MIRAMAR", "SANHOK", "VIKENDI"];



  return (
    <div className="space-y-8">
        <header className="flex items-center justify-between px-2">
            <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-white italic">Match Setup</h3>
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase text-zinc-600">Region //</span>
                <span className="text-[9px] font-bold uppercase text-emerald-500 italic">Global</span>
            </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950/40 p-8 rounded-[2.5rem] border border-white/5">
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-2 italic">Match Stage</label>
                <div className="relative group">
                    <Monitor className="absolute left-6 top-1/2 -translate-y-1/2 size-3.5 text-zinc-800" />
                    <input 
                        type="text" required value={formData.stage}
                        onChange={e => setFormData({...formData, stage: e.target.value})}
                        placeholder="E.G. QUALIFIERS / SEMIS"
                        className="w-full h-14 bg-black border border-white/5 rounded-2xl pl-16 pr-6 text-xs font-black uppercase italic tracking-widest text-white outline-none focus:border-primary/40 transition-all placeholder:text-zinc-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Target Lobby</label>
                        <span className="text-[8px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                            {lobbyCapacity} {gameTerms.unit}s / Lobby
                        </span>
                    </div>
                    <select 
                        value={formData.targetLobby}
                        onChange={e => setFormData({...formData, targetLobby: e.target.value})}
                        className="w-full h-14 bg-black border border-white/5 rounded-2xl px-6 text-xs font-black uppercase italic tracking-widest text-white outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                    >
                        {LOBBY_OPTIONS.map(l => <option key={l} value={l}>Lobby {l}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-2 italic">Game Map</label>
                    <select 
                        value={formData.map}
                        onChange={e => setFormData({...formData, map: e.target.value})}
                        className="w-full h-14 bg-black border border-white/5 rounded-2xl px-6 text-xs font-black uppercase italic tracking-widest text-white outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                    >
                        {MAP_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-primary/5 border border-primary/10 rounded-3xl mt-2">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-2">Room ID</label>
                    <div className="relative group">
                        <Gamepad2 className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-zinc-800" />
                        <input 
                            type="text" required value={formData.roomId}
                            onChange={e => setFormData({...formData, roomId: e.target.value})}
                            placeholder="ROOM ID"
                            className="w-full h-12 bg-zinc-950 border border-white/5 rounded-xl pl-16 pr-6 text-sm font-black italic text-primary outline-none focus:border-primary/50 transition-all placeholder:text-zinc-900"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-2">Room Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-zinc-800" />
                        <input 
                            type="text" required value={formData.roomPassword}
                            onChange={e => setFormData({...formData, roomPassword: e.target.value})}
                            placeholder="PASSWORD"
                            className="w-full h-12 bg-zinc-950 border border-white/5 rounded-xl pl-16 pr-6 text-sm font-black italic text-white outline-none focus:border-primary/50 transition-all placeholder:text-zinc-900"
                        />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <CustomDateTimePicker 
                        label="Auto-Unlock Time" 
                        value={formData.revealTime} 
                        onChange={v => setFormData({...formData, revealTime: v})}
                        icon={Clock}
                    />
                </div>
            </div>

            <div className="md:col-span-2 pt-6">
                <button 
                type="submit" disabled={isLoading}
                className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 group italic"
                >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <>Create Room <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" /></>}
                </button>
            </div>
        </form>
    </div>
  );
}
