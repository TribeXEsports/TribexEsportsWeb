"use client"

import React, { useEffect, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { motion } from 'framer-motion'
import { GraduationCap, Users, RefreshCw, Shield, Zap } from 'lucide-react'

interface CampusAmbassador {
  id: string
  name: string
  university: string
  imageUrl?: string
}

export default function AmbassadorsPage() {
    const [ambassadors, setAmbassadors] = useState<CampusAmbassador[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch("/api/public/ambassadors")
            .then((r) => r.json())
            .then((data) => setAmbassadors(Array.isArray(data) ? data : []))
            .catch(() => setAmbassadors([]))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <>
            <PageHeader 
                badge="Ambassadors"
                title="Campus Ambassadors"
                subtitle="The student leaders bridging the gap between academia and professional esports."
            />

            <section className="py-24 px-6 min-h-[60vh]">
                <div className="container mx-auto max-w-7xl">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="size-10 text-zinc-800 animate-spin" />
                        </div>
                    ) : ambassadors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                            <Users className="size-16 text-zinc-800" />
                            <p className="text-zinc-500 text-[12px] font-bold uppercase tracking-widest">
                                No campus ambassadors registered yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {ambassadors.map((ambassador, idx) => (
                                <motion.div
                                    key={ambassador.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-[#080808] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_50px_-12px_rgba(220,38,38,0.15)] hover:-translate-y-1"
                                >
                                    {/* Ambassador Image / Portrait */}
                                    <div className="relative h-64 overflow-hidden bg-zinc-950">
                                        {ambassador.imageUrl ? (
                                            <>
                                                <img
                                                    src={ambassador.imageUrl}
                                                    alt={ambassador.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-transparent to-transparent z-10" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="size-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-zinc-700">
                                                    {ambassador.name[0]}
                                                </div>
                                            </div>
                                        )}
                                        {/* Colored corner glow */}
                                        <div className="absolute -top-10 -right-10 size-40 bg-primary/20 blur-[80px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
                                        
                                        {/* Floating Badge */}
                                        <div className="absolute bottom-4 left-5 flex items-center gap-2 z-20">
                                            <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                                                <Shield className="size-2.5" /> AMBASSADOR
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ambassador Info */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-tight">
                                                {ambassador.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors mt-2">
                                                <GraduationCap className="size-3.5 shrink-0 text-primary" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">
                                                    {ambassador.university}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Card Detail */}
                                    <div className="h-1 w-full bg-white/5 group-hover:bg-primary transition-colors duration-500" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
