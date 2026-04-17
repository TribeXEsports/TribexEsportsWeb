import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateTournamentStandings } from "@/lib/tournament-logic";

// POST Advance Top Teams to Finale (NEXUS Advancement Protocol)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sourceLobby, count } = await req.json();

    // 1. Fetch Tournament, Registrations and Matches
    const [tournament, registrations, matches] = await Promise.all([
      prisma.tournament.findUnique({ where: { id: tournamentId } }),
      prisma.registration.findMany({ 
          where: { tournamentId },
          include: { team: true, user: true }
      }),
      prisma.match.findMany({ 
          where: { tournamentId, status: "COMPLETED" } 
      })
    ]);

    if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });

    // 2. Calculate Standings for the Source Lobby
    const standings = calculateTournamentStandings(matches, registrations, sourceLobby);

    // 3. Take Top X teams
    const topTeams = standings.slice(0, Math.min(count, standings.length));
    const promoIds = topTeams.map(t => t.registrationId);

    if (promoIds.length === 0) {
        return NextResponse.json({ error: "No teams found to promote in this lobby" }, { status: 400 });
    }

    // 4. Batch Update Registrations to 'FINAL'
    // Also reset slot to null so they can be assigned new slots in the Finale Lobby
    await prisma.registration.updateMany({
      where: { 
          id: { in: promoIds } 
      },
      data: {
        lobby: "FINAL",
        slot: null 
      }
    });

    console.log(`[ADVANCEMENT_API] Promoted ${promoIds.length} teams from Lobby ${sourceLobby} to FINAL`);

    return NextResponse.json({ 
        success: true, 
        promotedCount: promoIds.length,
        promotedTeams: topTeams.map(t => t.name)
    });

  } catch (error: any) {
    console.error("Advancement Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
