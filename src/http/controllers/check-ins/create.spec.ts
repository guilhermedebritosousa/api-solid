import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user';

describe('Create Check-in (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});
	afterAll(async () => {
		await app.close();
	});

	it('should be able to create a check-in', async () => {
		const { token } = await createAndAuthenticateUser(app);

		const gym = await prisma.gym.create({
			data: {
				title: 'JavaScript Gym',
				latitude: -2.9097566195019904,
				longitude: -41.747096083260494,
			},
		});

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				latitude: -2.9097566195019904,
				longitude: -41.747096083260494,
			});

		expect(response.statusCode).toEqual(201);
	});
});
