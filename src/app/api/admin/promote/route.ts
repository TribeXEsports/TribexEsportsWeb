import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, secret } = await req.json();

    // Basic security check: simple hardcoded secret for setup
    // In production, this should be removed after the first admin is created
    if (secret !== "tribex_admin_setup_2024") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: USER_ROLES.SUPER_ADMIN }
    });

    return NextResponse.json({ message: `User ${user.email} promoted to ${USER_ROLES.SUPER_ADMIN}`, user });
  } catch (error) {
    console.error("Promotion Error:", error);
    return NextResponse.json({ error: "Failed to promote user" }, { status: 500 });
  }
}
