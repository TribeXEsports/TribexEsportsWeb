"use client"

import React, { useState, useEffect } from "react";
import { Zap, Radio, Terminal, Cpu, Activity, Plus, X, Save, Image as ImageIcon, Loader2, Pencil, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  category: string;
  author: string;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "ANNOUNCEMENT",
    author: "Admin"
  });
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchNews();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/public/settings");
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error("Failed to fetch settings:", e);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingId ? `/api/admin/news/${editingId}` : "/api/admin/news";
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchNews();
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: "", content: "", imageUrl: "", category: "ANNOUNCEMENT", author: "Admin" });
      }
    } catch (error) {
      console.error("Failed to save news:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingId(item.id);
    setFormData({
        title: item.title,
        content: item.content,
        imageUrl: item.imageUrl || "",
        category: item.category,
        author: item.author
    });
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news post?")) return;
    
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("Failed to delete news:", error);
    }
  };

  return (
    <div className="space-y-12 pb-24 font-sans max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="size-2 bg-primary animate-pulse rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">News & Alerts</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                Latest <span className="text-primary not-italic">News</span>
            </h2>
            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] italic max-w-lg">
                Latest updates, announcements, and community information.
            </p>
        </div>
        
        <button 
            onClick={() => {
                if (isCreating) {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({ title: "", content: "", imageUrl: "", category: "ANNOUNCEMENT", author: "Admin" });
                } else {
                    setIsCreating(true);
                }
            }}
            className="h-14 px-8 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-2xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl"
        >
            {isCreating ? <X className="size-4" /> : <Plus className="size-4" />}
            {isCreating ? "Cancel" : "Create News"}
        </button>
      </header>

      <AnimatePresence>
        {isCreating && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <form onSubmit={handleCreateNews} className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">Post Title</label>
                            <input 
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter news title here..."
                                className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 text-sm font-medium text-white outline-none focus:border-primary/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">Category</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 text-sm font-medium text-white outline-none focus:border-primary/50 transition-all"
                            >
                                <option value="ANNOUNCEMENT">Announcement</option>
                                <option value="MATCH_UPDATE">Match Update</option>
                                <option value="COMMUNITY">Community</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">News Content</label>
                        <textarea 
                            required
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            placeholder="Write your news post here..."
                            className="w-full h-40 bg-black border border-white/5 rounded-3xl p-8 text-sm font-medium text-white outline-none focus:border-primary/30 transition-all resize-none"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">Header Image</label>
                            <div className="flex gap-4">
                                <input 
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                    placeholder="Image URL or upload..."
                                    className="flex-1 h-14 bg-black border border-white/5 rounded-xl px-6 text-[12px] font-medium text-white outline-none"
                                />
                                <CldUploadWidget 
                                    uploadPreset={settings?.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
                                    options={{ 
                                        cloudName: settings?.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
                                    }}
                                    onSuccess={(result: any) => {
                                        const url = result?.info?.secure_url;
                                        if (url) setFormData({...formData, imageUrl: url});
                                    }}
                                >
                                    {({ open }) => (
                                        <button 
                                            type="button"
                                            onClick={() => open()}
                                            className="h-14 px-6 bg-zinc-800 text-white rounded-xl border border-white/5 flex items-center gap-2 hover:bg-primary transition-all active:scale-95"
                                        >
                                            <ImageIcon className="size-4" />
                                            Upload
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="h-14 px-12 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center gap-3 hover:bg-primary/80 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            {editingId ? "Update News" : "Publish News"}
                        </button>
                    </div>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden p-10 min-h-[400px]">
          {isLoading ? (
              <div className="flex items-center justify-center h-64">
                  <Loader2 className="size-10 text-zinc-800 animate-spin" />
              </div>
          ) : news.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                  <Radio className="size-12 text-zinc-800 mx-auto" strokeWidth={1} />
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">No news posts found.</p>
              </div>
          ) : (
            <div className="space-y-8">
                {news.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-8 group cursor-crosshair border-b border-white/5 pb-8 last:border-0">
                        {item.imageUrl && (
                            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                <img src={item.imageUrl} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" />
                            </div>
                        )}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{new Date(item.createdAt).toLocaleDateString()} // POSTED</span>
                                 <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[8px] font-black text-primary uppercase italic tracking-widest">{item.category}</span>
                            </div>
                            <h3 className="text-[17px] font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest italic leading-relaxed max-w-2xl line-clamp-2">
                                {item.content}
                            </p>
                        </div>
                        
                        <div className="flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                                onClick={() => handleEditNews(item)}
                                className="size-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all"
                            >
                                <Pencil className="size-4" />
                            </button>
                            <button 
                                onClick={() => handleDeleteNews(item.id)}
                                className="size-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "System Status", value: "Online", icon: Activity },
            { label: "Total Posts", value: news.length.toString(), icon: Terminal },
            { label: "Updates Loaded", value: "100%", icon: Zap },
          ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                  <div className="size-12 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                      <stat.icon className="size-5 text-primary/40" />
                  </div>
                  <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">{stat.label}</p>
                      <p className="text-xl font-black italic text-white uppercase">{stat.value}</p>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
