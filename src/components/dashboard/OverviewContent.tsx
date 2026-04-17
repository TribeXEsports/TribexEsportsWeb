"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
    Trophy, 
    Target, 
    Zap, 
    Activity, 
    Shield, 
    TrendingUp,
    ChevronRight,
    ArrowUpRight,
    Gamepad2,
    History,
    Newspaper
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TournamentCard } from './TournamentCard'
import Link from 'next/link'

interface OverviewContentProps {
    user: any
    registrations: any[]
    matches: any[]
    news: any[]
}

export function OverviewContent({ user, registrations, matches, news }: OverviewContentProps) {
    const stats = [
        { label: 'Victories', value: matches.filter(m => m.winnerUserId === user.id || m.winnerTeam?.captainId === user.id).length, icon: Trophy },
        { label: 'Entries', value: registrations.length, icon: Target },
        { label: 'Total Matches', value: matches.length, icon: History },
    ]

    const priorityTournament = registrations[0]?.tournament

    return (
        <div className="space-y-12 pb-32 lg:pb-0">
             {/* Simple Professional Header */}
             <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        Welcome, <span className="text-red-600">{user.name?.split(' ')[0]}</span>
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Quick access to your tournaments and news</p>
                </div>
                
                {/* User Identity (Simplified) */}
                <div className="flex items-center gap-4 px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                     <div className="size-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden shrink-0">
                        <img 
                            src={user.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} 
                            className="size-full object-cover grayscale" 
                            alt="User Avatar" 
                        />
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{user.name}</div>
                        <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Player Profile</div>
                     </div>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <div 
                        key={i}
                        className="p-8 bg-zinc-950 border border-white/5 rounded-3xl hover:bg-zinc-900/50 transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <s.icon className="size-20" />
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</div>
                            <div className="text-4xl font-black text-white italic">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Boards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Primary Activity List */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-4 pb-4">
                        <Shield className="size-4 text-red-600" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-red-600/30">Upcoming Matches</h2>
                    </div>

                    {priorityTournament ? (
                        <div className="space-y-4">
                             <TournamentCard 
                                tournament={priorityTournament} 
                                registration={registrations[0]}
                                isScrim={priorityTournament.type === 'SCRIM'} 
                             />
                             <Link href="/dashboard/arena" className="block p-8 border border-dashed border-white/10 rounded-3xl group hover:border-red-600/30 transition-all text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-red-500 transition-colors flex items-center justify-center gap-3">
                                    <Zap className="size-4" /> Browse More Tournaments <ChevronRight className="size-4" />
                                </span>
                             </Link>
                        </div>
                    ) : (
                        <div className="p-20 text-center bg-zinc-900/10 border border-dashed border-white/5 rounded-[2.5rem] space-y-6 shadow-inner">
                             <Gamepad2 className="size-12 text-zinc-900 mx-auto opacity-30" />
                             <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xs mx-auto leading-loose">
                                You haven't joined any tournaments yet.
                             </p>
                             <Link href="/dashboard/arena" className="inline-flex h-12 px-10 items-center justify-center bg-red-600 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all">
                                BROWSE TOURNAMENTS
                             </Link>
                        </div>
                    )}
                </div>

                {/* News & Updates Feed (Realistic) */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="flex items-center gap-4 pb-4">
                        <Newspaper className="size-4 text-red-600" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-red-600/30">Latest News</h2>
                    </div>

                    <div className="space-y-4">
                         {news.length > 0 ? news.map((item) => (
                             <div key={item.id} className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-zinc-900 transition-colors group cursor-pointer">
                                 <div className="flex items-start gap-4">
                                     <div className="size-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 shrink-0 group-hover:bg-red-600/10 transition-colors">
                                         <Zap className="size-3 text-zinc-800 group-hover:text-red-600 transition-colors" />
                                     </div>
                                     <div className="space-y-1 overflow-hidden">
                                         <p className="text-[13px] font-bold uppercase text-white tracking-tight leading-tight truncate">{item.title}</p>
                                         <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-1">{item.category} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                             </div>
                         )) : (
                             <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl">
                                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">No recent updates</p>
                             </div>
                         )}
                    </div>
                </aside>
            </div>
        </div>
    )
}
