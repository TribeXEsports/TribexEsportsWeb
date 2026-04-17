"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Trophy, 
  Calendar, 
  Users, 
  Gamepad2, 
  Layers,
  Layout,
  Loader2,
  CheckCircle2,
  Zap,
  ShieldCheck,
  User as UserIcon,
  Clock,
  Info,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Target,
  Sword,
  Swords,
  Timer,
  Globe,
  Settings2,
  Map as MapIcon,
  Dna,
  ZapIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomDateTimePicker } from "@/components/ui/CustomDateTimePicker";
import { CldUploadWidget } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/providers/SettingsProvider";
import { 
  GAME_TYPES, 
  MAPS, 
  POINTS_PRESETS, 
  getMapRotation, 
  calculateBracketLobbies,
  getGameTerms,
  getLobbyCapacity
} from "@/lib/tournament-logic";

const GAMES = [
  { id: "FF", label: "Free Fire", icon: "simple-icons:freefire", lucide: Zap },
  { id: "BGMI", label: "BGMI", icon: "simple-icons:pubg", lucide: ShieldCheck },
  { id: "VALORANT", label: "Valorant", icon: "simple-icons:valorant", lucide: Target },
];

const GAME_MODES: Record<string, any[]> = {
  "FF": [
    { id: "BR", label: "Battle Royale", lucide: Globe },
    { id: "CS", label: "Clash Squad (4v4)", lucide: Swords },
  ],
  "BGMI": [
    { id: "BR", label: "Battle Royale", lucide: Globe },
    { id: "TDM", label: "TDM / Arena", lucide: Swords },
  ],
  "VALORANT": [
    { id: "5v5", label: "Tactical (5v5)", lucide: Target },
  ]
};

const TEAM_FORMATS: Record<string, any[]> = {
  "BR": [
    { id: "SOLO", label: "Solo", lucide: UserIcon },
    { id: "DUO", label: "Duo", lucide: Users },
    { id: "SQUAD", label: "Squad", lucide: Users },
  ],
  "CS": [{ id: "SQUAD", label: "Squad (4v4)", lucide: Users }],
  "5v5": [{ id: "SQUAD", label: "Full Team (5v5)", lucide: Users }],
};

