import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fix() {
  const current = await prisma.siteSettings.findFirst();
  if (!current) {
    console.log('No settings found to fix.');
    return;
  }

  const updated = await prisma.siteSettings.update({
    where: { id: current.id },
    data: {
      heroTitle: "REVOLUTIONIZING", // Fix the typo in the DB
      heroVideoUrl: "https://res.cloudinary.com/dgmmlnusg/video/upload/v1775839173/cynpjwe8ehf7awfjb8fh.mp4"
    }
  });

  console.log('Fixed Site Settings:');
  console.log(JSON.stringify(updated, null, 2));
}

fix().catch(console.error).finally(() => prisma.$disconnect());
