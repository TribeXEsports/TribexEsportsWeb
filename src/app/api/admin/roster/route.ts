import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, role, game, teamName, imageUrl, stats } = await req.json();

    if (!name || !role || !game) {
      return NextResponse.json({ error: "Name, role, and game are required" }, { status: 400 });
    }

    const member = await prisma.rosterMember.create({
      data: { name, role, game, teamName, imageUrl, stats },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Create Roster Member Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await prisma.rosterMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Roster Member Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
