"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Twitter, Instagram, MessageSquare, MessageCircle, Activity } from 'lucide-react'
import { usePathname } from "next/navigation"
import { SiteSettings } from '@prisma/client'
import { cn } from "@/lib/utils"

interface FooterProps {
    initialSettings?: SiteSettings | null
}

export function Footer({ initialSettings }: FooterProps) {
    const pathname = usePathname()
    // if (pathname.startsWith('/admin')) return null;

    const scrollToTop = () => {

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [siteName, setSiteName] = React.useState(initialSettings?.siteName?.toUpperCase() || "TRIBEX")
    const [siteSubtitle, setSiteSubtitle] = React.useState(initialSettings?.siteSubtitle?.toUpperCase() || "ESPORTS")
    const [footerDescription, setFooterDescription] = React.useState((initialSettings as any)?.footerDescription || "Pioneering high-performance digital solutions. Built for speed, security, and digital dominance.")
    const [socials, setSocials] = React.useState({
        twitter: initialSettings?.twitterUrl || "#",
        instagram: initialSettings?.instagramUrl || "#",
        discord: initialSettings?.discordUrl || "#",
        whatsapp: initialSettings?.whatsappUrl || "#"
    })

    React.useEffect(() => {
        fetch("/api/public/settings")
            .then(r => r.json())
            .then(data => {
                if (data.siteName) setSiteName(data.siteName.toUpperCase())
                if (data.siteSubtitle) setSiteSubtitle(data.siteSubtitle.toUpperCase())
                if (data.footerDescription) setFooterDescription(data.footerDescription)
                setSocials({
                    twitter: data.twitterUrl || "#",
                    instagram: data.instagramUrl || "#",
                    discord: data.discordUrl || "#",
                    whatsapp: data.whatsappUrl || "#"
                })
            })
            .catch(() => {})
    }, [])


    if (pathname.startsWith('/admin')) return null;

    return (
        <footer className="relative bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer Content</h2>
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10">
                                <Image 
                                    src={(initialSettings as any)?.logoUrl || "/logo.png"} 
                                    alt="Tribex eSports Corporate Logo" 
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                    priority
                                    loading="eager"
                                />
                            </div>
                            <h3 className="font-bold text-3xl uppercase tracking-widest text-white">
                                {siteName} <span className="text-primary transition-all duration-700">{siteSubtitle}</span>
                            </h3>
                        </div>
                        <p className="max-w-xs text-[11px] font-bold text-zinc-400 leading-relaxed uppercase tracking-wider">
                            {footerDescription}
                        </p>
                        
                        <div className="flex items-center gap-4">
                            {[
                                { 
                                    name: 'X', 
                                    href: socials.twitter, 
                                    icon: (
                                        <svg className="size-4.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    )
                                },
                                { 
                                    name: 'Instagram', 
                                    href: socials.instagram, 
                                    icon: (
                                        <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                    )
                                },
                                { 
                                    name: 'WhatsApp', 
                                    href: socials.whatsapp, 
                                    icon: (
                                        <svg className="size-4.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884h.001c2.613 0 5.068 1.016 6.944 2.875A9.825 9.825 0 0121.157 12c-.001 5.45-4.436 9.886-9.888 9.886" />
                                        </svg>
                                    )
                                },
                                { 
                                    name: 'Discord', 
                                    href: socials.discord, 
                                    icon: (
                                        <svg className="size-4.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42.046 1.333-.956 2.419-2.157 2.419z" />
                                        </svg>
                                    )
                                },
                            ].map((item, i) => (
                                <a 
                                  key={i} 
                                  href={item.href} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="size-11 flex items-center justify-center bg-white/[0.02] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all rounded-xl group"
                                  aria-label={`Visit our ${item.name} channel`}
                                >
                                    <div className="text-zinc-400 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-8 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-12 border-l border-white/5 pl-0 md:pl-12 lg:pl-24">
                        {[
                            { 
                                title: 'Platform', 
                                links: [
                                    { name: 'Tournaments', href: '/tournaments' }, 
                                    { name: 'Leaderboard', href: '/leaderboard' }, 
                                    { name: 'Roster', href: '/teams' }, 
                                    { name: 'News', href: '/news' }
                                ] 
                            },
                            { 
                                title: 'Support', 
                                links: [
                                    { name: 'About', href: '/about' },
                                    { name: 'Docs', href: '/docs' }, 
                                    { name: 'Contact', href: '/contact' }, 
                                    { name: 'FAQ', href: '/faq' }
                                ] 
                            },
                            { 
                                title: 'Legal', 
                                links: [
                                    { name: 'Privacy Policy', href: '/privacy-policy' }, 
                                    { name: 'Terms of Service', href: '/terms-of-service' }
                                ] 
                            }
                        ].map((col) => (
                            <div key={col.title}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-4 w-[2px] bg-primary" />
                                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">{col.title}</h4>
                                </div>
                                <ul className="flex flex-col space-y-4">
                                    {col.links.map((link) => (
                                        <li key={link.name}>
                                            <Link 
                                                href={link.href} 
                                                className="text-[11px] font-bold text-zinc-400 hover:text-white transition-all hover:translate-x-1 inline-block uppercase tracking-widest"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar Container */}
                <div className="w-full pt-4 border-t border-white/5 relative flex flex-col items-center">
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8 border-t border-white/5 relative z-20">
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            © 2026 {siteName} {siteSubtitle}. ALL RIGHTS RESERVED.
                        </p>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Stable</span>
                        </div>
                    </div>
 
                    <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                        <span className="text-zinc-400">V4.2.0</span>
                        <button 
                            onClick={scrollToTop}
                            className="group flex items-center gap-2 hover:text-white transition-colors"
                            aria-label="Scroll back to top of the page"
                        >
                            UP <ArrowUpRight className="size-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/[0.03] blur-[120px] rounded-full pointer-events-none" />
        </footer>
    )
}
