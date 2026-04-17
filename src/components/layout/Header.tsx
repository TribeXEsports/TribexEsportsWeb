"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

import { useSession, signOut } from "next-auth/react"
import { UserDropdown } from "@/components/ui/user-dropdown"
import { SiteSettings } from "@prisma/client"

interface HeaderProps {
    initialSettings?: SiteSettings | null
}

export function Header({ initialSettings }: HeaderProps) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session } = useSession()
    
    // ... rest of state ...
    const [scrolled, setScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const [logoUrl, setLogoUrl] = useState(initialSettings?.logoUrl || "/logo.png")
    const [siteName, setSiteName] = useState(initialSettings?.siteName || "Tribex")
    const [siteSubtitle, setSiteSubtitle] = useState(initialSettings?.siteSubtitle || "Esports")
    const [navbarItalic, setNavbarItalic] = useState(initialSettings?.navbarItalic ?? true)
    const [dashboardBtnItalic, setDashboardBtnItalic] = useState((initialSettings as any)?.dashboardBtnItalic ?? false)
    const [mounted, setMounted] = useState(false)

    // Handling URL-based triggers is now handled by GlobalAuthObserver in RootLayout

    useEffect(() => {
        setMounted(true)

        fetch("/api/public/settings")
            .then((r) => r.json())
            .then((data) => {
                if (data.logoUrl) setLogoUrl(data.logoUrl)
                if (data.siteName) setSiteName(data.siteName)
                if (data.siteSubtitle) setSiteSubtitle(data.siteSubtitle)
                if (data.navbarItalic !== undefined) setNavbarItalic(data.navbarItalic)
                if (data.dashboardBtnItalic !== undefined) setDashboardBtnItalic(data.dashboardBtnItalic)
            })
            .catch(() => {})

        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            setScrolled(isScrolled)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    const navLinks = [
        { label: 'Tournaments', href: '/tournaments' },
        { label: 'Roster', href: '/teams' },
        { label: 'Campus Ambassador', href: '/ambassadors' },
        { label: 'News', href: '/news' },
    ]

    const filteredLinks = navLinks

    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) return null;

    return (
        <header className={cn(

            "fixed top-0 z-50 w-full transition-all duration-700",
            scrolled 
                ? "glass-premium py-2 border-b border-white/10" 
                : "bg-transparent py-4 border-b border-transparent"
        )} aria-label="Main Navigation">


            <div className="container mx-auto px-[clamp(1rem,4vw,1.5rem)] relative flex items-center justify-between">

                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2 group" aria-label="Tribex eSports Home">
                        <div className="relative h-9 w-9">
                            <Image 
                                src={logoUrl} 
                                alt="Tribex eSports Logo" 
                                fill 
                                className="object-contain transition-transform duration-500 group-hover:scale-110 relative z-10" 
                                priority
                                sizes="36px"
                            />
                        </div>
                        <span className="text-white helvetica-font text-lg sm:text-2xl font-black tracking-[0.1em] uppercase flex items-center">
                            {siteName}
                            <span className="text-red-600 ml-1.5 sm:ml-2 font-black tracking-[0.05em] transition-all duration-500 group-hover:scale-105">
                                {siteSubtitle}
                            </span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 relative" onMouseLeave={() => setHoveredLink(null)}>
                        {filteredLinks.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link 
                                    key={item.label} 
                                    href={item.href} 
                                    onMouseEnter={() => setHoveredLink(item.label)}
                                    className={cn(
                                        "relative px-5 py-2 text-[12px] outfit-font font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all z-10",
                                        navbarItalic && "italic"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {mounted && session ? (
                        <div className="flex items-center gap-3">
                             <button 
                                onClick={() => router.push((session.user as any)?.role === "admin" ? "/admin" : "/dashboard")} 
                                className={cn(
                                    "hidden md:flex bg-primary border-0 text-white text-[12px] font-bold uppercase tracking-widest px-12 py-3 transition-all items-center gap-2 group shadow-[0_15px_30px_rgba(220,38,38,0.2)] hover:bg-white hover:text-black clip-tactical outfit-font",
                                    dashboardBtnItalic && "italic"
                                )}
                            >
                                DASHBOARD
                            </button>
                            <UserDropdown user={session.user} />
                        </div>
                    ) : mounted ? (
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => router.push(`${pathname}?auth=login`)}
                                className="hidden md:block text-[12px] outfit-font font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                aria-label="Sign in to your account"
                            >
                                LOGIN
                            </button>
                             <button 
                                onClick={() => router.push(`${pathname}?auth=register`)}
                                className={cn(
                                    "hidden md:block bg-primary text-white text-[12px] font-bold uppercase tracking-widest px-12 py-3 transition-all shadow-[0_15px_30px_rgba(220,38,38,0.2)] hover:bg-white hover:text-black clip-tactical outfit-font",
                                    dashboardBtnItalic && "italic"
                                )}
                                aria-label="Create a new account"
                            >
                                CREATE ACCOUNT
                            </button>
                        </div>
                    ) : (
                        <div className="h-10 w-24 bg-white/5 animate-pulse rounded-none" />
                    )}

                    <button
                        className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 lg:hidden bg-black/98 backdrop-blur-3xl px-8 py-24 flex flex-col gap-10"
                    >
                        {/* Internal Close Button for Mobile Accessibility */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-8 right-8 p-4 text-white/40 hover:text-white transition-all bg-white/[0.03] rounded-full border border-white/5 active:scale-90"
                            aria-label="Close mobile navigation"
                        >
                            <X className="size-6" />
                        </button>

                        <nav className="flex flex-col gap-5">
                            {filteredLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white/40 hover:text-red-600 transition-colors outfit-font"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {mounted && session && (
                                <Link
                                    href="/profile"
                                    className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-red-600 hover:text-white transition-colors outfit-font"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    View Pro Profile
                                </Link>
                            )}
                        </nav>
                        <div className="mt-auto pb-10 flex flex-col gap-4">
                             {mounted && session ? (
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="size-10 rounded-full border border-red-600/50 p-0.5 relative overflow-hidden">
                                            <Image 
                                                src={session.user?.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"} 
                                                alt={session.user?.name || "User Avatar"}
                                                fill
                                                className="rounded-full object-cover" 
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-lg font-black uppercase text-white leading-tight outfit-font truncate">{session.user?.name}</p>
                                            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[7px]">Verified Account</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                         <button 
                                            onClick={() => {
                                                router.push((session.user as any)?.role === "admin" ? "/admin" : "/dashboard")
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white hover:text-black transition-all outfit-font"
                                        >
                                            GO TO DASHBOARD
                                        </button>
                                         <button 
                                             onClick={() => {
                                                 signOut()
                                                 setIsMobileMenuOpen(false)
                                             }}
                                             className="w-full bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-red-600 hover:border-red-600 transition-all outfit-font"
                                         >
                                             LOGOUT
                                         </button>
                                    </div>
                                </div>
                            ) : mounted ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => {
                                            router.push(`${pathname}?auth=login`)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full bg-white/[0.05] border border-white/10 text-white text-[9px] font-black uppercase tracking-widest py-4 rounded-xl text-center hover:bg-white/10 transition-all outfit-font"
                                    >
                                        SIGN IN
                                    </button>
                                    <button 
                                        onClick={() => {
                                            router.push(`${pathname}?auth=register`)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="w-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest py-4 rounded-xl text-center hover:bg-white hover:text-black transition-all outfit-font"
                                    >
                                        REGISTER
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
