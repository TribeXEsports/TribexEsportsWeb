"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Loader2, Tag } from 'lucide-react'

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  category: string;
  author: string;
  createdAt: string;
}

export default function NewsArticlePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [article, setArticle] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/public/news/${id}`)
            .then(res => {
                if (!res.ok) { setNotFound(true); setIsLoading(false); return null; }
                return res.json();
            })
            .then(data => {
                if (data) setArticle(data);
                setIsLoading(false);
            })
            .catch(() => { setNotFound(true); setIsLoading(false); });
    }, [id]);

    const defaultImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop";

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/8 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 pt-32 md:pt-40 pb-24 px-6 md:px-12">
                <div className="container mx-auto max-w-4xl">

                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-10"
                    >
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-zinc-400 text-[11px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to News
                        </button>
                    </motion.div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="size-10 text-red-600 animate-spin" />
                        </div>
                    )}

                    {/* Not Found */}
                    {notFound && (
                        <div className="text-center py-32">
                            <p className="text-6xl font-black text-red-600 mb-4">404</p>
                            <p className="text-zinc-400 font-black uppercase tracking-widest mb-8">Article not found</p>
                            <Link href="/news" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-black uppercase tracking-[0.3em] text-[10px] clip-tactical hover:bg-white hover:text-black transition-all">
                                Back to News
                            </Link>
                        </div>
                    )}

                    {/* Article */}
                    {article && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Hero Image */}
                            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                                <Image
                                    src={article.imageUrl || defaultImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 896px"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                {/* Red top accent */}
                                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-red-500/60 to-transparent" />

                                {/* Category */}
                                <div className="absolute top-6 left-6">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-red-600/30 clip-tactical">
                                        <Tag className="w-3 h-3" />
                                        {article.category}
                                    </span>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                                    {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <User className="w-3.5 h-3.5 text-red-500" />
                                    {article.author}
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-tight mb-8">
                                {article.title}
                            </h1>

                            {/* Divider */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-[2px] w-16 bg-red-600" />
                                <div className="h-[1px] flex-1 bg-white/5" />
                            </div>

                            {/* Content */}
                            <div className="prose prose-invert prose-lg max-w-none">
                                {article.content.split('\n').filter(Boolean).map((para, i) => (
                                    <p key={i} className="text-zinc-300 leading-relaxed text-[15px] mb-5">
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* Footer CTA */}
                            <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                                <Link
                                    href="/news"
                                    className="inline-flex items-center gap-2 text-zinc-400 text-[11px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    All Dispatches
                                </Link>
                                <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">TRIBEX Intel</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
