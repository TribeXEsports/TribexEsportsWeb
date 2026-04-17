import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fix() {
  const current = await prisma.siteSettings.findFirst({ select: { id: true } });
  if (!current) { console.log('No settings found'); return; }

  await prisma.siteSettings.update({
    where: { id: current.id },
    data: {
      heroVideoBrightness: 70,
      heroOverlayOpacity: 25,
    }
  });

  console.log('Fixed! heroVideoBrightness set to 70, heroOverlayOpacity set to 25');
}

fix().catch(console.error).finally(() => prisma.$disconnect());
