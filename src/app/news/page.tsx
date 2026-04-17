"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { PageHeader } from '@/components/ui/PageHeader'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Radio, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  category: string;
  author: string;
  createdAt: string;
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/news")
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const defaultImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop";

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Page-level ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

            <PageHeader 
                badge="Intelligence"
                title="Latest Highlights"
                subtitle="Stay updated with the latest news, tournament results, and community stories from the Tribex tribe."
            />

            <section className="py-24 px-6 md:px-12 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="size-10 text-primary animate-spin" />
                        </div>
                    ) : news.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
                            <Radio className="size-16 text-zinc-700 mx-auto mb-6" />
                            <p className="text-zinc-500 font-black uppercase tracking-[0.2em] italic">No operational dispatches detected.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {news.map((post, idx) => (
                                <motion.article 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -6 }}
                                    className="group relative bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/8 overflow-hidden hover:border-red-600/40 transition-all duration-500 shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_60px_rgba(220,38,38,0.15)]"
                                >
                                    {/* Image — full color, no grayscale */}
                                    <div className="relative h-72 overflow-hidden">
                                        <Image 
                                            src={post.imageUrl || defaultImage} 
                                            alt={post.title} 
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        {/* Bottom gradient for text legibility */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
                                        {/* Top-left red accent line */}
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-red-500/60 to-transparent" />

                                        {/* Category badge */}
                                        <div className="absolute top-5 left-5">
                                            <span className="px-3 py-1.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-red-600/30 clip-tactical">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-7 sm:p-9">
                                        <div className="flex items-center gap-6 mb-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                <Calendar className="w-3.5 h-3.5 text-red-500" /> 
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                <User className="w-3.5 h-3.5 text-red-500" /> 
                                                {post.author}
                                            </div>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter mb-4 text-white leading-tight group-hover:text-red-400 transition-colors duration-300">
                                            {post.title}
                                        </h2>

                                        <p className="text-zinc-400 font-medium leading-relaxed mb-8 line-clamp-2 text-[12px] tracking-wide">
                                            {post.content}
                                        </p>

                                        <Link 
                                            href={`/news/${post.id}`}
                                            className="inline-flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:gap-5 transition-all duration-300 hover:text-red-400 group/link"
                                        >
                                            Read Full Report 
                                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
