"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
    Users, 
    MapPin, 
    Trophy, 
    Zap,
    Clock,
    ChevronRight,
    Sword,
    ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

import Link from 'next/link'
import Image from 'next/image'

interface TournamentCardProps {
    tournament: any
    isScrim?: boolean
    registration?: any
}

export function TournamentCard({ tournament, isScrim, registration }: TournamentCardProps) {
    const [mounted, setMounted] = React.useState(false)
    
    const lobby = registration?.lobby
    const slot = registration?.slot
    const hasRegistration = !!registration
    
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const totalSlots = tournament.maxPlayers || 100
    const filledSlots = tournament._count?.registrations || 0
    const progress = (filledSlots / totalSlots) * 100
    
    // Default values for server-side rendering
    const isClosed = mounted ? new Date(tournament.startTime) < new Date() : false
    const isFull = filledSlots >= totalSlots
    
    const timeString = mounted 
        ? new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "--:--"

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="group relative bg-[#080808] border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-zinc-900/40 transition-all shadow-xl overflow-hidden"
            initial={false}
        >
            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Game Info Thumb */}
                <div className="relative size-24 md:size-32 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                    <Image 
                        src={tournament.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} 
                        alt={`${tournament.game} - ${tournament.title} Cover Image`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100" 
                        sizes="128px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600 px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest text-white">
                        {tournament.game}
                    </div>
                </div>

                {/* Main Intel */}
                <div className="flex-1 space-y-6 w-full text-center md:text-left">
                    <header className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Badge className="bg-white/5 text-zinc-400 border-none text-[8px] font-black tracking-widest uppercase py-1">
                                {tournament.teamFormat} // {isScrim ? 'SCRIM' : 'TOURNAMENT'}
                            </Badge>
                            {hasRegistration && (
                                <Badge className="bg-emerald-600/10 text-emerald-500 border-none text-[8px] font-black tracking-widest uppercase py-1 flex items-center gap-1.5">
                                    <ShieldCheck className="size-3" /> REGISTERED
                                </Badge>
                            )}
                            {isClosed && (
                                <Badge className="bg-zinc-800 text-zinc-600 border-none text-[8px] font-black tracking-widest uppercase py-1">
                                    EVENT_ENDED
                                </Badge>
                            )}
                            {isFull && !isClosed && !hasRegistration && (
                                <Badge className="bg-red-600/10 text-red-500 border-none text-[8px] font-black tracking-widest uppercase py-1 animate-pulse">
                                    MAX_CAPACITY
                                </Badge>
                            )}
                        </div>
                        <h3 className={cn(
                            "text-xl md:text-2xl font-black uppercase tracking-tighter transition-colors",
                            hasRegistration ? "text-emerald-500" : "text-white group-hover:text-red-600"
                        )}>
                            {tournament.title}
                        </h3>
                    </header>

                    {/* Stats Horizontal Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 md:py-0">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Prize Pool</p>
                            <p className="text-sm font-black text-white italic">₹{tournament.prizePool || 0}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Entry Fee</p>
                            <p className={cn("text-sm font-black italic", hasRegistration ? "text-emerald-500" : "text-red-600")}>
                                {hasRegistration ? "VERIFIED" : tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{lobby ? 'Assigned Lobby' : 'Match Map'}</p>
                            <p className="text-sm font-black text-white uppercase truncate">{lobby || tournament.mode || 'Battle Royale'}</p>
                        </div>
                        <div className="space-y-1 text-right md:text-left">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{slot ? 'Your Slot' : 'Scheduled'}</p>
                            {slot ? (
                                <p className="text-sm font-black text-red-600 uppercase">Slot {slot}</p>
                            ) : (
                                <p suppressHydrationWarning className="text-sm font-black text-white uppercase">{timeString}</p>
                            )}
                        </div>
                    </div>

                    {/* Slot Capacity Tracker (Simplified) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <Users className="size-3 text-zinc-600" />
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Confirmed: {filledSlots}/{totalSlots}</span>
                            </div>
                            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">{Math.round(progress)}% Capacity</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                style={{ width: `${progress}%` }}
                                className={cn("h-full transition-all duration-1000", hasRegistration ? "bg-emerald-600" : "bg-red-600")}
                            />
                        </div>
                    </div>
                </div>

                {/* Primary Action */}
                <div className="pt-6 md:pt-0 w-full md:w-auto">
                    {hasRegistration ? (
                        <Link 
                            href={`/dashboard/registrations/${registration.id}`}
                            aria-label={`View your confirmed lobby for ${tournament.title}`}
                            className="w-full md:w-auto h-14 md:h-16 px-10 transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-4 group/btn shadow-xl active:scale-95 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl"
                        >
                            VIEW LOBBY
                            <ChevronRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    ) : isClosed ? (
                        <div className="w-full md:w-auto h-14 md:h-16 px-10 bg-zinc-900 border border-white/5 text-zinc-600 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-4 cursor-not-allowed opacity-50">
                            CLOSED
                            <ChevronRight className="size-4" />
                        </div>
                    ) : (
                        <Link 
                            href={`/tournaments/${tournament.id}`}
                            aria-label={`Join the ${tournament.title} tournament`}
                            className={cn(
                                "w-full md:w-auto h-14 md:h-16 px-10 transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-4 group/btn shadow-xl active:scale-95 bg-white hover:bg-red-600 text-black hover:text-white rounded-2xl",
                                isFull && "bg-zinc-800 text-zinc-400"
                            )}
                        >
                            {isFull ? 'WAITLIST' : 'JOIN'}
                            <ChevronRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
