const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const regId = '69d3750392ec7395d31ca7c1';
  console.log('--- LOBBY RECOVERY INITIATED ---');
  console.log('Target Registration:', regId);
  
  try {
    const reg = await prisma.registration.findUnique({
      where: { id: regId },
      include: { tournament: true }
    });

    if (!reg) {
      console.error('ERROR: Registration not found in registry.');
      return;
    }

    if (!reg.tournament) {
      console.error('ERROR: No tournament context linked to this record.');
      return;
    }

    console.log(`Tournament: ${reg.tournament.title} (${reg.tournament.game})`);
    console.log(`Current Status: ${reg.status}`);

    // --- Inlined Sequential Slotting Logic ---
    const capacity = reg.tournament.game === "FF" ? 12 : 25; // Simple fallback
    
    const confirmedCount = await prisma.registration.count({
      where: { 
        tournamentId: reg.tournamentId,
        AND: [
            { lobby: { not: null } },
            { slot: { not: null } }
        ]
      }
    });

    const nextPosition = confirmedCount + 1;
    const lobbyIndex = Math.floor((nextPosition - 1) / capacity);
    const localSlot = ((nextPosition - 1) % capacity) + 1;
    const lobbyName = String.fromCharCode(65 + lobbyIndex);

    console.log(`Calculated Position: ${nextPosition} -> Lobby ${lobbyName}, Slot ${localSlot}`);

    // --- Hard Update ---
    const updated = await prisma.registration.update({
      where: { id: regId },
      data: {
        lobby: lobbyName,
        slot: localSlot,
        status: "VERIFIED",
        paymentStatus: "COMPLETED"
      }
    });

    console.log(`SUCCESS: Dashboard record updated. Value: Lobby ${updated.lobby}, Slot ${updated.slot}`);
    console.log('--- RECOVERY COMPLETE ---');

  } catch (err) {
    console.error('CRITICAL RECOVERY FAILURE:', err);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
