import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // GROUND ZERO: Clear existing sector data to prevent duplicates
    await prisma.partner.deleteMany({});
    await prisma.featuredGame.deleteMany({});

    // 1. Initial Partner Network
    const partners = [
      { name: "Garena Free Fire", role: "Strategic Partner", category: "Global Esports", order: 1 },
      { name: "University Partner", role: "Academic Body", category: "Education", order: 2 },
      { name: "Institutional Ally", role: "Verification", category: "Certification", order: 3 },
      { name: "Network Infrastructure", role: "Tech Partner", category: "Connectivity", order: 4 },
      { name: "Operational Asset", role: "Strategic Partner", category: "Logistics", order: 5 }
    ];

    for (const p of partners) {
      await prisma.partner.upsert({
        where: { id: "p_" + p.name.replace(/\s+/g, '_') }, // unique-ish id for upsert
        update: p,
        create: {
            ...p,
            id: undefined // let prisma generate real id
        }
      }).catch(() => {
          // If upsert fails due to ID format, just create
          return prisma.partner.create({ data: p });
      });
    }

    // 2. Initial Games Roster (HD Tactical Logos)
    const games = [
      { name: "CS:GO", imageUrl: "https://images.logicalincrements.com/gallery/1920/822/csgowallpaper5.webp", order: 1 },
      { name: "F1 24", imageUrl: "https://media.contentapi.ea.com/content/dam/ea/f1/f1-24/common/f124-standard-ed-16x9.jpg.adapt.crop191x100.1200w.jpg", order: 2 },
      { name: "VALORANT", imageUrl: "https://variety.com/wp-content/uploads/2024/08/valorant.png", order: 3 },
      { name: "BGMI", imageUrl: "https://st1.techlusive.in/wp-content/uploads/2024/09/BGMI-3.4-update.jpg", order: 4 },
      { name: "FC24", imageUrl: "https://media.contentapi.ea.com/content/dam/ea/ea-sports-fc/fc-24/common/homepage/fchp-standard-ed-16x9.jpg.adapt.crop191x100.1200w.jpg", order: 5 }
    ];

    for (const g of games) {
      const existing = await prisma.featuredGame.findFirst({ where: { name: g.name } });
      if (!existing) {
        await prisma.featuredGame.create({ data: g });
      }
    }

    return NextResponse.json({ success: true, message: "Strategic alliances and tactical games restored." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Restoration failed" }, { status: 500 });
  }
}
