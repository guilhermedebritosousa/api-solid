import type { Gym } from '@/generated/prisma/client';
import type { GymCreateInput } from '@/generated/prisma/models';

export interface findManyNearbyParams {
	latitude: number;
	longitude: number;
}

export interface GymsRepository {
	findById(id: string): Promise<Gym | null>;
	findManyNearby(params: findManyNearbyParams): Promise<Gym[]>;
	searchMany(query: string, page: number): Promise<Gym[]>;
	create(data: GymCreateInput): Promise<Gym>;
}
