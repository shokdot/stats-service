import { FastifyInstance } from 'fastify';
import { internal } from '@schemas/index.js';
import { recordMatchHandler } from '@controllers/internal/index.js';

const internalRoutes = async (app: FastifyInstance) => {
	app.post('/matches', internal.recordMatch, recordMatchHandler as any);
}

export default internalRoutes;
