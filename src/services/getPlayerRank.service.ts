import prisma from '../utils/prismaClient.js';

const getPlayerRank = async (userId: string) => {
    const playerStats = await prisma.playerStats.findUnique({
        where: { userId }
    });

    if (!playerStats) {
        // If player doesn't exist, calculate rank based on default Elo (1000)
        const playersAbove = await prisma.playerStats.count({
            where: {
                elo: {
                    gt: 1000
                }
            }
        });
        return {
            userId,
            elo: 1000,
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
