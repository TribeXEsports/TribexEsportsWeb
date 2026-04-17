import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assignNextAvailableSlot } from "@/lib/tournament-logic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tournamentId, teamName, leaderName, players, paymentId, gateway } = await req.json();
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // 1. Fetch Tournament Security Context
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    }) as any;

    if (!tournament) return NextResponse.json({ error: "Tournament not found in system." }, { status: 404 });

    // 2. Capacity Integrity Checks - Count only Active/Verified registrations
    const activeCount = await prisma.registration.count({
        where: {
            tournamentId,
            status: { in: ["VERIFIED", "PENDING_APPROVAL", "CONFIRMED"] }
        }
    });

    if (activeCount >= tournament.maxPlayers) {
      return NextResponse.json({ error: "Tournament registration is full." }, { status: 400 });
    }

    // 2.5 Robust Duplicate Detection (Prevent Ghost Entries)
    const existing = await prisma.registration.findFirst({
      where: { 
        tournamentId,
        OR: [
            { userId }, 
            { team: { captainId: userId } },
            { captainId: userId }
        ]
      }
    });

    if (existing && (existing.status === "VERIFIED" || existing.status === "CONFIRMED")) {
        return NextResponse.json({ 
            error: "Already registered and verified.", 
            id: existing.id 
        }, { status: 400 });
    }

    // 3. Status Determination based on Auto-Verify setting
    // Status can be VERIFIED (Automatic) or PENDING_APPROVAL (Manual)
    let status: any = tournament.autoVerify ? "VERIFIED" : "PENDING_APPROVAL";

    if (tournament.entryType === "PAID") {
        if (!paymentId) {
            return NextResponse.json({ error: "Valid payment reference required for registration." }, { status: 402 });
        }
        // Paid tournaments default to manual verification until payment is checked, 
        // unless auto-verify is strictly forced.
        if (!tournament.autoVerify) status = "PENDING_APPROVAL";
    }

    // 4. Team Logic
    let teamId = null;
    if (tournament.mode !== "SOLO") {
      let team = await prisma.team.findFirst({
        where: { captainId: userId }
      });

      if (!team) {
          if (!teamName) return NextResponse.json({ error: "Team Name is required." }, { status: 400 });
          team = await prisma.team.create({
            data: {
              name: teamName,
              captainId: userId,
              members: { connect: { id: userId } }
            }
          });
      }
      teamId = team.id;
    }

    // 5. Final Registration (Atomic Registry Lock)
    const registrarKey = tournament.mode === "SOLO" 
        ? `${tournamentId}_${userId}` 
        : `${tournamentId}_${teamId}`;

    const registrationData = {
        tournamentId,
        userId: tournament.mode === "SOLO" ? userId : null,
        teamId,
        captainId: userId,
        status,
        rosterData: players || [],
        paymentStatus: status === "VERIFIED" ? "COMPLETED" : "PENDING",
        gatewayUsed: gateway || "NONE",
        transactionId: paymentId || null,
        registryKey: registrarKey
    };

    // Atomic Upsert Handshake
    const registration = await prisma.registration.upsert({
        where: { registryKey: registrarKey },
        update: { ...registrationData, status: existing?.status || status },
        create: registrationData
    });

    // 6. Guaranteed Post-Registration Slotting (Only if VERIFIED)
    if (registration.status === "VERIFIED") {
        await assignNextAvailableSlot(prisma, tournamentId, registration.id);
    }

    return NextResponse.json({ 
        message: "Registration successful.", 
        status: registration.status,
        id: registration.id 
    });

  } catch (error: any) {
    console.error("SYSTEM ERROR: Registration Failure", error);
    return NextResponse.json({ error: "Internal registration process failed.", details: error.message }, { status: 500 });
  }
}
