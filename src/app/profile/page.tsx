import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";

export const dynamic = "force-dynamic";

async function getUserData(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await getUserData((session.user as any).id);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Depth Background */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] grayscale" />
          <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
      </div>

      <div className="container max-w-2xl relative z-10">
        <ProfileCard user={user as any} />
      </div>
    </main>
  );
}
