"use client"

import React, { useState, useEffect } from "react";
import { 
  X, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  ShieldCheck,
  Target,
  Trophy,
  Activity,
  CreditCard,
  ChevronRight,
  ShieldAlert,
  Wallet,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// External SDK Types (Mocking for TS if not fully typed)
declare var Razorpay: any;
declare var Cashfree: any;

interface PlayerData {
  uid: string; // Used for FF/BGMI numeric or Valorant RiotID
  nickname: string;
  level?: number;
  guild?: string;
  verified: boolean;
  loading: boolean;
  error: string;
}

interface UnifiedRegistrationModalProps {
  tournament: any; // Full tournament object
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UnifiedRegistrationModal({ 
  tournament, 
  isOpen, 
  onClose,
  onSuccess 
}: UnifiedRegistrationModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: Players, 2: Payment, 3: Success
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isApiEnabled, setIsApiEnabled] = useState(true);

  const game = tournament.game || "Free Fire";
  const mode = tournament.mode || "BR";
  const isPaid = tournament.entryType === "PAID";
  const entryFee = tournament.entryFee || 0;

  // Roster logic and Settings fetch
  useEffect(() => {
    setMounted(true);
    
    if (isOpen) {
      // Fetch global verification setting — NO CACHE
      fetch("/api/public/settings", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          if (data.freefireApiEnabled !== undefined && data.freefireApiEnabled !== null) {
            setIsApiEnabled(data.freefireApiEnabled);
          }
        })
        .catch(() => setIsApiEnabled(true));

      let count = 1;
      const teamFormat = (tournament.teamFormat || "SQUAD").toUpperCase();
      
      if (teamFormat === "SOLO") {
          count = 1;
      } else if (teamFormat === "DUO") {
          count = 2;
      } else if (teamFormat === "SQUAD" || teamFormat === "5V5" || mode.includes("SQUAD") || mode.includes("BR") || mode.includes("5v5")) {
          count = game === "Valorant" ? 5 : 4;
          if (tournament.allowSubstitutes) count += (game === "Valorant" ? 2 : 1);
      }
      
      setPlayers(Array(count).fill(null).map(() => ({ 
        uid: "", nickname: "", verified: false, loading: false, error: "" 
      })));
      setStep(1);
    }
  }, [isOpen, mode, game, tournament.allowSubstitutes]);

  const handleInputChange = (index: number, value: string) => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], uid: value, verified: false, error: "" };
      return updated;
    });

    // Auto-verify logic for FF/BGMI if numeric
    if (game !== "Valorant" && value.length >= 8 && /^\d+$/.test(value)) {
        verifyPlayer(index, value);
    } else if (game === "Valorant" && value.includes("#")) {
        // Mock verify for Valorant Riot ID
        setTimeout(() => {
            setPlayers(prev => {
                const updated = [...prev];
                if (updated[index].uid === value) {
                    updated[index].verified = true;
                    updated[index].nickname = value.split("#")[0];
                }
                return updated;
            });
        }, 800);
    }
  };

  const verifyPlayer = async (index: number, uid: string) => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], loading: true };
      return updated;
    });

    // If API is disabled, bypass and mark as verified immediately
    if (!isApiEnabled) {
        setPlayers(prev => {
            if (prev[index].uid !== uid) return prev;
            const updated = [...prev];
            updated[index] = { 
                ...updated[index], 
                verified: true, 
                loading: false 
            };
            return updated;
        });
        return;
    }

    try {
      // Use the internal/external API for Free Fire/BGMI info
      const res = await fetch(`/api/freefire/info?uid=${uid.trim()}&region=IND`);
      const data = await res.json();

      if (res.ok) {
        setPlayers(prev => {
          if (prev[index].uid !== uid) return prev;
          const updated = [...prev];
          updated[index] = { ...updated[index], nickname: data.nickname, level: data.level, verified: true, loading: false };
          return updated;
        });
      } else {
        setPlayers(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], error: data.error || "Identity Invalid", loading: false };
          return updated;
        });
      }
    } catch (err) {
      setPlayers(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], loading: false, error: "Link Failure" };
        return updated;
      });
    }
  };

  const validateRoster = () => {
    const required = players.length - (tournament.allowSubstitutes ? (game === "Valorant" ? 2 : 1) : 0);
    const validCount = players.slice(0, required).filter(p => p.verified && p.nickname.trim().length > 0).length;
    return validCount === required;
  };

  const handleProceed = async () => {
    const isSolo = (tournament.teamFormat || "SQUAD").toUpperCase() === "SOLO";
    if (!isSolo && !teamName.trim()) return setFormError("Team Name is required.");
    
    // Auto-sync leaderName from first player's nickname or ID
    const effectiveLeader = players[0]?.nickname || players[0]?.uid;
    if (!isSolo && !effectiveLeader) return setFormError("Team Leader (Slot 01) must be verified.");
    
    if (!validateRoster()) return setFormError("All required players must be verified.");
    
    if (isPaid) {
        setStep(2);
    } else {
        submitRegistration();
    }
  };

  const submitRegistration = async (paymentId?: string) => {
    setIsSubmitting(true);
    setFormError("");

    try {
      const isSolo = (tournament.teamFormat || "SQUAD").toUpperCase() === "SOLO";
      const firstPlayer = players[0]?.nickname || players[0]?.uid;
      const finalTeamName = isSolo ? (firstPlayer || "Solo Entry") : teamName;
      const finalLeaderName = isSolo ? (firstPlayer || "Solo Participant") : firstPlayer;

      const res = await fetch("/api/tournaments/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId: tournament.id,
          teamName: finalTeamName,
          leaderName: finalLeaderName,
          players: players.filter(p => p.verified).map(p => ({ uid: p.uid, nickname: p.nickname })),
          paymentId
        })
      });

      if (res.ok) {
        setStep(3);
        // Reset scroll for success view
        const container = document.querySelector('.modal-container');
        if (container) container.scrollTop = 0;
        setTimeout(() => onSuccess(), 2500);
      } else {
        const data = await res.json();
        setFormError(data.error || "Registry rejection. Contact support.");
      }
    } catch (err) {
      setFormError("Network connection lost. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment Integration Logic
  const initiatePayment = async () => {
    setPaymentLoading(true);
    setFormError("");

    try {
        const isSolo = (tournament.teamFormat || "SQUAD").toUpperCase() === "SOLO";
        const finalTeamName = isSolo ? (players[0]?.nickname || "Solo Entry") : teamName;
        const finalLeaderName = isSolo ? (players[0]?.nickname || "Solo Participant") : leaderName;

        // 1. Pre-Register and Get Gateway config
        const res = await fetch("/api/payments/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                tournamentId: tournament.id, 
                amount: Number(entryFee),
                teamName: finalTeamName,
                leaderName: finalLeaderName,
                players: players.filter(p => p.verified).map(p => ({ uid: p.uid, nickname: p.nickname }))
            })
        });
        const orderData = await res.json();

        if (!res.ok) {
            console.error("PAYMENT API REJECTION:", JSON.stringify(orderData, null, 2));
            throw new Error(orderData.error || "Order creation failed");
        }

        if (orderData.gateway === "RAZORPAY") {
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: "INR",
                name: "Tribex Arena",
                description: `Entry for ${tournament.title}`,
                order_id: orderData.order_id,
                handler: function (response: any) {
                    // Razorpay is still handled via direct confirmation API but we already pre-registered
                    submitRegistration(response.razorpay_payment_id);
                },
                theme: { color: "#dc2626" }
            };
            const rzp = new Razorpay(options);
            rzp.open();
        } else if (orderData.gateway === "CASHFREE") {
            const cashfree = await Cashfree({
                mode: orderData.env === "PROD" ? "production" : "sandbox",
            });
            // Use _modal for popup experience
            await cashfree.checkout({
                paymentSessionId: orderData.payment_session_id,
                redirectTarget: "_modal" 
            });
            
            // For Cashfree Modal, we inform the user to check dashboard after payment completion
            setStep(3); // Show "Submitted" / "Processing" state
            setTimeout(() => {
                onClose();
                router.push("/dashboard");
            }, 3000);
        }
    } catch (err: any) {
        setFormError(err.message || "Transactional error occurred.");
    } finally {
        setPaymentLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative w-full max-w-3xl h-[85vh] bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
      >
          {/* 1. COMPACT BRANDED HEADER */}
          <div className="px-8 py-5 flex items-center justify-between shrink-0 border-b border-white/5 bg-zinc-900/20 backdrop-blur-xl z-20">
              <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-primary rounded-full shadow-[0_0_15px_rgba(255,0,0,0.4)]" />
                  <div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">
                          {step === 1 ? "Tournament Entry" : step === 2 ? "Final Payment" : "Success"}
                      </h2>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Registration System // Secure</p>
                  </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-zinc-400 hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 group"
                aria-label="Close registration modal"
              >
                  <X className="size-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>
          </div>

          {/* 2. DENSE SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-950/20">
              <AnimatePresence mode="wait">
                  {step === 1 && (
                      <motion.div 
                        key="step1" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="p-8 space-y-8"
                      >
                          {/* Premium Info Panel */}
                          <div className="grid grid-cols-2 gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-xl">
                              <div className="space-y-1">
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary italic">Tournament Details</p>
                                  <h4 className="text-base font-black text-white uppercase tracking-tight italic leading-none">{tournament.title}</h4>
                              </div>
                              <div className="text-right space-y-1">
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 italic">Entry Contribution</p>
                                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-md">
                                      <span className="text-[11px] font-black text-primary italic uppercase tracking-tighter">
                                          ₹ {entryFee}
                                      </span>
                                  </div>
                              </div>
                          </div>

                          {/* Team Credentials (Only show for Team Formats like DUO, SQUAD, etc.) */}
                          {(tournament.teamFormat || "SQUAD").toUpperCase() !== "SOLO" && (
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-1 italic">Official Team Name</label>
                                    <input 
                                        type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} 
                                        placeholder="TEAM IDENTITY"
                                        className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-xs font-bold uppercase italic text-white outline-none focus:border-primary focus:bg-primary/[0.01] transition-all placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>
                          )}

                          {/* High-Density Roster Rows */}
                          <div className="space-y-4 pt-2">
                               <div className="flex items-center justify-between px-1">
                                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
                                      {(tournament.teamFormat || "SQUAD").toUpperCase() === "SOLO" ? "Player Information" : (tournament.teamFormat || "SQUAD").toUpperCase() === "DUO" ? "Duo Roster" : "Team Roster"}
                                  </label>
                                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest italic">{players.length} {players.length === 1 ? "Player" : "Participants"} Verified</span>
                              </div>
                              <div className="space-y-2">
                                  {players.map((p, idx) => (
                                      <div key={idx} className={cn(
                                          "flex gap-3 p-4 bg-white/[0.01] border rounded-xl hover:border-primary/20 transition-all group",
                                          idx === 0 && (tournament.teamFormat || "SQUAD").toUpperCase() !== "SOLO" ? "border-primary/20 shadow-lg shadow-primary/5" : "border-white/5"
                                      )}>
                                          <div className="shrink-0 pt-3 flex flex-col items-center gap-1 w-8">
                                              <span className="text-[10px] font-black text-zinc-600 italic">0{idx + 1}</span>
                                              {idx === 0 && (tournament.teamFormat || "SQUAD").toUpperCase() !== "SOLO" && (
                                                   <Crown className="size-3 text-amber-500 animate-pulse" />
                                              )}
                                          </div>
                                          <div className="flex-1 grid grid-cols-2 gap-3">
                                              <div className="space-y-2">
                                                  <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 px-1 italic">
                                                      {idx === 0 && (tournament.teamFormat || "SQUAD").toUpperCase() !== "SOLO" ? "Team Leader Identifier" : "Competitor ID"}
                                                  </label>
                                                  <input 
                                                      type="text" value={p.uid} onChange={(e) => handleInputChange(idx, e.target.value)} 
                                                      placeholder="IDENTIFIER UID"
                                                      className="w-full h-10 bg-black border border-white/10 rounded-lg px-4 text-[11px] font-bold uppercase italic text-white outline-none focus:border-white/30 transition-all placeholder:text-zinc-700 font-mono"
                                                  />
                                              </div>
                                              <div className="space-y-2">
                                                   <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 px-1 italic">Identity Status</label>
                                                   <div className="relative group/field h-10">
                                                      {!isApiEnabled ? (
                                                          <input 
                                                              type="text" value={p.nickname} 
                                                              onChange={(e) => {
                                                                  const val = e.target.value;
                                                                  setPlayers(prev => {
                                                                      const up = [...prev];
                                                                      up[idx] = { ...up[idx], nickname: val };
                                                                      return up;
                                                                  });
                                                              }} 
                                                              placeholder="SIGNATURE..."
                                                              className="w-full h-full bg-black border border-white/10 rounded-lg px-4 text-[11px] font-bold uppercase italic text-primary outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
                                                          />
                                                      ) : p.verified ? (
                                                          <div className="flex-1 h-full bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between px-4">
                                                              <p className="text-[11px] font-black italic uppercase text-primary truncate tracking-tight">{p.nickname}</p>
                                                              <ShieldCheck className="size-3 text-primary" />
                                                          </div>
                                                      ) : (
                                                          <div className="flex-1 h-full bg-zinc-950/50 border border-white/5 rounded-lg flex items-center px-4">
                                                              {p.loading ? <Loader2 className="size-3 animate-spin text-primary" /> : <span className="text-[9px] font-bold text-zinc-600 uppercase italic tracking-widest">Awaiting Verification</span>}
                                                          </div>
                                                      )}
                                                   </div>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </motion.div>
                  )}
                  {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center p-8 space-y-8">
                           <div className="size-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                                <Wallet className="size-6 text-amber-500" />
                           </div>
                           <div className="text-center space-y-2">
                               <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-[0.4em] italic">Checkout Phase</p>
                               <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter italic font-heading">Secure Payout</h3>
                           </div>
                           <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl w-full max-w-sm space-y-8">
                               <div className="flex items-center justify-between">
                                   <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest">Aggregate Cost</span>
                                   <span className="text-2xl font-black text-white italic tracking-tight">₹ {entryFee}.00</span>
                               </div>
                               <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-relaxed">
                                       Finalizing this transaction will authorize your immediate entry into the competitive circuit.
                                   </p>
                               </div>
                           </div>
                      </motion.div>
                  )}

                  {step > 2 && (
                      <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center p-8 space-y-6">
                           <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="size-10 text-emerald-500" />
                           </div>
                            <div className="text-center space-y-1">
                                 <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white font-heading">Confirmed</h3>
                                 <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.4em] italic">Registration Process Completed</p>
                            </div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>

          {step < 3 && (
              <div className="px-8 py-6 border-t border-white/5 bg-zinc-900/50 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
                  <div className="hidden md:block">
                      <div className="flex items-center gap-2 opacity-60">
                          <div className="size-1 bg-zinc-400 rounded-full animate-pulse" />
                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">End-to-End Encryption Mode</p>
                      </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                      {formError && <p className="text-[10px] font-black text-primary uppercase italic tracking-widest pr-4">{formError}</p>}
                      <button 
                        onClick={step === 2 ? initiatePayment : handleProceed} 
                        disabled={isSubmitting || paymentLoading}
                        className="w-full md:w-72 h-12 bg-white text-black rounded-lg font-black uppercase tracking-[0.2em] text-[11px] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-98 italic flex items-center justify-center gap-3 group"
                      >
                          {isSubmitting || paymentLoading ? (
                               <Loader2 className="size-4 animate-spin" />
                          ) : (
                              <>
                                <span>{step === 2 ? "Authorize Payment" : isPaid ? "Proceed to Checkout" : "Confirm Registration"}</span>
                                <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                              </>
                          )}
                      </button>
                  </div>
              </div>
          )}
      </motion.div>
    </div>,
    document.body
  );
}
