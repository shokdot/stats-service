import prisma from '../utils/prismaClient.js';

const initPlayerStats = async (userId: string) => {
	await prisma.playerStats.upsert({
		where: { userId },
		update: {},
		create: {
			userId,
			wins: 0,
			losses: 0,
			draws: 0,
			elo: 0,
			xp: 0,
			level: 1
		}
	});
};

export default initPlayerStats;
