import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Upgrading existing 'admin' users to 'SUPER_ADMIN'...");
  const users = await prisma.user.updateMany({
    where: { role: "admin" },
    data: { role: "SUPER_ADMIN" }
  });
  console.log(`Updated ${users.count} users to SUPER_ADMIN.`);
  
  console.log("Upgrading existing 'user' users to 'USER' ENUM equivalent...");
  const normalUsers = await prisma.user.updateMany({
    where: { role: "user" },
    data: { role: "USER" }
  });
  console.log(`Updated ${normalUsers.count} users to USER role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
