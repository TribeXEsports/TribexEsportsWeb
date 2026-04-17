import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Use a transaction to clean up all related records
    await prisma.$transaction([
      // 1. Delete all matches associated with this tournament
      prisma.match.deleteMany({ where: { tournamentId: id } }),
      
      // 2. Delete all registrations associated with this tournament
      prisma.registration.deleteMany({ where: { tournamentId: id } }),
      
      // 3. Finally delete the tournament itself
      prisma.tournament.delete({ where: { id } })
    ]);

    return NextResponse.json({ message: "Tournament deleted successfully" });
  } catch (error: any) {
    console.error("Tournament Deletion Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete tournament", 
      details: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role;

        if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        // Allowed fields for updates
        const allowedFields = [
            "title", "game", "mode", "teamFormat", "maxPlayers", "startTime",
            "registrationEndTime", "endTime", "description", "imageUrl", 
            "entryType", "entryFee", "prizePool", "allowSubstitutes", "rules",
            "status", "winnerName", "winnerId", "resultsOverview", "finalStandings", "isFeatured"
        ];


        const data: any = {};
        allowedFields.forEach(field => {
            if (field in body) data[field] = body[field];
        });

        // Ensure status is valid if provided
        if (data.status && !["upcoming", "live", "completed"].includes(data.status)) {
            return NextResponse.json({ error: "Invalid status protocol" }, { status: 400 });
        }

        const updated = await prisma.tournament.update({
            where: { id },
            data
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("Tournament Update Error:", error);
        return NextResponse.json({ 
            error: "Deployment update failed", 
            details: error.message 
        }, { status: 500 });
    }
}

