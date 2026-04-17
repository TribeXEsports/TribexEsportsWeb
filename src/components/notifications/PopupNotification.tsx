"use client";

import React, { useState, useEffect } from "react";
import { X, ExternalLink, Zap, Trophy, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function PopupNotification() {
  const [notification, setNotification] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveNotification = async () => {
      try {
        const res = await fetch("/api/notifications/active");
        const data = await res.json();
        
        if (data) {
          // Check if showOnce is enabled and if user has already seen this specific notification
          const storageKey = `notif_seen_${data.id}`;
          const hasSeen = localStorage.getItem(storageKey);
          
          if (!data.showOnce || !hasSeen) {
            setNotification(data);
            // Small delay for better UX
            setTimeout(() => {
              setIsVisible(true);
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Popup fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveNotification();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (notification?.showOnce) {
      localStorage.setItem(`notif_seen_${notification.id}`, "true");
    }
  };

  if (!notification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Header / Banner */}
            <div className="relative h-64 w-full overflow-hidden">
               {notification.imageUrl ? (
                  <>
                    <Image 
                      src={notification.imageUrl} 
                      alt={`Announcement Highlights: ${notification.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 512px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  </>
               ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-zinc-900 to-black flex items-center justify-center">
                     <Zap className="size-20 text-primary opacity-20 animate-pulse" />
                  </div>
               )}

               {/* Close Button */}
               <button 
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-all hover:bg-black/80"
                  aria-label="Close notification"
               >
                  <X className="size-4" />
               </button>

               {/* New Notification Badge */}
               <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">New Notification</span>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-10 -mt-8 relative z-10 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            {notification.type === "TOURNAMENT" ? <Trophy className="size-5 text-primary" /> : <MessageSquare className="size-5 text-primary" />}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Recommended for you</p>
                    </div>
                    
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
                        {notification.title}
                    </h2>
                    
                    <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                        {notification.message}
                    </p>
                </div>

                <div className="pt-4">
                  {notification.link ? (
                    <Link 
                      href={notification.link}
                      onClick={handleClose}
                      className="group relative flex items-center justify-center gap-3 w-full bg-primary py-5 rounded-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)]"
                    >
                      <div className="relative z-10 flex items-center gap-3">
                        <Zap className="size-4 text-white group-hover:animate-bounce" />
                        <span className="font-black italic uppercase tracking-widest text-[11px] text-white">
                           {notification.linkText || "Learn More"}
                        </span>
                        <ExternalLink className="size-3 text-white/50" />
                      </div>
                      
                      {/* Hover Shine Effect */}
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />
                    </Link>
                  ) : (
                    <button 
                      onClick={handleClose}
                      className="w-full py-5 rounded-2xl bg-zinc-900 border border-white/5 text-white font-black italic uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all font-sans"
                      aria-label="Acknowledge notification"
                    >
                      Acknowledge Receipt
                    </button>
                  )}
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
