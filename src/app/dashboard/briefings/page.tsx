import React from "react";
import { prisma } from "@/lib/prisma";
const db = prisma as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BriefingsContent } from "@/components/dashboard/BriefingsContent";

export const dynamic = "force-dynamic";

async function getBriefingsData(userId: string) {
  const registrations = await db.registration.findMany({
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
  });

  return { registrations };
}

export default async function BriefingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;
  const { registrations } = await getBriefingsData(userId);

  return (
    <BriefingsContent 
        registrations={registrations} 
    />
  );
}
