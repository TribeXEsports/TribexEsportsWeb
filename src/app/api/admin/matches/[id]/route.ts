import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || !["SUPER_ADMIN", "ORGANIZER"].includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        room: true,
        tournament: {
           select: {
              id: true,
              title: true,
              game: true
           }
        }
      }
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error: any) {
    console.error("Fetch Match Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
