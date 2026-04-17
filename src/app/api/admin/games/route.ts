import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Authenticate Admin
async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session && (session.user as any)?.role === "SUPER_ADMIN";
}

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const games = await prisma.featuredGame.findMany({
            orderBy: { order: "asc" }
        });
        return NextResponse.json(games);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const gamesToAdd = Array.isArray(body) ? body : [body];

        if (gamesToAdd.length === 0) {
            return NextResponse.json({ error: "No games provided" }, { status: 400 });
        }

        const results = [];
        for (const gameData of gamesToAdd) {
            const { name, imageUrl, order } = gameData;
            
            if (!name || !imageUrl) continue;

            // Optional: Skip if name already exists
            const existing = await prisma.featuredGame.findFirst({ where: { name } });
            if (existing) continue;

            const res = await prisma.featuredGame.create({
                data: {
                    name,
                    imageUrl,
                    order: order || 0
                }
            });
            results.push(res);
        }

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ error: "Failed to process tactical deployment" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Id is required" }, { status: 400 });
        }

        await prisma.featuredGame.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, name, imageUrl, order } = body;

        if (!id) {
            return NextResponse.json({ error: "Id is required" }, { status: 400 });
        }

        const game = await prisma.featuredGame.update({
            where: { id },
            data: {
                name,
                imageUrl,
                order: order || 0
            }
        });

        return NextResponse.json(game);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }
}
