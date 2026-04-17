"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    User, 
    Shield, 
    Lock, 
    Save,
    LayoutGrid,
    CircleUser,
    Camera,
    AtSign,
    Mail,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Twitter,
    Instagram,
    Youtube,
    ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CldUploadWidget } from "next-cloudinary"
import { useSession } from "next-auth/react"
import { useSettings } from "@/components/providers/SettingsProvider"

interface SettingsContentProps {
    user: any
}

export function SettingsContent({ user: initialUser }: SettingsContentProps) {
    const { data: session, update } = useSession();
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY'>('PROFILE')
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const { settings } = useSettings();

    const [formData, setFormData] = useState({
        name: initialUser.name || "",
        username: initialUser.username || "",
        image: initialUser.image || "",
        newPassword: "",
        confirmPassword: "",
        twitterUrl: initialUser.twitterUrl || "",
        instagramUrl: initialUser.instagramUrl || "",
        youtubeUrl: initialUser.youtubeUrl || ""
    });

    // Update form if user prop changes or session updates
    useEffect(() => {
        const currentUser = session?.user || initialUser;
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || "",
                image: currentUser.image || "",
                username: (currentUser as any).username || "",
                twitterUrl: (currentUser as any).twitterUrl || "",
                instagramUrl: (currentUser as any).instagramUrl || "",
                youtubeUrl: (currentUser as any).youtubeUrl || ""
            }));
        }
    }, [session, initialUser]);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (activeTab === 'SECURITY') {
            if (!formData.newPassword) return setMessage({ type: 'error', text: 'New password required' });
            if (formData.newPassword !== formData.confirmPassword) {
                return setMessage({ type: 'error', text: 'Passwords do not match' });
            }
        }

        setIsSaving(true)
        setMessage(null)

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: formData.name,
                    username: formData.username,
                    image: formData.image,
                    twitterUrl: formData.twitterUrl,
                    instagramUrl: formData.instagramUrl,
                    youtubeUrl: formData.youtubeUrl,
                    password: activeTab === 'SECURITY' ? formData.newPassword : null
                })
            })

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings synchronized successfully' })
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
                }
                // Reset passwords on success
                setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
            } else {
                setMessage({ type: 'error', text: data.details || data.error || 'Update failed' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server communication error' })
        } finally {
            setIsSaving(false)
            setTimeout(() => setMessage(null), 5000)
        }
    }

    return (
        <div className="space-y-12 pb-32 lg:pb-0 h-full overflow-y-auto no-scrollbar">
            {/* Professional Settings Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        Tactical Settings
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] max-w-md">
                        Manage your digital identity and security configurations.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Settings Navigation */}
                <aside className="lg:col-span-3 space-y-4">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6 text-zinc-600">
                        <LayoutGrid className="size-4" />
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.4em]">Dashboard Menu</h2>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        {[
                            { id: 'PROFILE', label: 'General Info', icon: CircleUser },
                            { id: 'SECURITY', label: 'Account Security', icon: Shield },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-xl transition-all border group shrink-0 lg:shrink",
                                    activeTab === tab.id 
                                        ? "bg-white text-black border-white shadow-xl" 
                                        : "text-zinc-500 border-transparent hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <tab.icon className={cn("size-4", activeTab === tab.id ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400")} />
                                <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Settings Form Content */}
                <div className="lg:col-span-9">
                    <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-14 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                            <Lock className="size-64" />
                        </div>

                        <form onSubmit={handleSave} className="space-y-12 relative z-10">
                            <AnimatePresence mode="wait">
                                {activeTab === 'PROFILE' ? (
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
                                                <div className="size-24 rounded-full border-2 border-white/10 overflow-hidden bg-zinc-950 transition-all group-hover:border-primary">
                                                    <img 
                                                        src={formData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || 'tribex'}`} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                        alt="Identity Portrait" 
                                                    />
                                                </div>
                                                <CldUploadWidget 
                                                    uploadPreset={settings?.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
                                                    options={{ 
                                                        cloudName: settings?.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
                                                    }}
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
                                                <h3 className="text-white font-bold uppercase tracking-widest text-xs tracking-[0.2em]">Profile Portrait</h3>
                                                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest leading-relaxed max-w-xs">
                                                    Update your visual marker across the network.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Input Fields Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                                     Full Name
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                                    className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-8 text-[11px] font-bold text-white outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all"
                                                    placeholder="Enter full name"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                                    Display Name
                                                </label>
                                                <div className="relative">
                                                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold">
                                                        <AtSign className="size-3" />
                                                    </div>
                                                    <input 
                                                        type="text"
                                                        value={formData.username}
                                                        onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                                                        className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-8 text-[11px] font-black uppercase tracking-widest text-primary outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all"
                                                        placeholder="username"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-white/5 space-y-8">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="size-4 text-primary" />
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Social Connectivity</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                                        <Twitter className="size-3" /> Twitter URL
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        value={formData.twitterUrl}
                                                        onChange={e => setFormData({...formData, twitterUrl: e.target.value})}
                                                        className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-bold text-white outline-none focus:border-white/30 transition-all"
                                                        placeholder="twitter.com/..."
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                                        <Instagram className="size-3" /> Instagram URL
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        value={formData.instagramUrl}
                                                        onChange={e => setFormData({...formData, instagramUrl: e.target.value})}
                                                        className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-bold text-white outline-none focus:border-white/30 transition-all"
                                                        placeholder="instagram.com/..."
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                                        <Youtube className="size-3" /> YouTube URL
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        value={formData.youtubeUrl}
                                                        onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                                                        className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-bold text-white outline-none focus:border-white/30 transition-all"
                                                        placeholder="youtube.com/..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/5 opacity-50">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 block mb-3">Associated Email Address</label>
                                            <div className="w-full h-14 bg-black/40 border border-white/[0.02] rounded-2xl px-8 flex items-center text-[11px] font-bold text-zinc-600 cursor-not-allowed italic">
                                                {initialUser.email}
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
                                                <Shield className="size-4 text-primary" />
                                                <h3 className="text-white font-bold uppercase tracking-widest text-xs">Security Protocol</h3>
                                            </div>
                                            <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-widest">
                                                Passwords must be at least 8 characters. Updating your credentials will sign you out of all other active sessions for security purposes.
                                            </p>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">New Password</label>
                                                <div className="relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700">
                                                        <Lock className="size-4" />
                                                    </div>
                                                    <input 
                                                        type="password"
                                                        value={formData.newPassword}
                                                        onChange={e => setFormData({...formData, newPassword: e.target.value})}
                                                        className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl pl-14 pr-8 text-[11px] font-bold text-white outline-none focus:border-white/30 transition-all"
                                                        placeholder="••••••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Verify Password</label>
                                                <div className="relative">
                                                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700">
                                                        <Shield className="size-4" />
                                                    </div>
                                                    <input 
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                                        className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl pl-14 pr-8 text-[11px] font-bold text-white outline-none focus:border-white/30 transition-all"
                                                        placeholder="••••••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Control */}
                            <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex-1">
                                    <AnimatePresence mode="wait">
                                        {message && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className={cn(
                                                    "flex items-center gap-3 font-bold uppercase tracking-widest text-[9px]",
                                                    message.type === 'success' ? "text-green-500" : "text-primary"
                                                )}
                                            >
                                                {message.type === 'success' ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
                                                {message.text}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="h-14 px-12 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50 w-full sm:min-w-[240px] sm:w-auto"
                                >
                                    {isSaving ? (
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
    )
}
