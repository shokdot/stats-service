import prisma from "../utils/prismaClient.js";

const deleteUserStats = async (userId: string) => {
    // Delete all matches where user was a participant
    await prisma.match.deleteMany({
        where: {
            OR: [
                { playerAId: userId },
                { playerBId: userId },
            ],
        },
    });

    // Delete user stats
    const stats = await prisma.playerStats.findUnique({
        where: { userId },
    });

    if (stats) {
        await prisma.playerStats.delete({
            where: { userId },
        });
    }
};

export default deleteUserStats;
