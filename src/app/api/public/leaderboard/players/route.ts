import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Aggregates wins by counting occurrences of winnerName in completed tournaments
    const topWinners = await prisma.tournament.groupBy({
      by: ['winnerName'],
      where: { 
        status: "completed",
        winnerName: { not: null }
      },
      _count: {
        winnerName: true
      },
      orderBy: {
        _count: {
          winnerName: 'desc'
        }
      },
      take: 10
    });

    // Filter out empty strings after fetching, then map
    const formattedRankings = topWinners
      .filter((w: { winnerName: string | null }) => w.winnerName && w.winnerName.trim() !== "")
      .map((w: { winnerName: string | null; _count: { winnerName: number } }, index: number) => ({
        rank: index + 1,
        name: w.winnerName,
        wins: w._count.winnerName,
        points: w._count.winnerName * 100,
        trend: "same"
      }));
    
    return NextResponse.json(formattedRankings);
  } catch (error) {
    console.error("Fetch Player Rankings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
