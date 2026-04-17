import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assignNextAvailableSlot } from "@/lib/tournament-logic";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    
    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { action, count = 10, tournamentId, simulateSlotting = false } = await req.json();
        const TEST_PREFIX = `STRESS_TEST_${Math.floor(Math.random() * 9000) + 1000}_`;

        if (action === "GENERATE_USERS") {
            const BATCH_SIZE = 2500;
            let totalCreated = 0;
            
            for (let i = 0; i < count; i += BATCH_SIZE) {
                const currentBatchSize = Math.min(BATCH_SIZE, count - i);
                const users = [];
                for (let j = 0; j < currentBatchSize; j++) {
                    const idx = i + j;
                    users.push({
                        name: `${TEST_PREFIX}U_${idx}`,
                        email: `${TEST_PREFIX.toLowerCase()}u_${idx}@tribex.test`,
                        role: "PLAYER"
                    });
                }
                await (prisma.user as any).createMany({ data: users });
                totalCreated += currentBatchSize;
            }
            
            return NextResponse.json({ success: true, count: totalCreated, prefix: TEST_PREFIX });
        }

        if (action === "REGISTER_TOURNAMENT") {
            if (!tournamentId) return NextResponse.json({ error: "Tournament ID required" }, { status: 400 });
            const tournament = await (prisma.tournament as any).findUnique({ where: { id: tournamentId } });
            if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });

            // 1. CAPACITY PROTECTION
            const currentActiveCount = await prisma.registration.count({
                where: {
                    tournamentId,
                    status: { in: ["VERIFIED", "PENDING_APPROVAL", "CONFIRMED"] }
                }
            });

            const remainingSlots = Math.max(0, tournament.maxPlayers - currentActiveCount);
            if (remainingSlots <= 0) {
                return NextResponse.json({ error: "Tournament is already full (Active: " + currentActiveCount + " / Max: " + tournament.maxPlayers + ")" }, { status: 400 });
            }

            // Adjust count to not exceed remaining slots
            const finalCount = Math.min(count, remainingSlots);

            // 2. Fetch available stress users
            const stressUsers = await prisma.user.findMany({
                where: { name: { startsWith: "STRESS_TEST_" } },
                take: finalCount,
                select: { id: true, name: true }
            });

            if (stressUsers.length < finalCount) {
                return NextResponse.json({ 
                    error: `Not enough stress users. Have: ${stressUsers.length}, Need: ${finalCount}. Generate users first.` 
                }, { status: 400 });
            }

            const actualCount = stressUsers.length;
            let teamIds: (string | null)[] = Array(actualCount).fill(null);

            // 3. Handle Team Creation (Bulk)
            if (tournament.teamFormat !== "SOLO") {
                const teamsData = stressUsers.map((user: any, i: number) => ({
                    name: `${TEST_PREFIX}T_${i}`,
                    captainId: user.id,
                    memberIds: [user.id]
                }));

                await (prisma.team as any).createMany({ data: teamsData });
                
                const createdTeams = await (prisma.team as any).findMany({
                    where: { name: { startsWith: TEST_PREFIX } },
                    select: { id: true, captainId: true }
                });
                
                const captainToTeamMap = new Map(createdTeams.map((t: any) => [t.captainId, t.id]));
                teamIds = stressUsers.map((u: any) => captainToTeamMap.get(u.id) || null);
            }

            // 4. Batch Register with Realistic Data
            const BATCH_SIZE = 1000;
            let registered = 0;
            const autoVerify = tournament.autoVerify ?? true;

            for (let i = 0; i < actualCount; i += BATCH_SIZE) {
                const currentBatchSize = Math.min(BATCH_SIZE, actualCount - i);
                const registrationsData = [];
                
                for (let j = 0; j < currentBatchSize; j++) {
                    const idx = i + j;
                    const user = stressUsers[idx];
                    const teamId = teamIds[idx];

                    // Realistic UID Generation (8-10 digits)
                    const generateUid = () => Math.floor(Math.random() * 900000000 + 100000000).toString();

                    registrationsData.push({
                        tournamentId: tournament.id,
                        userId: tournament.teamFormat === "SOLO" ? user.id : null,
                        teamId: teamId,
                        captainId: user.id,
                        status: autoVerify ? "VERIFIED" : "PENDING_APPROVAL",
                        registryKey: `${TEST_PREFIX}K_${idx}`,
                        rosterData: tournament.teamFormat === "SOLO" ? [] : [
                            { nickname: `${user.name}_P1`, uid: generateUid() },
                            { nickname: `${user.name}_P2`, uid: generateUid() },
                            { nickname: `${user.name}_P3`, uid: generateUid() },
                            { nickname: `${user.name}_P4`, uid: generateUid() },
                        ],
                        // Simulated Payment for Paid Tournaments
                        paymentStatus: tournament.entryType === "PAID" ? "COMPLETED" : "PENDING",
                        gatewayUsed: tournament.entryType === "PAID" ? "VIRTUAL_STRESS" : "NONE",
                        transactionId: tournament.entryType === "PAID" ? `STR_PAY_${Math.random().toString(36).substring(7)}` : null
                    });
                }

                await (prisma.registration as any).createMany({ data: registrationsData });
                registered += currentBatchSize;
            }

            // 5. Handle Slotting (Optional & Limited)
            if (simulateSlotting && autoVerify) {
                const newRegs = await prisma.registration.findMany({
                    where: { registryKey: { startsWith: TEST_PREFIX } },
                    select: { id: true }
                });
                
                const slotLimit = Math.min(newRegs.length, 200);
                for (let k = 0; k < slotLimit; k++) {
                    try {
                        await assignNextAvailableSlot(prisma, tournament.id, newRegs[k].id);
                    } catch (e) {}
                }
            }

            return NextResponse.json({ 
                success: true, 
                count: registered, 
                slotted: (simulateSlotting && autoVerify) ? Math.min(registered, 200) : 0,
                capacityNote: `Enforced Limit: Current=${currentActiveCount}, Added=${registered}, Max=${tournament.maxPlayers}`
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Stress API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    
    if (!session || (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const prefixes = ["SIM_", "STRESS_TEST_", "sim_", "stress_test_"];
        const results = { registrations: 0, matches: 0, teams: 0, users: 0, tournaments: 0 };

        for (const prefix of prefixes) {
            const deletedRegs = await prisma.registration.deleteMany({
                where: { 
                   OR: [
                       { registryKey: { startsWith: prefix } },
                       { gatewayUsed: "VIRTUAL_STRESS" }
                   ]
                }
            });
            results.registrations += deletedRegs.count;

            const deletedTeams = await prisma.team.deleteMany({
                where: { name: { startsWith: prefix } }
            });
            results.teams += deletedTeams.count;

            const deletedMatches = await (prisma as any).match.deleteMany({
                where: { stage: { startsWith: prefix } }
            });
            results.matches += deletedMatches.count;

            const stressUsers = await prisma.user.findMany({
                where: { name: { startsWith: prefix } },
                select: { id: true }
            });
            const userIds = stressUsers.map((u: any) => u.id);

            if (userIds.length > 0) {
                await (prisma as any).account.deleteMany({ where: { userId: { in: userIds } } });
                await (prisma as any).session.deleteMany({ where: { userId: { in: userIds } } });
                const deletedUsers = await prisma.user.deleteMany({ where: { id: { in: userIds } } });
                results.users += deletedUsers.count;
            }

            const deletedTournaments = await (prisma as any).tournament.deleteMany({
                where: { title: { startsWith: prefix } }
            });
            results.tournaments += deletedTournaments.count;
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Cleanup Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
