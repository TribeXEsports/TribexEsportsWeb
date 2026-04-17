import React from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { ShieldCheck, Gavel, UserX, AlertTriangle, Scale } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | TribeX Esports Rules of Conduct',
  description: 'TribeX Esports competitive rules, registration terms, and platform fair play standards.',
}

export default function TermsOfServicePage() {
  return (
    <main className="bg-black min-h-screen pb-32 selection:bg-primary selection:text-white">
      <PageHeader 
        badge="Protocol v4.0"
        title="Terms of Service"
        subtitle="Operational guidelines for elite competitive engagement."
      />

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl space-y-16">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {[
                    { icon: ShieldCheck, title: "Fair Play Protocol", desc: "Anti-cheat synchronization is mandatory for all tournament modules." },
                    { icon: Gavel, title: "Code of Conduct", desc: "Professionalism is expected across all communication channels." },
                    { icon: UserX, title: "Registration Verification", desc: "Multi-accounting or account sharing leads to permanent termination." },
                    { icon: AlertTriangle, title: "Dispute Sync", desc: "Final match results are governed by the TribeX Integrity Team." },
                ].map((item, i) => (
                    <div key={i} className="p-10 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4 hover:border-primary/20 transition-all group">
                        <item.icon className="size-6 text-zinc-600 group-hover:text-primary transition-colors" />
                        <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">{item.title}</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="prose prose-invert max-w-none space-y-12">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-primary decoration-4 underline-offset-8">01 / Eligibility</h2>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed tracking-wider uppercase">
                        All participants must hold a valid and verified TribeX profile. Age restrictions may apply based on specific tournament modules. Tournament entry is strictly limited to one registration per player, per event module.
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-primary decoration-4 underline-offset-8">02 / Tournament Integrity</h2>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed tracking-wider uppercase">
                        Players found utilizing third-party enhancements, scripts, or external hardware advantages will be immediately disqualified. Any attempt to manipulate tournament outcomes through collusion results in a lifetime ban from the TribeX circuit.
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-primary decoration-4 underline-offset-8">03 / Financial Transactions</h2>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed tracking-wider uppercase">
                        Entry fees for paid tournaments are processed through our secure payment gateway. Refund requests are only processed if the mission is aborted by TribeX HQ. No platform credits or cash refunds are issued for player non-attendance.
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase underline decoration-primary decoration-4 underline-offset-8">04 / Platform Liability</h2>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed tracking-wider uppercase">
                        TribeX Esports acts as a synchronization platform and host. We are not liable for external hardware failures or connectivity issues experienced during the competitive circuit. The Integrity Team decision on match outcomes is final and binding.
                    </p>
                </div>
            </div>

            <div className="pt-20 border-t border-white/5 text-center">
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest leading-relaxed">
                    Terms Effective Date: 06-04-2026 // Operational HQ
                </p>
            </div>
        </div>
      </section>
    </main>
  )
}
