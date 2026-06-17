import type { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify();
	} catch (_err) {
		return reply.code(401).send({ message: 'Unauthorized.' });
	}
}
