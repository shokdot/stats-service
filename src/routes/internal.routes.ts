import { FastifyInstance } from 'fastify';
import { internal } from '@schemas/index.js';
import { recordMatchHandler, initPlayerStatsHandler, deleteUserHandler } from '@controllers/internal/index.js';

const internalRoutes = async (app: FastifyInstance) => {
	app.post('/matches', internal.recordMatch, recordMatchHandler as any);
	app.post('/init-stats', internal.initPlayerStats, initPlayerStatsHandler as any);
	app.delete('/:userId', deleteUserHandler as any);
}

export default internalRoutes;
