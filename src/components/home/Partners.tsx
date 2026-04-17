"use client";

import React from "react";
import { motion } from "framer-motion";

export function Partners() {
  const [partners, setPartners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/public/partners")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPartners(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Background Glitter Effect - Pure CSS Nitro Optimized */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(50%_50%,white,transparent_85%)]">
            <div className="absolute inset-[-100%] bg-[radial-gradient(1px_1px,rgba(220,38,38,0.4)_1px,transparent_0)] bg-[size:40px_40px] animate-glitter" />
            <div className="absolute inset-[-100%] bg-[radial-gradient(1.5px_1.5px,rgba(255,255,255,0.2)_1px,transparent_0)] bg-[size:60px_60px] animate-glitter-slow [animation-delay:1s]" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-8 bg-zinc-800" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.6em]">Elite Network</span>
            <span className="h-[1px] w-8 bg-zinc-800" />
          </div>
          <h2 className="text-impact text-white leading-[0.9]" style={{ fontSize: 'var(--font-size-h2)' }}>
            Trusted by the<br />
            <span className="text-red-600">Heavyweights.</span>
          </h2>
          <p className="text-zinc-400 font-medium max-w-xl mx-auto uppercase tracking-widest text-[9px] md:text-[11px] helvetica-font leading-relaxed">
            Collaborating with global powerhouses and top-tier academic institutions to redefine the competitive landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
             Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900 animate-pulse clip-tactical" />
             ))
          ) : partners.length > 0 ? (
            partners.map((partner, idx) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 md:p-10 relative flex flex-col items-center justify-center text-center space-y-4 hover:bg-white/[0.04] transition-all glass-arena clip-tactical"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.4em] helvetica-font opacity-80 group-hover:opacity-100 group-hover:text-red-400 transition-all">
                    {partner.category}
                  </span>
                  <h3 className="text-xl lg:text-2xl ppFormula-font font-black uppercase tracking-tighter text-white group-hover:scale-105 transition-transform leading-tight break-normal">
                    {partner.name}
                  </h3>
                </div>
                <div className="h-[1px] w-8 bg-red-600/20 group-hover:w-12 transition-all" />
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] helvetica-font">
                  {partner.role}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
                Network connection pending // No alliances registered
            </div>
          )}
        </div>

        <div className="mt-24 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 py-6 sm:py-4 px-8 sm:px-12 border border-white/5 rounded-none bg-white/[0.02] backdrop-blur-md w-full sm:w-auto">
                <span className="text-zinc-400 font-black uppercase text-[9px] tracking-[0.2em]">Institutional Verification</span>
                <div className="hidden sm:block h-4 w-[1px] bg-white/10" />
                <span className="text-white font-black uppercase text-[10px] tracking-widest text-center">50+ Global Universities Subscribed</span>
            </div>
        </div>
      </div>
    </section>
  );
}
