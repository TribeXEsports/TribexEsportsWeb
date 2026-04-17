"use client"

import React from 'react'
import { TerminalNav } from '@/components/dashboard/TerminalNav'

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-600/30 font-sans">
            {/* Background Subtle Gradient (Professional) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-red-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-zinc-900 border border-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Navigation (Sleek Sidebar) */}
            <TerminalNav />

            {/* Main Workspace */}
            <main className="lg:pl-20 min-h-screen relative z-10">
                <div className="container mx-auto px-6 py-10 lg:py-14 max-w-7xl animate-in fade-in duration-700">
                    {children}
                </div>
            </main>
        </div>
    )
}
