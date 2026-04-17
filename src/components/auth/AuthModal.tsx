import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, X, Loader2, ArrowRight, User, AlertCircle } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { GoogleLogo, DiscordLogo } from './AuthLogos'

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [view, setView] = useState<'login' | 'register'>(initialView)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Auto-close modal if session is detected (e.g. after successful social login)
    useEffect(() => {
        if (isOpen && session) {
            onClose()
        }
    }, [isOpen, session, onClose])

    useEffect(() => {
        if (isOpen) {
            setView(initialView)
            setError('')
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, initialView])

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: '/' })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            if (view === 'login') {
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false
                })
                if (result?.error) setError('Invalid email or password')
                else {
                    onClose()
                    router.refresh()
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match')
                    setIsLoading(false)
                    return
                }
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                })
                if (res.ok) {
                    await signIn('credentials', {
                        email: formData.email,
                        password: formData.password,
                        callbackUrl: '/'
                    })
                    onClose()
                } else {
                    const msg = await res.text()
                    setError(msg || 'Registration failed')
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop Blur Overlay */}
            <div 
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[1]"
            />

            {/* Modal Container */}
            <div 
                className={cn(
                    "relative w-full overflow-hidden bg-[#0a0a0a] border-2 border-white/5 p-8 md:p-10 shadow-[0_0_100px_rgba(0,0,0,1)] z-[2] outfit-font flex flex-col transition-all duration-300",
                    view === 'login' ? "max-w-[420px]" : "max-w-[480px]"
                )}
            >
                {/* Close Button UI (Clean) */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-all z-30 group bg-white/5 rounded-full"
                >
                    <X className="size-5 transition-transform group-hover:rotate-90" />
                </button>

                {/* Content Wrapper (Scrollable) */}
                <div className="relative z-10 flex-col overflow-y-auto custom-scrollbar pr-2 max-h-full">
                    {/* Header: Clean Logo & Title */}
                    <div className={cn(
                        "flex flex-col items-center text-center relative pt-4",
                        view === 'login' ? "mb-10" : "mb-6"
                    )}>
                        <div className={cn(
                            "relative transition-all",
                            view === 'login' ? "mb-8" : "mb-5"
                        )}>
                            <img src="/logo.png" alt="Tribex" className="h-10 w-auto relative z-10" />
                        </div>
                        
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">{view === 'login' ? 'LOGIN' : 'SIGN UP'}</h2>
                        <div className="h-1 w-12 bg-red-600 mb-4 mx-auto" />
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{view === 'login' ? 'Welcome back, operator.' : 'Join the elite organization.'}</p>
                    </div>

                {/* Main Auth Flow (Direct) */}
                <div className="space-y-5 relative z-10">
                    {/* Social Authentication */}
                    <div className="grid grid-cols-2 gap-3">
                         <button 
                            onClick={() => handleSocialLogin('google')}
                            className="bg-white hover:bg-white/95 text-black flex items-center justify-center gap-3 h-14 rounded-none transition-all clip-tactical-sm active:scale-95 group font-black text-[11px] uppercase tracking-widest"
                        >
                            <GoogleLogo className="size-4" />
                            <span>Google</span>
                        </button>
                        <button 
                            onClick={() => handleSocialLogin('discord')}
                            className="bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-3 h-14 rounded-none transition-all clip-tactical-sm active:scale-95 group font-black text-[11px] uppercase tracking-widest"
                        >
                            <DiscordLogo className="size-4" />
                            <span>Discord</span>
                        </button>
                    </div>

                    <div className={cn(
                        "relative flex items-center justify-center",
                        view === 'login' ? "py-4" : "py-2"
                    )}>
                        <div className="absolute inset-x-0 h-px bg-white/[0.03]" />
                        <span className="relative z-10 px-4 bg-[#0a0a0a] text-[8px] font-black text-white/10 tracking-[0.4em] uppercase italic">OR CONTINUE WITH EMAIL</span>
                    </div>

                    {/* Direct Enrollment Form */}
                    {error && (
                        <div className="p-4 bg-red-600/5 border border-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 italic">
                            <AlertCircle className="size-4" /> ERROR: {error.toUpperCase()}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={cn(
                        "transition-all",
                        view === 'login' ? "space-y-4" : "space-y-3"
                    )}>
                        {view === 'register' && (
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Username</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full h-12 bg-white/[0.03] border border-white/[0.06] px-6 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-red-600 transition-all"
                                    placeholder="username"
                                />
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full h-12 bg-white/[0.03] border border-white/[0.06] px-6 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-red-600 transition-all font-mono"
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                             <div className="flex justify-between px-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                             </div>
                            <input 
                                type="password" 
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full h-12 bg-white/[0.03] border border-white/[0.06] px-6 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-red-600 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {view === 'register' && (
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full h-12 bg-white/[0.03] border border-white/[0.06] px-6 text-xs font-bold text-white placeholder:text-white/20 outline-none focus:border-red-600 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-red-600 hover:bg-white text-white hover:text-black transition-all clip-tactical font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 active-glow-red mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <>{view === 'login' ? 'LOGIN' : 'SIGN UP'} <ArrowRight className="size-5" /></>
                            )}
                        </button>
                    </form>
                </div>

                    {/* Footer Switcher */}
                    <div className="mt-8 text-center pt-6 border-t border-white/[0.03] relative z-10">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-loose italic">
                            {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => {
                                    setView(view === 'login' ? 'register' : 'login')
                                    setError('')
                                }}
                                className="text-white hover:text-red-600 transition-colors ml-2 font-black underline underline-offset-4 decoration-white/10"
                            >
                                {view === 'login' ? "SIGN UP" : "LOGIN"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
