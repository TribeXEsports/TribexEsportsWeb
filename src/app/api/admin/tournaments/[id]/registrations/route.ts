import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all registrations for a tournament
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      where: { tournamentId },
      include: {
        user: { select: { name: true, email: true, image: true } },
        team: { 
          select: { 
            name: true, 
            image: true, 
            captain: { select: { name: true, email: true } } 
          } 
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Fetch Registrations Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH update registration (Confirm/Reject/Assign Lobby)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { registrationId, status, lobby, slot } = await req.json();

    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status,
        lobby,
        slot: slot ? parseInt(slot) : undefined
      }
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Update Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST manually add a team
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamName, captainName, players } = await req.json();

    // Create a manual registration
    const registration = await prisma.registration.create({
      data: {
        tournamentId,
        status: "CONFIRMED",
        isManualAdded: true,
        rosterData: players || [],
        // We don't necessarily create a full Team model for manual adds unless needed
        // but it's better to store team info in a JSON field if it's a one-off
      }
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Manual Add Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
