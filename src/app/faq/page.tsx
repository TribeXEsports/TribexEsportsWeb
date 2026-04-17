import React from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { HelpCircle, ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react'

export const metadata = {
  title: 'FAQ | TribeX Esports Intelligence Center',
  description: 'Frequently Asked Questions regarding TribeX Esports tournaments, registration protocols, and fair play standards.',
}

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I register for a tournament?",
      a: "Navigate to the 'Tournaments' section, select your preferred event, and click 'Register Now'. Ensure your squad members are correctly listed with their official In-Game IDs (UIDs). Only verified accounts with completed profiles can finalize the registration protocol."
    },
    {
      q: "When will the room IDs be distributed?",
      a: "Room IDs and Passwords are automatically revealed 15 minutes prior to the scheduled start time. You can access these details directly from your 'Dashboard' or the specific 'Tournament Detail' page after your registration is verified."
    },
    {
      q: "What happens if I encounter a cheater?",
      a: "TribeX maintains a zero-tolerance policy. If you suspect foul play, use the 'Dispute' feature in your match dashboard. You MUST provide clear video evidence or screenshots for our integrity team to review. Validated cheaters receive an immediate and permanent ban from all TribeX circuits."
    },
    {
        q: "Are substitutes allowed in the roster?",
        a: "Substitutes are permitted only if the specific tournament rules allow it. You must register your substitutes during the initial checkout phase. No roster changes are permitted once the tournament has officially commenced."
    },
    {
        q: "How are prize pools distributed?",
        a: "Prize pool distribution follows the 'Final Standings' verification. Funds are typically disbursed within 48-72 hours post-event via your preferred payout method configured in your Dashboard profile."
    }
  ]

  return (
    <main className="bg-black min-h-screen pb-32 selection:bg-primary selection:text-white">
      <PageHeader 
        badge="General FAQ"
        title="Help Center"
        subtitle="Find answers to common questions about our platform, tournaments, and rules."
      />

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl space-y-12">
            
            <div className="grid grid-cols-1 gap-6">
                {faqs.map((faq, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                            <HelpCircle className="size-24 text-white" />
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-start gap-6">
                                <div className="size-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black text-primary">0{i+1}</span>
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                                    {faq.q}
                                </h3>
                            </div>
                            <div className="pl-14">
                                <p className="text-zinc-500 font-medium leading-relaxed tracking-wider text-sm uppercase">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-12 text-center space-y-8">
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-full">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Need more assistance?</span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all clip-tactical">
                        Contact Support
                    </button>
                    <button className="px-12 py-5 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                        Join Discord
                    </button>
                </div>
            </div>

        </div>
      </section>
    </main>
  )
}
