"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Image as ImageIcon,
  Link as LinkIcon,
  Trophy,
  MessageSquare,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  link?: string;
  linkText: string;
  type: string;
  tournamentId?: string;
  isActive: boolean;
  showOnce: boolean;
  createdAt: string;
}

export function NotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    imageUrl: "",
    link: "",
    linkText: "Learn More",
    type: "CUSTOM",
    tournamentId: "",
    isActive: true,
    showOnce: true,
  });

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({
          title: "",
          message: "",
          imageUrl: "",
          link: "",
          linkText: "Learn More",
          type: "CUSTOM",
          tournamentId: "",
          isActive: true,
          showOnce: true,
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to create notification", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to toggle notification", error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
            Popup <span className="text-primary">Notifications</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Manage global alerts and tournament highlights</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
            isCreating ? "bg-zinc-800 text-zinc-400" : "bg-primary text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95"
          )}
        >
          {isCreating ? "Cancel" : <><Plus className="size-4" /> Create Notification</>}
        </button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. MEGA TOURNAMENT LIVE"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Message</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell your players what's happening..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all min-h-[120px] resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    >
                      <option value="CUSTOM">Custom Message</option>
                      <option value="TOURNAMENT">Tournament Direct</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Link Text</label>
                    <input 
                      type="text" 
                      value={formData.linkText}
                      onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                      placeholder="e.g. JOIN NOW"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Image URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
                  <input 
                    type="text" 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://images.com/banner.jpg"
                    className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Link URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
                  <input 
                    type="text" 
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="/tournaments/..."
                    className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <div className={cn(
                      "w-10 h-5 rounded-full transition-colors",
                      formData.isActive ? "bg-primary" : "bg-zinc-800"
                    )} />
                    <div className={cn(
                      "absolute top-1 left-1 size-3 bg-white rounded-full transition-transform shadow-sm",
                      formData.isActive && "translate-x-5"
                    )} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Initially Active</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={formData.showOnce}
                      onChange={(e) => setFormData({...formData, showOnce: e.target.checked})}
                    />
                    <div className={cn(
                      "w-10 h-5 rounded-full transition-colors",
                      formData.showOnce ? "bg-primary" : "bg-zinc-800"
                    )} />
                    <div className={cn(
                      "absolute top-1 left-1 size-3 bg-white rounded-full transition-transform shadow-sm",
                      formData.showOnce && "translate-x-5"
                    )} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Show Once Only</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] py-4 rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Publish Notification"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="grid grid-cols-1 gap-4">
        {loading && !isCreating ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Scanning system frequencies...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/20 transition-all backdrop-blur-sm">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "size-12 rounded-xl flex items-center justify-center border transition-all",
                  notif.isActive ? "bg-primary/10 border-primary/20 text-primary" : "bg-zinc-800 border-white/5 text-zinc-600"
                )}>
                  {notif.type === "TOURNAMENT" ? <Trophy className="size-6" /> : <MessageSquare className="size-6" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-black text-white uppercase tracking-tight">{notif.title}</h4>
                    <span className={cn(
                      "text-[8px] px-2 py-0.5 rounded-full font-black tracking-widest border uppercase",
                      notif.isActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-zinc-800 border-white/5 text-zinc-500"
                    )}>
                      {notif.isActive ? "Active" : "Archived"}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs line-clamp-1 max-w-md">{notif.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleActive(notif.id, notif.isActive)}
                  className={cn(
                    "p-2 rounded-lg border transition-all",
                    notif.isActive ? "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10" : "border-white/10 text-zinc-600 hover:text-white"
                  )}
                  title={notif.isActive ? "Deactivate" : "Activate"}
                >
                  {notif.isActive ? <ToggleRight className="size-5" /> : <ToggleLeft className="size-5" />}
                </button>
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 rounded-lg border border-white/10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Delete"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-zinc-900/30 border border-dashed border-white/5 rounded-3xl py-20 flex flex-col items-center gap-4 text-center">
            <div className="size-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-700">
               <AlertCircle className="size-8" />
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">No notifications detected</p>
              <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest">Create your first alert to engage your community</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
