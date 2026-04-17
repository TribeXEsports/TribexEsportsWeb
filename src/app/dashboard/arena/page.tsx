import React from "react";
import { prisma } from "@/lib/prisma";
const db = prisma as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArenaFloor } from "@/components/dashboard/ArenaFloor";

export const dynamic = "force-dynamic";

async function getArenaData() {
  const [games, allTournaments] = await Promise.all([
    db.featuredGame.findMany({
      orderBy: { order: "asc" }
    }),
    db.tournament.findMany({
      where: { status: { not: "COMPLETED" } },
      include: {
        _count: {
          select: { 
                registrations: { 
                    where: { status: { in: ["VERIFIED", "CONFIRMED"] } } 
                } 
          }
        }
      },
      orderBy: { startTime: "asc" }
    })
  ]);

  return { games, allTournaments };
}

export default async function ArenaFloorPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { games, allTournaments } = await getArenaData();

  return (
    <ArenaFloor 
        games={games} 
        allTournaments={allTournaments} 
    />
  );
}
