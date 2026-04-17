const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function promote() {
    try {
        const user = await prisma.user.update({
            where: { email: "kaushikprayag7@gmail.com" },
            data: { role: "admin" }
        });
        console.log("SUCCESS: Promoted", user.email, "to admin");
    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await prisma.$disconnect();
    }
}

promote();
