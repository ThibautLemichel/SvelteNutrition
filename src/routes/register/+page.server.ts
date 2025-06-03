import type { Actions } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const name = form.get('name');
		const email = form.get('email');
		const password = form.get('password');

		if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { message: 'Invalid form data.' });
		}

		const hashed = await bcrypt.hash(password, 10);
		const insert = await pool.query(
			'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
			[name, email, hashed]
		);
		const userId = insert.rows[0].id;

		// Create session
		const session_id = crypto.randomUUID();
		await pool.query('UPDATE users SET session_id = $1 WHERE id = $2', [session_id, userId]);
		cookies.set('session', session_id, { path: '/', httpOnly: true });

		throw redirect(303, '/dashboard');
	}
};
