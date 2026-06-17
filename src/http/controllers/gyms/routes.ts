import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { create } from './create.js';
import { nearby } from './nearby.js';
import { search } from './search.js';

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT);

	app.get('/gyms/search', search);
	app.get('/gyms/nearby', nearby);

	app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create);
}
