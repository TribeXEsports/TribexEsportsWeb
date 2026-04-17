"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { SiteSettings } from '@prisma/client'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface HeroProps {
    initialSettings?: SiteSettings | null
}

const DEFAULTS = {
  heroTitle: "TRIBEX",
  heroSubtitle: "eSPORTS",
  heroTagline: "Where Legends are Forged",
  heroVideoUrl: "/videos/content3.mp4",
  heroVideoBrightness: 75,
  heroOverlayOpacity: 30,
}

export function Hero({ initialSettings }: HeroProps) {
    const [settings, setSettings] = useState({
        heroTitle: initialSettings?.heroTitle || DEFAULTS.heroTitle,
        heroSubtitle: initialSettings?.heroSubtitle || DEFAULTS.heroSubtitle,
        heroTagline: initialSettings?.heroTagline || DEFAULTS.heroTagline,
        heroVideoUrl: initialSettings?.heroVideoUrl || DEFAULTS.heroVideoUrl,
        heroItalic: (initialSettings as any)?.heroItalic ?? true,
        heroVideoBrightness: (initialSettings as any)?.heroVideoBrightness ?? DEFAULTS.heroVideoBrightness,
        heroOverlayOpacity: (initialSettings as any)?.heroOverlayOpacity ?? DEFAULTS.heroOverlayOpacity,
        heroOverlayColor: (initialSettings as any)?.heroOverlayColor || "#000000",
        heroVideoGrayscale: (initialSettings as any)?.heroVideoGrayscale ?? false,
        dashboardBtnItalic: (initialSettings as any)?.dashboardBtnItalic ?? false,
        heroCtaText: (initialSettings as any)?.heroCtaText || "ENTER ARENA",
        heroCtaTextGuest: (initialSettings as any)?.heroCtaTextGuest || "SIGN UP NOW",
        heroBadgeText: (initialSettings as any)?.heroBadgeText || "Live Arena",
    })

    const { data: session } = useSession()
    const router = useRouter()
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (initialSettings) {
            setSettings({
                heroTitle: initialSettings.heroTitle || DEFAULTS.heroTitle,
                heroSubtitle: initialSettings.heroSubtitle || DEFAULTS.heroSubtitle,
                heroTagline: initialSettings.heroTagline || DEFAULTS.heroTagline,
                heroVideoUrl: initialSettings.heroVideoUrl || DEFAULTS.heroVideoUrl,
                heroItalic: (initialSettings as any).heroItalic ?? true,
                heroVideoBrightness: (initialSettings as any).heroVideoBrightness ?? DEFAULTS.heroVideoBrightness,
                heroOverlayOpacity: (initialSettings as any).heroOverlayOpacity ?? DEFAULTS.heroOverlayOpacity,
                heroOverlayColor: (initialSettings as any).heroOverlayColor || "#000000",
                heroVideoGrayscale: (initialSettings as any).heroVideoGrayscale ?? false,
                dashboardBtnItalic: (initialSettings as any).dashboardBtnItalic ?? false,
                heroCtaText: (initialSettings as any).heroCtaText || "ENTER ARENA",
                heroCtaTextGuest: (initialSettings as any).heroCtaTextGuest || "SIGN UP NOW",
                heroBadgeText: (initialSettings as any).heroBadgeText || "Live Arena",
            })
        } else {
            fetch("/api/public/settings")
                .then((r) => r.json())
                .then((data: any) => {
                    setSettings({
                        heroTitle: data.heroTitle || DEFAULTS.heroTitle,
                        heroSubtitle: data.heroSubtitle || DEFAULTS.heroSubtitle,
                        heroTagline: data.heroTagline || DEFAULTS.heroTagline,
                        heroVideoUrl: data.heroVideoUrl || DEFAULTS.heroVideoUrl,
                        heroItalic: data.heroItalic ?? true,
                        heroVideoBrightness: data.heroVideoBrightness ?? DEFAULTS.heroVideoBrightness,
                        heroOverlayOpacity: data.heroOverlayOpacity ?? DEFAULTS.heroOverlayOpacity,
                        heroOverlayColor: data.heroOverlayColor || "#000000",
                        heroVideoGrayscale: data.heroVideoGrayscale ?? false,
                        dashboardBtnItalic: data.dashboardBtnItalic ?? false,
                        heroCtaText: data.heroCtaText || "ENTER ARENA",
                        heroCtaTextGuest: data.heroCtaTextGuest || "SIGN UP NOW",
                        heroBadgeText: data.heroBadgeText || "Live Arena",
                    })
                })
                .catch(() => {})
        }
    }, [initialSettings])

    // Ensure video plays as soon as the element is mounted
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        video.load()
        video.play().catch(() => {
            // Autoplay may be blocked; will play on user interaction
        })
    }, [settings.heroVideoUrl])

    return (
        <section className="relative h-screen flex items-center overflow-hidden bg-black outfit-font">
            {/* ── VIDEO BACKGROUND ───────────────────────────────────── */}
            {/* Position absolute, z-0, NO contain:strict */}
            <video
                ref={videoRef}
                key={settings.heroVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className={cn(
                    "absolute inset-0 w-full h-full object-cover z-0",
                    settings.heroVideoGrayscale && "grayscale"
                )}
                style={{
                    filter: `brightness(${settings.heroVideoBrightness / 100})`
                }}
                src={settings.heroVideoUrl}
            />

            {/* ── OVERLAYS (z-10+) ────────────────────────────────────── */}
            {/* Very subtle top fade so navbar is legible */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Radial glow */}
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />


            <div className="absolute inset-0 bg-grid-dots opacity-[0.03] z-10 pointer-events-none" />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

            {/* ── CONTENT (z-30) ──────────────────────────────────────── */}
            <div className="container mx-auto px-6 relative z-30 max-w-[1600px]">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
                    {/* Live badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-4"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full">
                            <div className="size-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">{settings.heroBadgeText}</span>
                        </div>
                    </motion.div>

                    {/* Main heading */}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-impact text-white leading-[0.9] mb-6 tracking-tighter drop-shadow-2xl px-4 break-words"
                            style={{ fontSize: 'var(--font-size-hero)' }}
                        >
                            {settings.heroTitle} <br />
                            <span className={cn(
                                "inline-block tracking-[-0.06em] pb-2 text-transparent bg-clip-text bg-gradient-to-r from-white from-40% via-[#ff4b4b] via-65% to-red-600 to-100%"
                            )}>
                                {settings.heroSubtitle}
                            </span>
                        </motion.h1>

                        {/* Tagline */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-4 text-white/20 mb-10"
                        >
                            <div className="h-px w-12 bg-white/10" />
                            <span className="text-[10px] font-bold tracking-[0.5em] uppercase helvetica-font">{settings.heroTagline}</span>
                            <div className="h-px w-12 bg-white/10" />
                        </motion.div>

                        {/* CTA button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <button
                                onClick={() => {
                                    if (session) {
                                        router.push((session.user as any)?.role === "admin" ? "/admin" : "/tournaments")
                                    } else {
                                        router.push("/?auth=register")
                                    }
                                }}
                                className={cn(
                                    "group relative px-14 py-5 bg-red-600 text-white font-black uppercase tracking-[0.4em] text-[11px] clip-tactical border-0 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.25)] hover:bg-white hover:text-black hover:shadow-[0_15px_40px_rgba(220,38,38,0.3)] active:scale-95 overflow-hidden outfit-font",
                                    settings.dashboardBtnItalic !== false && "italic"
                                )}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {session ? settings.heroCtaText : settings.heroCtaTextGuest}
                                    <ChevronRight className="size-4 group-hover:translate-x-2 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
