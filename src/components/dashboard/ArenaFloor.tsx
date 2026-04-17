"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Search, 
    ArrowLeft,
    Trophy,
    Gamepad2,
    Zap,
    LayoutGrid
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TournamentCard } from './TournamentCard'
import { FeaturedGame } from '@prisma/client'

interface ArenaFloorProps {
    games: FeaturedGame[]
    allTournaments: any[]
}

export function ArenaFloor({ games, allTournaments }: ArenaFloorProps) {
    const [view, setView] = useState<'global' | 'game'>('global')
    const [selectedGame, setSelectedGame] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const featuredTournaments = allTournaments.filter(t => t.isFeatured).slice(0, 3)
    const fallbackTournaments = allTournaments.filter(t => !t.isFeatured).slice(0, 2)
    const displayFeatured = featuredTournaments.length > 0 ? featuredTournaments : fallbackTournaments

    const handleSelectGame = (game: any) => {
        setSelectedGame(game)
        setView('game')
    }

    const filteredGames = games.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-12 pb-32 lg:pb-0 h-full overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
                {view === 'global' ? (
                    <motion.div 
                        key="global"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {/* Clear Professional Dashboard Header */}
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                    Browse <span className="text-red-600">Games</span>
                                </h1>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Select a title to see available tournaments</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl focus-within:border-red-600 focus-within:bg-zinc-900 transition-all">
                                    <Search className="size-4 text-zinc-600" />
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH GAMES..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-white w-40 placeholder:text-zinc-800" 
                                    />
                                </div>
                            </div>
                        </header>

                        {/* Top Events */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <Trophy className="size-4 text-red-600" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-red-600/30">Recommended Matches</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {displayFeatured.map(t => (
                                    <TournamentCard key={t.id} tournament={t} isScrim={t.type === 'SCRIM'} />
                                ))}
                                {displayFeatured.length === 0 && (
                                    <div className="p-12 text-center border border-dashed border-white/5 rounded-3xl bg-zinc-900/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No recommended events right now.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Game Selection Grid */}
                        <section className="space-y-8 pb-10">
                            <div className="flex items-center gap-4">
                                <LayoutGrid className="size-4 text-red-600" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-red-600/30">All Games</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                {filteredGames.map((game) => (
                                    <motion.div 
                                        key={game.id}
                                        whileHover={{ y: -4 }}
                                        onClick={() => handleSelectGame(game)}
                                        className="group relative aspect-square rounded-[2rem] bg-zinc-900 border border-white/5 overflow-hidden cursor-pointer hover:border-red-600/40 transition-all flex items-end shadow-2xl"
                                    >
                                        <img 
                                            src={game.imageUrl} 
                                            alt={game.name} 
                                            className="absolute inset-0 size-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-4 z-20">
                                            <div className="p-4 bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl">
                                                <h3 className="text-[11px] md:text-xs font-black text-white uppercase tracking-widest leading-none">{game.name}</h3>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="game-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                    >
                         {/* Header Back Button */}
                         <header className="flex flex-col gap-8">
                            <button 
                                onClick={() => setView('global')}
                                className="flex items-center gap-3 text-red-600 hover:text-white transition-colors group w-fit"
                            >
                                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Games</span>
                            </button>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                                        {selectedGame.name} <span className="text-red-600">Events</span>
                                    </h1>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Available Tournaments & Scrims</p>
                                </div>
                            </div>
                         </header>

                         <GameBriefingView 
                            gameName={selectedGame.name} 
                            tournaments={allTournaments.filter(t => {
                                const normalize = (s: string) => s.toLowerCase().replace(/[\s_\-]/g, '');
                                const tGame = normalize(t.game || '');
                                const sGame = normalize(selectedGame.name || '');
                                
                                // Direct match
                                if (tGame === sGame) return true;
                                
                                // Alias matching for free fire, bgmi, valorant, csgo
                                if (sGame.includes('freefire') && tGame.includes('freefire')) return true;
                                if ((sGame.includes('pubg') || sGame.includes('bgmi')) && (tGame.includes('pubg') || tGame.includes('bgmi'))) return true;
                                if (sGame.includes('val') && tGame.includes('val')) return true;
                                if ((sGame.includes('cs') || sGame.includes('counter')) && (tGame.includes('cs') || tGame.includes('counter'))) return true;
                                
                                return tGame.includes(sGame) || sGame.includes(tGame);
                            })} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function GameBriefingView({ gameName, tournaments }: { gameName: string, tournaments: any[] }) {
    const [activeCategory, setActiveCategory] = useState<'ALL' | 'TOURNAMENT' | 'SCRIM'>('ALL')
    const [activeFormat, setActiveFormat] = useState<'ALL' | 'SOLO' | 'DUO' | 'SQUAD'>('ALL')

    const filtered = tournaments.filter(t => {
        const catMatch = activeCategory === 'ALL' || t.type === activeCategory
        const formatMatch = activeFormat === 'ALL' || t.teamFormat === activeFormat
        return catMatch && formatMatch
    })

    return (
        <div className="space-y-10">
            {/* Category Filters */}
            <div className="space-y-8">
                <div className="flex items-center gap-2 p-1.5 bg-zinc-950 border border-white/5 rounded-2xl w-fit overflow-x-auto no-scrollbar shadow-inner">
                    {['ALL', 'TOURNAMENT', 'SCRIM'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat as any)}
                            className={cn(
                                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                                activeCategory === cat ? "bg-red-600 text-white" : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {cat === 'ALL' ? 'Total Dashboard' : cat}
                        </button>
                    ))}
                </div>

                {/* Team Format Selector */}
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {['ALL', 'SOLO', 'DUO', 'SQUAD'].map((format) => (
                        <button
                            key={format}
                            onClick={() => setActiveFormat(format as any)}
                            className={cn(
                                "group flex flex-col gap-2 transition-all",
                                activeFormat === format ? "text-red-500" : "text-zinc-600 hover:text-white"
                            )}
                        >
                            <span className="text-[11px] font-black uppercase tracking-widest">{format}</span>
                            <div className={cn(
                                "h-1 transition-all rounded-full",
                                activeFormat === format ? "w-full bg-red-600" : "w-1 bg-white/5"
                            )} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Tournament Feed */}
            <div className="space-y-6">
                {filtered.length > 0 ? (
                    filtered.map(t => (
                        <TournamentCard key={t.id} tournament={t} isScrim={t.type === 'SCRIM'} />
                    ))
                ) : (
                    <div className="p-20 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-zinc-900/10">
                        <Zap className="size-12 text-zinc-950 mx-auto mb-6 opacity-30" />
                        <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xs mx-auto leading-loose">
                            No {activeCategory.toLowerCase()} matches currently listed for this title.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
