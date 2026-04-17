import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== "SUPER_ADMIN" && (session.user as any)?.role !== "ORGANIZER")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notifications = await prisma.popupNotification.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== "SUPER_ADMIN" && (session.user as any)?.role !== "ORGANIZER")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, message, imageUrl, link, linkText, type, tournamentId, isActive, showOnce } = body;

    if (!title || !message) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // If this new notification is active, maybe deactivate others? 
    // For now, let's just create it as requested.
    
    const notification = await prisma.popupNotification.create({
      data: {
        title,
        message,
        imageUrl,
        link,
        linkText: linkText || "Learn More",
        type: type || "CUSTOM",
        tournamentId,
        isActive: isActive !== undefined ? isActive : true,
        showOnce: showOnce !== undefined ? showOnce : true,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("[NOTIFICATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
