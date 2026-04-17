import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.featuredGame.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}
