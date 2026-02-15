import { FastifyReply, FastifyRequest } from "fastify";
import { deleteUserStats } from "../../services/index.js";
import { sendError, AppError } from "@core/index.js";

const deleteUserHandler = async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    try {
        const { userId } = request.params;

        await deleteUserStats(userId);

        return reply.status(200).send({
            status: 'success',
            message: 'User stats deleted successfully',
        });
    }
    catch (error: any) {
        if (error instanceof AppError) {
            return sendError(reply, error);
        }
        return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
};

export default deleteUserHandler;
