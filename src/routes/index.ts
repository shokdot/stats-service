import { FastifyInstance } from 'fastify';
import externalRoutes from './external.routes.js';
import internalRoutes from './internal.routes.js'

const statsRoutes = async (app: FastifyInstance): Promise<void> => {
	app.register(externalRoutes);
	app.register(internalRoutes, { prefix: '/internal' });
}

export default statsRoutes;
