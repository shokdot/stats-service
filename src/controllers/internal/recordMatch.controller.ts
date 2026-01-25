import { FastifyReply, FastifyRequest } from 'fastify';
import { sendError, AppError } from '@core/index.js';
import { recordMatch } from '@services/index.js';
import { RecordMatchDTO } from 'src/dto/record-match.dto.js';

const recordMatchHandler = async (
    request: FastifyRequest<{ Body: RecordMatchDTO }>,
    reply: FastifyReply
) => {
    try {
        const data = request.body;

        const match = await recordMatch(data);

        return reply.status(201).send({
            status: 'success',
            message: 'Match recorded successfully',
            data: match
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return sendError(reply, error);
        }
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
};

export default recordMatchHandler;
