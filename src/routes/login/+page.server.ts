import type { Actions } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { message: 'Invalid form data.' });
		}

		const result = await pool.query('SELECT id, password FROM users WHERE email = $1', [email]);
		const user = result.rows[0];
		if (!user) {
			return fail(400, { message: 'Invalid credentials.' });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return fail(400, { message: 'Invalid credentials.' });
		}

		// Create new session
		const session_id = crypto.randomUUID();
		await pool.query('UPDATE users SET session_id = $1 WHERE id = $2', [session_id, user.id]);
		cookies.set('session', session_id, { path: '/', httpOnly: true });

		throw redirect(303, '/dashboard');
	}
};
