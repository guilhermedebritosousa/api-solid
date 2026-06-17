import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const authenticateUseCase = makeAuthenticateUseCase();

		const { user } = await authenticateUseCase.execute({
			email,
			password,
		});

		const token = await reply.jwtSign(
			{
				role: user.role,
			},
			{
				sub: user.id,
			},
		);

		const refreshToken = await reply.jwtSign(
			{
				role: user.role,
			},
			{
				sub: user.id,
				expiresIn: '7d',
			},
		);

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.code(200)
			.send({
				token,
			});
	} catch (_err) {
		if (_err instanceof InvalidCredentialsError) {
			return reply.code(400).send({ message: _err.message });
		}

		throw _err;
	}
}
