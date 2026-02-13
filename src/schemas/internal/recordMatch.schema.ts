import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, serviceAuth } from "@core/index.js";

const recordMatchSchema: RouteShorthandOptions = {
	preHandler: [serviceAuth as any],
	schema: {
		description: "Record a finished game match (internal service call)",
		tags: ["Internal"],
		security: [{ serviceToken: [] }],
		body: {
			type: 'object',
			required: ['playerAId', 'playerBId', 'scoreA', 'scoreB', 'duration'],
			additionalProperties: false,
			properties: {
				playerAId: {
					type: 'string',
					format: 'uuid',
					description: 'User ID of player A'
				},
				playerBId: {
					type: 'string',
					format: 'uuid',
					description: 'User ID of player B'
				},
				scoreA: {
					type: 'number',
					minimum: 0,
					description: 'Final score of player A'
				},
				scoreB: {
					type: 'number',
					minimum: 0,
					description: 'Final score of player B'
				},
				winnerId: {
					type: ['string', 'null'],
					format: 'uuid',
					description: 'User ID of the winner, or null for draw'
				},
				duration: {
					type: 'number',
					minimum: 0,
					description: 'Game duration in seconds'
				},
				gameMode: {
					type: 'string',
					enum: ['online', 'local', 'ai_easy', 'ai_medium', 'ai_hard'],
					description: 'Game mode (defaults to online)'
				}
			}
		},
		response: {
			201: {
				type: 'object',
				required: ['status', 'message', 'data'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					message: { type: 'string' },
					data: {
						type: 'object',
						required: ['id', 'playerAId', 'playerBId', 'scoreA', 'scoreB', 'duration', 'gameMode', 'playedAt'],
						additionalProperties: false,
						properties: {
							id: { type: 'string', format: 'uuid' },
							playerAId: { type: 'string', format: 'uuid' },
							playerBId: { type: 'string', format: 'uuid' },
							scoreA: { type: 'number' },
							scoreB: { type: 'number' },
							winnerId: { type: ['string', 'null'], format: 'uuid' },
							duration: { type: 'number' },
							gameMode: { type: 'string' },
							playedAt: { type: 'string', format: 'date-time' }
						}
					}
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			403: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default recordMatchSchema;
