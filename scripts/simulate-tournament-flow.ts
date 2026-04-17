import { PrismaClient } from "@prisma/client";
import { 
    assignNextAvailableSlot, 
    calculateTournamentStandings 
} from "../src/lib/tournament-logic";

/**
 * Universal Tournament Simulator
 * USAGE: 
 * SIM_FORMAT=SQUAD SIM_COUNT=120 SIM_ADVANCE=1 npx tsx scripts/simulate-tournament-flow.ts
 */

const prisma = new PrismaClient();

const FORMAT = (process.env.SIM_FORMAT || "SQUAD") as "SOLO" | "DUO" | "SQUAD";
const COUNT = parseInt(process.env.SIM_COUNT || "48");
const ADVANCE_PER_LOBBY = parseInt(process.env.SIM_ADVANCE || "3");

async function runSimulation() {
    console.log(`🚀 STARTING UNIVERSAL SIMULATION: ${COUNT} participants in ${FORMAT} format...`);
    console.log(`🏆 Promotion: Top ${ADVANCE_PER_LOBBY} per lobby will advance.`);
    console.log("-----------------------------------------------------------");

    const TEST_PREFIX = `SIM_${FORMAT}_${COUNT}_${Math.floor(Math.random() * 1000)}_`;

    try {
        // 1. SETUP: Create Organizer
        console.log("📝 STEP 1: Setting up Test Organizer...");
        const organizer = await prisma.user.create({
            data: {
                name: `${TEST_PREFIX}Organizer`,
                email: `${TEST_PREFIX.toLowerCase()}organizer@tribex.test`,
                role: "ORGANIZER"
            }
        });

        // 2. TOURNAMENT CREATION
        console.log(`\n📝 STEP 2: Creating ${FORMAT} Tournament (${COUNT} capacity)...`);
        const tournament = await prisma.tournament.create({
            data: {
                title: `${TEST_PREFIX} Championship`,
                game: "Free Fire",
                mode: "Bermuda",
                teamFormat: FORMAT,
                type: "TOURNAMENT",
                organizerId: organizer.id,
                maxPlayers: COUNT, 
                startTime: new Date(Date.now() + 86400000),
                status: "REGISTRATION",
                entryType: "FREE",
                prizePool: "₹25,000"
            }
        });
        console.log(`✅ Tournament created ID: ${tournament.id}`);

        // 3. SEEDING PARTICIPANTS
        console.log(`\n📝 STEP 3: Seeding ${COUNT} Participants...`);
        const allRegistrations = [];
        for (let i = 1; i <= COUNT; i++) {
            const captain = await prisma.user.create({
                data: {
                    name: `${TEST_PREFIX}User_${i}`,
                    email: `${TEST_PREFIX.toLowerCase()}user_${i}@tribex.test`,
                    role: "PLAYER"
                }
            });

            let teamId = undefined;
            if (FORMAT !== "SOLO") {
                const team = await prisma.team.create({
                    data: {
                        name: `${TEST_PREFIX}Team_${i}`,
                        captainId: captain.id,
                        memberIds: [captain.id]
                    }
                });
                teamId = team.id;
            }

            const reg = await prisma.registration.create({
                data: {
                    tournamentId: tournament.id,
                    userId: captain.id,
                    teamId: teamId,
                    status: "PENDING_APPROVAL",
                    registryKey: `${TEST_PREFIX}REG_${i}`,
                    rosterData: FORMAT === "SOLO" ? [] : [
                        { nickname: `${TEST_PREFIX}P_${i}_1`, uid: `UID_${i}_1` },
                        { nickname: `${TEST_PREFIX}P_${i}_2`, uid: `UID_${i}_2` },
                    ]
                }
            });
            allRegistrations.push(reg);
            if (i % 24 === 0) process.stdout.write(`${i}..`);
        }
        console.log(`\n✅ ${COUNT} Participants registered.`);

        // 4. AUTO-SLOTTING
        console.log("\n📝 STEP 4: Executing Auto-Slotting...");
        for (const reg of allRegistrations) {
            await assignNextAvailableSlot(prisma, tournament.id, reg.id);
        }
        console.log(`✅ All participants slotted into lobbies.`);

        // 5. QUALIFIERS
        console.log("\n📝 STEP 5: Simulating Qualifier Matches...");
        const registrations = await prisma.registration.findMany({ 
            where: { tournamentId: tournament.id, NOT: { lobby: null } } 
        });
        const lobbies = Array.from(new Set(registrations.map(r => r.lobby)));
        console.log(`📡 Detected Lobbies: ${lobbies.sort().join(", ")}`);

        for (const lobby of lobbies) {
            if (!lobby) continue;
            const match = await prisma.match.create({
                data: {
                    tournamentId: tournament.id,
                    stage: `LOBBY ${lobby}`,
                    status: "SUBMITTED",
                    map: "Bermuda"
                }
            });

            const lobbyRegs = registrations.filter(r => r.lobby === lobby);
            const roundResults = lobbyRegs.sort(() => Math.random() - 0.5).map((reg, index) => {
                const placement = index + 1;
                const kills = Math.floor(Math.random() * 10);
                const points = ([15, 12, 10, 8, 6, 5, 4, 4, 3, 3, 2, 1][placement - 1] || 0) + kills;
                return { registrationId: reg.id, placement, kills, points };
            });

            await prisma.match.update({
                where: { id: match.id },
                data: { roundResults: roundResults, status: "SUBMITTED" }
            });
        }
        console.log(`✅ Qualifier round complete.`);

        // 6. ADVANCEMENT
        console.log("\n📝 STEP 6: Executing Advancement...");
        const promotedIds: string[] = [];
        const matches = await prisma.match.findMany({ where: { tournamentId: tournament.id } });
        const regsWithData = await prisma.registration.findMany({ 
            where: { tournamentId: tournament.id },
            include: { team: true, user: true }
        });

        for (const lobby of lobbies) {
            if (!lobby) continue;
            const standings = calculateTournamentStandings(matches, regsWithData, lobby);
            const top = standings.slice(0, ADVANCE_PER_LOBBY);
            promotedIds.push(...top.map(t => t.registrationId));
            console.log(`⭐ From Lobby ${lobby} Promoted: ${top.map(t => t.name).join(", ")}`);
        }

        // Batch update to FINAL and reset slots
        await prisma.registration.updateMany({
            where: { id: { in: promotedIds } },
            data: { lobby: "FINAL", slot: null }
        });

        // Re-slot for FINAL hub
        for (let j = 0; j < promotedIds.length; j++) {
            await prisma.registration.update({
                where: { id: promotedIds[j] },
                data: { slot: j + 1 }
            });
        }
        console.log(`✅ ${promotedIds.length} Finalists re-slotted into the Championship Hub.`);

        // 7. FINAL MATCH HUB
        console.log("\n📝 STEP 7: Launching Grand Final Match Hub...");
        const finalMatch = await prisma.match.create({
            data: {
                tournamentId: tournament.id,
                stage: "GRAND FINAL",
                status: "LIVE",
                map: "Purgatory"
            }
        });

        const finalRoom = await prisma.room.create({
            data: {
                matchId: finalMatch.id,
                roomId: `ROOM_${Math.floor(Math.random() * 10000)}`,
                roomPassword: `PASS_${Math.floor(Math.random() * 9999)}`,
                revealTime: new Date()
            }
        });
        console.log(`🏆 Hub Ready! ID: ${finalRoom.roomId} | PASS: ${finalRoom.roomPassword}`);


        console.log("-----------------------------------------------------------");
        console.log(`🏆 SIMULATION COMPLETE: ${TEST_PREFIX}`);
        console.log(`📍 Tournament ID: ${tournament.id}`);
        console.log("-----------------------------------------------------------");

    } catch (error) {
        console.error("❌ UNIVERSAL SIMULATION FAILED:", error);
    } finally {
        await prisma.$disconnect();
    }
}

runSimulation();
