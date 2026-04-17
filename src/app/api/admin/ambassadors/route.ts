import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ambassadors = await prisma.campusAmbassador.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(ambassadors);
  } catch (error) {
    console.error("Fetch Ambassadors Error:", error);
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

    const { name, university, imageUrl } = await req.json();

    if (!name || !university) {
      return NextResponse.json({ error: "Name and University are required" }, { status: 400 });
    }

    const ambassador = await prisma.campusAmbassador.create({
      data: { name, university, imageUrl },
    });
    return NextResponse.json(ambassador, { status: 201 });
  } catch (error) {
    console.error("Create Ambassador Error:", error);
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
    await prisma.campusAmbassador.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Ambassador Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
