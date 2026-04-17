const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true }
  });
  
  const nullUsers = users.filter(u => u.username === null || u.username === undefined);
  console.log(`Total users: ${users.length}`);
  console.log(`Users with null username: ${nullUsers.length}`);
  console.log('Sample null users:', nullUsers.slice(0, 5));
  
  const counts = {};
  users.forEach(u => {
    if (u.username) {
      counts[u.username] = (counts[u.username] || 0) + 1;
    }
  });
  
  const duplicates = Object.entries(counts).filter(([name, count]) => count > 1);
  console.log('Duplicate usernames:', duplicates);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
