import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, authenticate } from "@core/index.js";

const recordAIMatchSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema: {
		description: "Record an AI match result (no ELO change, XP only)",
		tags: ["Stats"],
		security: [{ bearerAuth: [] }],
		body: {
			type: 'object',
			required: ['scoreA', 'scoreB', 'duration', 'gameMode'],
			additionalProperties: false,
			properties: {
				scoreA: {
					type: 'number',
					minimum: 0,
					description: 'Player score'
				},
				scoreB: {
					type: 'number',
					minimum: 0,
					description: 'AI score'
				},
				duration: {
					type: 'number',
					minimum: 1,
					description: 'Game duration in seconds'
				},
				gameMode: {
					type: 'string',
					enum: ['ai_easy', 'ai_medium', 'ai_hard'],
					description: 'AI difficulty mode'
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
							id: { type: 'string' },
							playerAId: { type: 'string' },
							playerBId: { type: 'string' },
							scoreA: { type: 'number' },
							scoreB: { type: 'number' },
							winnerId: { type: ['string', 'null'] },
							duration: { type: 'number' },
							gameMode: { type: 'string' },
							playedAt: { type: 'string', format: 'date-time' }
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

export default recordAIMatchSchema;
