import React from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Book, Code, Terminal, FileText, Share2, ShieldCheck, Zap, Gavel, UserX, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Operational Docs | TribeX Esports Platform Intelligence',
  description: 'Technical documentation for tournament organizers, players, and developers within the TribeX Esports ecosystem.',
}

export default function DocsPage() {
  return (
    <main className="bg-black min-h-screen pb-32 selection:bg-primary selection:text-white">
      <PageHeader 
        badge="Documentation"
        title="TribeX Documentation"
        subtitle="Technical guides for organizers and players."
      />

      <section className="py-12 md:py-24 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            
            {/* SIDEBAR NAVIGATION - Now last on mobile */}
            <aside className="lg:col-span-3 space-y-12 order-2 lg:order-1">
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-700">Getting Started</h3>
                    <nav className="flex flex-col gap-3">
                        {['Player Registration', 'Team Management', 'Scoring Protocol'].map((link) => (
                            <button key={link} className="flex items-center gap-3 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary hover:text-white hover:border-primary transition-all text-left">
                                <Zap className="size-3" />
                                {link}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-700">For Organizers</h3>
                    <nav className="flex flex-col gap-3">
                        {['Tournament Creation', 'Bracket Management', 'Payment Integration'].map((link) => (
                            <button key={link} className="flex items-center gap-3 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary hover:text-white hover:border-primary transition-all text-left">
                                <FileText className="size-3" />
                                {link}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* MAIN CONTENT AREA - Now first on mobile */}
            <div className="lg:col-span-9 space-y-12 md:space-y-16 order-1 lg:order-2">
                <div className="p-12 md:p-20 bg-white/[0.02] border border-white/5 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Terminal className="size-64 text-white" />
                    </div>
                    
                    <div className="space-y-10 relative z-10">
                        <div className="space-y-4">
                            <h2 className="font-black italic uppercase tracking-tighter text-white" style={{ fontSize: 'var(--font-size-h2)' }}>Getting <span className="text-primary italic">Started</span></h2>
                            <div className="w-24 h-2 bg-primary" />
                        </div>
                        
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm leading-relaxed max-w-2xl">
                            Our platform is built for high-performance esports operations. This guide covers registration, team management, and tournament orchestration.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            <div className="space-y-4 p-8 bg-black/40 border border-white/5 rounded-3xl">
                                <Code className="size-8 text-primary" />
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Dynamic Scoring</h3>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Advanced point systems for FF, BGMI, and Valorant logic.</p>
                            </div>
                            <div className="space-y-4 p-8 bg-black/40 border border-white/5 rounded-3xl">
                                <Share2 className="size-8 text-emerald-500" />
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Real-Time Updates</h3>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Instant match updates and result publishing protocols.</p>
                            </div>
                        </div>

                        <div className="pt-12">
                             <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-6">
                                <Zap className="size-6 text-amber-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 leading-relaxed italic">
                                    Notice: Advanced API documentation for custom organizer integration is currently under restricted access. Contact Support for enlisting.
                                </p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* TABLE OF CONTENTS / QUICK SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: "Fair Play Rules", icon: ShieldCheck, desc: "Anti-cheat measures are strictly enforced for all participants." },
                        { title: "Code of Conduct", icon: Gavel, desc: "Professionalism is expected across all platforms." },
                        { title: "Account Verification", icon: UserX, desc: "Multi-accounting or account sharing is strictly prohibited." },
                        { title: "Match Disputes", icon: AlertTriangle, desc: "Final decisions are managed by the TribeX Integrity Team." },
                    ].map((item, i) => (
                        <div key={i} className="p-8 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                            <item.icon className="size-6 text-zinc-700" />
                            <h4 className="text-xs font-black italic uppercase tracking-tighter text-white">{item.title}</h4>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </main>
  )
}