export default function CreatorWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    title: "",
    type: "TOURNAMENT",
    game: "FF",
    mode: "BR",
    teamFormat: "SQUAD",
    maxPlayers: "48",
    entryType: "FREE",
    entryFee: "0",
    startTime: new Date(Date.now() + 86400000).toISOString(),
    registrationEndTime: new Date(Date.now() + 43200000).toISOString(),
    description: "",
    imageUrl: "",
    prizePool: "",
    allowSubstitutes: false,
    rules: "",
   
    bracketType: "SINGLE_ELIM",
    mapPool: [] as string[],
    pointsPreset: "FFWS",
    vetoSystem: false,
    wildcardEnabled: false,
    agentBansEnabled: false,
    autoMapRotation: true,
    matchesCount: 3,
    autoVerify: true
  });

  // Calculate bracket metrics on the fly
  const lobbySize = getLobbyCapacity(formData.game, formData.teamFormat);
  const gameTerms = getGameTerms(formData.game, formData.teamFormat);

  const bracketMetrics = calculateBracketLobbies(
    formData.game, 
    parseInt(formData.maxPlayers) || lobbySize, 
    lobbySize
  );

  useEffect(() => {
    // Reset defaults when game changes
    if (formData.game === "VALORANT") {
      setFormData(prev => ({ ...prev, mode: "5v5", teamFormat: "SQUAD", pointsPreset: "STANDARD", bracketType: "SINGLE_ELIM" }));
    } else {
      setFormData(prev => ({ ...prev, mode: "BR", pointsPreset: formData.game === "FF" ? "FFWS" : "BGIS" }));
    }
  }, [formData.game]);

  useEffect(() => {
    if (formData.autoMapRotation && (formData.game === "FF" || formData.game === "BGMI")) {
      setFormData(prev => ({ ...prev, mapPool: getMapRotation(formData.game, formData.matchesCount) }));
    }
  }, [formData.autoMapRotation, formData.matchesCount, formData.game]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const gameLabel = GAMES.find(g => g.id === formData.game)?.label || formData.game;
      const response = await fetch("/api/admin/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          game: gameLabel,
          gameType: formData.game // Ensure gameType is sent as the shortcode
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push("/admin/tournaments"), 2000);
      } else {
        const data = await response.json();
        setError(data.details || data.error || "Creation failed.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle2 className="size-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase text-white">Event Created</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Redirecting to tournament list...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            Create <span className="text-red-600">New Event</span>
          </h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={cn("h-1 w-8 rounded-full transition-all", step >= s ? "bg-red-600" : "bg-white/5")} />
            ))}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Step {step} of 5</span>
          <p className="text-white text-[11px] font-bold uppercase tracking-widest">
            {step === 1 && "Basic Info"}
            {step === 2 && "Format & Slots"}
            {step === 3 && "Game Settings"}
            {step === 4 && "Schedule & Fee"}
            {step === 5 && "Review & Create"}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Banner Upload */}
                <div className="shrink-0">
                  <CldUploadWidget 
                    uploadPreset={settings?.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"} 
                    options={{ 
                      cloudName: settings?.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
                    }}
                    onSuccess={(r: any) => r.info?.secure_url && setFormData({...formData, imageUrl: r.info.secure_url})}
                  >
                    {({ open }) => (
                      <button 
                        type="button"
                        onClick={() => open()} 
                        className="w-full md:w-48 h-64 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900 group hover:border-red-600/30 transition-all"
                      >
                        {formData.imageUrl ? (
                          <img src={formData.imageUrl} className="absolute inset-0 size-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="text-center p-4">
                            <Layout className="size-8 text-zinc-700 mx-auto mb-2" />
                            <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Select<br/>Banner</span>
                          </div>
                        )}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>

                {/* Basic Fields */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <label className="hud-label">Event Name</label>
                    <input 
                      type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="E.G. TRIBEX PRO SERIES"
                      className="w-full h-14 bg-zinc-900 border border-white/10 rounded-xl px-6 text-sm font-bold text-white outline-none focus:border-red-600 transition-all uppercase"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="hud-label">Platform</label>
                      <CustomSelect value={formData.game} options={GAMES} onChange={v => setFormData({...formData, game: v})} />
                    </div>
                    <div className="space-y-2">
                      <label className="hud-label">Category</label>
                      <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5 h-12">
                        {["TOURNAMENT", "SCRIM"].map(t => (
                          <button
                            key={t} type="button" onClick={() => setFormData({...formData, type: t})}
                            className={cn("flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", formData.type === t ? "bg-red-600 text-white" : "text-zinc-600")}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="hud-label">Quick Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Short catchphrase for the tournament..."
                      className="w-full h-20 bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-zinc-400 outline-none focus:border-red-600 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button type="button" onClick={nextStep} disabled={!formData.title} className="w-full h-14 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">
              NEXT STEP <ChevronRight className="size-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="hud-label">Game Mode</label>
                  <CustomSelect value={formData.mode} options={GAME_MODES[formData.game] || []} onChange={v => setFormData({...formData, mode: v})} />
                </div>
                <div className="space-y-2">
                  <label className="hud-label">Team Format</label>
                  <CustomSelect value={formData.teamFormat} options={TEAM_FORMATS[formData.mode] || TEAM_FORMATS.BR} onChange={v => setFormData({...formData, teamFormat: v})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="hud-label">Total {gameTerms.unit}s {formData.teamFormat === "SOLO" ? "(Players)" : "(Teams)"}</label>
                  <input 
                    type="number" value={formData.maxPlayers} onChange={e => setFormData({...formData, maxPlayers: e.target.value})}
                    className="w-full h-14 bg-zinc-900 border border-white/10 rounded-xl px-6 text-sm font-bold text-white outline-none"
                  />
                </div>
                <div className="bg-red-600/5 border border-red-600/20 rounded-xl p-4 flex items-center gap-4">
                  <div className="size-10 bg-red-600/10 rounded-lg flex items-center justify-center">
                    <Layers className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Lobby Distribution</p>
                    <p className="text-white text-[11px] font-bold">{bracketMetrics.lobbies} {bracketMetrics.lobbies > 1 ? "Lobbies" : "Lobby"} Required</p>
                  </div>
                </div>
              </div>

              {/* Registration Flow Safety */}
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={cn("size-5", formData.autoVerify ? "text-emerald-500" : "text-amber-500")} />
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-tight">Registration Flow</h4>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        {formData.autoVerify ? "Instant Slotting Enabled" : "Manual Verification Mode"}
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-black p-1 rounded-xl border border-white/10 h-10 w-48">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, autoVerify: true })}
                      className={cn("flex-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", formData.autoVerify ? "bg-emerald-600 text-white" : "text-zinc-600")}
                    >
                      AUTO
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, autoVerify: false })}
                      className={cn("flex-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", !formData.autoVerify ? "bg-amber-600 text-white" : "text-zinc-600")}
                    >
                      MANUAL
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-600 font-medium italic">
                  {formData.autoVerify 
                    ? "Users are automatically verified and assigned a slot upon registration." 
                    : "Registrations stay in 'Pending' status. Organizers must manually verify before a slot is assigned."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="w-24 h-14 border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/5 transition-all">
                <ChevronLeft className="size-5" />
              </button>
              <button onClick={nextStep} className="flex-1 h-14 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                NEXT STEP <ChevronRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Map Selection */}
              <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <label className="hud-label">Map Rotation</label>
                  <button onClick={() => setFormData(p => ({...p, autoMapRotation: !p.autoMapRotation}))} className={cn("text-[9px] font-black uppercase px-3 py-1 rounded-full border transition-all", formData.autoMapRotation ? "bg-red-600/10 border-red-600/30 text-red-600" : "bg-white/5 border-white/10 text-zinc-500")}>
                    {formData.autoMapRotation ? "Auto-Enabled" : "Manual"}
                  </button>
                </div>
                
                {formData.autoMapRotation ? (
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="text-[10px] font-bold text-zinc-500">Matches Count:</label>
                        <input 
                          type="number" min="1" max="6" 
                          value={formData.matchesCount || ""} 
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            setFormData({...formData, matchesCount: isNaN(val) ? 0 : val});
                          }} 
                          className="w-16 bg-zinc-900 border border-white/10 rounded-lg text-center text-sm font-bold py-1"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.mapPool.map((m, i) => (
                          <div key={i} className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-bold text-white flex items-center gap-2">
                            <span className="text-red-500 text-[8px]">{i+1}</span> {m}
                          </div>
                        ))}
                      </div>
                   </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {MAPS[formData.game as keyof typeof MAPS]?.map(m => (
                      <button key={m} onClick={() => {
                        const isAdding = !formData.mapPool.includes(m);
                        const isBR = formData.game === "FF" || formData.game === "BGMI";
                        
                        if (isAdding && isBR && formData.mapPool.length >= 6) return;
                        
                        const newPool = !isAdding 
                          ? formData.mapPool.filter(x => x !== m) 
                          : [...formData.mapPool, m];
                        
                        setFormData({...formData, mapPool: newPool});
                      }} className={cn("text-left px-4 py-2 rounded-xl border text-[10px] font-bold transition-all relative overflow-hidden", formData.mapPool.includes(m) ? "bg-red-600 border-red-600 text-white" : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20")}>
                        {m}
                        {formData.mapPool.indexOf(m) !== -1 && (
                          <div className="absolute top-1 right-1 size-3 bg-white/20 rounded-full flex items-center justify-center text-[7px] font-black">
                            {formData.mapPool.indexOf(m) + 1}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Game Specific Logic */}
              <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-6">
                <label className="hud-label">Point System & Rules</label>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Competitive Preset</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(POINTS_PRESETS[formData.game as keyof typeof POINTS_PRESETS] || {}).map(p => (
                        <button key={p} onClick={() => setFormData({...formData, pointsPreset: p})} className={cn("py-3 rounded-lg border text-[10px] font-black uppercase transition-all", formData.pointsPreset === p ? "bg-white text-black" : "bg-zinc-900 border-white/5 text-zinc-500")}>
                          {p} Style
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.game === "VALORANT" && (
                    <div className="pt-4 space-y-3">
                      <button onClick={() => setFormData(p => ({...p, vetoSystem: !p.vetoSystem}))} className={cn("w-full h-12 rounded-xl border flex items-center justify-between px-4 text-[10px] font-black uppercase transition-all", formData.vetoSystem ? "bg-red-600/10 border-red-600/30 text-red-600" : "bg-zinc-900 border-white/10 text-zinc-500")}>
                        Map Veto System {formData.vetoSystem && <CheckCircle2 className="size-4" />}
                      </button>
                      <button onClick={() => setFormData(p => ({...p, agentBansEnabled: !p.agentBansEnabled}))} className={cn("w-full h-12 rounded-xl border flex items-center justify-between px-4 text-[10px] font-black uppercase transition-all", formData.agentBansEnabled ? "bg-red-600/10 border-red-600/30 text-red-600" : "bg-zinc-900 border-white/10 text-zinc-500")}>
                        Agent Bans {formData.agentBansEnabled && <CheckCircle2 className="size-4" />}
                      </button>
                    </div>
                  )}

                  {formData.game === "BGMI" && (
                    <button onClick={() => setFormData(p => ({...p, wildcardEnabled: !p.wildcardEnabled}))} className={cn("w-full h-12 rounded-xl border flex items-center justify-between px-4 text-[10px] font-black uppercase transition-all", formData.wildcardEnabled ? "bg-red-600/10 border-red-600/30 text-red-600" : "bg-zinc-900 border-white/10 text-zinc-500")}>
                      Enable Wildcard Slots {formData.wildcardEnabled && <CheckCircle2 className="size-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="w-24 h-14 border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/5 transition-all">
                <ChevronLeft className="size-5" />
              </button>
              <button onClick={nextStep} className="flex-1 h-14 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                NEXT STEP <ChevronRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                 <CustomDateTimePicker label="Starts At" value={formData.startTime} onChange={v => setFormData({...formData, startTime: v})} />
                 <CustomDateTimePicker label="Registration Ends" value={formData.registrationEndTime} onChange={v => setFormData({...formData, registrationEndTime: v})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="hud-label">Entry Type</label>
                  <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5 h-12">
                     {["FREE", "PAID"].map(t => (
                       <button key={t} type="button" onClick={() => setFormData({...formData, entryType: t})} className={cn("flex-1 rounded-lg text-[9px] font-black uppercase transition-all", formData.entryType === t ? "bg-white text-black" : "text-zinc-600")}>{t}</button>
                     ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="hud-label">Entry Fee (INR)</label>
                  <input 
                    type="number" 
                    disabled={formData.entryType === "FREE"}
                    value={formData.entryFee} 
                    onChange={e => setFormData({...formData, entryFee: e.target.value})} 
                    className={cn(
                      "w-full h-12 bg-zinc-900 border border-white/10 rounded-xl px-4 text-sm font-bold outline-none transition-all",
                      formData.entryType === "FREE" ? "opacity-30 cursor-not-allowed" : "text-red-500 focus:border-red-600"
                    )} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="hud-label">Prize Pool (INR)</label>
                  <input 
                    type="number" 
                    value={formData.prizePool} 
                    onChange={e => setFormData({...formData, prizePool: e.target.value})} 
                    placeholder="0"
                    className="w-full h-12 bg-zinc-900 border border-white/10 rounded-xl px-4 text-sm font-bold text-amber-500 outline-none focus:border-amber-600 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="hud-label">Full Rules & Match Info</label>
                 <textarea value={formData.rules} onChange={e => setFormData({...formData, rules: e.target.value})} className="w-full h-32 bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm font-medium text-white outline-none focus:border-red-600 transition-all resize-none" placeholder="LIST RULES..."/>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="w-24 h-14 border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/5 transition-all">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={nextStep} className="flex-1 h-14 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                NEXT STEP <ChevronRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="flex items-start gap-8">
                <div className="w-48 h-64 border border-white/10 rounded-2xl relative overflow-hidden bg-zinc-900 shrink-0">
                  {formData.imageUrl ? <img src={formData.imageUrl} className="absolute inset-0 size-full object-cover" /> : <div className="size-full flex items-center justify-center text-zinc-800 font-black text-[10px] uppercase">No Banner</div>}
                </div>

                <div className="flex-1 space-y-6">
                   <div>
                     <h3 className="text-2xl font-black text-white uppercase">{formData.title}</h3>
                     <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{formData.game} // {formData.mode} // {formData.type}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="hud-label">Format</p>
                        <p className="text-white text-xs font-bold">{formData.teamFormat}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="hud-label">Bracket</p>
                        <p className="text-white text-xs font-bold">{bracketMetrics.lobbies} {bracketMetrics.lobbies > 1 ? "Lobbies" : "Lobby"}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="hud-label">Maps</p>
                        <p className="text-white text-[10px] font-bold">{formData.mapPool.join(", ")}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <p className="hud-label">Preset</p>
                        <p className="text-white text-xs font-bold">{formData.pointsPreset} STYLE</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

            <div className="flex gap-4">
              <button type="button" onClick={prevStep} className="w-24 h-14 border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/5 transition-all">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={handleSubmit} disabled={isLoading} className="flex-1 h-14 bg-red-600 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin size-4" /> : <>CREATE TOURNAMENT <ZapIcon className="size-4 fill-white" /></>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
