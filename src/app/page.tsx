import { HomeClient } from "@/components/home/HomeClient"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  let settings = null;
  let games: any[] = [];
  let tournaments: any[] = [];

  try {
    [settings, games, tournaments] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.featuredGame.findMany({
        orderBy: { order: 'asc' }
      }),
      (prisma as any).tournament.findMany({
        where: { status: { in: ['REGISTRATION', 'UPCOMING', 'registration', 'upcoming'] } },
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: {
          _count: { select: { registrations: true } }
        }
      })
    ]);
  } catch {
    // Database unreachable — render with fallback data
  }

  return <HomeClient initialSettings={settings} initialGames={games} initialTournaments={tournaments} />
}
