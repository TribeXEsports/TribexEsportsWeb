import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET matches for a tournament (Tactical Intelligence)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || !["SUPER_ADMIN", "ORGANIZER", "CAPTAIN", "PLAYER"].includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tournamentId) return NextResponse.json({ error: "Mission ID required" }, { status: 400 });

    try {
        const matches = await prisma.match.findMany({
            where: { tournamentId },
            include: {
                room: true,
                teamA: { select: { id: true, name: true, image: true } },
                teamB: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "asc" }
        });

        // Security check for non-privileged roles: Only return room info if registration is verified
        if (["CAPTAIN", "PLAYER", "USER"].includes(userRole)) {
            const userId = (session.user as any).id;
            
            // Find user's registration and lobby for this tournament
            const registration = await prisma.registration.findFirst({
                where: { 
                  tournamentId,
                  status: { in: ["VERIFIED", "CONFIRMED"] },
                  OR: [
                    { userId },
                    { team: { members: { some: { id: userId } } } }
                  ]
                }
            });

            return NextResponse.json(matches.map((m: any) => {
                const isAuthorizedLobby = !m.stage?.toLowerCase().includes("lobby") || 
                                         (registration && m.stage?.includes(registration.lobby || ""));
                
                const isRevealed = m.room?.revealTime ? new Date(m.room.revealTime) <= new Date() : true;

                if (!registration || !isAuthorizedLobby || !isRevealed) {
                    return {
                        ...m,
                        room: m.room ? { ...m.room, roomId: "LOCKED", roomPassword: "LOCKED" } : null
                    };
                }
                return m;
            }));
        }

        return NextResponse.json(matches);
    } catch (error: any) {
        return NextResponse.json({ error: "Satellite intelligence failed.", details: error.message }, { status: 500 });
    }
}

// POST create/update match + room (Organizer Override)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || !["SUPER_ADMIN", "ORGANIZER"].includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { 
      tournamentId, stage, lobby,
      teamAId, teamBId, roomData 
    } = payload;

    // Create Match
    const match = await prisma.match.create({
      data: {
        tournamentId,
        stage: lobby ? `Lobby ${lobby}` : (stage || "Round 1"),
        teamAId,
        teamBId,
        status: "PENDING",
        room: roomData ? {
            create: {
                roomId: roomData.roomId,
                roomPassword: roomData.roomPassword,
                map: roomData.map || "BERMUDA",
                revealTime: roomData.revealTime ? new Date(roomData.revealTime) : null,
                visibility: "PRIVATE"
            }
        } : undefined
      },
      include: { room: true }
    });

    return NextResponse.json(match);
  } catch (error: any) {
    console.error("Match/Room Deployment Error:", error);
    return NextResponse.json({ error: "Failed to deploy match resources.", details: error.message }, { status: 500 });
  }
}
