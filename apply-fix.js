const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const result = await prisma.registration.update({
    where: { id: "69d3733d92ec7395d31ca7bf" },
    data: {
      status: "VERIFIED",
      lobby: "A", 
      slot: 1
    }
  });
  console.log("UPDATED SUCCESSFULLY:", result.id, result.status, result.lobby, result.slot);
}

fix()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
