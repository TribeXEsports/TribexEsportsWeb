import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: "asc" }
    });
    return NextResponse.json(partners);
  } catch (error) {
    console.error("Fetch Partners Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
