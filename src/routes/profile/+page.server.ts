// src/routes/profile/+page.server.ts

import type { PageServerLoad, Actions } from './$types';
import { pool } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	// Auth
	const session = cookies.get('session');
	if (!session) throw redirect(303, '/login');

	const userRes = await pool.query(
		`SELECT
       id,
       name,
       email,
       calories_goal,
       protein_goal,
       fat_goal,
       carb_goal,
       sugar_goal,
       cholesterol_goal,
       sodium_goal,
       potassium_goal,
       calcium_goal,
       magnesium_goal,
       zinc_goal
     FROM users
     WHERE session_id = $1`,
		[session]
	);
	if (userRes.rowCount === 0) throw redirect(303, '/login');

	const row = userRes.rows[0];
	return {
		userId: row.id,
		name: row.name,
		email: row.email,
		caloriesGoal: row.calories_goal,
		proteinGoal: row.protein_goal,
		fatGoal: row.fat_goal,
		carbGoal: row.carb_goal,
		sugarGoal: row.sugar_goal,
		cholesterolGoal: row.cholesterol_goal,
		sodiumGoal: row.sodium_goal,
		potassiumGoal: row.potassium_goal,
		calciumGoal: row.calcium_goal,
		magnesiumGoal: row.magnesium_goal,
		zincGoal: row.zinc_goal
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// Auth
		const session = cookies.get('session');
		if (!session) throw redirect(303, '/login');

		const userRes = await pool.query('SELECT id FROM users WHERE session_id = $1', [session]);
		if (userRes.rowCount === 0) throw redirect(303, '/login');

		const userId: number = userRes.rows[0].id;

		// Read and validate form data
		const form = await request.formData();
		const nameRaw = form.get('name');
		const emailRaw = form.get('email');
		const passwordRaw = form.get('password');
		const caloriesGoalRaw = form.get('calories_goal');
		const proteinGoalRaw = form.get('protein_goal');
		const fatGoalRaw = form.get('fat_goal');
		const carbGoalRaw = form.get('carb_goal');
		const sugarGoalRaw = form.get('sugar_goal');
		const cholGoalRaw = form.get('cholesterol_goal');
		const sodiumGoalRaw = form.get('sodium_goal');
		const potassiumGoalRaw = form.get('potassium_goal');
		const calciumGoalRaw = form.get('calcium_goal');
		const magnesiumGoalRaw = form.get('magnesium_goal');
		const zincGoalRaw = form.get('zinc_goal');

		if (
			typeof nameRaw !== 'string' ||
			typeof emailRaw !== 'string' ||
			typeof caloriesGoalRaw !== 'string' ||
			typeof proteinGoalRaw !== 'string' ||
			typeof fatGoalRaw !== 'string' ||
			typeof carbGoalRaw !== 'string' ||
			typeof sugarGoalRaw !== 'string' ||
			typeof cholGoalRaw !== 'string' ||
			typeof sodiumGoalRaw !== 'string' ||
			typeof potassiumGoalRaw !== 'string' ||
			typeof calciumGoalRaw !== 'string' ||
			typeof magnesiumGoalRaw !== 'string' ||
			typeof zincGoalRaw !== 'string'
		) {
			return fail(400, { message: 'Invalid form data.' });
		}

		// Trim and parse the form data
		const name = nameRaw.trim();
		const email = emailRaw.trim();
		const caloriesGoal = parseInt(caloriesGoalRaw, 10);
		const proteinGoal = parseFloat(proteinGoalRaw);
		const fatGoal = parseFloat(fatGoalRaw);
		const carbGoal = parseFloat(carbGoalRaw);
		const sugarGoal = parseFloat(sugarGoalRaw);
		const cholGoal = parseFloat(cholGoalRaw);
		const sodiumGoal = parseFloat(sodiumGoalRaw);
		const potassiumGoal = parseFloat(potassiumGoalRaw);
		const calciumGoal = parseFloat(calciumGoalRaw);
		const magnesiumGoal = parseFloat(magnesiumGoalRaw);
		const zincGoal = parseFloat(zincGoalRaw);

		if (!name) {
			return fail(400, { message: 'Name cannot be empty.' });
		}
		if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
			return fail(400, { message: 'Please enter a valid email address.' });
		}
		if (isNaN(caloriesGoal) || caloriesGoal < 0) {
			return fail(400, { message: 'Calories goal must be a non-negative integer.' });
		}
		const numericFields = [
			proteinGoal,
			fatGoal,
			carbGoal,
			sugarGoal,
			cholGoal,
			sodiumGoal,
			potassiumGoal,
			calciumGoal,
			magnesiumGoal,
			zincGoal
		];
		if (numericFields.some((v) => isNaN(v) || v < 0)) {
			return fail(400, { message: 'Nutrient goals must be non-negative numbers.' });
		}

		// verify that email is not already in use by another user
		const emailRes = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [
			email,
			userId
		]);
		if (emailRes.rowCount > 0) {
			return fail(400, { message: 'Email is already in use.' });
		}

		// Dynamically build the UPDATE query
		const updates: string[] = [];
		const params: any[] = [];
		let idx = 1;

		// Update name and email
		updates.push(`name = $${idx++}`);
		params.push(name);

		updates.push(`email = $${idx++}`);
		params.push(email);

		// Calories goal
		updates.push(`calories_goal = $${idx++}`);
		params.push(caloriesGoal);

		// Nutrient goals
		updates.push(`protein_goal = $${idx++}`);
		params.push(proteinGoal);
		updates.push(`fat_goal = $${idx++}`);
		params.push(fatGoal);
		updates.push(`carb_goal = $${idx++}`);
		params.push(carbGoal);
		updates.push(`sugar_goal = $${idx++}`);
		params.push(sugarGoal);
		updates.push(`cholesterol_goal = $${idx++}`);
		params.push(cholGoal);
		updates.push(`sodium_goal = $${idx++}`);
		params.push(sodiumGoal);
		updates.push(`potassium_goal = $${idx++}`);
		params.push(potassiumGoal);
		updates.push(`calcium_goal = $${idx++}`);
		params.push(calciumGoal);
		updates.push(`magnesium_goal = $${idx++}`);
		params.push(magnesiumGoal);
		updates.push(`zinc_goal = $${idx++}`);
		params.push(zincGoal);

		// if password changed, hash it and add to updates
		if (typeof passwordRaw === 'string' && passwordRaw.trim() !== '') {
			if (passwordRaw.length < 6) {
				return fail(400, { message: 'Password must be at least 6 characters.' });
			}
			const hashed = await bcrypt.hash(passwordRaw, 10);
			updates.push(`password = $${idx++}`);
			params.push(hashed);
		}

		// WHERE id = $idx
		params.push(userId);
		const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${idx}
    `;

		await pool.query(query, params);

		// redirect with success message
		throw redirect(303, '/profile?updated=true');
	}
};
