import React from "react";
import { prisma } from "@/lib/prisma";
const db = prisma as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OverviewContent } from "@/components/dashboard/OverviewContent";

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
  const [registrations, matches, news] = await Promise.all([
    db.registration.findMany({
      where: { 
        OR: [{ userId }, { team: { captainId: userId } }]
      },
      include: { 
        tournament: {
          include: {
            _count: {
              select: { 
                registrations: { 
                    where: { status: { in: ["VERIFIED", "CONFIRMED"] } } 
                } 
              }
            }
          }
        }, 
        team: true 
      },
      orderBy: { createdAt: "desc" }
    }),
    db.match.findMany({
      where: { 
        OR: [
          { userAId: userId }, 
          { userBId: userId },
          { teamA: { captainId: userId } }, 
          { teamB: { captainId: userId } }
        ]
      },
      include: {
        tournament: true,
        userA: true,
        userB: true,
        teamA: true,
        teamB: true,
        winnerUser: true,
        winnerTeam: true
      },
      orderBy: { createdAt: "desc" }
    }),
    db.news.findMany({
        take: 2,
        orderBy: { createdAt: "desc" }
    })
  ]);

  return { registrations, matches, news };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;
  const { registrations, matches, news } = await getDashboardData(userId);

  return (
    <OverviewContent 
        user={session.user} 
        registrations={registrations} 
        matches={matches} 
        news={news}
    />
  );
}


