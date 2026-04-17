import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";

interface PublicProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUserData(username: string) {
  // We lowercase the username to ensure case-insensitive matching if needed, 
  // though typically it should match exactly what's in DB
  return await prisma.user.findFirst({
    where: { 
      username: {
        equals: username,
        mode: 'insensitive' // Ensure we find them even if case differs
      }
    },
  });
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  
  const user = await getUserData(username);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Depth Background (Matching main profile) */}
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
