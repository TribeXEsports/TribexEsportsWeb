"use client"

import React, { useState, useEffect, useRef } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Zap,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, setHours, setMinutes, parseISO } from "date-fns";

interface CustomDateTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: any;
}

export function CustomDateTimePicker({ label, value, onChange, icon: Icon = CalendarIcon }: CustomDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial value or default to now
  const selectedDate = value ? new Date(value) : new Date();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleDateClick = (day: Date) => {
    const newDate = setHours(setMinutes(day, selectedDate.getMinutes()), selectedDate.getHours());
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: number) => {
    const newDate = new Date(selectedDate);
    if (type === 'hours') newDate.setHours(val);
    else newDate.setMinutes(val);
    onChange(newDate.toISOString());
  };

  const quickPresets = [
    { label: "+1H", action: () => { const d = new Date(); d.setHours(d.getHours() + 1); onChange(d.toISOString()); } },
    { label: "Tomorrow", action: () => { const d = new Date(); d.setDate(d.getDate() + 1); onChange(d.toISOString()); } },
    { label: "Finals (8PM)", action: () => { const d = new Date(); d.setHours(20, 0, 0, 0); onChange(d.toISOString()); } },
  ];

  return (
    <div className="space-y-4 relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4 leading-none">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-18 bg-zinc-900/20 border border-white/5 rounded-[2rem] pl-16 pr-6 flex items-center justify-between text-left group hover:border-primary/40 hover:bg-zinc-900/40 transition-all",
          isOpen && "border-primary/40 bg-zinc-950 shadow-[0_0_30px_rgba(220,38,38,0.05)]"
        )}
        aria-label={label ? `Select ${label}` : "Open date time picker"}
        aria-expanded={isOpen}
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Icon className={cn("size-5 transition-colors", isOpen ? "text-primary" : "text-zinc-600")} />
        </div>
        
        <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                {value ? format(new Date(value), "PPP") : "SELECT DATE"}
            </span>
            <span className="text-[14px] font-black text-primary uppercase tracking-tight">
                {value ? format(new Date(value), "p") : "SET TIME"}
            </span>
        </div>

        <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <ChevronRight className={cn("size-4 text-zinc-600 transition-transform", isOpen && "rotate-90 text-primary")} />
            </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/90 backdrop-blur-xl"
               onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1 leading-none">Scheduler Protocol</span>
                        <h3 className="text-xl font-black uppercase tracking-tight text-white">{label.split(' ')[0]} <span className="text-primary">Engagement</span></h3>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Close scheduler modal"
                    >
                        <X className="size-5 text-zinc-400" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Date Picker */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{format(currentMonth, "MMMM yyyy")}</span>
                            <div className="flex gap-1">
                                <button 
                                    type="button" 
                                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
                                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Previous Month"
                                >
                                    <ChevronLeft className="size-3.5" />
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
                                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Next Month"
                                >
                                    <ChevronRight className="size-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => (
                                <div key={i} className="text-[9px] font-black text-zinc-800 text-center mb-2 uppercase tracking-widest">{d}</div>
                            ))}
                            {days.map((day: Date, i: number) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleDateClick(day)}
                                    className={cn(
                                        "aspect-square rounded-lg flex items-center justify-center text-[11px] font-bold transition-all border shadow-sm",
                                        isSameDay(day, selectedDate)
                                            ? "bg-white border-white text-black shadow-lg"
                                            : "bg-transparent border-transparent text-zinc-600 hover:border-white/10 hover:text-white",
                                        isToday(day) && !isSameDay(day, selectedDate) && "text-primary font-black"
                                    )}
                                >
                                    {format(day, "d")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Picker */}
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Select Time</span>
                            <div className="flex items-center justify-center gap-6 py-8 bg-black/40 rounded-2xl border border-white/5">
                                <div className="space-y-3 text-center">
                                    <button 
                                        type="button" 
                                        onClick={() => handleTimeChange('hours', (selectedDate.getHours() + 1) % 24)} 
                                        className="text-zinc-800 hover:text-white transition-colors"
                                        aria-label="Increment Hour"
                                    >
                                        <ChevronLeft className="size-4 rotate-90" />
                                    </button>
                                    <div className="text-4xl font-black text-white px-2 tracking-tighter">{format(selectedDate, "HH")}</div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleTimeChange('hours', (selectedDate.getHours() + 23) % 24)} 
                                        className="text-zinc-800 hover:text-white transition-colors"
                                        aria-label="Decrement Hour"
                                    >
                                        <ChevronLeft className="size-4 -rotate-90" />
                                    </button>
                                </div>
                                <span className="text-xl font-black text-zinc-900 mt-6">:</span>
                                <div className="space-y-3 text-center">
                                    <button 
                                        type="button" 
                                        onClick={() => handleTimeChange('minutes', (selectedDate.getMinutes() + 5) % 60)} 
                                        className="text-zinc-800 hover:text-white transition-colors"
                                        aria-label="Increment Minute"
                                    >
                                        <ChevronLeft className="size-4 rotate-90" />
                                    </button>
                                    <div className="text-4xl font-black text-white px-2 tracking-tighter">{format(selectedDate, "mm")}</div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleTimeChange('minutes', (selectedDate.getMinutes() + 55) % 60)} 
                                        className="text-zinc-800 hover:text-white transition-colors"
                                        aria-label="Decrement Minute"
                                    >
                                        <ChevronLeft className="size-4 -rotate-90" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {quickPresets.map((p, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={p.action}
                                    className="py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:text-white hover:border-white/10 transition-all font-sans"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full h-14 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all active:scale-[0.98]"
                    >
                        Confirm Schedule
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
