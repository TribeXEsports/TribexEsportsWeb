const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('--- REGISTRY KEY MIGRATION STARTED ---');
  try {
    // 1. Fetch all registrations with tournament context
    const regs = await prisma.registration.findMany({
      include: { tournament: true }
    });

    console.log(`Processing ${regs.length} registrations...`);

    let updatedCount = 0;
    let deletedDuplicates = 0;

    for (const r of regs) {
      if (!r.tournament) {
        console.warn(`Skipping registration ${r.id}: No associated tournament found.`);
        continue;
      }

      // 2. Generate the unique Registry Key
      const registrarId = r.tournament.mode === 'SOLO' ? r.userId : r.teamId;
      
      // Fallback to userId if it's a team registration but teamId is missing for some reason
      const identifier = registrarId || r.userId || r.captainId;

      if (!identifier) {
        console.warn(`Skipping registration ${r.id}: No valid user/team identifier found.`);
        continue;
      }

      const key = `${r.tournamentId}_${identifier}`;

      // 3. Apply the Key (Handle Duplicates)
      try {
        await prisma.registration.update({
          where: { id: r.id },
          data: { registryKey: key }
        });
        updatedCount++;
      } catch (error) {
        // If P2002 (Unique constraint failed), this is a duplicate
        if (error.code === 'P2002' || error.message.includes('unique')) {
          console.log(`Duplicate detected for key [${key}]. Deleting redundant record: ${r.id}`);
          await prisma.registration.delete({ where: { id: r.id } });
          deletedDuplicates++;
        } else {
          console.error(`Failed to update registration ${r.id}:`, error.message);
        }
      }
    }

    console.log('--- MIGRATION SUMMARY ---');
    console.log(`Total Processed: ${regs.length}`);
    console.log(`Successfully Updated: ${updatedCount}`);
    console.log(`Duplicates Removed: ${deletedDuplicates}`);
    console.log('-------------------------');

  } catch (err) {
    console.error('CRITICAL MIGRATION ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
