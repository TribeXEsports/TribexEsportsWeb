/**
 * NEXUS — Lobby Assignment Logic
 * Handles balanced distribution of teams across lobbies
 */

export interface LobbyDistribution {
  totalLobbies: number;
  baseSize: number;
  overflowCount: number;
  assignments: {
    lobbyName: string;
    teamCount: number;
  }[];
}

/**
 * Calculates how teams should be distributed to ensure balance
 */
export function calculateLobbyDistribution(totalTeams: number, lobbySize: number): LobbyDistribution {
  if (totalTeams <= 0) return { totalLobbies: 0, baseSize: 0, overflowCount: 0, assignments: [] };
  
  const totalLobbies = Math.ceil(totalTeams / lobbySize);
  const baseSize = Math.floor(totalTeams / totalLobbies);
  const overflowCount = totalTeams % totalLobbies;
  
  const assignments = [];
  for (let i = 0; i < totalLobbies; i++) {
    const isOverflow = i < overflowCount;
    assignments.push({
      lobbyName: String.fromCharCode(65 + i), // A, B, C...
      teamCount: isOverflow ? baseSize + 1 : baseSize
    });
  }
  
  return {
    totalLobbies,
    baseSize,
    overflowCount,
    assignments
  };
}

/**
 * Shuffles an array randomly (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
