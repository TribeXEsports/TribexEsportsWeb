"use client"

import React from 'react'
import { motion } from 'framer-motion'

export function BackgroundEffects() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            {/* Grid Texture */}
            <div className="absolute inset-0 bg-grid-dots opacity-[0.15]" />
            
            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />

            {/* Radial Glows - Nitro Optimized: Higher intensity on desktop, minimal footprint on mobile */}
            <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 sm:bg-primary/20 blur-[40px] sm:blur-[120px] rounded-full animate-pulse-slow will-change-transform" style={{ transform: 'translateZ(0)' }} />
            <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-accent/5 sm:bg-accent/10 blur-[40px] sm:blur-[120px] rounded-full will-change-transform" style={{ transform: 'translateZ(0)' }} />
            
            {/* Scanline Effect - Low-Frequency GPU Compositing */}
            <div className="absolute inset-x-0 h-[1.5px] bg-white/[0.005] sm:bg-white/[0.01] animate-scanline will-change-transform pointer-events-none" style={{ transform: 'translateZ(0)' }} />
        </div>

    )
}
