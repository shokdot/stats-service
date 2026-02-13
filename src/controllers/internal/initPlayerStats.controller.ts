import { FastifyReply, FastifyRequest } from 'fastify';
import { sendError, AppError } from '@core/index.js';
import { initPlayerStats } from '@services/index.js';

const initPlayerStatsHandler = async (
	request: FastifyRequest<{ Body: { userId: string } }>,
	reply: FastifyReply
) => {
	try {
		const { userId } = request.body;

		await initPlayerStats(userId);

		return reply.status(201).send({
			status: 'success',
			message: 'Player stats initialized successfully'
		});
	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default initPlayerStatsHandler;
