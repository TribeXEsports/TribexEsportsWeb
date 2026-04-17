import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, username } = await req.json();
    const userId = (session.user as any).id;

    // Basic data sanitization
    const data: any = {};
    if (name !== undefined) data.name = name.trim();
    if (username !== undefined) data.username = username.trim().toLowerCase();

    if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: "No update parameters provided" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });

    return NextResponse.json({
        message: "Identity updated successfully",
        user: {
            name: updatedUser.name,
            username: updatedUser.username
        }
    });
  } catch (error: any) {
    console.error("User Update Failure:", error);
    return NextResponse.json({ 
        error: "Failed to update profile",
        details: error.message 
    }, { status: 500 });
  }
}
