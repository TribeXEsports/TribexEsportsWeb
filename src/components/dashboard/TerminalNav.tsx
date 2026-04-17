"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
    Home, 
    Trophy, 
    Zap, 
    History, 
    User,
    Settings,
    LayoutGrid,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'

const NAV_ITEMS = [
    { label: 'Home', icon: Home, href: '/dashboard' },
    { label: 'Browse Games', icon: LayoutGrid, href: '/dashboard/arena' },
    { label: 'My Matches', icon: Trophy, href: '/dashboard/briefings' },
    { label: 'Results', icon: History, href: '/dashboard/vault' },
    { label: 'Account Settings', icon: Settings, href: '/dashboard/settings' },
]

export function TerminalNav() {
    const pathname = usePathname()

    return (
        <>
            {/* Desktop Navigation Rail */}
            <aside className="fixed left-0 top-0 h-screen w-16 xl:w-20 hidden lg:flex flex-col items-center py-8 bg-zinc-950 border-r border-white/5 z-[60]">
                {/* Branding Indicator (Minimal) */}
                <Link href="/" className="mb-10 p-4 hover:scale-110 transition-transform">
                    <Image src="/logo.png" alt="Tribex Corporate Logo" width={32} height={32} className="w-8 h-auto" />
                </Link>

                <nav className="flex flex-col gap-6 w-full items-center">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "relative size-12 rounded-2xl flex items-center justify-center transition-all group",
                                    isActive 
                                        ? "bg-red-600 text-white" 
                                        : "text-zinc-600 hover:text-white"
                                )}
                            >
                                <item.icon className="size-5 transition-transform group-hover:scale-110" />
                                
                                {/* Tooltip */}
                                <div className="absolute left-[110%] ml-4 px-3 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className="absolute -left-4 w-1 h-8 bg-red-600 rounded-full" 
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Log Out Button */}
                <div className="mt-auto pb-8">
                     <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="size-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:border-red-600 transition-all cursor-pointer group"
                     >
                        <LogOut className="size-4" />
                        {/* Tooltip */}
                        <div className="absolute left-[110%] ml-4 px-3 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            LOG OUT
                        </div>
                     </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation (Streamlined) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[60]">
                <nav className="p-2 bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex items-center justify-around shadow-2xl">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "relative p-4 transition-all rounded-2xl flex items-center justify-center",
                                    isActive ? "text-white bg-red-600 shadow-[0_10px_20px_-5px_rgba(220,38,38,0.4)] scale-110" : "text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                <item.icon className="size-5" />
                                {isActive && (
                                    <motion.div 
                                        layoutId="mobileActive"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" 
                                    />
                                )}
                            </Link>
                        )
                    })}
                    <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="p-4 text-zinc-600 hover:text-white transition-all"
                    >
                        <LogOut className="size-5" />
                    </button>
                </nav>
            </div>
        </>
    )
}
