import '@fastify/swagger';
import recordMatchSchema from "./internal/recordMatch.schema.js";
import initPlayerStatsSchema from "./internal/initPlayerStats.schema.js";
import getPlayerStatsSchema from "./external/getPlayerStats.schema.js";
import getMatchHistorySchema from "./external/getMatchHistory.schema.js";
import getLeaderboardSchema from "./external/getLeaderboard.schema.js";
import getPlayerRankSchema from "./external/getPlayerRank.schema.js";
import recordAIMatchSchema from "./external/recordAIMatch.schema.js";

export const internal = {
	recordMatch: recordMatchSchema,
	initPlayerStats: initPlayerStatsSchema
};

export const external = {
	getPlayerStats: getPlayerStatsSchema,
	getMatchHistory: getMatchHistorySchema,
	getLeaderboard: getLeaderboardSchema,
	getPlayerRank: getPlayerRankSchema,
	recordAIMatch: recordAIMatchSchema
};
