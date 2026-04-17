import { PrismaClient } from '@prisma/client';
import { assignNextAvailableSlot } from './src/lib/tournament-logic';

const prisma = new PrismaClient();

async function debug() {
  const regId = '69d3760392ec7395d31ca7c1';
  console.log('--- ATOMIC DEBUG INITIATED ---');
  
  try {
    const reg = await prisma.registration.findUnique({
      where: { id: regId },
      include: { tournament: true }
    });

    if (!reg) {
      console.log('REG_NOT_FOUND:', regId);
      // Let's find any registration for this tournament
      const anyReg = await prisma.registration.findFirst({
        where: { tournamentId: '69d29299b23d340f6b4bf181' }
      });
      console.log('FOUND_OTHER_RECORD:', anyReg?.id);
      return;
    }

    console.log('RECORD_DATA:', {
      id: reg.id,
      status: reg.status,
      paymentStatus: reg.paymentStatus,
      lobby: reg.lobby,
      slot: reg.slot,
      registryKey: reg.registryKey
    });

    console.log('TRIGGERING_ASSIGNMENT...');
    const result = await assignNextAvailableSlot(prisma, reg.tournamentId, reg.id);
    console.log('ASSIGNMENT_RESULT:', result);

    const verify = await prisma.registration.findUnique({ where: { id: regId } });
    console.log('FINAL_VERIFIED_DATA:', {
      id: verify?.id,
      lobby: verify?.lobby,
      slot: verify?.slot
    });

  } catch (err) {
    console.error('DEBUG_ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
