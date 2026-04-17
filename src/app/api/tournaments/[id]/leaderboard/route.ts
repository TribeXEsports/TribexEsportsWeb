import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// NEXUS — Grand Leaderboard Aggregator
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;

    // 1. Fetch all completed matches for this tournament
    const matches = await prisma.match.findMany({
      where: { 
        tournamentId,
        status: "COMPLETED" 
      },
      select: { roundResults: true }
    });

    if (matches.length === 0) {
      return NextResponse.json({ 
          message: "Awaiting combat data to generate standings.",
          standings: [] 
      });
    }

    // 2. Aggregate Results
    // roundResults is an array of { registrationId, teamName, placement, kills, points }
    const aggregation: Record<string, any> = {};

    matches.forEach((match: any) => {
      const results = (match.roundResults as any[]) || [];
      results.forEach(res => {
        if (!aggregation[res.registrationId]) {
          aggregation[res.registrationId] = {
            id: res.registrationId,
            name: res.teamName,
            matches: 0,
            wins: 0,
            kills: 0,
            points: 0,
            bestPlacement: 25,
          };
        }

        const stats = aggregation[res.registrationId];
        stats.matches += 1;
        stats.wins += (res.placement === 1 ? 1 : 0);
        stats.kills += (res.kills || 0);
        stats.points += (res.points || 0);
        
        if (res.placement < stats.bestPlacement && res.placement > 0) {
          stats.bestPlacement = res.placement;
        }
      });
    });

    // 3. Sort by Points -> Kills -> Wins -> Best Placement
    const standings = Object.values(aggregation).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.kills !== a.kills) return b.kills - a.kills;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.bestPlacement - b.bestPlacement;
    });

    return NextResponse.json(standings);
  } catch (error: any) {
    console.error("Leaderboard Failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
