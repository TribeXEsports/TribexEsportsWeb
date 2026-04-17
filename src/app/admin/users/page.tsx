"use client"

import React, { useEffect, useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  Trash2, 
  Search,
  Mail,
  Loader2,
  Lock,
  Unlock,
  User as UserIcon,
  Activity,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                User <span className="text-primary">Directory</span>
            </h2>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest max-w-lg">
                Manage accounts, roles, and administrative permissions for the entire platform.
            </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex flex-col gap-1 min-w-[150px]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Total Users</p>
                <p className="text-2xl font-black text-white">{users.length}</p>
            </div>
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex flex-col gap-1 min-w-[150px]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Administrators</p>
                <p className="text-2xl font-black text-primary">{users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ORGANIZER').length}</p>
            </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or username..." 
                className="w-full h-16 bg-zinc-900 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium text-white outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
              />
          </div>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-8 text-[11px] font-bold uppercase tracking-widest text-zinc-600">User Details</th>
                <th className="p-8 text-[11px] font-bold uppercase tracking-widest text-zinc-600">Access Level</th>
                <th className="p-8 text-[11px] font-bold uppercase tracking-widest text-zinc-600 text-center">Registrations</th>
                <th className="p-8 text-[11px] font-bold uppercase tracking-widest text-zinc-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="p-8 h-24" />
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-24 text-center">
                        <Users className="size-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-600 font-bold uppercase text-[11px] tracking-widest">No matching users found.</p>
                    </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="size-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden relative">
                        {u.image ? (
                            <img src={u.image} className="size-full object-cover" />
                        ) : (
                            <UserIcon className="size-6 text-zinc-700" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <h4 className="text-sm font-black uppercase text-white group-hover:text-primary transition-colors">{u.name || u.username || "Anonymous"}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                            <Mail className="size-3" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                            "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border",
                            u.role === "SUPER_ADMIN" && "bg-red-500/10 border-red-500/20 text-red-500",
                            u.role === "ORGANIZER" && "bg-amber-500/10 border-amber-500/20 text-amber-500",
                            u.role === "CAPTAIN" && "bg-primary/10 border-primary/20 text-primary",
                            u.role === "PLAYER" && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                            u.role === "USER" && "bg-zinc-800 border-white/5 text-zinc-500"
                        )}>
                            {u.role === "SUPER_ADMIN" ? <ShieldCheck className="size-3" /> : u.role === "ORGANIZER" ? <Activity className="size-3" /> : <UserIcon className="size-3" />}
                            {u.role.replace('_', ' ')}
                        </div>
                     </div>
                  </td>
                  <td className="p-8 text-center text-sm font-black text-white group-hover:text-primary transition-colors">
                    {u._count.registrations}
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select 
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        disabled={updatingId === u.id}
                        className={cn(
                            "bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none",
                            updatingId === u.id && "opacity-50 pointer-events-none"
                        )}
                      >
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="ORGANIZER">Organizer</option>
                        <option value="CAPTAIN">Captain</option>
                        <option value="PLAYER">Player</option>
                        <option value="USER">User</option>
                      </select>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={updatingId === u.id}
                        className="size-10 flex items-center justify-center bg-zinc-800 rounded-xl border border-white/5 text-zinc-600 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
