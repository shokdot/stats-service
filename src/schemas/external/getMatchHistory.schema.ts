import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from "@core/index.js";

const getMatchHistorySchema: RouteShorthandOptions = {
	schema: {
		description: "Get match history for a user",
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
		querystring: {
			type: 'object',
			required: [],
			additionalProperties: false,
			properties: {
				page: {
					type: 'number',
					minimum: 1,
					description: 'Page number (default: 1)'
				},
				limit: {
					type: 'number',
					minimum: 1,
					maximum: 100,
					description: 'Number of results per page (default: 20, max: 100)'
				}
			}
		},
		response: {
			200: {
				type: 'object',
				required: ['status', 'data', 'pagination'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					data: {
						type: 'array',
						items: {
							type: 'object',
							required: ['id', 'playerAId', 'playerBId', 'scoreA', 'scoreB', 'duration', 'playedAt'],
							additionalProperties: false,
							properties: {
								id: { type: 'string', format: 'uuid' },
								playerAId: { type: 'string', format: 'uuid' },
								playerBId: { type: 'string', format: 'uuid' },
								scoreA: { type: 'number' },
								scoreB: { type: 'number' },
								winnerId: { type: ['string', 'null'], format: 'uuid' },
								duration: { type: 'number' },
								playedAt: { type: 'string', format: 'date-time' }
							}
						}
					},
					pagination: {
						type: 'object',
						required: ['page', 'limit', 'total', 'totalPages'],
						additionalProperties: false,
						properties: {
							page: { type: 'number' },
							limit: { type: 'number' },
							total: { type: 'number' },
							totalPages: { type: 'number' }
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

export default getMatchHistorySchema;
