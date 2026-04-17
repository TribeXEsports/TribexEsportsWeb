import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all tournaments for the specific logged in role
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where: any = {};
    const now = new Date();

    // Self-healing: Transition Upcomings and Lives to their next state if time has passed
    // 1. Transition UPCOMING to LIVE if startTime has passed
    await prisma.tournament.updateMany({
        where: {
            OR: [
                { status: "upcoming" },
                { status: "UPCOMING" }
            ],
            startTime: { lte: now }
        },
        data: { status: "live" }
    });

    // 2. Transition LIVE to COMPLETED if endTime has passed
    await prisma.tournament.updateMany({
        where: {
            status: "live",
            endTime: { lte: now, not: null }
        },
        data: { status: "completed" }
    });

    // Organizers only see their own events
    if (userRole === "ORGANIZER") {
      where.organizerId = (session.user as any).id;
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      orderBy: { startTime: "desc" },
      include: {
        _count: {
          select: { registrations: true }
        },
        organizer: {
            select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error("Fetch Tournaments Error:", error);
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}

// POST create tournament/scrim
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userId = (session?.user as any)?.id;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { 
        title, game, mode, teamFormat, maxPlayers, 
        startTime, registrationEndTime, endTime, description, imageUrl,
        type = "TOURNAMENT",
        entryType = "FREE",
        entryFee = 0,
        prizePool = "",
        allowSubstitutes = false,
        rules = "",
        pointsSystem = null,
        // Game Intelligence Fields
        gameType,
        bracketType,
        mapPool = [],
        pointsPreset,
        vetoSystem = false,
        wildcardEnabled = false,
        agentBansEnabled = false,
        autoVerify = true
    } = payload;

    const tournament = await prisma.tournament.create({
      data: {
        title,
        game,
        mode,
        teamFormat,
        maxPlayers: parseInt(maxPlayers),
        startTime: new Date(startTime),
        registrationEndTime: registrationEndTime ? new Date(registrationEndTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        description,
        imageUrl,
        type,
        entryType,
        entryFee: parseInt(entryFee) || 0,
        prizePool,
        allowSubstitutes,
        rules,
        pointsSystem: pointsSystem || {},
        status: "upcoming",
        organizerId: userRole === "ORGANIZER" ? userId : (payload.organizerId || userId),
        // Game Intelligence
        gameType,
        bracketType,
        mapPool,
        pointsPreset,
        vetoSystem: Boolean(vetoSystem),
        wildcardEnabled: Boolean(wildcardEnabled),
        agentBansEnabled: Boolean(agentBansEnabled),
        autoVerify: Boolean(autoVerify)
      } as any
    });

    return NextResponse.json(tournament);
  } catch (error: any) {
    console.error("CRITICAL: Strategic Event Creation Failure", error);
    return NextResponse.json({ 
        error: "Failed to initialize event",
        details: error.message 
    }, { status: 500 });
  }
}
