import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session && (session.user as any)?.role === "SUPER_ADMIN";
}

export async function GET() {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const partners = await prisma.partner.findMany({
            orderBy: { order: "asc" }
        });
        return NextResponse.json(partners);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name, role, category, order } = body;

        if (!name || !role || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const partner = await prisma.partner.create({
            data: { name, role, category, order: order || 0 }
        });

        return NextResponse.json(partner);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { id, name, role, category, order } = body;

        if (!id) return NextResponse.json({ error: "Id is required" }, { status: 400 });

        const partner = await prisma.partner.update({
            where: { id },
            data: { name, role, category, order: order }
        });

        return NextResponse.json(partner);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Id is required" }, { status: 400 });

        await prisma.partner.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
    }
}
