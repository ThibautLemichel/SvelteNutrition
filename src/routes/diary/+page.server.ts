import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) throw redirect(303, '/login');

	const userRes = await pool.query('SELECT id FROM users WHERE session_id = $1', [session]);
	if (userRes.rowCount === 0) throw redirect(303, '/login');
	const userId: number = userRes.rows[0].id;

	const today = new Date().toISOString().slice(0, 10);
	const diaryRes = await pool.query(
		'SELECT id FROM diaries WHERE user_id = $1 AND entry_date = $2',
		[userId, today]
	);

	let diaryId: number;
	if ((diaryRes.rowCount ?? 0) > 0) {
		diaryId = diaryRes.rows[0].id;
	} else {
		const insert = await pool.query(
			'INSERT INTO diaries (user_id, entry_date) VALUES ($1, $2) RETURNING id',
			[userId, today]
		);
		diaryId = insert.rows[0].id;
	}

	const entriesRes = await pool.query(
		`SELECT
       de.id AS entry_id,
       de.quantity,
       de.metric,
       de.meal_type,
       p.name,
       p.protein,
       p.fat,
       p.carbohydrate,
       p.energy AS calories,
       p.sugars,
       p.cholesterol,
       p.sodium,
       p.potassium,
       p.calcium,
       p.magnesium,
       p.zinc
     FROM diary_entries de
     JOIN products p ON de.product_id = p.id
     WHERE de.diary_id = $1
     ORDER BY de.meal_type, p.name`,
		[diaryId]
	);

	return {
		entries: entriesRes.rows,
		date: today
	};
};

export const actions: Actions = {
	delete: async ({ request, cookies }) => {
		const session = cookies.get('session');
		if (!session) return fail(401, { message: 'Not authenticated' });

		const userRes = await pool.query('SELECT id FROM users WHERE session_id = $1', [session]);
		if (userRes.rowCount === 0) return fail(401, { message: 'User not found' });
		const userId: number = userRes.rows[0].id;

		const form = await request.formData();
		const entryIdRaw = form.get('deleteEntry');
		if (typeof entryIdRaw !== 'string') return fail(400);
		const entryId = parseInt(entryIdRaw, 10);
		if (isNaN(entryId)) return fail(400);

		const ownershipRes = await pool.query(
			`SELECT de.id FROM diary_entries de
       JOIN diaries d ON de.diary_id = d.id
       WHERE de.id = $1 AND d.user_id = $2`,
			[entryId, userId]
		);
		if (ownershipRes.rowCount === 0) return fail(403);

		await pool.query('DELETE FROM diary_entries WHERE id = $1', [entryId]);

		return { success: true, deletedId: entryId };
	}
};
