const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDetails() {
  const regs = await prisma.registration.findMany({
    include: { tournament: true }
  });
  console.log(JSON.stringify(regs.map(r => ({
      id: r.id,
      status: r.status,
      lobby: r.lobby,
      slot: r.slot,
      tournament: r.tournament.title,
      roster: r.rosterData
  })), null, 2));
}

checkDetails()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
