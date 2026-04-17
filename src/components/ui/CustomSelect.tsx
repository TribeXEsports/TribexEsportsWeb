"use client"

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
  icon?: string;
  lucide?: LucideIcon;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  icon?: LucideIcon;
}

export function CustomSelect({ label, value, options, onChange, icon: HeaderIcon }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3" ref={containerRef}>
      {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4 leading-none">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full h-18 bg-zinc-900/20 border border-white/5 rounded-3xl pr-6 text-[13px] font-bold uppercase tracking-tight text-white flex items-center justify-between group transition-all",
            HeaderIcon ? "pl-16" : "px-6",
            isOpen ? "border-primary/40 bg-zinc-950 shadow-[0_0_30px_rgba(220,38,38,0.05)]" : "hover:border-white/10 hover:bg-zinc-900/40"
          )}
          aria-label={label ? `Select ${label}` : "Toggle custom dropdown"}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="custom-select-listbox"
        >
          {HeaderIcon && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-primary transition-colors">
              <HeaderIcon className="size-5" />
            </div>
          )}
          
          <div className="flex items-center gap-3">
             {selectedOption.icon && <Icon icon={selectedOption.icon} className="size-5 text-primary" />}
             {selectedOption.lucide && <selectedOption.lucide className="size-5 text-primary" />}
             <span className="uppercase tracking-tight">{selectedOption.label}</span>
          </div>

          <ChevronDown className={cn("size-4 text-zinc-600 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute z-50 w-full mt-4 bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden p-2 shadow-2xl"
              role="listbox"
              id="custom-select-listbox"
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={value === option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all",
                      value === option.id 
                        ? "bg-primary text-white shadow-lg" 
                        : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {option.icon && <Icon icon={option.icon} className={cn("size-5", value === option.id ? "text-white" : "text-primary")} />}
                    {option.lucide && <option.lucide className={cn("size-5", value === option.id ? "text-white" : "text-primary")} />}
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
