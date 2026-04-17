"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Shield, Zap, Users, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
    {
        question: "How do I register for a tournament?",
        answer: "Navigate to the Tournaments section, select your desired game, and click 'Register'. Enter your Player UID and Team details in our secure deployment modal to initialize your entry.",
        icon: Zap
    },
    {
        question: "Where do I find the Room ID and Password?",
        answer: "Room credentials are synchronized directly to your Player Dashboard 15 minutes before the match starts. Ensure you are logged in to receive real-time mission intelligence.",
        icon: Shield
    },
    {
        question: "Is UID verification mandatory?",
        answer: "Yes. Our 'Apex Verifier' system performs real-time stats and identity checks on Every UID to ensure competitive integrity. Invalid UIDs will be automatically rejected.",
        icon: Users
    },
    {
        question: "How can I contact technical support?",
        answer: "Join our global Discord server or WhatsApp channel via the 'Join the Tribe' section. Our moderators provide 24/7 direct assistance for all tournament disputes.",
        icon: MessageCircle
    },
    {
        question: "Can I update my team after registration?",
        answer: "Team modifications are permitted up to 2 hours before the tournament launch. Visit your dashboard 'Active Registrations' to manage your squad.",
        icon: HelpCircle
    },
    {
        question: "Are there entry fees for the tournaments?",
        answer: "Tribex hosts both Free-to-Play and Premium Sponsored tournaments. Check each tournament's 'Mission Briefing' on its individual page for specific entry requirements.",
        icon: Zap
    }
]

export function FAQ({ initialSettings }: { initialSettings?: any }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section id="faq" className="py-24 md:py-40 px-6 relative overflow-hidden bg-black/40 border-t border-white/5">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-16 md:mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/[0.03] border-l-2 border-primary backdrop-blur-md"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.4em]">Support Hub</span>
                    </motion.div>
                    
                    <h2 className="text-impact text-white leading-[0.9]" style={{ fontSize: 'var(--font-size-h2)' }}>
                        {initialSettings?.faqTitle || "FREQUENTLY ASKED"} <br />
                        <span className={cn(
                            "inline-block text-transparent bg-clip-text bg-gradient-to-r from-white from-40% via-[#ff4b4b] via-65% to-red-600 to-100%",
                            initialSettings?.headingsItalic !== false && "italic"
                        )}>
                            {initialSettings?.faqSubtitle || "QUESTIONS"}
                        </span>
                    </h2>
                    
                    <p className="text-zinc-500 font-medium max-w-xl mx-auto uppercase tracking-[0.2em] text-[11px] md:text-[12px] helvetica-font leading-relaxed opacity-80">
                        Everything you need to know before your next deployment. Simple answers about setup, performance, and elite support.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {FAQS.map((faq, idx) => (
                        <div 
                            key={idx} 
                            className={`group relative transition-all duration-500 ${openIndex === idx ? 'lg:col-span-1' : ''}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                aria-expanded={openIndex === idx}
                                aria-controls={`faq-answer-${idx}`}
                                className={`w-full text-left p-8 glass-arena border-l-2 transition-all duration-500 flex items-start gap-6 group/btn ${
                                    openIndex === idx 
                                    ? 'border-red-600 bg-red-600/5' 
                                    : 'border-white/10 hover:border-white/30'
                                }`}
                            >
                                <div className={`mt-1 size-10 flex items-center justify-center bg-white/[0.03] border border-white/10 transition-colors ${
                                    openIndex === idx ? 'border-red-600/50 bg-red-600/10' : 'group-hover/btn:border-white/20'
                                }`}>
                                    <faq.icon className={`size-4 transition-colors ${
                                        openIndex === idx ? 'text-red-600' : 'text-zinc-600'
                                    }`} />
                                </div>
                                
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-[14px] md:text-[16px] ppFormula-font font-black uppercase tracking-wider text-white group-hover/btn:text-red-600 transition-colors">
                                            {faq.question}
                                        </span>
                                        <div className={`transition-transform duration-500 ${openIndex === idx ? 'rotate-45' : ''}`}>
                                            <Image 
                                              src="/icons/faq-cross-s2.svg" 
                                              className="opacity-40 group-hover:opacity-100" 
                                              alt="Toggle question" 
                                              width={16} 
                                              height={16}
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {openIndex === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "circOut" }}
                                                id={`faq-answer-${idx}`}
                                                className="overflow-hidden"
                                            >
                                                <p className="pt-4 text-zinc-400 text-[12px] uppercase tracking-widest leading-loose font-medium border-t border-white/5 helvetica-font">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </section>
    )
}
