import React from "react";
import { prisma } from "@/lib/prisma";
const db = prisma as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VaultContent } from "@/components/dashboard/VaultContent";

async function getVaultData(userId: string) {
  const matches = await db.match.findMany({
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
  });

  return { matches };
}

export default async function VaultPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;
  const { matches } = await getVaultData(userId);

  return (
    <VaultContent 
        user={session.user} 
        matches={matches} 
    />
  );
}
