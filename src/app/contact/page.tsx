import React from 'react'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/ui/PageHeader'
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck } from 'lucide-react'

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Contact TribeX Esports | Professional Support Protocol',
  description: 'Connect with the TribeX Esports support team for tournament inquiries, partnership opportunities, and technical assistance.',
}

export default async function ContactPage() {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch {}

  return (
    <main className="bg-black min-h-screen selection:bg-primary selection:text-white pb-32">
      <PageHeader 
        badge="Customer Support"
        title="Contact Us"
        subtitle="Our support team is available to assist you with any inquiries regarding tournaments or partnerships."
      />

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* CONTACT DETAILS CARDS */}
            <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4 mb-12">
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Support Channels</h2>
                     <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Standard response time: within 24 hours</p>
                </div>

                <div className="space-y-6">
                    {[
                        { icon: Mail, title: "Support Email", value: settings?.contactEmail || "support@tribexesports.cloud", label: "Email" },
                        { icon: Phone, title: "Phone Support", value: settings?.contactPhone || "+91 00000 00000", label: "Helpline" },
                        { icon: MapPin, title: "Physical Address", value: settings?.contactAddress || "Esports HQ, Digital City", label: "Location" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-primary/20 transition-all">
                            <div className="size-12 bg-white/[0.03] rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-primary/5 transition-all text-zinc-500 group-hover:text-primary">
                                <item.icon className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{item.title}</p>
                                <p className="text-sm font-bold text-white tracking-widest uppercase italic">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SOCIAL SYNC */}
                <div className="pt-8 space-y-6">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-700">Follow Our Updates</h3>
                     <div className="flex items-center gap-4">
                        {[
                            { icon: MessageSquare, label: "Discord", href: settings?.discordUrl },
                            { icon: Send, label: "Telegram", href: "#" },
                        ].map((social, i) => (
                            <a 
                                key={i} 
                                href={social.href || '#'} 
                                className="flex-1 h-14 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary hover:text-white hover:border-primary transition-all group"
                            >
                                <social.icon className="size-4" />
                                {social.label}
                            </a>
                        ))}
                     </div>
                </div>
            </div>

            {/* CONTACT FORM */}
            <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-3xl p-8 md:p-12 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="size-48 text-white" />
                </div>
                
                <div className="space-y-6 relative z-10">
                     <div className="space-y-2">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Get in Touch</h2>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest italic">Fill out the form below for assistance</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                            <input type="text" placeholder="Your Name" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                            <input type="email" placeholder="example@email.com" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all" />
                        </div>
                     </div>

                     <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Subject</label>
                            <select className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all appearance-none">
                                <option className="bg-zinc-900">TOURNAMENT INQUIRY</option>
                                <option className="bg-zinc-900">PARTNERSHIP INQUIRY</option>
                                <option className="bg-zinc-900">TECHNICAL SUPPORT</option>
                                <option className="bg-zinc-900">OTHER</option>
                            </select>
                     </div>

                     <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Message Content</label>
                            <textarea rows={6} placeholder="How can we help you?" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all resize-none" />
                     </div>

                     <div className="pt-6">
                        <button className="w-full bg-white text-black font-black uppercase tracking-[0.3em] py-5 rounded-xl text-xs hover:bg-primary hover:text-white transition-all active:scale-98 shadow-xl flex items-center justify-center gap-3">
                            <Send className="size-4" />
                            Send Message
                        </button>
                     </div>
                </div>
            </div>
        </div>
      </section>
    </main>
  )
}
