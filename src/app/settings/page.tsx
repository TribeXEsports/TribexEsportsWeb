"use client"

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Shield, 
  CircleUser, 
  Mail, 
  Lock, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  AtSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CldUploadWidget } from "next-cloudinary";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    image: "",
    newPassword: "",
    confirmPassword: "",
    twitterUrl: "",
    instagramUrl: "",
    youtubeUrl: ""
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        image: session.user.image || "",
        username: (session.user as any).username || "",
        twitterUrl: (session.user as any).twitterUrl || "",
        instagramUrl: (session.user as any).instagramUrl || "",
        youtubeUrl: (session.user as any).youtubeUrl || ""
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "security") {
      if (!formData.newPassword) return setMessage({ type: "error", text: "Please enter a new password" });
      if (formData.newPassword !== formData.confirmPassword) {
        return setMessage({ type: "error", text: "Passwords do not match" });
      }
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          image: formData.image,
          twitterUrl: formData.twitterUrl,
          instagramUrl: formData.instagramUrl,
          youtubeUrl: formData.youtubeUrl,
          password: activeTab === "security" ? formData.newPassword : null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.details || data.error || "Update protocol failed" });
      } else {
        setMessage({ type: "success", text: "Settings synchronized successfully" });
        if (session) {
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: formData.name,
                    image: formData.image,
                    username: formData.username,
                    twitterUrl: formData.twitterUrl,
                    instagramUrl: formData.instagramUrl,
                    youtubeUrl: formData.youtubeUrl
                }
            }); 
            // Clear passwords if success
            setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server communication error detected" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="space-y-12">
        <header className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="size-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">System Preferences</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Profile <span className="text-primary italic">Settings</span>
            </h1>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest max-w-md leading-relaxed">
              Manage your digital identity, security protocols, and account visibility across the network.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Navigation Sidebar */}
            <aside className="md:col-span-3 space-y-3">
                {[
                    { id: "profile", label: "General Info", icon: CircleUser },
                    { id: "security", label: "Account Security", icon: Shield }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border group",
                            activeTab === tab.id 
                                ? "bg-white text-black border-white shadow-xl" 
                                : "bg-white/5 text-zinc-500 border-white/5 hover:border-white/10 hover:bg-white/[0.08]"
                        )}
                    >
                        <tab.icon className={cn("size-4", activeTab === tab.id ? "text-primary" : "text-zinc-600 transition-colors group-hover:text-zinc-400")} />
                        {tab.label}
                    </button>
                ))}
            </aside>

            {/* Main Configuration Console */}
            <div className="md:col-span-9">
                <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                        <Lock className="size-64" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                        <AnimatePresence mode="wait">
                            {activeTab === "profile" ? (
                                <motion.div 
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-10"
                                >
                                    {/* Avatar Selection */}
                                    <div className="flex flex-col sm:flex-row items-center gap-10 p-8 bg-black/40 border border-white/5 rounded-3xl">
                                        <div className="relative group shrink-0">
                                            <div className="size-28 rounded-full border-2 border-white/10 overflow-hidden bg-zinc-950 transition-all group-hover:border-primary">
                                                <img 
                                                    src={formData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || 'tribex'}`} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    alt="Identity Portrait" 
                                                />
                                            </div>
                                            <CldUploadWidget 
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
                                                onSuccess={(result: any) => {
                                                    if (result.info && result.info.secure_url) {
                                                        setFormData({...formData, image: result.info.secure_url});
                                                    }
                                                }}
                                            >
                                                {({ open }) => (
                                                    <button 
                                                        type="button"
                                                        onClick={() => open()}
                                                        className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all active:scale-90 border-4 border-zinc-900"
                                                    >
                                                        <Camera className="size-5" />
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                        <div className="space-y-2 text-center sm:text-left">
                                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">Profile Picture</h3>
                                            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest leading-relaxed max-w-xs">
                                                This portrait will be visible across the arena network and leaderboards.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Input Fields Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <CircleUser className="size-3 text-zinc-700" /> Full Name
                                            </label>
                                            <input 
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all"
                                                placeholder="Enter full name"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <AtSign className="size-3 text-zinc-700" /> Display Name
                                            </label>
                                            <input 
                                                type="text"
                                                value={formData.username}
                                                onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                                                className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-6 text-sm font-black uppercase tracking-widest text-primary outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all"
                                                placeholder="Choose username"
                                            />
                                        </div>
                                    </div>

                                    {/* Social Connectivity Section */}
                                    <div className="pt-10 border-t border-white/5 space-y-8">
                                        <div className="flex items-center gap-3">
                                            <Globe className="size-4 text-primary" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Social Connectivity</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                    <Twitter className="size-3 text-zinc-700" /> Twitter URL
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={formData.twitterUrl}
                                                    onChange={e => setFormData({...formData, twitterUrl: e.target.value})}
                                                    className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-bold text-white outline-none focus:border-white/30 transition-all font-mono"
                                                    placeholder="twitter.com/..."
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                    <Instagram className="size-3 text-zinc-700" /> Instagram URL
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={formData.instagramUrl}
                                                    onChange={e => setFormData({...formData, instagramUrl: e.target.value})}
                                                    className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-bold text-white outline-none focus:border-white/30 transition-all font-mono"
                                                    placeholder="instagram.com/..."
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                    <Youtube className="size-3 text-zinc-700" /> YouTube URL
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={formData.youtubeUrl}
                                                    onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                                                    className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-bold text-white outline-none focus:border-white/30 transition-all font-mono"
                                                    placeholder="youtube.com/..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Read-only segment */}
                                    <div className="pt-8 border-t border-white/5">
                                        <div className="space-y-3 opacity-60">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <Mail className="size-3 text-zinc-800" /> Contact Email
                                            </label>
                                            <div className="w-full h-14 bg-black/40 border border-white/[0.02] rounded-2xl px-6 flex items-center text-sm font-medium text-zinc-600 cursor-not-allowed">
                                                {session.user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-10"
                                >
                                    <div className="p-8 bg-zinc-950/60 border border-white/5 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Shield className="size-5 text-primary" />
                                            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Security Advisory</h3>
                                        </div>
                                        <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest">
                                            Passwords must be at least 8 characters long. Updating your credentials will sign you out of all other active sessions for security purposes.
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <Lock className="size-3 text-zinc-700" /> New Password
                                            </label>
                                            <input 
                                                type="password"
                                                value={formData.newPassword}
                                                onChange={e => setFormData({...formData, newPassword: e.target.value})}
                                                className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all"
                                                placeholder="••••••••••••"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <Shield className="size-3 text-zinc-700" /> Confirm Password
                                            </label>
                                            <input 
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                                className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Control */}
                        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {message.text && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={cn(
                                                "flex items-center gap-3 font-bold uppercase tracking-widest text-[9px]",
                                                message.type === "success" ? "text-green-500" : "text-primary"
                                            )}
                                        >
                                            {message.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
                                            {message.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="h-14 px-12 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-glow-red active:scale-95 disabled:opacity-50 min-w-[240px]"
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <>Update Profile <Save className="size-4" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
