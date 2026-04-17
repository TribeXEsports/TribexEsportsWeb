"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2, RefreshCw, Pencil, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Partner {
    id: string;
    name: string;
    role: string;
    category: string;
    order: number;
}

export default function AdminPartnersPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form State
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [category, setCategory] = useState("");
    const [order, setOrder] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/partners");
            const data = await res.json();
            if (Array.isArray(data)) setPartners(data);
        } catch (error) {
            console.error("Failed to fetch partners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !role || !category) return;

        setSaving(true);
        try {
            const method = editingId ? "PATCH" : "POST";
            const res = await fetch("/api/admin/partners", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: editingId,
                    name, 
                    role, 
                    category, 
                    order 
                }),
            });

            if (res.ok) {
                resetForm();
                fetchPartners();
            }
        } catch (error) {
            console.error("Failed to save partner:", error);
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setName("");
        setRole("");
        setCategory("");
        setOrder(0);
        setEditingId(null);
    };

    const startEditing = (partner: Partner) => {
        setEditingId(partner.id);
        setName(partner.name);
        setRole(partner.role);
        setCategory(partner.category);
        setOrder(partner.order);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this partner?")) return;

        try {
            const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchPartners();
        } catch (error) {
            console.error("Failed to delete partner:", error);
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                    Elite <span className="text-primary">Network</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest max-w-lg">
                    Manage strategic alliances and institutional partners. These appear in the tactical network section on the home page.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Management Form */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                {editingId ? <Pencil className="size-5 text-primary" /> : <Plus className="size-5 text-primary" />}
                                <h3 className="font-black uppercase tracking-tight">
                                    {editingId ? "Update Alliance" : "Register Partner"}
                                </h3>
                            </div>
                            {editingId && (
                                <button onClick={resetForm} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all">
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Organization Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Garena Free Fire"
                                    className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-primary transition-all outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Role / Designation</label>
                                    <input 
                                        type="text" 
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g. Strategic Partner"
                                        className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-primary transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Category</label>
                                    <input 
                                        type="text" 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Global Esports"
                                        className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-primary transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sort Order</label>
                                <input 
                                    type="number" 
                                    value={order}
                                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                    className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:border-primary transition-all outline-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={saving || !name || !role || !category}
                                className={cn(
                                    "w-full h-14 font-black uppercase tracking-widest text-[12px] rounded-xl transition-all active:scale-95 shadow-glow-red disabled:shadow-none",
                                    editingId ? "bg-primary text-white" : "bg-red-600 text-white hover:bg-white hover:text-black"
                                )}
                            >
                                {saving ? "TRANSMITTING..." : editingId ? "COMMIT ALLIANCE" : "ACTIVATE PARTNER"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Partners List */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <ShieldCheck className="size-5 text-primary" />
                            <h3 className="font-black uppercase tracking-tight">Active Network</h3>
                        </div>
                        <button 
                            onClick={fetchPartners}
                            className="p-2 text-zinc-500 hover:text-white transition-all"
                        >
                            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {partners.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                <Users className="size-8 text-zinc-800 mx-auto mb-4" />
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">No alliances registered in this sector.</p>
                            </div>
                        ) : (
                            partners.map((partner) => (
                                <div key={partner.id} className="group relative bg-zinc-900 border border-white/5 p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest bg-red-600/10 px-2 py-0.5">#{partner.order}</span>
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{partner.category}</span>
                                        </div>
                                        <h4 className="text-lg font-black uppercase text-white">{partner.name}</h4>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{partner.role}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => startEditing(partner)}
                                            className="p-2 text-zinc-700 hover:text-primary transition-colors bg-white/5 rounded-lg"
                                        >
                                            <Pencil className="size-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(partner.id)}
                                            className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                                        >
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
