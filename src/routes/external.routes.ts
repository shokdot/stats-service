import { FastifyInstance } from 'fastify';
import { external } from '@schemas/index.js';
import {
	getPlayerStatsHandler,
	getMatchHistoryHandler,
	getLeaderboardHandler,
	getPlayerRankHandler
} from '@controllers/external/index.js';

const externalRoutes = async (app: FastifyInstance) => {
	// More specific routes first
	app.get('/leaderboard/rank/:userId', external.getPlayerRank, getPlayerRankHandler as any);
	app.get('/leaderboard', external.getLeaderboard, getLeaderboardHandler as any);
	app.get('/:userId/history', external.getMatchHistory, getMatchHistoryHandler as any);
	app.get('/:userId', external.getPlayerStats, getPlayerStatsHandler as any);
}

export default externalRoutes;
