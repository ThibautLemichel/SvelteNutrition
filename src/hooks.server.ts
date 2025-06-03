import type { Handle } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, url } = event;

	// unprotected paths that should not require authentication
	const unauthPaths = ['/', '/login', '/register'];
	const pathname = url.pathname;

	// If the user is already authenticated
	const sessionId = cookies.get('session');
	if (sessionId && unauthPaths.includes(pathname)) {
		const res = await pool.query('SELECT id FROM users WHERE session_id = $1', [sessionId]);
		if ((res.rowCount ?? 0) > 0) {
			// Go to dashboard
			return new Response(null, {
				status: 303,
				headers: { location: '/dashboard' }
			});
		}
	}

	return await resolve(event);
};
