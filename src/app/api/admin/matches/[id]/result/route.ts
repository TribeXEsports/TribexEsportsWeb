import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH update match results (NEXUS Combat Sync)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: matchId } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { results } = await req.json();

    // 1. Identify the winner (Placement 1)
    const winner = results.find((r: any) => r.placement === 1);

    // 2. Update match status and results
    // We store the full array in roundResults for the leaderboard engine
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: "COMPLETED",
        winnerTeamId: winner?.teamId || undefined,
        roundResults: results,
      }
    });

    return NextResponse.json(match);
  } catch (error: any) {
    console.error("Combat Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
