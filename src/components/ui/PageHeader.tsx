"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface PageHeaderProps {
    title: string
    subtitle: string
    badge?: string
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
    return (
        <section className="pt-32 pb-10 px-6 relative overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="container mx-auto max-w-6xl relative z-10">
                {badge && (
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 inline-block italic"
                    >
                        {badge}
                    </motion.span>
                )}
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="font-black italic tracking-tighter uppercase mb-6 leading-[0.9] text-white break-words"
                    style={{ fontSize: 'var(--font-size-h1)' }}
                >
                    {title}
                </motion.h1>
                <div className="w-20 h-1.5 bg-primary mb-8" />
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 max-w-2xl font-medium text-lg uppercase tracking-widest leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            </div>
        </section>
    )
}
