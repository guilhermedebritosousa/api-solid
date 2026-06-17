import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		const registerUseCase = makeRegisterUseCase();

		await registerUseCase.execute({
			name,
			email,
			password,
		});
	} catch (_err) {
		if (_err instanceof UserAlreadyExistsError) {
			return reply.code(409).send();
		}

		throw _err;
	}

	return reply.code(201).send();
}
