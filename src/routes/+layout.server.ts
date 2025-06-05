import type { LayoutServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) {
		return { user: null };
	}

	// Lookup user by session_id
	const res = await pool.query('SELECT id, name FROM users WHERE session_id = $1', [session]);
	if (res.rowCount === 0) {
		return { user: null };
	}

	return {
		user: {
			id: res.rows[0].id,
			name: res.rows[0].name
		}
	};
};
