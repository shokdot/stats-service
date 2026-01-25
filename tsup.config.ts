import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/server.ts'],
	format: ['esm'],
	target: 'es2022',
	outDir: 'dist',
	external: [
		'prom-client',
		'fastify-metrics',
		'axios',
		'form-data',
		'combined-stream',
		'@prisma/client',
		'@prisma/adapter-better-sqlite3',
		'pino',
		'fastify',
		'@fastify/cookie',
		'@fastify/cors',
		'@fastify/helmet',
		'@fastify/rate-limit',
		'@fastify/swagger',
		'@fastify/swagger-ui',
		'dotenv',
		'jsonwebtoken',
		'zod'
	],
	noExternal: ['@core'],
});
