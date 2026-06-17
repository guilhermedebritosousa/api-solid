import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env/index.js';
import { checkInsRoutes } from './http/controllers/check-ins/routes.js';
import { gymsRoutes } from './http/controllers/gyms/routes.js';
import { usersRoutes } from './http/controllers/users/routes.js';

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
	sign: {
		expiresIn: '10m',
	},
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		reply
			.status(400)
			.send({ message: 'Validation Error;', issues: error.issues });
	}

	if (env.NODE_ENV !== 'production') {
		console.error(error);
	} else {
		// TODO: Here whe should log to an external tool like DataDog/NewRelic/Sentry
	}

	return reply.status(500).send({ message: 'Internal server error.' });
});
