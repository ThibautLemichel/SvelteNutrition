import type { Actions } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { defaultNutritionalGoals } from '$lib/const/DefaultMacros';

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
			'INSERT INTO users (name, email, password, calories_goal, protein_goal, fat_goal, carb_goal, sugar_goal, cholesterol_goal, sodium_goal, potassium_goal, calcium_goal, magnesium_goal, zinc_goal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id',
			[
				name,
				email,
				hashed,
				defaultNutritionalGoals.caloriesGoal,
				defaultNutritionalGoals.proteinGoal,
				defaultNutritionalGoals.fatGoal,
				defaultNutritionalGoals.carbGoal,
				defaultNutritionalGoals.sugarGoal,
				defaultNutritionalGoals.cholesterolGoal,
				defaultNutritionalGoals.sodiumGoal,
				defaultNutritionalGoals.potassiumGoal,
				defaultNutritionalGoals.calciumGoal,
				defaultNutritionalGoals.magnesiumGoal,
				defaultNutritionalGoals.zincGoal
			]
		);
		const userId = insert.rows[0].id;

		// Create session
		const session_id = crypto.randomUUID();
		await pool.query('UPDATE users SET session_id = $1 WHERE id = $2', [session_id, userId]);
		cookies.set('session', session_id, { path: '/', httpOnly: true });

		throw redirect(303, '/dashboard');
	}
};
