import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [teamCount, settings] = await Promise.all([
      prisma.team.count(),
      prisma.siteSettings.findFirst()
    ]);
    
    return NextResponse.json({
      totalTeams: (teamCount || 0) + (settings?.totalRegisteredTeamsBase || 0),
      totalPrizeMoney: settings?.totalPrizeMoney || 0,
      totalTournaments: await prisma.tournament.count({ where: { status: "completed" } })
    });

  } catch (error) {
    console.error("Fetch Public Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
