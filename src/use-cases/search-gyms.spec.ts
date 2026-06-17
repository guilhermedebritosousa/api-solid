import { beforeEach, describe, expect, it } from 'vitest';
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms.js';

let gymsRepository: inMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new inMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'JavaScript Gym',
			latitude: -2.908349546147912,
			longitude: -41.77822240227702,
			description: null,
			phone: null,
		});

		await gymsRepository.create({
			title: 'TypeScript Gym',
			latitude: -2.908349546147912,
			longitude: -41.77822240227702,
			description: null,
			phone: null,
		});

		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym' }),
		]);
	});

	it('should be able to fetch paginated gym search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `JavaScript Gym ${i}`,
				latitude: -2.908349546147912,
				longitude: -41.77822240227702,
				description: null,
				phone: null,
			});
		}

		const { gyms } = await sut.execute({
			query: 'JavaScript Gym',
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym 21' }),
			expect.objectContaining({ title: 'JavaScript Gym 22' }),
		]);
	});
});
