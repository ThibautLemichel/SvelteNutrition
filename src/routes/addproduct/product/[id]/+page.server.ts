import type { PageServerLoad, Actions } from './$types';
import { pool } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies }) => {
	// Auth
	const session = cookies.get('session');
	if (!session) throw redirect(303, '/login');

	const userRes = await pool.query('SELECT id FROM users WHERE session_id = $1', [session]);
	if (userRes.rowCount === 0) throw redirect(303, '/login');

	// Get the product’s data
	const id = parseInt(params.id, 10);
	if (isNaN(id)) throw error(400, 'Invalid product ID');

	const prodRes = await pool.query(
		`SELECT
       id, name,
       protein, fat, carbohydrate,
       energy AS calories, sugars, cholesterol,
       sodium, potassium, calcium, magnesium, zinc
     FROM products
     WHERE id = $1
     LIMIT 1`,
		[id]
	);
	if (prodRes.rowCount === 0) throw error(404, 'Product not found');

	return {
		product: prodRes.rows[0]
	};
};

// Allow updating quantity + adding to diary
export const actions: Actions = {
	default: async ({ request, cookies, params }) => {
		const session = cookies.get('session');
		if (!session) throw redirect(303, '/login');

		const userRes = await pool.query('SELECT id FROM users WHERE session_id = $1', [session]);
		if (userRes.rowCount === 0) throw redirect(303, '/login');
		const userId: number = userRes.rows[0].id;

		// Parse form: we expect metric (e.g. 'g'), quantity (string of number), meal_type
		const form = await request.formData();
		const metric = form.get('metric');
		const quantityRaw = form.get('quantity');
		const mealTypeRaw = form.get('meal_type');

		if (
			typeof metric !== 'string' ||
			typeof quantityRaw !== 'string' ||
			typeof mealTypeRaw !== 'string'
		) {
			return { success: false, error: 'Formulaire mal rempli.' };
		}

		const quantity = parseFloat(quantityRaw);
		const meal_type = mealTypeRaw.toLowerCase();
		if (isNaN(quantity) || !['breakfast', 'lunch', 'dinner', 'snack'].includes(meal_type)) {
			return { success: false, error: 'Valeurs non valides.' };
		}

		// Get or create “today’s” diary
		const today = new Date().toISOString().slice(0, 10);
		const diaryRes = await pool.query(
			'SELECT id FROM diaries WHERE user_id = $1 AND entry_date = $2',
			[userId, today]
		);
		let diaryId: number;
		if ((diaryRes.rowCount ?? 0) > 0) {
			diaryId = diaryRes.rows[0].id;
		} else {
			const ins = await pool.query(
				'INSERT INTO diaries (user_id, entry_date) VALUES ($1, $2) RETURNING id',
				[userId, today]
			);
			diaryId = ins.rows[0].id;
		}

		const productId = parseInt(params.id, 10);

		// Insert into diary_entries (with meal_type)
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

		// After adding, redirect back to /diary
		throw redirect(303, '/diary');
	}
};
