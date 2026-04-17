"use client"

import React, { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Target, Zap, ChevronUp, ChevronDown, User, Shield } from 'lucide-react'

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState('global')
    const [rankings, setRankings] = useState<any[]>([])
    const [completedTournaments, setCompletedTournaments] = useState<any[]>([])
    const [stats, setStats] = useState({ totalTeams: 0, totalPrizeMoney: 0 })
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingRankings, setIsLoadingRankings] = useState(false)

    React.useEffect(() => {
        // Fetch Global Stats
        fetch("/api/public/stats")
            .then(r => r.json())
            .then(data => setStats(data))
            .catch(() => {})

        // Initial fetch for rankings
        fetchRankings()
    }, [])

    const fetchRankings = () => {
        setIsLoadingRankings(true)
        fetch("/api/public/leaderboard/players")
            .then(r => r.json())
            .then(data => {
                setRankings(Array.isArray(data) ? data : [])
                setIsLoadingRankings(false)
            })
            .catch(() => setIsLoadingRankings(false))
    }

    React.useEffect(() => {
        if (activeTab === 'records') {
            setIsLoading(true)
            fetch("/api/public/tournaments/completed")
                .then(r => r.json())
                .then(data => {
                    setCompletedTournaments(Array.isArray(data) ? data : [])
                    setIsLoading(false)
                })
                .catch(() => setIsLoading(false))
        } else if (activeTab === 'global') {
            fetchRankings()
        }
    }, [activeTab])

    return (
        <>
            <PageHeader 
                badge="Ranking"
                title="Elite Records"
                subtitle="The definitive archive of the elite in the Tribex ecosystem. Precision and dominance quantified."
            />

            <section className="py-12 md:py-24 px-4 sm:px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 mb-16">
                        <div className="flex w-full md:w-auto gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl">
                            {['global', 'records'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 md:flex-none px-6 md:px-8 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic transition-all ${
                                        activeTab === tab 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'text-zinc-500 hover:text-white'
                                    }`}
                                >
                                    {tab === 'global' ? 'Player Ranks' : 'Battle Records'}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-8 sm:gap-12 items-center justify-center md:justify-end">
                            <div className="text-center md:text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic mb-2">Total Prize Distributed</p>
                                <p className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">₹{stats.totalPrizeMoney.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic mb-2">Platform Scale</p>
                                <p className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">{stats.totalTeams.toLocaleString()}+ <span className="text-zinc-600 text-[10px] sm:text-xs">TEAMS</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="relative p-0.5 md:p-1 rounded-[2rem] md:rounded-[3rem] bg-linear-to-b from-white/10 to-transparent">
                        <div className="bg-[#050505]/60 backdrop-blur-2xl rounded-[1.9rem] md:rounded-[2.9rem] border border-white/5 overflow-hidden">
                            {/* Desktop View: Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            {activeTab === 'global' ? (
                                                <>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Rank</th>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Warrior</th>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic text-center">Wins</th>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic text-center">Consistency</th>
                                                    <th className="px-10 py-10 text-[10px) font-black uppercase tracking-[0.2em] text-zinc-500 italic text-right">Points</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Deployment</th>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Victor</th>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Intelligence Report</th>
                                                    <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic text-right">Date</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTab === 'global' ? (
                                            isLoadingRankings ? (
                                                [1, 2, 3].map(i => (
                                                    <tr key={i} className="animate-pulse border-b border-white/[0.02]">
                                                        <td colSpan={5} className="p-16 h-24 bg-white/[0.01]" />
                                                    </tr>
                                                ))
                                            ) : (
                                                rankings.map((player) => (
                                                    <motion.tr 
                                                        key={player.rank}
                                                        initial={{ opacity: 0 }}
                                                        whileInView={{ opacity: 1 }}
                                                        className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all"
                                                    >
                                                        <td className="px-10 py-10">
                                                            <div className="flex items-center gap-4">
                                                                <span className={`text-2xl font-black italic tracking-tighter ${
                                                                    player.rank === 1 ? 'text-primary' : 
                                                                    player.rank === 2 ? 'text-orange-500' :
                                                                    player.rank === 3 ? 'text-blue-500' : 'text-zinc-700'
                                                                }`}>
                                                                    {player.rank.toString().padStart(2, '0')}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-10">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-12 h-12 bg-white/[0.05] rounded-xl border border-white/10 flex items-center justify-center">
                                                                    <User className="w-6 h-6 text-zinc-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-black text-white italic uppercase tracking-tight group-hover:text-primary transition-colors">{player.name}</p>
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Verified Warrior</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-10 text-center">
                                                            <span className="text-xl font-black text-white italic">{player.wins}</span>
                                                        </td>
                                                        <td className="px-10 py-10 text-center">
                                                            <span className="text-[10px] font-bold text-zinc-500 uppercase italic">Elite</span>
                                                        </td>
                                                        <td className="px-10 py-10 text-right">
                                                            <span className="text-2xl font-black text-primary italic tracking-tighter">{player.points}</span>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            )
                                        ) : (
                                            completedTournaments.map((t) => (
                                                <motion.tr 
                                                    key={t.id}
                                                    onClick={() => window.location.href = `/leaderboard/tournaments/${t.id}`}
                                                    className="group border-b border-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer"
                                                >
                                                    <td className="px-10 py-12">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-base font-black italic uppercase text-white group-hover:text-primary transition-colors tracking-tight">{t.title}</span>
                                                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{t.game}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-12">
                                                        <div className="flex items-center gap-4">
                                                            <Medal className="size-5 text-primary" />
                                                            <span className="text-lg font-black italic uppercase text-white tracking-widest">{t.winnerName || "UNDECIDED"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-12 max-w-xs">
                                                        <p className="text-[11px] font-medium text-zinc-500 italic uppercase leading-relaxed line-clamp-2">
                                                            {t.resultsOverview || "Mission data archived."}
                                                        </p>
                                                    </td>
                                                    <td className="px-10 py-12 text-right">
                                                        <span className="text-xs font-black italic text-zinc-300">
                                                            {new Date(t.updatedAt).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View: Card Stack */}
                            <div className="md:hidden divide-y divide-white/5">
                                {activeTab === 'global' ? (
                                    rankings.length === 0 ? (
                                        <div className="p-20 text-center text-zinc-700 italic font-black uppercase text-[10px] tracking-widest">Scanning Registry...</div>
                                    ) : rankings.map((player) => (
                                        <div key={player.rank} className="p-6 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-4xl font-black italic tracking-tighter ${
                                                        player.rank === 1 ? 'text-primary' : 'text-zinc-800'
                                                    }`}>#{player.rank.toString().padStart(2, '0')}</span>
                                                    <div>
                                                        <p className="text-lg font-black text-white italic uppercase tracking-tight">{player.name}</p>
                                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Registered Talent</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-primary italic tracking-tighter">{player.points}</p>
                                                    <p className="text-[8px] font-bold text-zinc-600 uppercase">Points</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                                <div className="text-center">
                                                    <p className="text-lg font-black text-white">{player.wins}</p>
                                                    <p className="text-[7px] font-bold text-zinc-600 uppercase">Victories</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-black text-zinc-400">PRO</p>
                                                    <p className="text-[7px] font-bold text-zinc-600 uppercase">Tier</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    completedTournaments.map((t) => (
                                        <div 
                                            key={t.id} 
                                            onClick={() => window.location.href = `/leaderboard/tournaments/${t.id}`}
                                            className="p-6 space-y-6 active:bg-white/5 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-primary italic uppercase tracking-widest">{t.game}</p>
                                                <h4 className="text-xl font-black text-white italic uppercase tracking-tight">{t.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/20">
                                                <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                                                    <Trophy className="size-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-primary uppercase tracking-widest">Champion</p>
                                                    <p className="text-base font-black text-white italic uppercase tracking-widest">{t.winnerName || "TBD"}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic pt-2 border-t border-white/5">
                                                <span>Mission Archive</span>
                                                <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
