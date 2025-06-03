import type { RequestHandler } from './$types';
import { pool } from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const search = `%${q}%`;

	const result = await pool.query(
		`SELECT id, name, energy
     FROM products
     WHERE name ILIKE $1
     ORDER BY name
     LIMIT 10`,
		[search]
	);

	return new Response(JSON.stringify(result.rows), {
		headers: { 'Content-Type': 'application/json' }
	});
};
