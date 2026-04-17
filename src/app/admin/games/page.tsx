"use client";

import React, { useState, useEffect } from "react";
import { Gamepad2, Plus, Trash2, RefreshCw, Image as ImageIcon, Pencil, X, Save, SlidersHorizontal } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface FeaturedGame {
    id: string;
    name: string;
    imageUrl: string;
    order: number;
}

const DEFAULT_ROSTER = [
    { name: "CS:GO", imageUrl: "https://images.unsplash.com/photo-1542751128-00a2159a28b4?q=80&w=1200", order: 1 },
    { name: "F1 24", imageUrl: "https://images.unsplash.com/photo-1594914141274-78c848e355d5?q=80&w=1200", order: 2 },
    { name: "VALORANT", imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1200", order: 3 },
    { name: "BGMI", imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4375?q=80&w=1200", order: 4 },
    { name: "FC24", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200", order: 5 }
];

export default function AdminGamesPage() {
    const [games, setGames] = useState<FeaturedGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [cardHeight, setCardHeight] = useState<number>(220);
    const [savingCardSize, setSavingCardSize] = useState(false);
    const [savedCardSize, setSavedCardSize] = useState(false);
    const [cardSpeed, setCardSpeed] = useState<number>(30);
    const [savingSpeed, setSavingSpeed] = useState(false);
    const [savedSpeed, setSavedSpeed] = useState(false);

    const [newName, setNewName] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newOrder, setNewOrder] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/games");
            const data = await res.json();
            if (Array.isArray(data)) setGames(data);
        } catch (error) {
            console.error("Failed to fetch games:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
        fetch("/api/public/settings")
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setCardHeight(data?.gameCardHeight ?? 220);
                setCardSpeed(data?.gameCardSpeed ?? 30);
            })
            .catch(err => console.error("Failed to fetch settings:", err));
    }, []);

    const saveCardHeight = async () => {
        setSavingCardSize(true);
        try {
            await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameCardHeight: cardHeight }),
            });
            setSavedCardSize(true);
            setTimeout(() => setSavedCardSize(false), 2500);
        } catch (e) {
            console.error(e);
        } finally {
            setSavingCardSize(false);
        }
    };

    const saveCardSpeed = async () => {
        setSavingSpeed(true);
        try {
            await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameCardSpeed: cardSpeed }),
            });
            setSavedSpeed(true);
            setTimeout(() => setSavedSpeed(false), 2500);
        } catch (e) {
            console.error(e);
        } finally {
            setSavingSpeed(false);
        }
    };

    const handleAddGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newImageUrl) return;
        setSaving(true);
        try {
            const method = editingId ? "PATCH" : "POST";
            const res = await fetch("/api/admin/games", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, name: newName, imageUrl: newImageUrl, order: newOrder || 0 }),
            });
            const data = await res.json();
            if (res.ok) {
                alert(editingId ? "Game updated successfully" : "Game added successfully");
                setNewName(""); setNewImageUrl(""); setNewOrder(0); setEditingId(null);
                fetchGames();
            } else {
                alert(`Error: ${data.error || "Something went wrong"}`);
            }
        } catch {
            alert("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (game: FeaturedGame) => {
        setEditingId(game.id); setNewName(game.name); setNewImageUrl(game.imageUrl); setNewOrder(game.order);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEditing = () => { setEditingId(null); setNewName(""); setNewImageUrl(""); setNewOrder(0); };

    const handleDeployDefaults = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/games", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(DEFAULT_ROSTER),
            });
            if (res.ok) { alert("Default games added"); fetchGames(); }
            else alert("Failed to add default games");
        } catch { alert("Network error"); } finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this game?")) return;
        try {
            const res = await fetch(`/api/admin/games?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchGames();
        } catch (error) { console.error(error); }
    };

    const cardWidth = Math.round(cardHeight * 0.72);

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                    Games <span className="text-primary">Management</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest max-w-lg">
                    Manage the featured games shown on the home page.
                </p>
            </header>

            {/* ── Card Size Control ── */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <SlidersHorizontal className="size-5 text-primary" />
                    <h3 className="font-black uppercase tracking-tight text-sm text-white">Card Display Size</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {/* Size Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Card Height</label>
                            <span className="text-[11px] font-black text-white bg-white/5 px-3 py-1 rounded-lg">{cardHeight}px × {cardWidth}px</span>
                        </div>
                        <input
                            type="range" min={150} max={400} value={cardHeight}
                            onChange={(e) => setCardHeight(Number(e.target.value))}
                            className="w-full accent-red-600 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                            <span>Compact</span><span>Large</span>
                        </div>
                        <button
                            onClick={saveCardHeight} disabled={savingCardSize}
                            className="w-full h-11 px-6 bg-primary text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {savingCardSize ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                            {savedCardSize ? "Saved!" : "Save Height"}
                        </button>
                    </div>

                    {/* Speed Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Scroll Speed</label>
                            <span className="text-[11px] font-black text-white bg-white/5 px-3 py-1 rounded-lg">{cardSpeed}s</span>
                        </div>
                        <input
                            type="range" min={5} max={100} value={cardSpeed}
                            onChange={(e) => setCardSpeed(Number(e.target.value))}
                            className="w-full accent-red-600 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                            <span>Fast (5s)</span><span>Slow (100s)</span>
                        </div>
                        <button
                            onClick={saveCardSpeed} disabled={savingSpeed}
                            className="w-full h-11 px-6 bg-primary text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {savingSpeed ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
                            {savedSpeed ? "Saved!" : "Save Speed"}
                        </button>
                    </div>

                    {/* Live preview — capped so it fits the panel */}
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Live Preview</p>
                        <div
                            className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-800 transition-all duration-150"
                            style={{
                                height: `${Math.min(cardHeight, 300)}px`,
                                width: `${Math.min(cardWidth, 216)}px`
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=400"
                                alt="Preview" className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                                <p className="text-white font-black uppercase tracking-tight text-xs leading-none">Valorant</p>
                                <div className="flex items-center gap-1">
                                    <div className="size-1.5 rounded-full bg-red-500" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-red-500">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Add / Edit + List ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Form */}
                <div className="lg:col-span-5 order-2 lg:order-1">
                    <div className="p-6 md:p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between text-white border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                {editingId ? <Pencil className="size-5 text-primary" /> : <Plus className="size-5 text-primary" />}
                                <h3 className="font-black uppercase tracking-tight text-sm">
                                    {editingId ? "Edit Game" : "Add New Game"}
                                </h3>
                            </div>
                            {editingId && (
                                <button onClick={cancelEditing} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all">
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleAddGame} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Game Name</label>
                                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Valorant"
                                    className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-primary transition-all outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Sort Order</label>
                                <input type="number" value={newOrder} onChange={(e) => setNewOrder(parseInt(e.target.value) || 0)}
                                    className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-primary transition-all outline-none" />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block ml-1">Game Thumbnail</label>
                                <div className="h-44 bg-black border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                                    {newImageUrl ? (
                                        <>
                                            <img src={newImageUrl} alt="Preview" className="size-full object-cover" />
                                            <button onClick={() => setNewImageUrl("")}
                                                className="absolute top-2 right-2 p-2 bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <ImageIcon className="size-8 text-zinc-800" />
                                            <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">No Image Selected</span>
                                        </div>
                                    )}
                                </div>

                                <CldUploadWidget
                                    uploadPreset={settings?.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
                                    options={{ cloudName: settings?.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
                                    onSuccess={(result: any) => { if (result.info?.secure_url) setNewImageUrl(result.info.secure_url); }}
                                >
                                    {({ open }) => (
                                        <button type="button" onClick={() => open()}
                                            className="w-full h-12 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95">
                                            Upload to Cloudinary
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>

                            <button type="submit" disabled={saving || !newName || !newImageUrl}
                                className={cn(
                                    "w-full h-14 font-black uppercase tracking-widest text-[12px] rounded-xl transition-all active:scale-95 disabled:opacity-40",
                                    editingId ? "bg-primary text-white" : "bg-red-600 text-white hover:bg-white hover:text-black"
                                )}>
                                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Game"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3 text-white">
                            <Gamepad2 className="size-5 text-primary" />
                            <h3 className="font-black uppercase tracking-tight text-sm">Active Games</h3>
                        </div>
                        <button onClick={fetchGames} className="p-2 text-zinc-500 hover:text-white transition-all bg-white/5 rounded-lg">
                            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        {games.length === 0 ? (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl space-y-6">
                                <ImageIcon className="size-8 text-zinc-800 mx-auto" />
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">No games added yet.</p>
                                <button onClick={handleDeployDefaults} disabled={saving}
                                    className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2 mx-auto">
                                    <RefreshCw className={cn("size-3", saving && "animate-spin")} />
                                    {saving ? "Adding..." : "Add Default Games"}
                                </button>
                            </div>
                        ) : (
                            games.map((game) => (
                                <div key={game.id} className="group relative bg-zinc-900 border border-white/5 rounded-2xl p-4 flex gap-4 items-center hover:border-white/10 transition-all">
                                    <div className="size-16 relative flex-shrink-0 rounded-xl overflow-hidden">
                                        <img src={game.imageUrl} className="size-full object-cover" alt={game.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">#{game.order}</p>
                                        <h4 className="text-lg font-black uppercase text-white truncate">{game.name}</h4>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => startEditing(game)}
                                            className={cn("p-2 transition-colors bg-white/5 rounded-lg border",
                                                editingId === game.id ? "text-primary border-primary bg-primary/10" : "text-zinc-400 border-transparent hover:text-white")}>
                                            <Pencil className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(game.id)} className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
