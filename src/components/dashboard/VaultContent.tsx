"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
    History, 
    Trophy, 
    Zap,
    Users,
    Activity,
    ChevronRight,
    ArrowUpRight,
    Shield,
    XCircle,
    LayoutGrid
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VaultContentProps {
    matches: any[]
    user: any
}

export function VaultContent({ matches, user }: VaultContentProps) {
    return (
        <div className="space-y-12 pb-32 lg:pb-0 h-full overflow-y-auto no-scrollbar">
            {/* Professional Vault Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                        Gear Vault <span className="text-red-600">Results</span>
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Your complete match history and performance</p>
                </div>
            </header>

            {/* Match Listings */}
            <div className="space-y-8">
                 {/* Current Section Filter */}
                 <div className="flex items-center gap-4">
                    <Activity className="size-4 text-red-600" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-red-600/30">Previous Results</h2>
                 </div>

                <div className="grid grid-cols-1 gap-4">
                    {matches.length > 0 ? (
                        matches.map((match) => {
                            const isWinner = match.winnerUserId === user.id || match.winnerTeam?.captainId === user.id
                            return (
                                <motion.div 
                                    key={match.id}
                                    whileHover={{ x: 4 }}
                                    className="p-8 bg-zinc-950 border border-white/5 rounded-3xl group hover:border-white/10 transition-all flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
                                >
                                     <div className="flex items-center gap-8">
                                         <div className={cn(
                                            "size-16 rounded-2xl flex items-center justify-center border shrink-0",
                                            isWinner ? "bg-amber-600/10 border-amber-600/20 text-amber-500" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                         )}>
                                             {isWinner ? <Trophy className="size-8" /> : <Shield className="size-8" />}
                                         </div>
                                         <div>
                                             <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">{match.tournament?.title || "CUSTOM_MATCH"}</h3>
                                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Played on {new Date(match.createdAt).toLocaleDateString()}</p>
                                         </div>
                                     </div>

                                     <div className="flex items-center gap-10">
                                         <div className="text-center md:text-right">
                                             <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Performance</p>
                                             <p className="text-lg font-black text-white italic tracking-widest">{isWinner ? 'VICTORY' : 'DEFEAT'}</p>
                                         </div>
                                         <div className="size-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-red-500 transition-colors">
                                             <ChevronRight className="size-5" />
                                         </div>
                                     </div>
                                </motion.div>
                            )
                        })
                    ) : (
                        <div className="p-24 text-center border border-dashed border-white/5 rounded-[3.5rem] bg-zinc-900/10">
                             <History className="size-16 text-zinc-900 mx-auto mb-6 opacity-30" />
                             <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xs mx-auto leading-loose">
                                No historical match records found in the archive. 
                             </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
