import { FastifyReply } from 'fastify';
import { sendError, AuthRequest, AppError } from '@core/index.js';
import { getPlayerRank } from '@services/index.js';
import { UserIdDTO } from 'src/dto/user-id.dto.js';

const getPlayerRankHandler = async (
    request: AuthRequest<{ Params: UserIdDTO }>,
    reply: FastifyReply
) => {
    try {
        const { userId } = request.params;

        const rank = await getPlayerRank(userId);

        return reply.status(200).send({
            status: 'success',
            data: rank
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return sendError(reply, error);
        }
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
};

export default getPlayerRankHandler;
