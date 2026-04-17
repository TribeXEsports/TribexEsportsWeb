import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.rosterMember.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("Fetch Roster Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
