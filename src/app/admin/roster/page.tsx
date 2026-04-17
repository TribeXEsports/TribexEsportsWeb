"use client"
import { Users, Plus, Trash2, RefreshCw, Gamepad2, Shield, ChevronDown, Image as ImageIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useSettings } from "@/components/providers/SettingsProvider";

interface RosterMember {
  id: string;
  name: string;
  role: string;
  game: string;
  teamName?: string;
  imageUrl?: string;
  stats?: string;
}

const GAMES = ["BGMI", "Valorant", "Free Fire", "CS2", "Fortnite", "Other"];
const ROLES = ["IGL", "Fragger", "Support", "Sniper", "Entry", "Coach", "Manager", "Substitute"];

const emptyForm = { name: "", role: "", game: "BGMI", teamName: "", imageUrl: "", stats: "" };

export default function AdminRosterPage() {
  const [members, setMembers] = useState<RosterMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterGame, setFilterGame] = useState("All");
  const [deleting, setDeleting] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => { 
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/roster");
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.role || !form.game) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newMember = await res.json();
        setMembers((prev) => [newMember, ...prev]);
        setForm(emptyForm);
        setIsAdding(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch("/api/admin/roster", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = filterGame === "All" ? members : members.filter((m) => m.game === filterGame);

  return (
    <div className="space-y-10 pb-24 font-sans text-zinc-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            Roster <span className="text-primary">Management</span>
          </h2>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
            Add, remove, and manage pro team players.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 h-12 px-6 bg-primary text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-white hover:text-black transition-all active:scale-95"
        >
          <Plus className="size-4" />
          Add Member
        </button>
      </header>

      {/* Add Member Form */}
      {isAdding && (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-5">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Plus className="size-4 text-primary" /> New Roster Member
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Player Name / IGN", placeholder: "e.g. Vortex" },
              { key: "teamName", label: "Team Name", placeholder: "e.g. Tribex Elite" },
              { key: "stats", label: "Stats / Achievement", placeholder: "e.g. 3x Monthly Champions" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</label>
                <input
                  type="text"
                  value={(form as any)[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="bg-black border border-white/10 rounded-xl px-4 h-11 text-sm text-white font-medium focus:border-primary/50 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Photo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://... or upload"
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 h-11 text-sm text-white font-medium focus:border-primary/50 outline-none transition-all placeholder:text-zinc-700"
                />
                <CldUploadWidget
                  uploadPreset={settings?.cloudinaryUploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tribex_default"}
                  options={{ 
                    cloudName: settings?.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
                  }}
                  onSuccess={(result: any) => {
                    if (result.info?.secure_url) {
                      setForm((p) => ({ ...p, imageUrl: result.info.secure_url }));
                    }
                  }}
                >
                  {({ open }) => (
                    <button onClick={() => open()} className="h-11 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <ImageIcon className="size-4 text-zinc-400" />
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Game</label>
              <select
                value={form.game}
                onChange={(e) => setForm((p) => ({ ...p, game: e.target.value }))}
                className="bg-black border border-white/10 rounded-xl px-4 h-11 text-sm text-white font-medium focus:border-primary/50 outline-none transition-all"
              >
                {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="bg-black border border-white/10 rounded-xl px-4 h-11 text-sm text-white font-medium focus:border-primary/50 outline-none transition-all"
              >
                <option value="">Select Role</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              disabled={saving || !form.name || !form.role}
              className="h-11 px-8 bg-primary text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-40 flex items-center gap-2"
            >
              {saving ? <RefreshCw className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add to Roster
            </button>
            <button onClick={() => setIsAdding(false)} className="h-11 px-6 bg-white/5 text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-[11px] rounded-xl transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All", ...GAMES].map((g) => (
          <button
            key={g}
            onClick={() => setFilterGame(g)}
            className={`px-4 h-9 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
              filterGame === g ? "bg-primary text-white" : "bg-white/5 text-zinc-500 hover:text-white"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Roster Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <RefreshCw className="size-8 text-zinc-800 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-16 text-center">
          <Users className="size-12 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">No roster members yet. Add your first player above.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-0 border-b border-white/5">
            {["#", "Player", "Role", "Game", "Team", ""].map((h, i) => (
              <div key={i} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                {h}
              </div>
            ))}
          </div>

          {filtered.map((member, idx) => (
            <div
              key={member.id}
              className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-0 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all group items-center"
            >
              <div className="px-6 py-4 text-[11px] font-bold text-zinc-700">{idx + 1}</div>
              <div className="px-6 py-4 flex items-center gap-3">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="size-8 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-600">
                    {member.name[0]}
                  </div>
                )}
                <span className="text-[13px] font-black text-white uppercase tracking-tight">{member.name}</span>
              </div>
              <div className="px-6 py-4">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  {member.role}
                </span>
              </div>
              <div className="px-6 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-tight">{member.game}</div>
              <div className="px-6 py-4 text-[12px] font-bold text-zinc-500 uppercase tracking-tight">{member.teamName || "—"}</div>
              <div className="px-6 py-4">
                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={deleting === member.id}
                  className="size-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-zinc-600 rounded-lg transition-all active:scale-90 disabled:opacity-40"
                >
                  {deleting === member.id ? <RefreshCw className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
