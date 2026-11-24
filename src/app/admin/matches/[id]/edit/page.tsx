import { prisma } from "@/lib/prisma";
import BrResultForm from "@/app/admin/tournaments/[id]/BrResultForm";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function MatchEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let match = null;
  try {
    match = await prisma.match.findUnique({
      where: { id },
      include: {
          tournament: true,
          room: true
      }
    });
  } catch {}

  if (!match) return <div>Match details not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <Link 
        href={`/admin/tournaments/${match.tournamentId}`} 
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest italic">Back to Tournament Details</span>
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 italic tracking-widest text-[9px] uppercase">{match.tournament.game}</Badge>
            <ShieldCheck className="size-4 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Secure Result Update</span>
        </div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight">
            {match.stage || "Match Details"}
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            TOURNAMENT: {match.tournament.title} // MATCH ID: {match.id.slice(-8)}
        </p>
      </header>

      <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12">
        <BrResultForm 
            tournamentId={match.tournamentId} 
            matchId={match.id} 
            game={match.tournament.game}
            lobbyName={match.stage?.replace(/Lobby\s+/i, "")}
        />
      </div>
    </div>
  );
}
