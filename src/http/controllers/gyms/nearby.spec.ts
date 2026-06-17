import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user';

describe('Search Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});
	afterAll(async () => {
		await app.close();
	});

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'JavaScript Gym',
				description: 'Some description.',
				phone: '1199999999',
				latitude: -2.9097566195019904,
				longitude: -41.747096083260494,
			});

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'TypeScript Gym',
				description: 'Some description.',
				phone: '1199999999',
				latitude: -2.8818455473080093,
				longitude: -41.6,
			});

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -2.9097566195019904,
				longitude: -41.747096083260494,
			})
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'JavaScript Gym',
			}),
		]);
	});
});
