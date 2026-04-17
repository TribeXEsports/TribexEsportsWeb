"use client"

import React, { useState, useEffect } from "react";
import { Settings, Save, RefreshCw, Image as ImageIcon, Film, Link2, Users, Layout, Globe, Share2, Cloud, Activity, Wifi, WifiOff, FlaskConical, CreditCard, ShieldCheck as ShieldIcon, Terminal, Zap, Database, Download, FileJson } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface SiteSettings {
  id: string;
  heroBackgroundUrl: string | null;
  heroVideoUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroTagline: string | null;
  heroCtaText: string | null;
  heroCtaTextGuest: string | null;
  heroBadgeText: string | null;
  footerDescription: string | null;
  logoUrl: string | null;
  siteName: string | null;
  siteSubtitle: string | null;
  whatsappUrl: string | null;
  discordUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  cloudinaryCloudName: string | null;
  cloudinaryUploadPreset: string | null;
  logoItalic: boolean | null;
  heroItalic: boolean | null;
  headingsItalic: boolean | null;
  tagsItalic: boolean | null;
  phasesTitle: string | null;
  phasesSubtitle: string | null;
  arenaTitle: string | null;
  arenaSubtitle: string | null;
  heroVideoBrightness: number | null;
  heroOverlayOpacity: number | null;
  faqTitle: string | null;
  faqSubtitle: string | null;
  navbarItalic: boolean | null;
  dashboardBtnItalic: boolean | null;
  githubUrl: string | null;
  totalPrizeMoney: number | null;
  totalRegisteredTeamsBase: number | null;
  gameCardHeight: number | null;
  freefireApiUrl: string | null;
  activeGateway: string | null;
  razorpayKeyId: string | null;
  razorpayKeySecret: string | null;
  cashfreeAppId: string | null;
  cashfreeSecretKey: string | null;
  cashfreeEnv: string | null;
  phonepeMerchantId: string | null;
  phonepeSaltKey: string | null;
  phonepeSaltIndex: string | null;
  phonepeEnv: string | null;
  heroOverlayColor: string | null;
  heroVideoGrayscale: boolean | null;
  freefireApiEnabled: boolean | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  aboutStatTournaments: string | null;
  aboutStatPlayers: string | null;
  aboutStatPrize: string | null;
  aboutStatGames: string | null;
}

const defaultSettings: Partial<SiteSettings> = {
  heroTitle: "TRIBEX",
  heroSubtitle: "eSPORTS",
  heroTagline: "Where Legends are Forged",
  heroCtaText: "ENTER ARENA",
  heroCtaTextGuest: "SIGN UP NOW",
  heroBadgeText: "Live Arena",
  footerDescription: "Pioneering high-performance digital solutions. Built for speed, security, and digital dominance.",
  siteName: "Tribex",
  siteSubtitle: "Esports",
  heroVideoUrl: "/videos/content3.mp4",
  logoUrl: "/logo.png",
  whatsappUrl: "https://whatsapp.com/channel/0029Vb6nTSk4o7qDjcH17I1K",
  discordUrl: "https://discord.gg/pbFZQMWYQu",
  twitterUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  cloudinaryCloudName: "",
  cloudinaryUploadPreset: "",
  logoItalic: true,
  heroItalic: true,
  headingsItalic: true,
  tagsItalic: true,
  navbarItalic: true,
  phasesTitle: "Operational",
  phasesSubtitle: "Phases.",
  arenaTitle: "Join the",
  arenaSubtitle: "Arena.",
  heroVideoBrightness: 75,
  heroOverlayOpacity: 30,
  faqTitle: "FREQUENTLY ASKED",
  faqSubtitle: "QUESTIONS",
  freefireApiUrl: "https://tribexapi.vercel.app",
  gameCardHeight: 220,
  activeGateway: "RAZORPAY",
  cashfreeEnv: "SANDBOX",
  phonepeSaltIndex: "1",
  phonepeEnv: "UAT",
  freefireApiEnabled: true,
};

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black border border-white/10 rounded-xl px-5 h-12 text-sm focus:border-primary/50 outline-none transition-all font-medium text-white placeholder:text-zinc-700"
      />
    </div>
  );
}

