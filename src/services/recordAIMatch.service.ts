import prisma from '../utils/prismaClient.js';
import { AppError } from '@core/index.js';

const VALID_AI_MODES = ['ai_easy', 'ai_medium', 'ai_hard'] as const;
type AIGameMode = typeof VALID_AI_MODES[number];

export interface RecordAIMatchDTO {
	scoreA: number;
	scoreB: number;
	duration: number;
	gameMode: AIGameMode;
}

/**
 * Record an AI match result.
 * - No ELO change (AI games are practice only)
 * - Awards XP based on game duration
 * - Tracks wins/losses (winnerId = userId if player won, null if AI won)
 * - Does NOT create stats for the AI "player"
 */
const recordAIMatch = async (userId: string, data: RecordAIMatchDTO) => {
	if (!VALID_AI_MODES.includes(data.gameMode)) {
		throw new AppError('VALIDATION_FAILED', 400, 'Invalid AI game mode');
	}

	if (data.scoreA < 0 || data.scoreB < 0) {
		throw new AppError('VALIDATION_FAILED', 400, 'Scores must be non-negative');
	}

	if (data.duration <= 0) {
		throw new AppError('VALIDATION_FAILED', 400, 'Duration must be positive');
	}

	const playerWon = data.scoreA > data.scoreB;
	const winnerId = playerWon ? userId : null;

	return await prisma.$transaction(async (tx) => {
		// Create match record
		const match = await tx.match.create({
			data: {
				playerAId: userId,
				playerBId: data.gameMode, // sentinel: "ai_easy" / "ai_medium" / "ai_hard"
				scoreA: data.scoreA,
				scoreB: data.scoreB,
				winnerId,
				duration: data.duration,
				gameMode: data.gameMode
			}
		});

		// Upsert player stats: XP + win/loss tracking, NO ELO change
		await tx.playerStats.upsert({
			where: { userId },
			create: {
				userId,
				wins: playerWon ? 1 : 0,
				losses: playerWon ? 0 : 1,
				draws: 0,
				elo: 0,
				xp: data.duration,
				level: 1
			},
			update: {
				wins: playerWon ? { increment: 1 } : undefined,
				losses: playerWon ? undefined : { increment: 1 },
				xp: { increment: data.duration }
			}
		});

		return match;
	});
};

export default recordAIMatch;
