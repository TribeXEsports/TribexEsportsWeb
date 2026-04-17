const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.rosterMember.count();
    console.log("Total Roster Members in DB:", count);
    const members = await prisma.rosterMember.findMany({ take: 5 });
    console.log("Samples:", JSON.stringify(members, null, 2));
  } catch (e) {
    console.error("Check failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
