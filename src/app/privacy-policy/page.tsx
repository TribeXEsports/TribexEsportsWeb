import React from 'react'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata = {
  title: 'Privacy Policy | TribeX Esports Platform Protocol',
  description: 'TribeX Esports privacy standards regarding data encryption, player information, and community safety.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-black min-h-screen pb-32 selection:bg-primary selection:text-white">
      <PageHeader 
        badge="Data Privacy"
        title="Privacy Policy"
        subtitle="Our commitment to player data security and transparency."
      />

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl prose prose-invert prose-zinc prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-p:text-zinc-500 prose-p:font-medium prose-p:tracking-wider prose-p:uppercase prose-p:text-xs">
            <div className="space-y-16">
                
                <div className="space-y-8 p-12 bg-white/[0.01] border border-white/5 rounded-3xl">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">01 // Data Collection</h2>
                    <p>
                        TribeX Esports collects specific player information (Usernames, In-Game IDs, Emails) exclusively for tournament registration and verification purposes.
                    </p>
                </div>

                <div className="space-y-8 p-12 bg-white/[0.01] border border-white/5 rounded-3xl">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">02 // Encryption Protocols</h2>
                    <p>
                        We utilize industry-standard cryptographic protocols to ensure your sensitive mission data is protected from unauthorized access. Payment information is processed via certified secure gateways (Razorpay/Cashfree) and is never stored on our operational servers.
                    </p>
                </div>

                <div className="space-y-8 p-12 bg-white/[0.01] border border-white/5 rounded-3xl">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">03 // Community Integrity</h2>
                    <p>
                        Your public profile information is visible to other members of the TribeX network for competitive transparency. This includes your win/loss statistics and game-specific identifiers. We do not sell player intelligence to third-party entities.
                    </p>
                </div>

                <div className="space-y-8 p-12 bg-white/[0.01] border border-white/5 rounded-3xl">
                    <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">04 // Account Deletion</h2>
                    <p>
                        Users have the right to request account deletion at any time. Requests will be processed within 72 hours, permanently removing your data from our systems.
                    </p>
                </div>

                <div className="pt-20 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest leading-relaxed">
                        Last Modified: April 06, 2026 // Operational HQ
                    </p>
                </div>
            </div>
        </div>
      </section>
    </main>
  )
}
