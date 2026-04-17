import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { name, username, password, image, twitterUrl, instagramUrl, youtubeUrl } = await req.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (username) {
      // Check if username unique
      const existing = await prisma.user.findFirst({ where: { username } });
      if (existing && existing.id !== userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
      updateData.username = username;
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;
    if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile", 
      details: error.message 
    }, { status: 500 });
  }
}
