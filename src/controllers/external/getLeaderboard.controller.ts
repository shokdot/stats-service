import { FastifyReply } from 'fastify';
import { sendError, AuthRequest, AppError } from '@core/index.js';
import { getLeaderboard } from '@services/index.js';
import { GetLeaderboardQueryDTO } from 'src/dto/get-leaderboard.dto.js';

const getLeaderboardHandler = async (
    request: AuthRequest<{ Querystring: GetLeaderboardQueryDTO }>,
    reply: FastifyReply
) => {
    try {
        const { limit, offset } = request.query;

        const leaderboard = await getLeaderboard(
            limit ? Number(limit) : undefined,
            offset ? Number(offset) : undefined
        );

        return reply.status(200).send({
            status: 'success',
            data: leaderboard,
            count: leaderboard.length
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return sendError(reply, error);
        }
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
};

export default getLeaderboardHandler;
