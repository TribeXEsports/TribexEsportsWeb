import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const s = await prisma.siteSettings.findFirst({
    select: {
      heroTitle: true,
      heroSubtitle: true,
      heroVideoUrl: true,
      heroVideoBrightness: true,
      heroOverlayOpacity: true,
      heroOverlayColor: true,
    }
  });
  console.log('Hero settings:', JSON.stringify(s, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
