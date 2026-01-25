import 'dotenv/config'
import { buildApp, startServer, API_PREFIX, healthRoutes } from '@core/index.js';
import { PORT, HOST, SERVICE_NAME } from './utils/env.js';
import statsRoutes from 'src/routes/index.js';

const app = buildApp(SERVICE_NAME);
type AppInstance = typeof app;

async function registerRoutes(app: AppInstance) {
	await app.register(healthRoutes, { prefix: `${API_PREFIX}/stats` });
	await app.register(statsRoutes as any, { prefix: `${API_PREFIX}/stats` })
}

startServer(app, registerRoutes, HOST, PORT, SERVICE_NAME);
