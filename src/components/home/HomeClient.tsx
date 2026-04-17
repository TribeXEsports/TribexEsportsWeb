"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Hero } from "@/components/home/Hero";
const Partners = dynamic(() => import("@/components/home/Partners").then(mod => mod.Partners), {
    ssr: true,
    loading: () => <div className="h-[400px] bg-black animate-pulse" />
});
const InfiniteSlider = dynamic(() => import("@/components/ui/infinite-slider").then(mod => mod.InfiniteSlider), {
    ssr: false, // Critical for framer-motion loops
    loading: () => <div className="h-[200px] bg-black animate-pulse" />
});
const FAQ = dynamic(() => import("@/components/home/FAQ").then(mod => mod.FAQ), {
    ssr: true,
    loading: () => <div className="h-[400px] bg-black animate-pulse" />
});
const LiveMatches = dynamic(() => import("@/components/home/LiveMatches").then(mod => mod.LiveMatches), {
    ssr: false,
    loading: () => <div className="h-[600px] bg-black animate-pulse" />
});
import { SiteSettings, FeaturedGame } from "@prisma/client";
import { cn } from "@/lib/utils";
import { 
    Users, 
    Trophy, 
    Sword, 
    Zap, 
    Target, 
    MessageCircle, 
    ChevronRight 
} from "lucide-react";

