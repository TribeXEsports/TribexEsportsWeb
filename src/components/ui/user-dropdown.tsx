"use client"

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const MENU_ITEMS = {
  status: [
    { value: "online", icon: "solar:check-circle-bold-duotone", label: "Online" },
    { value: "focus", icon: "solar:emoji-funny-circle-line-duotone", label: "Focus Mode" },
    { value: "offline", icon: "solar:moon-sleep-line-duotone", label: "Appear Offline" }
  ],
  profile: [
    { icon: "solar:widget-bold-duotone", label: "Pro Dashboard", action: "dashboard", iconClass: "text-primary" },
    { icon: "solar:user-circle-line-duotone", label: "Your Profile", action: "profile" },
    { icon: "solar:settings-line-duotone", label: "Account Settings", action: "settings" },
  ],
  premium: [
    { 
      icon: "solar:ranking-bold-duotone", 
      label: "Tribex Pro Pass", 
      action: "upgrade",
      iconClass: "text-primary",
      badge: { text: "ACTIVATE", className: "bg-primary text-white text-[9px] px-1.5" }
    },
  ],
  support: [
    { icon: "solar:question-circle-line-duotone", label: "Support Center", action: "help" }
  ],
  account: [
    { icon: "solar:logout-2-bold-duotone", label: "Log Out", action: "logout", iconClass: "text-zinc-500" }
  ]
};

interface UserDropdownProps {
  user?: any;
}

export const UserDropdown = ({ user }: UserDropdownProps) => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = React.useState("online");

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "TX";

  const handleAction = (action: string) => {
    if (action === "logout") {
      signOut();
    } else if (action === "dashboard") {
      router.push(user?.role === "admin" ? "/admin" : "/dashboard");
    } else if (action === "profile") {
      router.push("/profile");
    } else if (action === "settings") {
      router.push("/settings");
    } else if (action === "admin") {
      router.push("/admin");
    } else if (action === "settings") {
      router.push("/settings");
    } else if (action === "upgrade") {
      alert("Tribex Pro Pass activation is currently disabled for this sector.");
    } else if (action === "help") {
      router.push("/#faq");
    } else {
      console.log(`Action: ${action}`);
    }
  };

  const renderMenuItem = (item: any, index: number) => (
    <DropdownMenuItem 
      key={index}
      className={cn(
        "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        item.action === "logout" ? "hover:bg-red-500/10 hover:text-red-500" : ""
      )}
      onClick={() => handleAction(item.action)}
    >
      <span className="flex items-center gap-2.5">
        <Icon
          icon={item.icon}
          className={`size-5 ${item.iconClass || "text-zinc-500"}`}
        />
        <span className="font-bold tracking-tight">{item.label}</span>
      </span>
      {item.badge && (
        <Badge className={item.badge.className}>
          {item.badge.text}
        </Badge>
      )}
      {item.rightIcon && (
        <Icon
          icon={item.rightIcon}
          className="size-3.5 text-zinc-600"
        />
      )}
    </DropdownMenuItem>
  );

  const getStatusColor = (status: string) => {
    const colors = {
      online: "text-green-500 bg-green-500/10 border-green-500/20",
      offline: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
      focus: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    };
    return colors[status.toLowerCase() as keyof typeof colors] || colors.online;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative group outline-none"
          aria-label="Open user profile menu"
        >
            <Avatar className="relative cursor-pointer size-10 border-2 border-zinc-800 transition-transform group-hover:scale-105 active:scale-95">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className={cn(
                "absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-950",
                selectedStatus === 'online' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : 
                selectedStatus === 'focus' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "bg-zinc-600"
            )}></div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-[280px] rounded-2xl bg-black/95 backdrop-blur-2xl border-white/5 p-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]" 
        align="end"
        sideOffset={12}
      >
        <div className="bg-zinc-900/40 rounded-xl p-3 mb-1 border border-white/5">
          <div className="flex items-center gap-3">
            <Avatar className="size-11 border-2 border-white/5">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-black italic text-sm text-white truncate uppercase tracking-wider">{user.name}</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest truncate">{user.username || user.email}</p>
            </div>
            <Badge className={cn(getStatusColor(selectedStatus), "border h-5 px-1.5")}>
              {selectedStatus}
            </Badge>
          </div>
        </div>

        <DropdownMenuGroup className="px-1">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer p-2 rounded-lg">
              <span className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-400">
                <Icon icon="solar:smile-circle-line-duotone" className="size-5 text-zinc-500" />
                Update Status
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-zinc-900/95 border-white/5 rounded-xl p-1 shadow-2xl">
                <DropdownMenuRadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
                  {MENU_ITEMS.status.map((status, index) => (
                    <DropdownMenuRadioItem 
                        className="gap-2.5 font-bold italic h-9 rounded-lg px-2 data-[state=checked]:text-primary transition-colors" 
                        key={index} 
                        value={status.value}
                    >
                      <Icon icon={status.icon} className="size-5" />
                      {status.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="px-1 p-1">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          {user?.role === "admin" && (
            <DropdownMenuItem 
              className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] border border-primary/20 bg-primary/5 mb-1"
              onClick={() => handleAction("admin")}
            >
              <span className="flex items-center gap-2.5">
                <Icon icon="solar:shield-keyhole-bold-duotone" className="size-5 text-primary" />
                <span className="font-black italic tracking-tighter uppercase text-[10px] text-primary">Admin Command</span>
              </span>
            </DropdownMenuItem>
          )}
          {MENU_ITEMS.profile.map(renderMenuItem)}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="px-1 p-1">
          <DropdownMenuLabel>Competition</DropdownMenuLabel>
          {MENU_ITEMS.premium.map(renderMenuItem)}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="px-1 p-1">
          {MENU_ITEMS.support.map(renderMenuItem)}
        </DropdownMenuGroup>

        <div className="mt-1 bg-zinc-900/20 p-1 rounded-xl">
          <DropdownMenuGroup>
            {MENU_ITEMS.account.map(renderMenuItem)}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
