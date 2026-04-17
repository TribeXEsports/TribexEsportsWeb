import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("[News API] Fetching article ID:", id);

    // Using findFirst instead of findUnique to avoid strict ObjectId validation errors in Prisma
    const article = await prisma.news.findFirst({
      where: { id },
    });
    
    if (!article) {
      console.log("[News API] Article not found in database:", id);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error: any) {
    console.error("[News API] Prisma error:", error.message);
    return NextResponse.json({ error: "Failed to fetch article", details: error.message }, { status: 500 });
  }
}
