import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from "@core/index.js";

const getPlayerStatsSchema: RouteShorthandOptions = {
	schema: {
		description: "Get player statistics",
		tags: ["Stats"],
		security: [{ bearerAuth: [] }],
		params: {
			type: 'object',
			required: ['userId'],
			additionalProperties: false,
			properties: {
				userId: {
					type: 'string',
					format: 'uuid',
					description: 'User ID'
				}
			}
		},
		response: {
			200: {
				type: 'object',
				required: ['status', 'data'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					data: {
						type: 'object',
						required: ['userId', 'wins', 'losses', 'draws', 'elo', 'xp', 'level', 'updatedAt'],
						additionalProperties: false,
						properties: {
							userId: { type: 'string', format: 'uuid' },
							wins: { type: 'number' },
							losses: { type: 'number' },
							draws: { type: 'number' },
							elo: { type: 'number' },
							xp: { type: 'number' },
							level: { type: 'number' },
							updatedAt: { type: 'string', format: 'date-time' }
						}
					}
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default getPlayerStatsSchema;
