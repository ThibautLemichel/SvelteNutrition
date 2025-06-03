import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const GET: RequestHandler = async ({ cookies }) => {
	// Protection
	const session = cookies.get('session');
	if (!session) {
		return new Response(null, { status: 401 });
	}

	const userRes = await pool.query('SELECT id FROM users WHERE session_id = $1', [session]);
	if (userRes.rowCount === 0) {
		return new Response(null, { status: 401 });
	}
	const userId: number = userRes.rows[0].id;

	// Fetch the last 10 products added by the user
	const histoRes = await pool.query(
		`SELECT
       h.product_id,
       p.name,
       h.added_at
     FROM user_product_history h
     JOIN products p
       ON h.product_id = p.id
     WHERE h.user_id = $1
     ORDER BY h.added_at DESC
     LIMIT 10`,
		[userId]
	);

	const data = histoRes.rows.map((row) => ({
		product_id: row.product_id,
		name: row.name,
		added_at: row.added_at
	}));

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
