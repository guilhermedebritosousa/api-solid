import { randomUUID } from 'node:crypto';
import type { User } from '@/generated/prisma/client';
import type { UserCreateInput } from '@/generated/prisma/models';
import type { UsersRepository } from '../users-repository.js';

export class inMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];

	async findById(id: string): Promise<User | null> {
		return this.items.find((item) => item.id === id) ?? null;
	}

	async findByEmail(email: string) {
		return this.items.find((item) => item.email === email) ?? null;
	}
	async create(data: UserCreateInput) {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date(),
		};

		this.items.push(user);

		return user;
	}
}
