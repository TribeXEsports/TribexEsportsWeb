import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== "SUPER_ADMIN" && (session.user as any)?.role !== "ORGANIZER")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, message, imageUrl, link, linkText, type, tournamentId, isActive, showOnce } = body;

    const notification = await prisma.popupNotification.update({
      where: { id },
      data: {
        title,
        message,
        imageUrl,
        link,
        linkText,
        type,
        tournamentId,
        isActive,
        showOnce,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("[NOTIFICATION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any)?.role !== "SUPER_ADMIN" && (session.user as any)?.role !== "ORGANIZER")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const notification = await prisma.popupNotification.delete({
      where: { id },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("[NOTIFICATION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
