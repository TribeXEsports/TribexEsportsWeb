"use client"

import React, { useEffect, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Twitter, Instagram, Users, Gamepad2, Shield, ChevronRight, RefreshCw } from 'lucide-react'

interface RosterMember {
  id: string
  name: string
  role: string
  game: string
  teamName?: string
  imageUrl?: string
  stats?: string
}

export default function RosterPage() {
    const [members, setMembers] = useState<RosterMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterGame, setFilterGame] = useState("All")

    useEffect(() => {
        fetch("/api/public/roster")
            .then((r) => r.json())
            .then((data) => setMembers(Array.isArray(data) ? data : []))
            .catch(() => setMembers([]))
            .finally(() => setIsLoading(false))
    }, [])

    const games = ["All", ...Array.from(new Set(members.map((m) => m.game)))]
    const filtered = filterGame === "All" ? members : members.filter((m) => m.game === filterGame)

    return (
        <>
            <PageHeader 
                badge="Roster"
                title="Pro Roster"
                subtitle="The elite athletes representing the Tribex organization across multiple disciplines."
            />

            <section className="pt-8 pb-16 px-6">
                <div className="container mx-auto max-w-7xl">

                    {/* Game Filter */}
                    {!isLoading && members.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap mb-10">
                            {games.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setFilterGame(g)}
                                    className={`px-5 h-10 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                                        filterGame === g
                                            ? "bg-primary text-white shadow-glow-red"
                                            : "bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="size-10 text-zinc-800 animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                            <Users className="size-16 text-zinc-800" />
                            <p className="text-zinc-500 text-[12px] font-bold uppercase tracking-widest">
                                {members.length === 0
                                    ? "No roster members have been added yet."
                                    : "No players found for this game."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map((member, idx) => (
                                    <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group bg-[#080808] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-[0_0_50px_-12px_rgba(220,38,38,0.15)] hover:-translate-y-1"
                                >
                                    {/* Player Image */}
                                    <div className="relative h-64 overflow-hidden bg-zinc-950">
                                        {member.imageUrl ? (
                                            <>
                                                <Image
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-transparent to-transparent z-10" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="size-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-zinc-700">
                                                    {member.name[0]}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Colored corner glow */}
                                        <div className="absolute -top-10 -right-10 size-40 bg-primary/20 blur-[80px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
                                        
                                        <div className="absolute bottom-4 left-5 flex items-center gap-2 z-20">
                                            <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                {member.game}
                                            </span>
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                                <Shield className="size-2.5 text-primary" /> {member.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Player Info */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{member.name}</h3>
                                            {member.teamName && (
                                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{member.teamName}</p>
                                            )}
                                        </div>
                                        {member.stats && (
                                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[11px]">
                                                <Gamepad2 className="size-3.5" />
                                                {member.stats}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
