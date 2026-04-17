import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH update news
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, content, imageUrl, category, author } = await req.json();

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl,
        category,
        author: author || "Admin",
      },
    });

    return NextResponse.json(updatedNews);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update news", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE news
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete news", details: error.message },
      { status: 500 }
    );
  }
}
