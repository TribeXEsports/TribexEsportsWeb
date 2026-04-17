const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRooms() {
  const matches = await prisma.match.findMany({
    include: { room: true, tournament: true }
  });
  console.log(JSON.stringify(matches.map(m => ({
      id: m.id,
      tournament: m.tournament.title,
      stage: m.stage,
      room: m.room ? { id: m.room.roomId, pass: m.room.roomPassword } : null
  })), null, 2));
}

checkRooms()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
