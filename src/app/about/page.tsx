import React from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Target, Users2, Rocket, Trophy, Shield, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'About TribeX Esports | The Evolution of Competitive Gaming',
  description: 'TribeX Esports is a high-performance gaming ecosystem dedicated to competition, community, and the elite gaming experience.',
}

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findFirst()

  return (
    <main className="bg-black min-h-screen selection:bg-primary selection:text-white">
      <PageHeader
        badge="Professional Esports"
        title="TribeX Organization"
        subtitle="Dedicated to building a strong platform for players, creators, and esports entertainment."
      />

      {/* WHO WE ARE — full-width text section, no boxes */}
      <section className="py-28 px-6 border-b border-white/5">
        <div className="container mx-auto max-w-5xl space-y-16">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Left label column */}
            <div className="md:col-span-4 space-y-4 md:pt-2">
              <div className="flex items-center gap-3">
                <div className="h-5 w-[3px] bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Who We Are</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-tight">
                Our<br />Vision
              </h2>
            </div>

            {/* Right content column */}
            <div className="md:col-span-8 space-y-6 text-zinc-400 font-medium leading-loose tracking-wide text-[15px]">
              <p>
                TribeX Esports is a competitive gaming and esports organization dedicated to building a strong platform for players, creators, communities, and esports entertainment. Our goal is to create an ecosystem where talent is discovered, competition is celebrated, and gaming experiences are delivered with professionalism and passion.
              </p>
              <p>
                We specialize in competitive team development, tournament hosting, community engagement, content creation, and esports event execution. From organizing custom rooms and online tournaments to managing registrations, match flow, result updates, and fair play systems, TribeX Esports focuses on delivering well-structured and high-quality gaming events.
              </p>
              <p>
                Our organization is built on the values of teamwork, discipline, growth, innovation, and community. We are committed to giving players opportunities to prove themselves, creating exciting experiences for gaming audiences, and building a brand that stands strong in the evolving esports industry.
              </p>
            </div>
          </div>

          {/* Horizontal stats strip — replaces the boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {[
              { label: 'Tournaments Hosted', value: settings?.aboutStatTournaments || '50+' },
              { label: 'Registered Players',  value: settings?.aboutStatPlayers      || '2500+' },
              { label: 'Prize Distributed',   value: settings?.aboutStatPrize        || '₹1.2L+' },
              { label: 'Games Supported',     value: settings?.aboutStatGames        || '4+' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-950 px-8 py-10 flex flex-col gap-2 hover:bg-zinc-900/60 transition-colors">
                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">{stat.value}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO — horizontal list, no cards */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="container mx-auto max-w-5xl space-y-16">
          <div className="flex items-center gap-4">
            <div className="h-5 w-[3px] bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">What We Do</span>
          </div>

          <div className="divide-y divide-white/5">
            {[
              { icon: Trophy,  title: 'Tournament Hosting',     desc: 'Structured online and LAN events across Free Fire, BGMI, Valorant, and more with transparent results and prize pools.' },
              { icon: Users2,  title: 'Team Development',       desc: 'Identifying, building, and supporting competitive rosters with the tools and matches they need to grow.' },
              { icon: Shield,  title: 'Fair Play & Integrity',  desc: 'Zero-tolerance anti-cheat enforcement, dispute resolution, and verified player accounts across every event.' },
              { icon: Zap,     title: 'Event Production',       desc: 'End-to-end execution of room hosting, match scheduling, score tracking, and result announcement.' },
              { icon: Rocket,  title: 'Community & Content',    desc: 'Building an active audience through social media, creator partnerships, and esports entertainment.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-10 py-8 group">
                <item.icon className="size-5 text-zinc-700 group-hover:text-primary mt-1 transition-colors shrink-0" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                  <h3 className="md:col-span-2 text-base font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="md:col-span-3 text-zinc-500 text-sm font-medium leading-relaxed tracking-wider">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES — inline badges, not boxes */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-[3px] bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Foundation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-tight">
                Core<br />Values
              </h2>
            </div>
            <div className="md:col-span-8 flex flex-wrap gap-3">
              {['Teamwork', 'Discipline', 'Growth', 'Innovation', 'Community', 'Professionalism', 'Passion', 'Fair Play'].map((v) => (
                <span
                  key={v}
                  className="px-5 py-2.5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:border-primary hover:text-primary transition-all cursor-default"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-150 translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8 space-y-6">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none uppercase italic">
                Grow With <span className="text-primary">TribeX</span>
              </h2>
              <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-lg tracking-wide">
                Register for a tournament, join the community, or partner with us. The TribeX ecosystem is built for players who are serious about competing.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end items-end gap-4">
              <Link
                href="/tournaments"
                className="inline-flex items-center gap-3 bg-primary text-white font-black uppercase tracking-[0.2em] px-8 py-4 text-xs hover:bg-white hover:text-black transition-all group"
              >
                View Tournaments
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
