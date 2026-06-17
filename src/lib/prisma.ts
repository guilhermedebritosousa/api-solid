import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';

function getSchema() {
	try {
		const url = new URL(process.env.DATABASE_URL ?? '');
		return url.searchParams.get('schema') ?? 'public';
	} catch {
		return 'public';
	}
}

function createClient() {
	const connectionString = process.env.DATABASE_URL ?? '';
	const pool = new Pool({ connectionString });
	const schema = getSchema();
	pool.on('connect', (client) => {
		client.query(`SET search_path TO "${schema}"`);
	});

	const adapter = new PrismaPg(pool, { schema });

	return new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
	});
}

export const prisma = createClient();
