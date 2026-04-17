const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  const tId = '67f1390f70f612ab7c3855ea';
  console.log('Cleaning up duplicates for tournament:', tId);
  
  const regs = await prisma.registration.findMany({ 
    where: { tournamentId: tId } 
  });
  
  const users = {}; // userId -> [regs]
  
  regs.forEach(r => {
    const key = r.userId || r.teamId || r.captainId;
    if (!key) return;
    if (!users[key]) users[key] = [];
    users[key].push(r);
  });

  for (const key in users) {
    const list = users[key];
    if (list.length > 1) {
      // Find the "best" one to keep (Verified > most recent)
      const verified = list.find(r => r.status === 'VERIFIED');
      const keep = verified || list[list.length - 1];
      
      const toDelete = list.filter(r => r.id !== keep.id);
      for (const d of toDelete) {
        await prisma.registration.delete({ where: { id: d.id } });
        console.log(`Deleted redundant registration: ${d.id} for user ${key}`);
      }
    }
  }
  console.log('Cleanup finished.');
}

cleanup()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
