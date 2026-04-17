import React from "react";
import { NotificationManager } from "@/components/admin/NotificationManager";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-12 pb-20 font-sans">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-sans">
            Global <span className="text-primary font-sans">Notifications</span>
        </h2>
        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">System-wide alerts, popups, and community announcements.</p>
      </header>

      <NotificationManager />
    </div>
  );
}
