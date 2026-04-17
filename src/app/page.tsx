import { HomeClient } from "@/components/home/HomeClient"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [settings, games, tournaments] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.featuredGame.findMany({
      orderBy: { order: 'asc' }
    }),
    (prisma as any).tournament.findMany({
      where: { status: { in: ['REGISTRATION', 'UPCOMING', 'registration', 'upcoming'] } },
      orderBy: { createdAt: 'desc' },
      take: 4, // Show last 4 created that are available for registration
      include: {
        _count: { select: { registrations: true } }
      }
    })
  ])

  return <HomeClient initialSettings={settings} initialGames={games} initialTournaments={tournaments} />
}
