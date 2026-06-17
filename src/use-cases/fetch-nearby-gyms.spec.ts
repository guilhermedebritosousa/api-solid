import { beforeEach, describe, expect, it } from 'vitest';
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.js';

let gymsRepository: inMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new inMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);
	});

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			latitude: -2.9097566195019904,
			longitude: -41.747096083260494,
			description: null,
			phone: null,
		});

		await gymsRepository.create({
			title: 'Far Gym',
			latitude: -2.8818455473080093,
			longitude: -41.665840819551846,
			description: null,
			phone: null,
		});

		const { gyms } = await sut.execute({
			userLatitude: -2.908349546147912,
			userLongitude: -41.77822240227702,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
	});
});
