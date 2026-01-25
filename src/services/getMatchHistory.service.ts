import prisma from '../utils/prismaClient.js';
import { AppError } from '@core/index.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getMatchHistory = async (userId: string, page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    if (page < 1) {
        throw new AppError('VALIDATION_FAILED', 400, 'Page must be greater than 0');
    }

    if (limit < 1 || limit > MAX_LIMIT) {
        throw new AppError('VALIDATION_FAILED', 400, `Limit must be between 1 and ${MAX_LIMIT}`);
    }

    const skip = (page - 1) * limit;

    const [matches, total] = await Promise.all([
        prisma.match.findMany({
            where: {
                OR: [
                    { playerAId: userId },
                    { playerBId: userId }
                ]
            },
            orderBy: {
                playedAt: 'desc'
            },
            skip,
            take: limit
        }),
        prisma.match.count({
            where: {
                OR: [
                    { playerAId: userId },
                    { playerBId: userId }
                ]
            }
        })
    ]);

    return {
        matches,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export default getMatchHistory;
