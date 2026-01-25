import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from "@core/index.js";

const getPlayerRankSchema: RouteShorthandOptions = {
	schema: {
		description: "Get player rank",
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
						required: ['userId', 'elo', 'rank'],
						additionalProperties: false,
						properties: {
							userId: { type: 'string', format: 'uuid' },
							elo: { type: 'number' },
							rank: { type: 'number' }
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

export default getPlayerRankSchema;
