"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
    Clock, 
    Shield, 
    Trophy, 
    Zap,
    History,
    Calendar,
    Gamepad2,
    LayoutGrid
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TournamentCard } from './TournamentCard'

interface BriefingsContentProps {
    registrations: any[]
}

export function BriefingsContent({ registrations }: BriefingsContentProps) {
    const active = registrations.filter(r => 
        r.status === 'CONFIRMED' || 
        r.status === 'PENDING' || 
        r.status === 'PENDING_APPROVAL' || 
        r.status === 'VERIFIED'
    )
    const completed = registrations.filter(r => r.status === 'COMPLETED')

    return (
        <div className="space-y-12 pb-32 lg:pb-0">
            {/* Match Registrations Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        Active <span className="text-red-600">Registrations</span>
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Your current match and tournament participation status</p>
                </div>
            </header>

            {/* Registration Lists */}
            <div className="space-y-16">
                 {/* Current Section */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Gamepad2 className="size-4 text-red-600" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-red-600/30">Upcoming Matches</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {active.map((reg) => (
                            <div key={reg.id} className="relative group">
                                <TournamentCard 
                                    tournament={reg.tournament} 
                                    isScrim={reg.tournament?.type === 'SCRIM'} 
                                    registration={reg}
                                />
                                {/* Status Indicator Badge Overlay */}
                                <div className="absolute top-4 right-4 md:top-8 md:right-8">
                                    <div className={cn(
                                        "px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10 shadow-2xl",
                                        reg.status === 'CONFIRMED' ? "bg-green-600/10 text-green-500 border-green-600/20" : "bg-amber-600/10 text-amber-500 border-amber-600/20"
                                    )}>
                                        {reg.status}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {active.length === 0 && (
                            <div className="p-24 text-center border border-dashed border-white/5 rounded-[3rem] bg-zinc-900/10">
                                <Shield className="size-12 text-zinc-900 mx-auto mb-6 opacity-30" />
                                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xs mx-auto leading-loose">
                                    No active entries detected for upcoming matches.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* History/Archived Section (Brief) */}
                {completed.length > 0 && (
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <History className="size-4 text-zinc-700" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600">Completed Matches</h2>
                        </div>
                        <div className="grid grid-cols-1 opacity-60 hover:opacity-100 transition-opacity gap-6">
                             {completed.map((reg) => (
                                <TournamentCard key={reg.id} tournament={reg.tournament} isScrim={reg.tournament?.type === 'SCRIM'} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
