"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy, 
  Users, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  PlusCircle,
  ShieldCheck,
  Bell,
  Sword,
  Gamepad2,
  Handshake,
  Globe,
  Activity,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const sidebarGroups = [
  {
    title: "Dashboard",
    links: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Tournaments", href: "/admin/tournaments", icon: Trophy },
      { label: "Registrations", href: "/admin/registrations", icon: Users },
    ]
  },
  {
    title: "Content",
    links: [
      { label: "Create Tournament", href: "/admin/tournaments/create", icon: PlusCircle },
      { label: "User Management", href: "/admin/users", icon: ShieldCheck },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "News & Alerts", href: "/admin/news", icon: Bell },
      { label: "Roster", href: "/admin/roster", icon: Sword },
      { label: "Ambassadors", href: "/admin/ambassadors", icon: Handshake },
      { label: "Games", href: "/admin/games", icon: Gamepad2 },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
    ]
  },
  {
    title: "System",
    links: [
      { label: "Stress Test", href: "/admin/stress", icon: Activity },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

interface AdminSidebarProps {
  user: any;
  isMobile?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ user, isMobile, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
        "w-full h-full bg-zinc-950 border-r border-white/5 flex flex-col overflow-y-auto custom-scrollbar md:w-[280px]",
        !isMobile && "sticky top-0 h-screen"
    )}>
      <div className="p-8 border-b border-white/5 mb-4 group flex items-start justify-between">
        <Link href="/" className="flex flex-col gap-1 px-2" onClick={onClose}>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
            Tribex<span className="text-primary"> Arena</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Administrative Suite</p>
        </Link>
        {isMobile && (
            <button 
                onClick={onClose}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors md:hidden"
            >
                <X className="size-4" />
            </button>
        )}
      </div>

      <nav className="flex-1 px-6 flex flex-col gap-8">
        {sidebarGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-800">
              {group.title}
            </h3>
            <div className="flex flex-col gap-1">
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative overflow-hidden",
                      isActive 
                        ? "bg-white/[0.03] text-white shadow-sm" 
                        : "text-zinc-500 hover:text-white hover:bg-white/[0.02]"
                    )}
                  >
                    <link.icon className={cn("size-4 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                    <span className="font-bold text-[13px] tracking-tight uppercase">{link.label}</span>
                    {isActive && (
                       <div className="ml-auto size-1 rounded-full bg-primary shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5 bg-zinc-950/50 space-y-2">
          <Link 
            href="/"
            onClick={onClose}
            className="flex items-center gap-4 w-full px-4 py-3 text-zinc-600 hover:text-white transition-all group rounded-xl"
          >
            <Globe className="size-4 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Portal View</span>
          </Link>
          
          <button 
            className="flex items-center gap-4 w-full px-4 py-3 text-zinc-700 hover:text-red-500 transition-all group rounded-xl"
            onClick={() => {
                onClose?.();
                signOut({ callbackUrl: '/' });
            }}
          >
            <LogOut className="size-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Log Out</span>
          </button>
      </div>
    </aside>
  );
}
