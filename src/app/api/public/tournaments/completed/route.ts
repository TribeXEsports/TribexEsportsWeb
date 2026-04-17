import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const completedTournaments = await prisma.tournament.findMany({
      where: { status: "completed" },
      orderBy: { updatedAt: "desc" },
      take: 20
    });
    
    return NextResponse.json(completedTournaments);
  } catch (error) {
    console.error("Fetch Completed Tournaments Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
