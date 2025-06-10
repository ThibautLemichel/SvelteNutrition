import type { Actions } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// Protect the route
		const session = cookies.get('session');
		if (!session) {
			throw redirect(303, '/login');
		}
		const userRes = await pool.query('SELECT id FROM users WHERE session_id = $1', [session]);
		if (userRes.rowCount === 0) {
			throw redirect(303, '/login');
		}
		const userId: number = userRes.rows[0].id;

		const form = await request.formData();
		const productIdRaw = form.get('product_id');
		const metric = form.get('metric');
		const quantityRaw = form.get('quantity');
		const meal_type = form.get('meal_type');

		if (
			typeof productIdRaw !== 'string' ||
			typeof metric !== 'string' ||
			typeof quantityRaw !== 'string'
		) {
			return fail(400, { message: 'Invalid Data' });
		}

		const productId = parseInt(productIdRaw, 10);
		const quantity = parseFloat(quantityRaw);

		if (isNaN(productId) || isNaN(quantity)) {
			return fail(400, { message: 'Product ID or Quantity invalid' });
		}

		// create a new diary or get existing one
		const today = new Date().toISOString().slice(0, 10);
		const diaryRes = await pool.query(
			'SELECT id FROM diaries WHERE user_id = $1 AND entry_date = $2',
			[userId, today]
		);

		let diaryId: number;
		if (diaryRes.rowCount != null && diaryRes.rowCount > 0) {
			diaryId = diaryRes.rows[0].id;
		} else {
			const insertDiary = await pool.query(
				'INSERT INTO diaries (user_id, entry_date) VALUES ($1, $2) RETURNING id',
				[userId, today]
			);
			diaryId = insertDiary.rows[0].id;
		}

		// Insert the product into diary_entries
		await pool.query(
			`INSERT INTO diary_entries
         (diary_id, product_id, metric, quantity, meal_type)
       VALUES ($1, $2, $3, $4, $5)`,
			[diaryId, productId, metric, quantity, meal_type]
		);

		// Insert into user_product_history
		await pool.query(
			`INSERT INTO user_product_history
         (user_id, product_id)
       VALUES ($1, $2)`,
			[userId, productId]
		);
		return { success: true };
	}
};
