import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import type { Environment } from 'vitest/environments';

function generateDatabaseUrl(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Please Provide a DATABASE_URL env variable.');
	}

	const url = new URL(process.env.DATABASE_URL);
	url.searchParams.set('schema', schema);
	return url.toString();
}

export default (<Environment>{
	name: 'prisma',
	viteEnvironment: 'ssr',
	async setup() {
		const schema = randomUUID();
		const databaseUrl = generateDatabaseUrl(schema);

		process.env.DATABASE_URL = databaseUrl;

		execSync('npx prisma db push');

		return {
			async teardown() {
				const client = new Client({
					connectionString: process.env.DATABASE_URL,
				});

				await client.connect();

				await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);

				await client.end();
			},
		};
	},
});
