import prisma from '../utils/prismaClient.js';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

const getLeaderboard = async (limit: number = DEFAULT_LIMIT, offset: number = 0) => {
    const actualLimit = Math.min(limit, MAX_LIMIT);
    const actualOffset = Math.max(0, offset);

    const players = await prisma.playerStats.findMany({
        orderBy: {
            elo: 'desc'
        },
        take: actualLimit,
        skip: actualOffset
    });

    return players.map((player, index) => ({
        ...player,
        rank: actualOffset + index + 1
    }));
};

export default getLeaderboard;
