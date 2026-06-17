import { beforeEach, describe, expect, it } from 'vitest';
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym.js';

let gymsRepository: inMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
	beforeEach(() => {
		gymsRepository = new inMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it('should be able to create gym', async () => {
		const { gym } = await sut.execute({
			title: 'JavaScript Gym',
			latitude: -2.908349546147912,
			longitude: -41.77822240227702,
			description: null,
			phone: null,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
