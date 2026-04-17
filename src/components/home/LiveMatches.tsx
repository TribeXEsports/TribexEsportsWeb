// File: src/components/home/LiveMatches.tsx
"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Radio, Users, Trophy, ChevronRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; badgeCls: string; glowCls: string; dotCls: string }> = {
  LIVE:      { label: 'Live Now',  badgeCls: 'bg-red-500/20 border-red-500/40 text-red-400',   glowCls: 'shadow-red-500/30',    dotCls: 'bg-red-500' },
  REGISTRATION: { label: 'Registering', badgeCls: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', glowCls: 'shadow-emerald-500/20', dotCls: 'bg-emerald-500' },
  UPCOMING:  { label: 'Upcoming',  badgeCls: 'bg-blue-500/20 border-blue-500/40 text-blue-300', glowCls: 'shadow-blue-500/20',   dotCls: 'bg-blue-400' },
  COMPLETED: { label: 'Completed', badgeCls: 'bg-zinc-600/20 border-zinc-600/40 text-zinc-400', glowCls: 'shadow-zinc-600/10',   dotCls: 'bg-zinc-500' },
}

const GAME_GRADIENTS: Record<string, string> = {
  'FREE FIRE': 'from-orange-600/50 via-yellow-500/20 to-transparent',
  'BGMI':      'from-blue-600/50 via-cyan-500/20 to-transparent',
  'COD':       'from-green-600/50 via-emerald-500/20 to-transparent',
  'VALORANT':  'from-rose-600/50 via-pink-500/20 to-transparent',
  'DEFAULT':   'from-red-600/50 via-rose-500/20 to-transparent',
}

export function LiveMatches({ tournaments = [] }: { tournaments?: any[] }) {
    if (!tournaments || tournaments.length === 0) return null;

    return (
        <section id="matches" className="py-24 px-6 bg-black relative z-10 border-t border-white/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />

            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase text-white">
                            Live Tournaments
                        </h2>
                    </div>
                    <Link
                        href="/tournaments"
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors flex items-center gap-2"
                        aria-label="View all scheduled and live tournaments"
                    >
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6">
                    {tournaments.map((match, index) => {
                        const statusKey = (match.status || 'UPCOMING').toUpperCase() as keyof typeof STATUS_CONFIG;
                        const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.UPCOMING;
                        const gameKey = (match.game || '').toUpperCase();
                        const gameGradient = GAME_GRADIENTS[gameKey] ?? GAME_GRADIENTS.DEFAULT;

                        return (
                            <motion.div
                                key={match.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className={cn(
                                    "group relative flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden",
                                    "border border-white/8 hover:border-white/20 transition-all duration-500",
                                    "hover:shadow-[0_0_60px_-10px] hover:-translate-y-1",
                                    status.glowCls,
                                    "bg-[#0d0d0d]"
                                )}
                            >
                                {/* ── COLOR ACCENT BAR (left edge) ── */}
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                                    statusKey === 'LIVE'         && "bg-gradient-to-b from-red-500 via-orange-500 to-red-600",
                                    statusKey === 'REGISTRATION' && "bg-gradient-to-b from-emerald-500 via-teal-400 to-emerald-600",
                                    statusKey === 'UPCOMING'     && "bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-600",
                                    statusKey === 'COMPLETED'    && "bg-gradient-to-b from-zinc-500 to-zinc-700",
                                )} />

                                {/* ── BG GLOW BLOB ── */}
                                <div className={cn(
                                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                                    `bg-gradient-to-r ${gameGradient}`
                                )} />

                                {/* ── IMAGE PANEL ── */}
                                <div className="relative w-full md:w-72 h-56 md:h-auto shrink-0 overflow-hidden">
                                    <Image
                                        src={match.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070'}
                                        alt={match.game || 'Tournament'}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 288px"
                                    />
                                    {/* Image overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]/80" />
                                    {/* Game label badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/15 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-white">
                                            {match.game}
                                        </span>
                                    </div>
                                </div>

                                {/* ── CONTENT PANEL ── */}
                                <div className="flex-1 pl-6 pr-8 py-7 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="space-y-4">
                                        {/* Status + registrations row */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className={cn(
                                                "flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-wider border rounded-full",
                                                status.badgeCls
                                            )}>
                                                <span className={cn("size-1.5 rounded-full", status.dotCls, statusKey === 'LIVE' && "animate-pulse")} />
                                                {status.label}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-black uppercase tracking-wider">
                                                <Users className="w-3 h-3" />
                                                {match._count?.registrations || 0} Registered
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white group-hover:text-white/90 transition-colors leading-tight">
                                            {match.title}
                                        </h3>

                                        {/* Meta tags */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/8">
                                                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                                                <span className="text-[10px] font-bold text-zinc-200 uppercase tracking-wider">{match.mode}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/8">
                                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                                                    {new Date(match.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="shrink-0 flex flex-col items-center gap-3">
                                        <Link
                                            href={`/tournaments/${match.id}`}
                                            className={cn(
                                                "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl",
                                                "font-black text-[10px] uppercase tracking-widest transition-all duration-300",
                                                "bg-white text-black hover:bg-primary hover:text-white",
                                                "shadow-lg hover:shadow-primary/30 group-hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]",
                                                "active:scale-[0.97]"
                                            )}
                                        >
                                            Join Action <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        <p className="text-center text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                                            {match.entryFee > 0 ? `Fee: ₹${match.entryFee}` : 'Free Entry'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
