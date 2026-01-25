import '@fastify/swagger';
import recordMatchSchema from "./internal/recordMatch.schema.js";
import getPlayerStatsSchema from "./external/getPlayerStats.schema.js";
import getMatchHistorySchema from "./external/getMatchHistory.schema.js";
import getLeaderboardSchema from "./external/getLeaderboard.schema.js";
import getPlayerRankSchema from "./external/getPlayerRank.schema.js";

export const internal = {
	recordMatch: recordMatchSchema
};

export const external = {
	getPlayerStats: getPlayerStatsSchema,
	getMatchHistory: getMatchHistorySchema,
	getLeaderboard: getLeaderboardSchema,
	getPlayerRank: getPlayerRankSchema
};
