import prisma from '../utils/prismaClient.js';

const getPlayerStats = async (userId: string) => {
	const stats = await prisma.playerStats.findUnique({
		where: { userId }
	});

	if (!stats) {
		// Return default stats if player doesn't exist yet
		return {
			userId,
			wins: 0,
			losses: 0,
			draws: 0,
			elo: 0,
			xp: 0,
			level: 1,
			updatedAt: new Date()
		};
	}

	return stats;
};

export default getPlayerStats;
