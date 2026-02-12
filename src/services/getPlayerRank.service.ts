import prisma from '../utils/prismaClient.js';

const getPlayerRank = async (userId: string) => {
	const playerStats = await prisma.playerStats.findUnique({
		where: { userId }
	});

	if (!playerStats) {
		// If player doesn't exist, calculate rank based on default Elo (0)
		const playersAbove = await prisma.playerStats.count({
			where: {
				elo: {
					gt: 0
				}
			}
		});
		return {
			userId,
			elo: 0,
			rank: playersAbove + 1
		};
	}

	// Count players with higher Elo
	const playersAbove = await prisma.playerStats.count({
		where: {
			elo: {
				gt: playerStats.elo
			}
		}
	});

	return {
		userId: playerStats.userId,
		elo: playerStats.elo,
		rank: playersAbove + 1
	};
};

export default getPlayerRank;
