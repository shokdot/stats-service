import prisma from '../utils/prismaClient.js';
import { RecordMatchDTO } from '../dto/record-match.dto.js';
import { calculateElo } from './elo.service.js';
import { AppError } from '@core/index.js';

const recordMatch = async (data: RecordMatchDTO) => {
	// Validate players are different
	if (data.playerAId === data.playerBId) {
		throw new AppError('VALIDATION_FAILED', 400, 'Players must be different');
	}

	// Validate winner is one of the players or null
	if (data.winnerId && data.winnerId !== data.playerAId && data.winnerId !== data.playerBId) {
		throw new AppError('VALIDATION_FAILED', 400, 'Winner must be one of the players');
	}

	return await prisma.$transaction(async (tx) => {
		// Get or create player stats
		const statsA = await tx.playerStats.upsert({
			where: { userId: data.playerAId },
			create: {
				userId: data.playerAId,
				wins: 0,
				losses: 0,
				draws: 0,
				elo: 1000,
				xp: 0,
				level: 1
			},
			update: {}
		});

		const statsB = await tx.playerStats.upsert({
			where: { userId: data.playerBId },
			create: {
				userId: data.playerBId,
				wins: 0,
				losses: 0,
				draws: 0,
				elo: 1000,
				xp: 0,
				level: 1
			},
			update: {}
		});

		// Calculate Elo changes
		const eloResult = calculateElo(
			statsA.elo,
			statsB.elo,
			data.winnerId,
			data.playerAId,
			data.playerBId
		);

		// Create match record
		const match = await tx.match.create({
			data: {
				playerAId: data.playerAId,
				playerBId: data.playerBId,
				scoreA: data.scoreA,
				scoreB: data.scoreB,
				winnerId: data.winnerId,
				duration: data.duration,
				gameMode: data.gameMode ?? 'online'
			}
		});

		// Update player A stats
		const isWinnerA = data.winnerId === data.playerAId;
		const isDraw = data.winnerId === null;
		const isLoserA = data.winnerId === data.playerBId;

		await tx.playerStats.update({
			where: { userId: data.playerAId },
			data: {
				elo: eloResult.newEloA,
				wins: isWinnerA ? { increment: 1 } : undefined,
				losses: isLoserA ? { increment: 1 } : undefined,
				draws: isDraw ? { increment: 1 } : undefined,
				xp: { increment: data.duration } // XP based on game duration
			}
		});

		// Update player B stats
		const isWinnerB = data.winnerId === data.playerBId;
		const isLoserB = data.winnerId === data.playerAId;

		await tx.playerStats.update({
			where: { userId: data.playerBId },
			data: {
				elo: eloResult.newEloB,
				wins: isWinnerB ? { increment: 1 } : undefined,
				losses: isLoserB ? { increment: 1 } : undefined,
				draws: isDraw ? { increment: 1 } : undefined,
				xp: { increment: data.duration } // XP based on game duration
			}
		});

		return match;
	});
};

export default recordMatch;
