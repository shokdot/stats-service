import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, serviceAuth } from "@core/index.js";

const initPlayerStatsSchema: RouteShorthandOptions = {
	preHandler: [serviceAuth as any],
	schema: {
		description: "Initialize player stats for a newly registered user (internal service call)",
		tags: ["Internal"],
		security: [{ serviceToken: [] }],
		body: {
			type: 'object',
			required: ['userId'],
			additionalProperties: false,
			properties: {
				userId: {
					type: 'string',
					format: 'uuid',
					description: 'User ID to initialize stats for'
				}
			}
		},
		response: {
			201: {
				type: 'object',
				required: ['status', 'message'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					message: { type: 'string' }
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			403: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default initPlayerStatsSchema;
