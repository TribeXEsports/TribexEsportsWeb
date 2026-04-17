import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all registrations with relations
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      include: {
        user: { select: { name: true, username: true, email: true, image: true } },
        team: { 
          select: { 
            name: true,
          } 
        },
        tournament: { select: { id: true, title: true, game: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

// PATCH approve/reject registration
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json(); 
    
    // Map UI statuses to DB statuses
    let dbStatus = status;
    if (status === "approved") dbStatus = "VERIFIED";
    if (status === "rejected") dbStatus = "REJECTED";
    if (status === "pending") dbStatus = "PENDING_APPROVAL";

    const registration = await prisma.registration.update({
      where: { id },
      data: { status: dbStatus }
    });

    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}
