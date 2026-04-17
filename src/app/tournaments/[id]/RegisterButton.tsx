"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Zap, 
  Loader2, 
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Plus,
  Lock,
  Unlock,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UnifiedRegistrationModal from "@/components/tournaments/UnifiedRegistrationModal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RegisterButtonProps {
  tournament: any;
  userRegistration?: any;
}

export default function RegisterButton({ tournament, userRegistration }: RegisterButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasRegistered = !!userRegistration;
  const isPaid = tournament.entryType === "PAID";
  const isFull = (tournament._count?.registrations || 0) >= tournament.maxPlayers;
  const isClosed = new Date(tournament.startTime) < new Date();

  const handleRegisterClick = () => {
    if (!session) return router.push("/login");
    if (hasRegistered) return router.push(`/dashboard/registrations/${userRegistration.id}`);
    if (isFull || isClosed) return;
    setShowModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Modern Status Readout */}
        <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Entry Fee</p>
                    <p className={cn(
                        "text-lg font-black italic tracking-tighter uppercase",
                        isPaid ? "text-amber-500" : "text-emerald-500"
                    )}>
                        {isPaid ? `₹${tournament.entryFee}` : "Free Entry"}
                    </p>
                </div>
                <div className="text-right space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Status</p>
                    <p className={cn(
                        "text-lg font-black italic tracking-tighter uppercase",
                        isFull ? "text-red-500" : isClosed ? "text-zinc-600" : "text-emerald-500"
                    )}>
                        {isFull ? "Full" : isClosed ? "Closed" : "Open"}
                    </p>
                </div>
            </div>
        </div>

        <button 
          onClick={handleRegisterClick}
          disabled={isLoading || (!hasRegistered && (isFull || isClosed))}
          className={cn(
            "group relative w-full h-14 rounded-xl font-black uppercase tracking-[0.2em] text-[12px] transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-3 outfit-font italic",
            hasRegistered
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                : (isFull || isClosed)
                    ? "bg-zinc-900 px-8 text-zinc-600 border border-white/5 cursor-not-allowed" 
                    : "bg-primary px-8 text-white shadow-lg shadow-primary/10 hover:brightness-110 border-none"
          )}
        >
          {hasRegistered ? <ShieldCheck className="size-4" /> : isFull ? <Lock className="size-4" /> : isClosed ? <ShieldAlert className="size-4" /> : <Zap className="size-4" />}
          <span>{hasRegistered ? "View Lobby Hub" : isFull ? "Tournament Full" : isClosed ? "Lobby Closed" : "Join Tournament"}</span>
          {(hasRegistered || (!isFull && !isClosed)) && <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />}
        </button>
      </div>

      <UnifiedRegistrationModal 
        tournament={tournament}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          router.push("/dashboard");
        }}
      />
    </>
  );
}
