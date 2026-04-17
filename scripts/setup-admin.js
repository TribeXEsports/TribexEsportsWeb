const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function setupAdmin() {
    const email = "kaushikprayag7@gmail.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        
        if (existing) {
            const updated = await prisma.user.update({
                where: { email },
                data: { role: "admin" }
            });
            console.log("SUCCESS: User exists. Promoted", updated.email, "to admin");
        } else {
            const created = await prisma.user.create({
                data: {
                    email,
                    name: "Admin User",
                    password: hashedPassword,
                    role: "admin",
                    username: "admin_tribex"
                }
            });
            console.log("SUCCESS: Created NEW admin account:");
            console.log("Email:", created.email);
            console.log("Password:", password);
        }
    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await prisma.$disconnect();
    }
}

setupAdmin();
