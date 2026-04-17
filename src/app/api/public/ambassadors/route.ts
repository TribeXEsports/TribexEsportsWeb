import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ambassadors = await prisma.campusAmbassador.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(ambassadors);
  } catch (error) {
    console.error("Fetch Public Ambassadors Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
