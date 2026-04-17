import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Aggregate data from all models
    // Exclude security-sensitive transitionary data like Sessions and VerificationTokens
    const [
      users,
      teams,
      tournaments,
      registrations,
      matches,
      payments,
      rosterMembers,
      ambassadors,
      news,
      featuredGames,
      partners,
      notifications,
      settings
    ] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          twitterUrl: true,
          instagramUrl: true,
          youtubeUrl: true
        }
      }),
      prisma.team.findMany(),
      prisma.tournament.findMany(),
      prisma.registration.findMany(),
      prisma.match.findMany(),
      prisma.payment.findMany(),
      prisma.rosterMember.findMany(),
      prisma.campusAmbassador.findMany(),
      prisma.news.findMany(),
      prisma.featuredGame.findMany(),
      prisma.partner.findMany(),
      prisma.popupNotification.findMany(),
      prisma.siteSettings.findFirst()
    ]);

    const backupData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      metadata: {
        totalUsers: users.length,
        totalTournaments: tournaments.length,
        totalRegistrations: registrations.length
      },
      data: {
        users,
        teams,
        tournaments,
        registrations,
        matches,
        payments,
        rosterMembers,
        ambassadors,
        news,
        featuredGames,
        partners,
        notifications,
        settings
      }
    };

    return NextResponse.json(backupData);
  } catch (error) {
    console.error("Backup Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