const FEATURED_GAMES = [
    { name: "CS:GO", imageUrl: "https://images.unsplash.com/photo-1542751128-00a2159a28b4?q=80&w=200", order: 1 },
    { name: "F1 24", imageUrl: "https://images.unsplash.com/photo-1594914141274-78c848e355d5?q=80&w=200", order: 2 },
    { name: "VALORANT", imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=200", order: 3 },
    { name: "BGMI", imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4375?q=80&w=200", order: 4 },
    { name: "FC24", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200", order: 5 }
];

interface HomeClientProps {
    initialSettings?: SiteSettings | null;
    initialGames?: FeaturedGame[];
    initialTournaments?: any[];
}

export function HomeClient({ initialSettings, initialGames, initialTournaments = [] }: HomeClientProps) {
    // PERFORMANCE NITRO: Memoized constants to ensure icon resolution and prevent re-render thrashing
    const STEPS = React.useMemo(() => [
        { 
            num: "01", 
            title: "Create Account", 
            desc: "Sign up via Discord or Email to unlock your dashboard.", 
            icon: Users,
            href: "/register"
        },
        { 
            num: "02", 
            title: "Select Tournament", 
            desc: "Browse daily scrims and weekly tournaments. Filter by game.", 
            icon: Trophy,
            href: "/tournaments"
        },
        { 
            num: "03", 
            title: "Compete & Win", 
            desc: "Join the lobby, battle it out, and claim your rewards.", 
            icon: Sword,
            href: "/tournaments"
        }
    ], []);

    const BENEFITS = React.useMemo(() => [
        { title: 'Fast Updates', desc: 'Instant alerts for room IDs and slots.', icon: Zap },
        { title: 'Room ID\'s', desc: 'Get codes 15 mins before every match.', icon: Target },
        { title: '24/7 Support', desc: 'Direct access to mods for all disputes.', icon: MessageCircle }
    ], []);
    const [liveSettings, setLiveSettings] = React.useState<any>(initialSettings);
    const [socials, setSocials] = React.useState({
        whatsappUrl: initialSettings?.whatsappUrl || "#",
        discordUrl: initialSettings?.discordUrl || "#",
    })
    const [featuredGames, setFeaturedGames] = React.useState<any[]>(
        (initialGames && initialGames.length > 0) ? initialGames : FEATURED_GAMES
    )
    const [loadingGames, setLoadingGames] = React.useState(!initialGames)
    const [tournaments, setTournaments] = React.useState<any[]>(initialTournaments || [])

    React.useEffect(() => {
        // Fetch Settings
        fetch("/api/public/settings")
            .then((r) => r.json())
            .then((data) => {
                setLiveSettings(data);
                setSocials({
                    whatsappUrl: data.whatsappUrl || "#",
                    discordUrl: data.discordUrl || "#",
                })
            })
            .catch(() => {})

        // Fetch Games
        fetch("/api/public/games")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setFeaturedGames(data)
                }
            })
            .catch(() => {})
            .finally(() => setLoadingGames(false))
    }, [])

    return (
        <div className="relative outfit-font">

            <div id="hero">
                <Hero initialSettings={initialSettings} />
            </div>

            {/* Games Ticker / Roster Status */}
            <section className="relative py-16 pb-20 border-y border-white/5 bg-black">
                {/* Horizontal Scanline Effect */}
                <div className="absolute inset-0 bg-grid-dots opacity-[0.02] pointer-events-none" />
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent top-0 animate-scan-line-horizontal" />
                
                <div className="container mx-auto px-6 relative z-10 mb-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-4">
                            <span className="h-px w-8 bg-zinc-800" />
                            <span className={cn(
                                "text-[11px] font-bold text-red-600/60 uppercase tracking-widest",
                                (initialSettings as any)?.tagsItalic !== false && "italic"
                            )}>Our Ecosystem</span>
                            <div className="h-px w-8 bg-zinc-800" />
                        </div>
                        <h2 className={cn(
                            "text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3",
                            (initialSettings as any)?.tagsItalic !== false && "italic"
                        )}>
                            <span className="size-1 bg-primary rounded-full" />
                            <span className="text-white">Featured Games</span>
                        </h2>
                    </div>
                </div>

                <Suspense fallback={<div className="h-[220px] bg-white/[0.02] animate-pulse rounded-3xl" />}>
                    {(() => {
                        const cardH = (liveSettings as any)?.gameCardHeight ?? 220;
                        const cardW = Math.round(cardH * 0.72);
                        const minFill = Math.max(3, Math.ceil(2400 / ((cardW + 12) * featuredGames.length)) + 1);
                        const loopedGames = Array.from({ length: minFill }, () => featuredGames).flat();
                        return (
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
                                <InfiniteSlider duration={(liveSettings as any)?.gameCardSpeed ?? 30} gap={12} className="py-3">
                                    {loopedGames.map((game: any, idx: number) => (
                                        <div
                                            key={`${game.id || game.name}-${idx}`}
                                            className="cursor-default group/item relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] shrink-0"
                                            style={{ height: `${cardH}px`, width: `${cardW}px` }}
                                        >
                                            <Image
                                                src={game.imageUrl || game.image}
                                                alt={`${game.name} - Featured Tournament Game`}
                                                fill
                                                className="object-cover scale-105 group-hover/item:scale-100 transition-transform duration-700"
                                                sizes="(max-width: 768px) 150px, 200px"
                                                quality={60}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
                                                <p className="text-white font-black uppercase tracking-tight text-sm leading-none">{game.name}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="size-1.5 rounded-full bg-primary" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </InfiniteSlider>
                            </div>
                        );
                    })()}
                </Suspense>
            </section>

            <Suspense fallback={<div className="h-[400px] bg-black animate-pulse" />}>
                <LiveMatches tournaments={tournaments} />
            </Suspense>

            <Suspense fallback={<div className="h-[200px] bg-black animate-pulse" />}>
                <Partners />
            </Suspense>

            {/* Steps Section */}
            <section className="py-24 md:py-32 px-6 border-b border-white/5">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="h-[1px] w-8 bg-red-600/30" />
                                <span className={cn(
                                     "text-[9px] font-bold text-red-500 uppercase tracking-[0.6em]",
                                     (initialSettings as any)?.tagsItalic !== false && "italic"
                                )}>Registration Workflow</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-impact text-white uppercase tracking-tighter break-words">
                                {(initialSettings as any)?.phasesTitle || "Tournament"}<br />
                                <span className={cn(
                                     "inline-block text-transparent bg-clip-text bg-gradient-to-r from-white from-40% via-[#ff4b4b] via-65% to-red-600 to-100%", 
                                     (initialSettings as any)?.headingsItalic !== false && "italic"
                                )}>{(initialSettings as any)?.phasesSubtitle || "Roadmap."}</span>
                            </h2>
                        </div>
                        <p className="text-zinc-400 max-w-xs font-medium uppercase tracking-[0.2em] text-[10px] md:text-[11px] leading-relaxed md:text-right">
                            Our streamlined system ensures your squad is ready for the arena in three simple stages.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {STEPS.map((step, idx) => (
                            <Link 
                              key={step.num} 
                              href={step.href}
                              className={cn(
                                "p-10 bg-white/[0.01] border border-white/5 group transition-all hover:bg-white/[0.02] relative overflow-hidden block focus:ring-2 focus:ring-primary outline-none",
                                idx === 0 ? "rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" : "",
                                idx === STEPS.length - 1 ? "rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none" : ""
                              )}
                              aria-label={`Go to ${step.title}: ${step.desc}`}
                            >
                                <div className="space-y-8 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1.5">
                                            <span className={cn(
                                                "text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-primary transition-colors",
                                                (initialSettings as any)?.tagsItalic !== false && "italic"
                                            )}>Step {step.num}</span>
                                            <h3 className={cn(
                                                "text-2xl md:text-3xl font-bold uppercase tracking-tight text-white",
                                                (initialSettings as any)?.headingsItalic !== false && "italic"
                                            )}>{step.title}</h3>
                                        </div>
                                        <step.icon className="size-5 text-zinc-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    
                                    <p className="text-zinc-300 font-medium leading-relaxed text-[11px] uppercase tracking-wider">{step.desc}</p>
                                    
                                    <div className={cn(
                                        "inline-flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-[9px] pt-4 group-hover:gap-5 transition-all text-red-500",
                                        (initialSettings as any)?.dashboardBtnItalic !== false && "italic"
                                    )}>
                                        START JOURNEY <ChevronRight className="size-3.5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Benefits */}
            <section className="py-16 md:py-24 px-6 border-t border-white/5 relative overflow-hidden bg-black/50">
                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left: Branding & CTAs */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-4 px-4 py-1.5 bg-white/[0.02] border-l-2 border-red-600 backdrop-blur-md">
                                    <span className={cn(
                                        "text-[9px] font-bold text-white/70 uppercase tracking-[0.4em]",
                                        (initialSettings as any)?.tagsItalic !== false && "italic"
                                    )}>Integrated Network</span>
                                </div>
                                
                                <h2 className="text-impact text-white leading-tight" style={{ fontSize: 'var(--font-size-h2)' }}>
                                    {(initialSettings as any)?.arenaTitle || "Join the"}<br />
                                    <span className={cn(
                                        "inline-block text-transparent bg-clip-text bg-gradient-to-r from-white from-40% via-[#ff4b4b] via-65% to-red-600 to-100% drop-shadow-md",
                                        (initialSettings as any)?.headingsItalic !== false && "italic"
                                    )}>{(initialSettings as any)?.arenaSubtitle || "Arena."}</span>
                                </h2>
                                
                                <p className="text-zinc-400 font-medium max-w-sm uppercase tracking-widest text-[11px] leading-relaxed">
                                    Connect with thousands of players. Receive instantaneous tournament updates and recruit your next elite team.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                  href={socials.whatsappUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  aria-label="Join the community on WhatsApp"
                                  className="group relative px-10 py-5 bg-[#25D366] text-white font-bold uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:translate-y-[2px] active:translate-y-[4px] transition-all shadow-[0_6px_0_0_#128C7E] hover:shadow-[0_4px_0_0_#128C7E] active:shadow-[0_0_0_0_#128C7E] active:scale-[0.98] overflow-hidden flex items-center justify-center sm:w-auto w-full"
                                >
                                    <span className={cn(
                                        "relative z-10 flex items-center gap-4 text-[13px] md:text-[15px] outfit-font",
                                        (initialSettings as any)?.dashboardBtnItalic !== false && "italic"
                                    )}>
                                      <svg className="size-6 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884h.001c2.613 0 5.068 1.016 6.944 2.875A9.825 9.825 0 0121.157 12c-.001 5.45-4.436 9.886-9.888 9.886" />
                                      </svg>
                                      WHATSAPP
                                      <ChevronRight className="size-5 group-hover:translate-x-2 transition-transform text-white/50" />
                                    </span>
                                    {/* Scan Sweep Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </a>

                                <a 
                                  href={socials.discordUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  aria-label="Join the community on Discord"
                                  className="group relative px-10 py-5 bg-[#5865F2] text-white font-bold uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:translate-y-[2px] active:translate-y-[4px] transition-all shadow-[0_6px_0_0_#4752c4] hover:shadow-[0_4px_0_0_#4752c4] active:shadow-[0_0_0_0_#4752c4] active:scale-[0.98] overflow-hidden flex items-center justify-center sm:w-auto w-full"
                                >
                                    <span className="relative z-10 flex items-center gap-4 text-[13px] md:text-[15px] outfit-font tracking-widest">
                                      <svg className="size-6 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42.046 1.333-.956 2.419-2.157 2.419z" />
                                      </svg>
                                      DISCORD
                                      <ChevronRight className="size-5 group-hover:translate-x-2 transition-transform text-white/50" />
                                    </span>
                                    {/* Scan Sweep Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </a>
                            </div>

                        </div>

                        {/* Right: Operational Benefits Console */}
                        <div className="lg:col-span-5 relative">
                            <div className="glass-premium p-8 md:p-10 border-l-4 border-red-600 relative overflow-hidden group">
                                <div className="space-y-8 md:space-y-10 relative z-10">
                                    <div className="space-y-3">
                                        <h3 className="text-base md:text-lg font-bold uppercase tracking-widest text-white">Member Benefits</h3>
                                        <div className="h-[1px] w-8 bg-primary" />
                                    </div>

                                    <div className="space-y-6 md:space-y-8">
                                        {BENEFITS.map((b, idx) => (
                                            <div key={b.title} className="relative group/item flex gap-4 md:gap-5">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="size-7 md:size-8 flex items-center justify-center bg-white/[0.02] border border-white/5 group-hover/item:border-red-600/30 transition-colors">
                                                        <b.icon className="size-3 md:size-3.5 text-zinc-400 group-hover/item:text-red-600 transition-colors" />
                                                    </div>
                                                    {idx < BENEFITS.length - 1 && <div className="w-[1px] grow bg-white/5" />}
                                                </div>
                                                
                                                <div className="space-y-1.5 pb-4">
                                                    <h4 className="text-[13px] font-bold uppercase text-white group-hover/item:text-primary transition-colors">
                                                        {b.title}
                                                    </h4>
                                                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                                        {b.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FAQ initialSettings={initialSettings} />
        </div>
    );
}

