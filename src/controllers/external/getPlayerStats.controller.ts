import { FastifyReply } from 'fastify';
import { sendError, AuthRequest, AppError } from '@core/index.js';
import { getPlayerStats } from '@services/index.js';
import { UserIdDTO } from 'src/dto/user-id.dto.js';

const getPlayerStatsHandler = async (
    request: AuthRequest<{ Params: UserIdDTO }>,
    reply: FastifyReply
) => {
    try {
        const { userId } = request.params;

        const stats = await getPlayerStats(userId);

        return reply.status(200).send({
            status: 'success',
            data: stats
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return sendError(reply, error);
        }
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
};

export default getPlayerStatsHandler;
