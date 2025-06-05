import type { RequestHandler } from './$types';
import { pool } from '$lib/server/db';

export const POST: RequestHandler = async ({ cookies }) => {
	// Get the session ID from the cookie
	const sessionId = cookies.get('session');
	if (sessionId) {
		// clear session_id in the database so it cannot be reused
		await pool.query(
			`UPDATE users
         SET session_id = NULL
       WHERE session_id = $1`,
			[sessionId]
		);

		// Delete the cookie
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0),
			httpOnly: true
		});
	}

	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
