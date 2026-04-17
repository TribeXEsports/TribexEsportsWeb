import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notification = await prisma.popupNotification.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notification || null);
  } catch (error) {
    console.error("[ACTIVE_NOTIFICATION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
