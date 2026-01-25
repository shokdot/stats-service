import { FastifyReply } from 'fastify';
import { sendError, AuthRequest, AppError } from '@core/index.js';
import { getMatchHistory } from '@services/index.js';
import { UserIdDTO } from 'src/dto/user-id.dto.js';
import { GetHistoryQueryDTO } from 'src/dto/get-history.dto.js';

const getMatchHistoryHandler = async (
    request: AuthRequest<{ Params: UserIdDTO; Querystring: GetHistoryQueryDTO }>,
    reply: FastifyReply
) => {
    try {
        const { userId } = request.params;
        const { page, limit } = request.query;

        const result = await getMatchHistory(
            userId,
            page ? Number(page) : undefined,
            limit ? Number(limit) : undefined
        );

        return reply.status(200).send({
            status: 'success',
            data: result.matches,
            pagination: result.pagination
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return sendError(reply, error);
        }
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
};

export default getMatchHistoryHandler;
