const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllRegs() {
  const regs = await prisma.registration.findMany({
    include: { tournament: true }
  });
  console.log(JSON.stringify(regs.map(r => ({
      id: r.id,
      status: r.status,
      paymentStatus: r.paymentStatus,
      lobby: r.lobby,
      slot: r.slot,
      tournament: r.tournament.title
  })), null, 2));
}

checkAllRegs()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
