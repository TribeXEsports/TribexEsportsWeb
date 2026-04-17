import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/dashboard/SettingsContent";

import { prisma as db } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;
  const user = await db.user.findUnique({
      where: { id: userId },
      include: { accounts: true }
  });

  if (!user) redirect("/login");

  return (
    <SettingsContent 
        user={user} 
    />
  );
}
