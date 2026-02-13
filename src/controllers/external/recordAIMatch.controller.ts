import { FastifyReply } from 'fastify';
import { sendError, AppError, AuthRequest } from '@core/index.js';
import recordAIMatch, { RecordAIMatchDTO } from '../../services/recordAIMatch.service.js';

const recordAIMatchHandler = async (
	request: AuthRequest & { Body: RecordAIMatchDTO },
	reply: FastifyReply
) => {
	try {
		const userId = request.userId;
		if (!userId) {
			return sendError(reply, 401, 'UNAUTHORIZED', 'Authentication required');
		}

		const data = request.body as RecordAIMatchDTO;
		const match = await recordAIMatch(userId, data);

		return reply.status(201).send({
			status: 'success',
			message: 'AI match recorded successfully',
			data: match
		});
	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default recordAIMatchHandler;
