import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all news (Admin view)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// POST create news
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { title, content, imageUrl, category, author } = payload;

    const newsItem = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl,
        category,
        author: author || "Admin",
      }
    });

    return NextResponse.json(newsItem);
  } catch (error: any) {
    return NextResponse.json({ 
        error: "Failed to create news dispatch",
        details: error.message 
    }, { status: 500 });
  }
}
