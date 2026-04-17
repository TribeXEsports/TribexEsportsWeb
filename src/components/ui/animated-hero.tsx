"use client"

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Crosshair, Activity, Shield, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["ARENA", "LEAGUE", "ORDER", "GLORY", "LEGEND"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2800);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full relative min-h-screen flex items-center justify-center overflow-hidden bg-black select-none font-sans antialiased">
      {/* Background Decor - Industrial Tension */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-primary/10 z-10" />
          <motion.div 
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
          >
              <Image 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
                  alt="Esports Arena Background" 
                  fill
                  priority
                  loading="eager"
                  className="object-cover grayscale brightness-[0.2]"
              />
          </motion.div>
          
          {/* Scanning Line overlay */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-primary/30 animate-scanline z-11 pointer-events-none blur-[1px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay z-11 pointer-events-none" />
      </div>

      {/* The TRIBEX Monolith Watermark */}
      <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <h2 className="text-[50vw] font-black italic tracking-[-0.2em] uppercase leading-none text-white/5 whitespace-nowrap -rotate-6 scale-125">TRIBEX</h2>
      </div>

      <div className="container mx-auto px-6 relative z-30 flex flex-col items-center">
        {/* Platform Status Indicators */}
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex items-center gap-6"
        >
            <div className="flex items-center gap-2">
                <Cpu className="size-3 text-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-500 font-mono">SYSTEM_ENCRYPTED_SSL</span>
            </div>
            <div className="h-[1px] w-12 bg-zinc-800" />
            <span className="text-[10px] font-black uppercase tracking-[1em] text-primary italic drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">ELITE PLATFORM</span>
            <div className="h-[1px] w-12 bg-zinc-800" />
        </motion.div>

        <div className="text-center relative">
            <motion.h1 
                className="text-[15vw] md:text-[18rem] font-black tracking-[-0.14em] uppercase leading-[0.65] text-white flex flex-col items-center relative z-10 italic"
                initial={{ opacity: 0, y: 100, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="relative" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.05)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,1))' }}>
                DOMINATE
              </span>
              <div className="relative flex w-full justify-center overflow-hidden text-center h-[1.1em] text-primary mt-[-0.15em]">
                &nbsp;
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleNumber}
                    className="absolute font-black tracking-[-0.1em] italic brightness-125 pt-2"
                    style={{ 
                        textShadow: '0 0 60px rgba(220,38,38,0.8), 0 0 20px rgba(220,38,38,1)',
                        WebkitTextStroke: '1px rgba(220,38,38,0.3)'
                    }}
                    initial={{ opacity: 0, x: 200, skewX: "25deg" }}
                    animate={{ x: 0, opacity: 1, skewX: "-12deg" }}
                    exit={{ x: -200, opacity: 0, skewX: "-25deg" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    THE_{titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.5, scaleX: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="flex flex-col items-center mt-20 space-y-6"
            >
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <p className="text-zinc-400 max-w-lg font-black italic uppercase tracking-[0.6em] text-[9px] leading-relaxed select-none">
                   THE ULTIMATE HUB FOR ELITE COMPETITORS. 
                   <br/>
                   <span className="text-primary/90">PROFESSIONAL GRADE TOURNAMENTS // GLOBAL LEADERBOARDS</span>
                </p>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </motion.div>
        </div>

        {/* Industrial AGGRESSIVE Buttons */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-10 mt-28"
        >
            <button className="h-24 px-24 bg-white text-black font-black uppercase tracking-[0.6em] text-[13px] hover:bg-primary hover:text-white transition-all italic relative group border-none outline-none overflow-hidden skew-x-[-15deg] shadow-[20px_20px_60px_rgba(0,0,0,0.5)] active:scale-95">
                <div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                <span className="relative z-10 flex items-center gap-6">
                    GET STARTED <Zap className="size-6 fill-current" />
                </span>
                <div className="absolute top-0 right-0 w-4 h-4 bg-black/5" />
            </button>
            
            <button className="h-24 px-24 bg-zinc-900 border-2 border-white/5 text-zinc-600 font-black uppercase tracking-[0.6em] text-[11px] hover:border-primary/40 hover:text-white transition-all italic group skew-x-[-15deg] relative overflow-hidden backdrop-blur-3xl shadow-2xl active:scale-95">
                <span className="relative z-10 flex items-center gap-6">
                    EXPLORE EVENTS <Target className="size-6 group-hover:scale-125 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
            </button>
        </motion.div>

        {/* Dynamic HUD PERIMETER */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-20">
            <div className="absolute top-12 left-12 flex items-center gap-4">
                <div className="p-3 border border-primary/40">
                    <Shield className="size-4 text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[7px] font-black uppercase tracking-widest text-primary italic">Platform Status</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white italic">SECURE_VERIFIED</span>
                </div>
            </div>
            
            <div className="absolute bottom-12 left-12 p-6 border-l-2 border-b-2 border-zinc-800 w-48 h-24 flex items-end justify-start">
                 <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-600">EST_MMXXIV</span>
            </div>
            
            <div className="absolute bottom-12 right-12 p-6 border-r-2 border-b-2 border-zinc-800 w-48 h-24 flex items-end justify-end">
                 <div className="flex flex-col items-end gap-2">
                    <Activity className="size-4 text-primary animate-pulse" />
                    <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-600">SIGNAL_UPTIME: 99.8%</span>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
