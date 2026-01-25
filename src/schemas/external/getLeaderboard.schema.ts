import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from "@core/index.js";

const getLeaderboardSchema: RouteShorthandOptions = {
	schema: {
		description: "Get leaderboard",
		tags: ["Stats"],
		security: [{ bearerAuth: [] }],
		querystring: {
			type: 'object',
			required: [],
			additionalProperties: false,
			properties: {
				limit: {
					type: 'number',
					minimum: 1,
					maximum: 1000,
					description: 'Number of players to return (default: 100, max: 1000)'
				},
				offset: {
					type: 'number',
					minimum: 0,
					description: 'Offset for pagination (default: 0)'
				}
			}
		},
		response: {
			200: {
				type: 'object',
				required: ['status', 'data', 'count'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					data: {
						type: 'array',
						items: {
							type: 'object',
							required: ['userId', 'wins', 'losses', 'draws', 'elo', 'xp', 'level', 'rank'],
							additionalProperties: false,
							properties: {
								userId: { type: 'string', format: 'uuid' },
								wins: { type: 'number' },
								losses: { type: 'number' },
								draws: { type: 'number' },
								elo: { type: 'number' },
								xp: { type: 'number' },
								level: { type: 'number' },
								rank: { type: 'number' }
							}
						}
					},
					count: { type: 'number', description: 'Number of players returned' }
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default getLeaderboardSchema;
