/**
 * Game-Specific Tournament Logic for Tribex Esports
 * Inspired by BLAZE (FF), BATTLEGROUND (BGMI), and OPERATOR (VAL)
 */

export const GAME_TYPES = {
  FF: "FF",
  BGMI: "BGMI",
  VALORANT: "VALORANT",
};

export const MAPS = {
  FF: ["Bermuda", "Kalahari", "Purgatory", "Nexterra", "Bermuda Remastered", "Alpine"],
  BGMI: ["Erangel", "Miramar", "Sanhok", "Vikendi", "Rondo", "Nusa"],
  VALORANT: ["Bind", "Haven", "Split", "Ascent", "Icebox", "Breeze", "Fracture", "Pearl", "Lotus", "Sunset", "Abyss"],
};

export const POINTS_PRESETS = {
  FF: {
    FFWS: {
      placement: [15, 12, 10, 8, 6, 5, 4, 4, 3, 3, 2, 1],
      kill: 1,
    },
    KILL_HEAVY: {
      placement: [10, 8, 6, 4, 4, 4, 1, 1, 1, 1, 1, 1],
      kill: 2,
    }
  },
  BGMI: {
    BGIS: {
      placement: [10, 6, 5, 4, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0],
      kill: 1,
    },
    PMCO: {
      placement: [10, 6, 5, 4, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      kill: 1.5,
    }
  },
  VALORANT: {
    STANDARD: {
      matchWin: 3,
      mapWin: 1,
      loss: 0
    },
    DIFFERENTIAL: {
      win20: 3,
      win21: 2,
      loss12: 1,
      loss02: 0
    }
  }
};

/**
 * Generates map rotation based on game rules
 */
export function getMapRotation(game: string, matchCount: number): string[] {
  const pool = MAPS[game as keyof typeof MAPS] || [];
  if (game === GAME_TYPES.FF) {
    return pool.slice(0, Math.min(matchCount, 6));
  }
  if (game === GAME_TYPES.BGMI) {
    // BGMI rotation often repeats Erangel
    const rotation = ["Erangel", "Miramar", "Sanhok", "Vikendi", "Rondo", "Erangel"];
    return rotation.slice(0, Math.min(matchCount, 6));
  }
  return [];
}

/**
 * Calculates lobby distribution and advancement logic
 */
export function calculateBracketLobbies(game: string, totalTeams: number, lobbySize?: number, format = "SQUAD") {
  const size = lobbySize || getLobbyCapacity(game, format);
  const lobbies = Math.ceil(totalTeams / (size || 1));
  const g = (game || "").toUpperCase();
  const targetFinalSize = (g.includes("FREE FIRE") || g === "FF") ? 12 : ((g.includes("BGMI") || g.includes("PUBG")) ? 16 : 2);
  
  // Special handling for edge cases
  const safeLobbies = Math.max(1, lobbies);
  const advancingPerLobby = Math.floor(targetFinalSize / safeLobbies) || 1;
  const totalQualifiers = advancingPerLobby * safeLobbies;
  
  return {
    lobbies: safeLobbies,
    teamsPerLobby: size,
    advancingPerLobby,
    targetFinalSize,
    totalQualifiers
  };
}

/**
 * Returns the maximum capacity (teams/players) per lobby based on game and format
 */
export function getLobbyCapacity(game: string, format = "SQUAD"): number {
  const f = (format || "SQUAD").toUpperCase();
  const isSolo = f === "SOLO";
  const isDuo = f === "DUO";

  const g = (game || "").toUpperCase();
  
  if (g.includes("FREE FIRE") || g === "FF") {
    if (isSolo) return 48;
    if (isDuo) return 24;
    return 12; // Squad
  }
  
  if (g.includes("BGMI") || g.includes("PUBG")) {
    if (isSolo) return 100;
    if (isDuo) return 50;
    return 25; // Squad
  }

  if (g.includes("VALORANT") || g === "VAL") {
    return 2; // Always 1v1 teams
  }

  return 12;
}

/**
 * Helper to identify game terminology
 */
export function getGameTerms(game: string, format = "SQUAD") {
  const g = (game || "").toUpperCase();
  const isSolo = format === "SOLO";
  
  if (g.includes("FREE FIRE") || g === "FF") {
      return { winTerm: "Booyah!", unit: isSolo ? "Player" : "Team" };
  }
  if (g.includes("BGMI") || g.includes("PUBG")) {
      return { winTerm: "Winner Winner!", unit: isSolo ? "Player" : "Team" };
  }
  if (g.includes("VALORANT") || g === "VAL") {
      return { winTerm: "Victory", unit: "Team" };
  }
  return { winTerm: "Victory", unit: isSolo ? "Player" : "Team" };
}

/**
 * Calculates points for a single team in a match based on a preset
 */
export function calculateBrPoints(
  game: string, 
  placement: number, 
  kills: number, 
  presetName: string = "FFWS"
) {
  const gamePresets = POINTS_PRESETS[game as keyof typeof POINTS_PRESETS] || POINTS_PRESETS.FF;
  const preset = (gamePresets as any)[presetName] || Object.values(gamePresets)[0];
  
  const placementPoints = preset.placement[placement - 1] || 0;
  const killPoints = kills * (preset.kill || 1);
  
  return {
    placementPoints,
    killPoints,
    totalPoints: placementPoints + killPoints
  };
}

/**
 * Automates Lobby/Slot Assignment for a specific registration
 * Calculates next available sequential position based on current enrollment
 */
export async function assignNextAvailableSlot(prisma: any, tournamentId: string, registrationId: string) {
  try {
    // 1. Fetch Tournament & Registration
    const [tournament, registration] = await Promise.all([
      prisma.tournament.findUnique({ where: { id: tournamentId } }),
      prisma.registration.findFirst({ where: { id: registrationId } })
    ]);

    if (!tournament || !registration) return null;
    if (registration.slot && registration.lobby && !registration.lobby.includes("PENDING")) return { lobby: registration.lobby, slot: registration.slot };

    // 2. Determine Capacity
    const capacity = getLobbyCapacity(tournament.game, tournament.teamFormat || "SQUAD");
    
    // 3. Count currently slotted teams to find next position (Multi-Field Resilience for MongoDB)
    const confirmedCount = await prisma.registration.count({
      where: { 
        tournamentId,
        AND: [
            { lobby: { not: null } },
            { slot: { not: null } }
        ]
      }
    });

    const nextPosition = confirmedCount + 1;
    const lobbyIndex = Math.floor((nextPosition - 1) / capacity);
    const localSlot = ((nextPosition - 1) % capacity) + 1;
    const lobbyName = String.fromCharCode(65 + lobbyIndex); // A, B, C...

    console.log(`[AUTO-SLOT_LOGIC] ${registrationId} -> Pos: ${nextPosition}, Lobby: ${lobbyName}, Slot: ${localSlot}`);

    // 4. Update Registration (Force Verified status upon slotting)
    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        lobby: lobbyName,
        slot: localSlot,
        status: (registration.status === "PENDING_APPROVAL" || registration.status === "PENDING") ? "VERIFIED" : registration.status,
        paymentStatus: registration.paymentStatus === "PENDING" ? "COMPLETED" : registration.paymentStatus
      }
    });

    return { lobby: updated.lobby, slot: updated.slot };
  } catch (error) {
    console.error("Auto-Slot Failure:", error);
    return null;
  }
}

