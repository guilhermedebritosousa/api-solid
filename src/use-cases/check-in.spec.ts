import { Decimal } from '@prisma/client/runtime/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckInUseCase } from './check-in.js';
import { MaxDistanceError } from './errors/max-distance-error.js';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.js';

let checkInsRepository: inMemoryCheckInsRepository;
let gymsRepository: inMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new inMemoryCheckInsRepository();
		gymsRepository = new inMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: 'gym-01',
			title: 'JavaScript Gym',
			description: '',
			latitude: -2.908349546147912,
			longitude: -41.77822240227702,
			phone: '',
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -2.908349546147912,
			userLongitude: -41.77822240227702,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in twice on the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -2.908349546147912,
			userLongitude: -41.77822240227702,
		});

		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				userLatitude: -2.908349546147912,
				userLongitude: -41.77822240227702,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -2.908349546147912,
			userLongitude: -41.77822240227702,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -2.908349546147912,
			userLongitude: -41.77822240227702,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in on a distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-02',
			title: 'JavaScript Gym',
			description: '',
			latitude: new Decimal(-2.9083926576378465),
			longitude: new Decimal(-41.777257868429096),
			phone: '',
		});

		await expect(() =>
			sut.execute({
				gymId: 'gym-02',
				userId: 'user-01',
				userLatitude: -2.908349546147912,
				userLongitude: -41.77822240227702,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
