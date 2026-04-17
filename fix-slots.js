const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getLobbyCapacity(game, format = "SQUAD") {
  const isSolo = format === "SOLO";
  const isDuo = format === "DUO";
  switch (game) {
    case "FF":
      if (isSolo) return 48;
      if (isDuo) return 24;
      return 12;
    case "BGMI":
      if (isSolo) return 100;
      if (isDuo) return 50;
      return 25;
    default:
      return 12;
  }
}

async function fixMissingSlots() {
  console.log("Checking for confirmed registrations without slots...");
  const missing = await prisma.registration.findMany({
    where: {
      OR: [
        { status: "VERIFIED" },
        { status: "CONFIRMED" }
      ],
      slot: null
    },
    include: { tournament: true }
  });

  console.log(`Found ${missing.length} registrations stuck in 'Pending' slot state.`);

  for (const reg of missing) {
    console.log(`Fixing Registration ${reg.id} for Tournament: ${reg.tournament.title}`);
    
    const capacity = await getLobbyCapacity(reg.tournament.game, reg.tournament.teamFormat || "SQUAD");
    
    const confirmedCount = await prisma.registration.count({
      where: { 
        tournamentId: reg.tournamentId,
        NOT: { slot: null }
      }
    });

    const nextPosition = confirmedCount + 1;
    const lobbyIndex = Math.floor((nextPosition - 1) / capacity);
    const localSlot = ((nextPosition - 1) % capacity) + 1;
    const lobbyName = String.fromCharCode(65 + lobbyIndex);

    await prisma.registration.update({
      where: { id: reg.id },
      data: {
        lobby: lobbyName,
        slot: localSlot
      }
    });
    
    console.log(`Successfully assigned: Lobby ${lobbyName}, Slot ${localSlot}`);
  }
}

fixMissingSlots()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