/**
 * Aggregates all matches and calculates the overall standings for a tournament or specific lobby.
 * Used for automated advancement.
 */
export function calculateTournamentStandings(matches: any[], registrations: any[], lobbyName?: string) {
  // 1. Initial Map for aggregate data
  const standingsMap: Record<string, any> = {};

  // 2. Filter if lobby is specified
  const filteredRegs = lobbyName 
    ? registrations.filter(r => r.lobby === lobbyName)
    : registrations;

  // 3. Initialize scores for all relevant participants
  filteredRegs.forEach(reg => {
    standingsMap[reg.id] = {
      registrationId: reg.id,
      name: reg.team?.name || reg.user?.name || "Unknown",
      lobby: reg.lobby,
      slot: reg.slot,
      matchesPlayed: 0,
      totalKills: 0,
      totalPoints: 0,
      booyahs: 0,
      bestPlacement: 99,
      history: []
    };
  });

  // 4. Aggregate results from all matches
  matches.forEach(match => {
    const results = (match.roundResults as any[]) || [];
    results.forEach(res => {
      const entry = standingsMap[res.registrationId];
      if (entry) {
        entry.matchesPlayed += 1;
        entry.totalKills += res.kills || 0;
        entry.totalPoints += res.points || 0;
        if (res.placement === 1) entry.booyahs += 1;
        if (res.placement < entry.bestPlacement && res.placement > 0) entry.bestPlacement = res.placement;
        entry.history.push({ 
           matchId: match.id, 
           stage: match.stage, 
           placement: res.placement, 
           kills: res.kills, 
           points: res.points 
        });
      }
    });
  });

  // 5. Convert to array and sort
  return Object.values(standingsMap).sort((a, b) => {
    // Priority 1: Aggregate Points
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    // Priority 2: Most Wins (Booyahs)
    if (b.booyahs !== a.booyahs) return b.booyahs - a.booyahs;
    // Priority 3: Total Kills
    if (b.totalKills !== a.totalKills) return b.totalKills - a.totalKills;
    // Priority 4: Best Placement
    return a.bestPlacement - b.bestPlacement;
  });
}