function RangeField({ label, value, onChange, min, max, unit }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; unit: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</label>
        <span className="text-[10px] font-black text-white bg-white/5 px-2 py-0.5 rounded-md">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-red-600 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

function Section({ title, icon: Icon, children, description }: { title: string; icon: any; children: React.ReactNode; description?: string }) {
  return (
    <section className="bg-zinc-900 shadow-2xl border border-white/5 rounded-3xl p-10 relative overflow-hidden">
      <div className="mb-8">
        <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3 mb-2">
          <Icon className="size-5 text-primary" />
          {title}
        </h3>
        {description && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ApiUrlField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const testUrl = async () => {
    setStatus('testing');
    setErrorMsg('');
    try {
      const base = value.trim().replace(/\/$/, '');
      const res = await fetch(`/api/freefire/info?uid=test_ping&region=IND`, {
        headers: { 'x-override-api-url': base },
      });
      // We just need the server to respond — even a 400/500 from FF API means our proxy reached it
      if (res.status < 500) {
        setStatus('ok');
      } else {
        const d = await res.json();
        setErrorMsg(d?.error || 'API returned an error');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Could not reach the API URL');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">
        Free Fire API Base URL
      </label>
      <div className="flex gap-3 items-center">
        <input
          type="url"
          value={value}
          onChange={(e) => { onChange(e.target.value); setStatus('idle'); }}
          placeholder="https://your-api.onrender.com"
          className="flex-1 bg-black border border-white/10 rounded-xl px-5 h-12 text-sm focus:border-primary/50 outline-none transition-all font-medium text-white placeholder:text-zinc-700"
        />
        <button
          onClick={testUrl}
          disabled={status === 'testing' || !value}
          className="h-12 px-6 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/40 transition-all disabled:opacity-40 flex items-center gap-2"
        >
          {status === 'testing' ? <RefreshCw className="size-3.5 animate-spin" /> : <Wifi className="size-3.5" />}
          Test
        </button>
      </div>

      {/* Status Indicator */}
      {status === 'ok' && (
        <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-widest">
          <Wifi className="size-3.5" /> API reachable — connection successful
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest">
          <WifiOff className="size-3.5" /> {errorMsg || 'Cannot reach this URL'}
        </div>
      )}

      <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold px-1">
        Enter the base URL only — do not include <span className="text-zinc-400">/info</span> at the end.
        Example: <span className="text-zinc-400">https://tribex-freefire-api.onrender.com</span>
      </p>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("branding");
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const TABS = [
    { id: "branding", label: "Branding", icon: Layout },
    { id: "landing", label: "Hero & Landing", icon: Globe },
    { id: "content", label: "Sections", icon: Share2 },
    { id: "infra", label: "Infrastructure", icon: Cloud },
    { id: "backup", label: "Backup & Recovery", icon: Database },
  ];

  const handleDownloadBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) throw new Error("Backup failed");
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tribex_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("System backup failed. Check console for details.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/public/settings");
      const data = await res.json();
      setSettings({ ...defaultSettings, ...data });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const save = async (fields: Partial<SiteSettings>, sectionKey: string) => {
    setSavingSection(sectionKey);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, ...updated }));
        setSaved(sectionKey);
        setTimeout(() => setSaved(null), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSection(null);
    }
  };

  const SaveBtn = ({ sectionKey, fields }: { sectionKey: string; fields: Partial<SiteSettings> }) => (
    <button
      onClick={() => save(fields, sectionKey)}
      disabled={savingSection === sectionKey}
      className="mt-6 h-12 px-8 bg-primary text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
    >
      {savingSection === sectionKey ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
      {saved === sectionKey ? "Saved!" : "Save Changes"}
    </button>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="size-8 text-zinc-800 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 pb-32 font-sans text-zinc-300">
      <header className="flex flex-col gap-6">
        <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            Website <span className="text-primary italic">Settings</span>
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Control center for platform-wide configurations.
            </p>
        </div>

        {/* Dynamic Tab Navigation */}
        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-2xl w-fit overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`h-11 px-6 rounded-xl flex items-center gap-2.5 transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                        activeTab === tab.id 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <tab.icon className="size-4" />
                    {tab.label}
                </button>
            ))}
        </div>
      </header>

      {/* Tab Content: Branding */}
      {activeTab === "branding" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Section title="Site Branding" icon={ImageIcon}>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="size-32 bg-black border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden relative group">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo Preview" className="size-20 object-contain" />
            ) : (
              <ImageIcon className="size-8 text-zinc-800" />
            )}
          </div>
          <div className="flex-1 space-y-4 w-full">
            <Field
              label="Logo URL"
              value={settings.logoUrl || ""}
              onChange={(v) => setSettings((p) => ({ ...p, logoUrl: v }))}
              placeholder="/logo.png or https://..."
            />
            <CldUploadWidget
              uploadPreset={settings.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
              options={{ 
                cloudName: settings.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
              }}
              onSuccess={(result: any) => {
                if (result.info?.secure_url) {
                  setSettings((p) => ({ ...p, logoUrl: result.info.secure_url }));
                  save({ logoUrl: result.info.secure_url }, "site-branding");
                }
              }}
            >
              {({ open }) => (
                <button onClick={() => open()} className="h-12 px-6 bg-white/[0.03] border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary hover:border-primary transition-all active:scale-95">
                  Upload New Logo
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Field
            label="Site Name (e.g. Tribex)"
            value={settings.siteName || ""}
            onChange={(v) => setSettings((p) => ({ ...p, siteName: v }))}
            placeholder="Tribex"
          />
          <Field
            label="Site Subtitle (e.g. Esports)"
            value={settings.siteSubtitle || ""}
            onChange={(v) => setSettings((p) => ({ ...p, siteSubtitle: v }))}
            placeholder="Esports"
          />
        </div>
        <Field
          label="Footer Description"
          value={settings.footerDescription || ""}
          onChange={(v) => setSettings((p) => ({ ...p, footerDescription: v }))}
          placeholder="Pioneering high-performance digital solutions..."
        />
        <SaveBtn sectionKey="site-branding" fields={{ 
          logoUrl: settings.logoUrl || "",
          siteName: settings.siteName || "",
          siteSubtitle: settings.siteSubtitle || "",
          footerDescription: settings.footerDescription || ""
        }} />
      </Section>
      </div>
      )}

      {/* Tab Content: Hero & Landing */}
      {activeTab === "landing" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Hero Text */}
      <Section title="Hero Text" icon={Settings}>
        <Field
          label="Main Title (Line 1)"
          value={settings.heroTitle || ""}
          onChange={(v) => setSettings((p) => ({ ...p, heroTitle: v }))}
          placeholder="TRIBEX"
        />
        <Field
          label="Main Subtitle (Line 2 — Gradient)"
          value={settings.heroSubtitle || ""}
          onChange={(v) => setSettings((p) => ({ ...p, heroSubtitle: v }))}
          placeholder="eSPORTS"
        />
        <Field
          label="Tagline (below the title)"
          value={settings.heroTagline || ""}
          onChange={(v) => setSettings((p) => ({ ...p, heroTagline: v }))}
          placeholder="Where Legends are Forged"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Field
            label="Hero CTA (Logged In)"
            value={settings.heroCtaText || ""}
            onChange={(v) => setSettings((p) => ({ ...p, heroCtaText: v }))}
            placeholder="ENTER ARENA"
          />
          <Field
            label="Hero CTA (Guest/Default)"
            value={settings.heroCtaTextGuest || ""}
            onChange={(v) => setSettings((p) => ({ ...p, heroCtaTextGuest: v }))}
            placeholder="SIGN UP NOW"
          />
        </div>
        <Field
          label="Hero Badge Text (e.g. Live Arena)"
          value={settings.heroBadgeText || ""}
          onChange={(v) => setSettings((p) => ({ ...p, heroBadgeText: v }))}
          placeholder="Live Arena"
        />
        <SaveBtn sectionKey="hero-text" fields={{ 
          heroTitle: settings.heroTitle || "", 
          heroSubtitle: settings.heroSubtitle || "", 
          heroTagline: settings.heroTagline || "",
          heroCtaText: settings.heroCtaText || "",
          heroCtaTextGuest: settings.heroCtaTextGuest || "",
          heroBadgeText: settings.heroBadgeText || ""
        }} />
      </Section>

      {/* Hero Visual Settings */}
      <Section title="Hero Visual Experience" icon={Film} description="Customized optics for the landing page background.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RangeField
                label="Video Brightness"
                value={settings.heroVideoBrightness ?? 75}
                onChange={(v) => setSettings((p) => ({ ...p, heroVideoBrightness: v }))}
                min={0}
                max={200}
                unit="%"
            />
            <RangeField
                label="Overlay Intensity"
                value={settings.heroOverlayOpacity ?? 30}
                onChange={(v) => setSettings((p) => ({ ...p, heroOverlayOpacity: v }))}
                min={0}
                max={100}
                unit="%"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">Overlay Color (Hex)</label>
                <div className="flex gap-3">
                    <div 
                        className="size-12 rounded-xl border border-white/10 shrink-0" 
                        style={{ backgroundColor: settings.heroOverlayColor || "#000000" }}
                    />
                    <input
                        type="text"
                        value={settings.heroOverlayColor || ""}
                        onChange={(e) => setSettings((p) => ({ ...p, heroOverlayColor: e.target.value }))}
                        placeholder="#000000"
                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 text-sm focus:border-primary/50 outline-none transition-all font-mono text-white"
                    />
            </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Monochrome Grayscale</p>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Strip all color from the background video.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!!settings.heroVideoGrayscale} 
                  onChange={(e) => setSettings(p => ({ ...p, heroVideoGrayscale: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
        </div>

        <SaveBtn sectionKey="hero-visual" fields={{ 
            heroVideoBrightness: settings.heroVideoBrightness, 
            heroOverlayOpacity: settings.heroOverlayOpacity,
            heroOverlayColor: settings.heroOverlayColor || "#000000",
            heroVideoGrayscale: settings.heroVideoGrayscale ?? false
        }} />
      </Section>
      <div className="h-20" /> {/* Spacer */}
      </div>
      )}

      {/* Tab Content: Sections & Information */}
      {activeTab === "content" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Hero Background Video */}
      <Section title="Hero Background Video" icon={Film}>
        <Field
          label="Video URL (direct link or path)"
          value={settings.heroVideoUrl || ""}
          onChange={(v) => setSettings((p) => ({ ...p, heroVideoUrl: v }))}
          placeholder="/videos/content3.mp4 or https://..."
        />
        <div className="flex items-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">or upload via Cloudinary</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        {settings.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
          <CldUploadWidget
            uploadPreset={settings.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
            options={{ 
              cloudName: settings.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              resourceType: "video",
              clientAllowedFormats: ["mp4", "webm", "ogg", "mov"]
            }}
            onSuccess={(result: any) => {
              if (result.info?.secure_url) {
                setSettings((p) => ({ ...p, heroVideoUrl: result.info.secure_url }));
                save({ heroVideoUrl: result.info.secure_url }, "hero-video");
              }
            }}
          >
            {({ open }) => (
              <button onClick={() => open()} className="h-12 px-6 bg-white/[0.03] border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary hover:border-primary transition-all active:scale-95">
                Upload Video
              </button>
            )}
          </CldUploadWidget>
        ) : null}

        {/* Preview */}
        {settings.heroVideoUrl && (
          <div className="mt-2 p-4 bg-black/40 rounded-2xl border border-white/5 text-[11px] font-mono text-zinc-500 break-all">
            {settings.heroVideoUrl}
          </div>
        )}
        <SaveBtn sectionKey="hero-video" fields={{ heroVideoUrl: settings.heroVideoUrl || "" }} />
      </Section>

      {/* Hero Background Image */}
      <Section title="Hero Background Image (fallback)" icon={ImageIcon}>
        <Field
          label="Image URL"
          value={settings.heroBackgroundUrl || ""}
          onChange={(v) => setSettings((p) => ({ ...p, heroBackgroundUrl: v }))}
          placeholder="https://... or leave blank to use video"
        />
        {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
          <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5">
            <div>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Cloudinary Upload</p>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Fast & Optimized</p>
            </div>
            <CldUploadWidget
              uploadPreset={settings.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
              options={{ 
                cloudName: settings.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
              }}
              onSuccess={(result: any) => {
                if (result.info?.secure_url) {
                  setSettings((p) => ({ ...p, heroBackgroundUrl: result.info.secure_url }));
                  save({ heroBackgroundUrl: result.info.secure_url }, "hero-bg");
                }
              }}
            >
              {({ open }) => (
                <button onClick={() => open()} className="h-12 px-6 bg-white/[0.03] border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary hover:border-primary transition-all active:scale-95">
                  Upload Image
                </button>
              )}
            </CldUploadWidget>
          </div>
        ) : null}
        <SaveBtn sectionKey="hero-bg" fields={{ heroBackgroundUrl: settings.heroBackgroundUrl || "" }} />
      </Section>
      </div>
      )}

      {/* Tab Content: Infrastructure */}
      {activeTab === "infra" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Cloudinary Tactical Config */}
      <Section title="Media Infrastructure" icon={Settings}>
        <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl mb-6">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Configuration Required</p>
          <p className="text-[9px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
            Required for all on-site media uploads. Create an <span className="text-white">Unsigned Upload Preset</span> in your Cloudinary Dashboard Settings &gt; Upload section.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Cloud Name"
            value={settings.cloudinaryCloudName || ""}
            onChange={(v) => setSettings((p) => ({ ...p, cloudinaryCloudName: v }))}
            placeholder="e.g. dtsf9m26a"
          />
          <Field
            label="Upload Preset (Unsigned)"
            value={settings.cloudinaryUploadPreset || ""}
            onChange={(v) => setSettings((p) => ({ ...p, cloudinaryUploadPreset: v }))}
            placeholder="e.g. tribex_preset"
          />
        </div>
        <SaveBtn sectionKey="cloudinary-config" fields={{ 
          cloudinaryCloudName: settings.cloudinaryCloudName || "", 
          cloudinaryUploadPreset: settings.cloudinaryUploadPreset || "" 
        }} />
      </Section>
      </div>
      )}

      {/* Tab Content: Sections & Information */}
      {activeTab === "content" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Contact Details */}
      <Section title="Support Contact Details" icon={Globe} description="Manage the contact information displayed on the public Contact Us page.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Support Email"
            value={settings.contactEmail || ""}
            onChange={(v) => setSettings((p) => ({ ...p, contactEmail: v }))}
            placeholder="support@tribexesports.cloud"
          />
          <Field
            label="Helpline / Phone"
            value={settings.contactPhone || ""}
            onChange={(v) => setSettings((p) => ({ ...p, contactPhone: v }))}
            placeholder="+91 00000 00000"
          />
        </div>
        <Field
          label="Physical HQ Address"
          value={settings.contactAddress || ""}
          onChange={(v) => setSettings((p) => ({ ...p, contactAddress: v }))}
          placeholder="Esports HQ, Digital City"
        />
        <SaveBtn sectionKey="contact-details" fields={{
          contactEmail: settings.contactEmail || "",
          contactPhone: settings.contactPhone || "",
          contactAddress: settings.contactAddress || "",
        }} />
      </Section>

      {/* About Page Stats */}
      <Section title="About Page — Stats Strip" icon={Activity} description="The four numbers displayed on the public About page.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Stat 1 — Tournaments Hosted"
            value={settings.aboutStatTournaments || ""}
            onChange={(v) => setSettings((p) => ({ ...p, aboutStatTournaments: v }))}
            placeholder="50+"
          />
          <Field
            label="Stat 2 — Registered Players"
            value={settings.aboutStatPlayers || ""}
            onChange={(v) => setSettings((p) => ({ ...p, aboutStatPlayers: v }))}
            placeholder="2500+"
          />
          <Field
            label="Stat 3 — Prize Distributed"
            value={settings.aboutStatPrize || ""}
            onChange={(v) => setSettings((p) => ({ ...p, aboutStatPrize: v }))}
            placeholder="₹1.2L+"
          />
          <Field
            label="Stat 4 — Games Supported"
            value={settings.aboutStatGames || ""}
            onChange={(v) => setSettings((p) => ({ ...p, aboutStatGames: v }))}
            placeholder="4+"
          />
        </div>
        <SaveBtn sectionKey="about-stats" fields={{
          aboutStatTournaments: settings.aboutStatTournaments || "",
          aboutStatPlayers: settings.aboutStatPlayers || "",
          aboutStatPrize: settings.aboutStatPrize || "",
          aboutStatGames: settings.aboutStatGames || "",
        }} />
      </Section>

      {/* Social Links */}
      <Section title="Social Media Links" icon={Link2}>
        <Field
          label="WhatsApp Channel URL"
          value={settings.whatsappUrl || ""}
          onChange={(v) => setSettings((p) => ({ ...p, whatsappUrl: v }))}
          placeholder="https://whatsapp.com/channel/..."
        />
        <Field
          label="Discord Server URL"
          value={settings.discordUrl || ""}
          onChange={(v) => setSettings((p) => ({ ...p, discordUrl: v }))}
          placeholder="https://discord.gg/..."
        />
        <Field
          label="X (Twitter) URL"
          value={settings.twitterUrl || ""}
          onChange={(v) => setSettings((p) => ({ ...p, twitterUrl: v }))}
          placeholder="https://x.com/..."
        />
        <Field
          label="Instagram URL"
          value={settings.instagramUrl || ""}
          onChange={(v) => setSettings((p) => ({ ...p, instagramUrl: v }))}
          placeholder="https://instagram.com/..."
        />
        <SaveBtn sectionKey="socials" fields={{
          whatsappUrl: settings.whatsappUrl || "",
          discordUrl: settings.discordUrl || "",
          twitterUrl: settings.twitterUrl || "",
          instagramUrl: settings.instagramUrl || "",
        }} />

      </Section>

      {/* Global Metrics */}
      <Section title="Global Platform Metrics" icon={Activity}>
        <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl mb-6">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Public Display Data</p>
          <p className="text-[9px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
            These values are displayed on your public <span className="text-white">Leaderboard</span> header.
          </p>
        </div>
        <Field
          label="Total Prize Distributed (₹)"
          value={settings.totalPrizeMoney?.toString() || "0"}
          onChange={(v) => setSettings((p) => ({ ...p, totalPrizeMoney: parseInt(v) || 0 }))}
          placeholder="e.g. 1245000"
        />
        <Field
          label="Total Registered Teams (Base Count)"
          value={settings.totalRegisteredTeamsBase?.toString() || "0"}
          onChange={(v) => setSettings((p) => ({ ...p, totalRegisteredTeamsBase: parseInt(v) || 0 }))}
          placeholder="e.g. 2500"
        />
        <SaveBtn sectionKey="metrics" fields={{
          totalPrizeMoney: settings.totalPrizeMoney || 0,
          totalRegisteredTeamsBase: settings.totalRegisteredTeamsBase || 0,
        }} />

      </Section>

      {/* Typography & Style Controls */}

      <Section title="Typography & Styles" icon={Settings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: "logoItalic", label: "Logo Italic Style", desc: "Logo subtitle will have a professional slant." },
            { id: "heroItalic", label: "Hero Typography Slant", desc: "Main landing text will use italicized weights." },
            { id: "headingsItalic", label: "Section Heading Slant", desc: "Standard section titles will use italics." },
            { id: "tagsItalic", label: "Visual Tag Slant", desc: "Status indicators and small tags will be slanted." },
            { id: "navbarItalic", label: "Navigation Slant", desc: "Header menu links will be slanted/italic." },
            { id: "dashboardBtnItalic", label: "Action Button Slant", desc: "Primary CTA buttons will use a slanted style." }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-red-600/20 transition-all group">
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">{item.label}</p>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!!(settings as any)[item.id]} 
                  onChange={(e) => setSettings(p => ({ ...p, [item.id]: e.target.checked }))}
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          ))}
        </div>
        <SaveBtn sectionKey="style-controls" fields={{
          logoItalic: settings.logoItalic ?? true,
          heroItalic: settings.heroItalic ?? true,
          headingsItalic: settings.headingsItalic ?? true,
          tagsItalic: settings.tagsItalic ?? true,
          navbarItalic: settings.navbarItalic ?? true,
          dashboardBtnItalic: (settings as any).dashboardBtnItalic ?? false,
        } as any} />
      </Section>

      {/* Home Content Administration */}
      <Section title="Home Page Content" icon={Layout}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.4em]">Phases Section</h4>
            <div className="space-y-4">
              <Field label="Title (Main)" value={settings.phasesTitle || ""} onChange={(v) => setSettings(s => ({ ...s, phasesTitle: v }))} placeholder="Operational" />
              <Field label="Subtitle (Highlight)" value={settings.phasesSubtitle || ""} onChange={(v) => setSettings(s => ({ ...s, phasesSubtitle: v }))} placeholder="Phases." />
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.4em]">Arena Section</h4>
            <div className="space-y-4">
              <Field label="Title (Main)" value={settings.arenaTitle || ""} onChange={(v) => setSettings(s => ({ ...s, arenaTitle: v }))} placeholder="Join the" />
              <Field label="Subtitle (Highlight)" value={settings.arenaSubtitle || ""} onChange={(v) => setSettings(s => ({ ...s, arenaSubtitle: v }))} placeholder="Arena." />
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.4em]">FAQ Section</h4>
            <div className="space-y-4">
              <Field label="Title (Main)" value={settings.faqTitle || ""} onChange={(v) => setSettings(s => ({ ...s, faqTitle: v }))} placeholder="FREQUENTLY ASKED" />
              <Field label="Subtitle (Highlight)" value={settings.faqSubtitle || ""} onChange={(v) => setSettings(s => ({ ...s, faqSubtitle: v }))} placeholder="QUESTIONS" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <RangeField
            label="Game Card Height (px)"
            value={settings.gameCardHeight ?? 220}
            onChange={(v) => setSettings((s) => ({ ...s, gameCardHeight: v }))}
            min={150}
            max={400}
            unit="px"
          />
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2 px-1">Controls how tall the game cards appear on the home page.</p>
        </div>

        <SaveBtn sectionKey="home-content" fields={{
          phasesTitle: settings.phasesTitle || "",
          phasesSubtitle: settings.phasesSubtitle || "",
          arenaTitle: settings.arenaTitle || "",
          arenaSubtitle: settings.arenaSubtitle || "",
          faqTitle: settings.faqTitle || "",
          faqSubtitle: settings.faqSubtitle || "",
          gameCardHeight: settings.gameCardHeight ?? 220,
        } as any} />
      </Section>
      </div>
      )}

      {/* Tab Content: Infrastructure */}
      {activeTab === "infra" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* API Configuration */}
      <Section title="API Configuration" icon={FlaskConical}>
        <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl mb-6">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Free Fire Player Info API</p>
          <p className="text-[9px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
            This URL is used to verify player UIDs during tournament registration. Change this any time without redeploying.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl group hover:border-blue-500/40 transition-all">
            <div>
              <p className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldIcon className="size-3.5 text-blue-400" />
                Player API Verification
              </p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">If OFF, players can register with any UID without an API check.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={!!settings.freefireApiEnabled} 
                onChange={(e) => setSettings(p => ({ ...p, freefireApiEnabled: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <ApiUrlField
            value={settings.freefireApiUrl || ""}
            onChange={(v) => setSettings(p => ({ ...p, freefireApiUrl: v }))}
          />
        </div>

        <SaveBtn sectionKey="api-config" fields={{
          freefireApiUrl: settings.freefireApiUrl || "",
          freefireApiEnabled: settings.freefireApiEnabled ?? true,
        } as any} />
      </Section>

      {/* Payment Gateways */}
      <Section title="Payment Gateways" icon={CreditCard} description="Configure your payment infrastructure for paid tournaments and scrims.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">Active Payment Gateway</label>
                <select 
                  value={settings.activeGateway || "RAZORPAY"}
                  onChange={(e) => setSettings(p => ({ ...p, activeGateway: e.target.value }))}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 h-12 text-sm focus:border-primary/50 outline-none transition-all font-medium text-white appearance-none cursor-pointer hover:bg-zinc-950"
                >
                  <option value="RAZORPAY">Razorpay (Standard)</option>
                  <option value="CASHFREE">Cashfree (Seamless UPI)</option>
                  <option value="PHONEPE">PhonePe (Direct)</option>
                </select>
             </div>
          </div>

          {/* Razorpay Config */}
          <div className={`space-y-4 p-6 rounded-2xl border transition-all ${settings.activeGateway === 'RAZORPAY' ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 'bg-black/40 border-white/5 opacity-50'}`}>
            <div className="flex items-center gap-2 mb-4">
               <div className={`p-1.5 rounded-lg ${settings.activeGateway === 'RAZORPAY' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-600'}`}>
                  <ShieldIcon className="size-4" />
               </div>
               <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Razorpay</h4>
            </div>
            <Field label="Key ID" value={settings.razorpayKeyId || ""} onChange={(v) => setSettings(p => ({ ...p, razorpayKeyId: v }))} placeholder="rzp_test_..." />
            <Field label="Key Secret" value={settings.razorpayKeySecret || ""} onChange={(v) => setSettings(p => ({ ...p, razorpayKeySecret: v }))} placeholder="••••••••••••" />
          </div>

          {/* Cashfree Config */}
          <div className={`space-y-4 p-6 rounded-2xl border transition-all ${settings.activeGateway === 'CASHFREE' ? 'bg-blue-500/5 border-blue-500/20 shadow-lg shadow-blue-500/5' : 'bg-black/40 border-white/5 opacity-50'}`}>
            <div className="flex items-center gap-2 mb-4">
               <div className={`p-1.5 rounded-lg ${settings.activeGateway === 'CASHFREE' ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-800 text-zinc-600'}`}>
                  <Zap className="size-4" />
               </div>
               <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Cashfree</h4>
            </div>
            <Field label="App ID" value={settings.cashfreeAppId || ""} onChange={(v) => setSettings(p => ({ ...p, cashfreeAppId: v }))} />
            <Field label="Secret Key" value={settings.cashfreeSecretKey || ""} onChange={(v) => setSettings(p => ({ ...p, cashfreeSecretKey: v }))} placeholder="••••••••••••" />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">Environment</label>
              <select 
                value={settings.cashfreeEnv || "SANDBOX"}
                onChange={(e) => setSettings(p => ({ ...p, cashfreeEnv: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-5 h-10 text-xs focus:border-blue-500/50 outline-none transition-all font-medium text-white"
              >
                <option value="SANDBOX">Sandbox (Testing)</option>
                <option value="PRODUCTION">Production (Live)</option>
              </select>
            </div>
          </div>

          {/* PhonePe Config */}
          <div className={`space-y-4 p-6 rounded-2xl border transition-all ${settings.activeGateway === 'PHONEPE' ? 'bg-purple-500/5 border-purple-500/20 shadow-lg shadow-purple-500/5' : 'bg-black/40 border-white/5 opacity-50'}`}>
            <div className="flex items-center gap-2 mb-4">
               <div className={`p-1.5 rounded-lg ${settings.activeGateway === 'PHONEPE' ? 'bg-purple-500/20 text-purple-500' : 'bg-zinc-800 text-zinc-600'}`}>
                  <Terminal className="size-4" />
               </div>
               <h4 className="text-[11px] font-black uppercase tracking-widest text-white">PhonePe</h4>
            </div>
            <Field label="Merchant ID" value={settings.phonepeMerchantId || ""} onChange={(v) => setSettings(p => ({ ...p, phonepeMerchantId: v }))} />
            <Field label="Salt Key" value={settings.phonepeSaltKey || ""} onChange={(v) => setSettings(p => ({ ...p, phonepeSaltKey: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Salt Index" value={settings.phonepeSaltIndex || "1"} onChange={(v) => setSettings(p => ({ ...p, phonepeSaltIndex: v }))} />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1">Env</label>
                <select 
                  value={settings.phonepeEnv || "UAT"}
                  onChange={(e) => setSettings(p => ({ ...p, phonepeEnv: e.target.value }))}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 h-11 text-xs focus:border-purple-500/50 outline-none transition-all font-medium text-white"
                >
                  <option value="UAT">UAT</option>
                  <option value="PRODUCTION">Live</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <SaveBtn sectionKey="payment-gateways" fields={{
          activeGateway: settings.activeGateway,
          razorpayKeyId: settings.razorpayKeyId,
          razorpayKeySecret: settings.razorpayKeySecret,
          cashfreeAppId: settings.cashfreeAppId,
          cashfreeSecretKey: settings.cashfreeSecretKey,
          cashfreeEnv: settings.cashfreeEnv,
          phonepeMerchantId: settings.phonepeMerchantId,
          phonepeSaltKey: settings.phonepeSaltKey,
          phonepeSaltIndex: settings.phonepeSaltIndex,
          phonepeEnv: settings.phonepeEnv,
        } as any} />
      </Section>
      </div>
      )}

      {/* Tab Content: Backup & Recovery */}
      {activeTab === "backup" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Database className="size-64 text-primary" />
                </div>
                
                <div className="relative z-10 space-y-10">
                    <div className="space-y-3">
                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                            <Database className="size-7 text-primary" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">System <span className="text-primary italic">Snapshot</span></h3>
                        <p className="text-zinc-400 text-xs font-medium uppercase tracking-[0.2em] max-w-md leading-relaxed">
                            Generate a full export of your platform's database. This includes users, tournaments, and all configuration nodes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-6 hover:border-primary/30 transition-all">
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <FileJson className="size-4 text-primary" /> JSON EXPORT
                                </h4>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                                    Download a portable JSON snapshot. Perfect for audits, disaster recovery, or manual data analysis.
                                </p>
                            </div>
                            <button
                                onClick={handleDownloadBackup}
                                disabled={isBackingUp}
                                className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                            >
                                {isBackingUp ? <RefreshCw className="size-5 animate-spin" /> : <Download className="size-5" />}
                                {isBackingUp ? "EXRACTING DATA..." : "DOWNLOAD SNAPSHOT"}
                            </button>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 flex flex-col justify-center gap-4">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <ShieldIcon className="size-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-black text-primary uppercase tracking-widest">Security Advisory</h4>
                                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed uppercase tracking-widest leading-relaxed">
                                    Backup files contain sensitive platform data. Store them in encrypted vaults. 
                                    Hashed passwords are excluded for maximum security.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Export Domains</h4>
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Users", "Teams", "Tournaments", "Registrations", 
                                "Matches", "Payments", "News", "Campus"
                            ].map(d => (
                                <span key={d} className="px-4 py-2 bg-black border border-white/5 rounded-full text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                    {d}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
