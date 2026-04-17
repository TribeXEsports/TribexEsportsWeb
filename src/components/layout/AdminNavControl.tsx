"use client"

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AnimatePresence, motion } from "framer-motion";

export function AdminNavControl({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-black/60 backdrop-blur-2xl border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-[60]">
        <Link href="/admin" className="flex items-center gap-2">
           <span className="text-primary font-black italic uppercase tracking-tighter">Tribex</span>
           <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest border border-zinc-800 px-1.5 py-0.5 rounded italic">Admin</span>
        </Link>
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-all bg-white/5 rounded-lg active:scale-95"
        >
          {isOpen ? <X className="size-6 text-primary" /> : <Menu className="size-6" />}
        </button>
      </header>

      {/* Sidebar - Desktop (Static) & Mobile (Drawer) */}
      <div className="hidden md:block sticky top-0 h-screen">
          <AdminSidebar user={user} />
      </div>

      <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop Overlay */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] md:hidden"
                />
                {/* Mobile Drawer */}
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 left-0 bottom-0 w-[280px] z-[80] md:hidden shadow-2xl"
                >
                    <AdminSidebar user={user} isMobile onClose={() => setIsOpen(false)} />
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </>
  );
}
