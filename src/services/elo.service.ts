/**
 * Elo Rating System
 * 
 * Formula:
 * - Expected Score: E = 1 / (1 + 10^((oppElo - myElo) / 400))
 * - Rating Update: NewElo = OldElo + K * (S - E)
 * - K factor: 32 (standard for chess, can be adjusted)
 */

const K_FACTOR = 32;

export interface EloResult {
    newEloA: number;
    newEloB: number;
    eloChangeA: number;
    eloChangeB: number;
}

export const calculateElo = (
    eloA: number,
    eloB: number,
    winnerId: string | null,
    playerAId: string,
    playerBId: string
): EloResult => {
    // Calculate expected scores
    const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
    const expectedB = 1 / (1 + Math.pow(10, (eloA - eloB) / 400));

    // Determine actual scores
    let actualA: number;
    let actualB: number;

    if (winnerId === null) {
        // Draw
        actualA = 0.5;
        actualB = 0.5;
    } else if (winnerId === playerAId) {
        // Player A wins
        actualA = 1;
        actualB = 0;
    } else {
        // Player B wins
        actualA = 0;
        actualB = 1;
    }

    // Calculate new Elo ratings
    const eloChangeA = Math.round(K_FACTOR * (actualA - expectedA));
    const eloChangeB = Math.round(K_FACTOR * (actualB - expectedB));

    const newEloA = Math.max(0, eloA + eloChangeA);
    const newEloB = Math.max(0, eloB + eloChangeB);

    return {
        newEloA,
        newEloB,
        eloChangeA,
        eloChangeB
    };
};
