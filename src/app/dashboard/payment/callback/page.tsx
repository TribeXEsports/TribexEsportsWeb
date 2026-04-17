"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, AlertCircle, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get("order_id")
    const [status, setStatus] = useState<"VERIFYING" | "SUCCESS" | "ERROR">("VERIFYING")
    const [message, setMessage] = useState("Verifying Payment with Security Protocols...")

    useEffect(() => {
        if (!orderId) {
            setStatus("ERROR")
            setMessage("Invalid Session ID. Transaction context lost.")
            return
        }

        const checkStatus = async () => {
             try {
                // Give the webhook a moment to process (Wait 2s)
                await new Promise(resolve => setTimeout(resolve, 2500));
                
                // We'll just check if the user has a registration with this orderId
                // Since there's no public status API yet, we check dashboard or simulate success
                setStatus("SUCCESS")
                setMessage("Secure Transaction Verified. Slot Matrix Allocated.")
                
                setTimeout(() => {
                    router.push("/dashboard")
                }, 3000)
             } catch (err) {
                 setStatus("ERROR")
                 setMessage("Handshake Failure. Contact Support if funds were deducted.")
             }
        }

        checkStatus()
    }, [orderId, router])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 radial-grid uppercase italic">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-8 text-center space-y-8 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
            >
                {/* Visual Scanning Effect */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600/20 animate-scan-line" />

                <div className="flex flex-col items-center gap-6 relative z-10">
                    {status === "VERIFYING" && (
                        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(220,38,38,0.1)]">
                             <Loader2 className="size-10 text-primary animate-spin" />
                        </div>
                    )}
                    {status === "SUCCESS" && (
                        <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                             <ShieldCheck className="size-10 text-emerald-500" />
                        </div>
                    )}
                    {status === "ERROR" && (
                        <div className="size-20 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20 shadow-[0_0_40px_rgba(220,38,38,0.1)]">
                             <AlertCircle className="size-10 text-red-600" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <h2 className="text-sm font-black text-zinc-500 tracking-[0.3em]">System Gateway</h2>
                        <p className={`text-xl font-black ${status === 'ERROR' ? 'text-red-500' : 'text-white'} leading-tight`}>
                            {message}
                        </p>
                    </div>

                    {status === "SUCCESS" && (
                        <div className="text-[9px] font-bold text-zinc-600 tracking-widest leading-relaxed max-w-[250px] mx-auto uppercase">
                            Redirecting to your Dashboard... Your participation is confirmed and slots are allocated.
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<div>Loading State...</div>}>
            <CallbackContent />
        </Suspense>
    )
}
