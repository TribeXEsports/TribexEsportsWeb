import React from "react";
import { prisma } from "@/lib/prisma";
import { TournamentsClient } from "./TournamentsClient";

export const dynamic = "force-dynamic";

async function getTournaments() {
  return await (prisma as any).tournament.findMany({
    // Fetch all relevant statuses we want to show
    where: { 
      status: { 
        in: ['UPCOMING', 'LIVE', 'COMPLETED', 'upcoming', 'live', 'completed'] 
      } 
    },
    orderBy: { startTime: "asc" },
    include: {
      _count: { select: { registrations: true } }
    }
  });
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <TournamentsClient initialTournaments={tournaments} />
  );
}


