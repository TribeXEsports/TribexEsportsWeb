import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateLobbyDistribution, shuffleArray } from "@/lib/lobby-logic";

// Perform Auto Lobby Assignment for confirmed teams
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

    // 1. Fetch Tournament Context
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) return NextResponse.json({ error: "Tournament mission lost." }, { status: 404 });

    // 2. Fetch Confirmed Registrations
    const registrations = await prisma.registration.findMany({
      where: { 
        tournamentId, 
        status: { in: ["CONFIRMED", "VERIFIED"] }
      }
    });

    if (registrations.length === 0) {
      return NextResponse.json({ error: "No confirmed squads in matrix to assign." }, { status: 400 });
    }

    // 3. Logic Configuration (FF: 12, BGMI: 25)
    // Note: Use from tournament config if matchesPerGroup/teamsPerMatch exists
    const maxLobbySize = tournament.game === "FF" ? 12 : (tournament.game === "BGMI" ? 25 : 12);
    
    // 4. Calculate Distribution
    const distribution = calculateLobbyDistribution(registrations.length, maxLobbySize);
    
    // 5. Random Assignment
    const shuffled = (registrations as any[]).map(r => r);
    shuffleArray(shuffled);
    
    const updates = [];
    let currentIdx = 0;
    
    for (const assignment of distribution.assignments) {
      for (let j = 0; j < assignment.teamCount; j++) {
        const reg = shuffled[currentIdx];
        updates.push(prisma.registration.update({
          where: { id: reg.id },
          data: {
            lobby: assignment.lobbyName,
            slot: j + 1
          }
        }));
        currentIdx++;
      }
    }

    // 6. Execute Batch Sequence
    await prisma.$transaction(updates);

    return NextResponse.json({ 
        message: "Lobby Assignment Successful.", 
        lobbies: distribution.totalLobbies,
        count: registrations.length 
    });

  } catch (error: any) {
    console.error("Lobby Assignment Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
