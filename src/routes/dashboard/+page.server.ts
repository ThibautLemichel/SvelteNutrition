import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
	// 1) Ensure user is authenticated
	const session = cookies.get('session');
	if (!session) throw redirect(303, '/login');

	// 2) Fetch user info and goals
	const userRes = await pool.query(
		`SELECT
       id,
       name,
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

	const user = userRes.rows[0];
	const userId: number = user.id;

	// 3) Find today's diary (if it exists)
	const today = new Date().toISOString().slice(0, 10);
	const diaryRes = await pool.query(
		'SELECT id FROM diaries WHERE user_id = $1 AND entry_date = $2',
		[userId, today]
	);
	let diaryId: number | null = null;
	if (diaryRes.rowCount > 0) {
		diaryId = diaryRes.rows[0].id;
	}

	// 4) Sum calories by meal_type for the doughnut (unchanged)
	const mealCalories = {
		breakfast: 0,
		lunch: 0,
		dinner: 0,
		snack: 0
	};

	if (diaryId !== null) {
		const sumsMealRes = await pool.query(
			`SELECT de.meal_type,
              SUM(p.energy * de.quantity / 100.0) AS calories
       FROM diary_entries de
       JOIN products p ON de.product_id = p.id
       WHERE de.diary_id = $1
       GROUP BY de.meal_type`,
			[diaryId]
		);

		for (const row of sumsMealRes.rows) {
			const mt: string = row.meal_type;
			const c: number = parseFloat(row.calories) || 0;
			if (mealCalories[mt as keyof typeof mealCalories] !== undefined) {
				mealCalories[mt as keyof typeof mealCalories] = c;
			}
		}
	}

	// 5) Sum each nutrient for today's diary
	// If no diary, all sums remain zero
	const nutrientSums = {
		protein: 0,
		fat: 0,
		carbohydrate: 0,
		sugar: 0,
		cholesterol: 0,
		sodium: 0,
		potassium: 0,
		calcium: 0,
		magnesium: 0,
		zinc: 0
	};

	if (diaryId !== null) {
		const sumsNutrientsRes = await pool.query(
			`SELECT
         SUM(p.protein     * de.quantity / 100.0) AS protein,
         SUM(p.fat         * de.quantity / 100.0) AS fat,
         SUM(p.carbohydrate* de.quantity / 100.0) AS carbohydrate,
         SUM(p.sugars      * de.quantity / 100.0) AS sugar,
         SUM(p.cholesterol * de.quantity / 100.0) AS cholesterol,
         SUM(p.sodium      * de.quantity / 100.0) AS sodium,
         SUM(p.potassium   * de.quantity / 100.0) AS potassium,
         SUM(p.calcium     * de.quantity / 100.0) AS calcium,
         SUM(p.magnesium   * de.quantity / 100.0) AS magnesium,
         SUM(p.zinc        * de.quantity / 100.0) AS zinc
       FROM diary_entries de
       JOIN products p ON de.product_id = p.id
       WHERE de.diary_id = $1`,
			[diaryId]
		);

		const sumsRow = sumsNutrientsRes.rows[0];
		nutrientSums.protein = parseFloat(sumsRow.protein) || 0;
		nutrientSums.fat = parseFloat(sumsRow.fat) || 0;
		nutrientSums.carbohydrate = parseFloat(sumsRow.carbohydrate) || 0;
		nutrientSums.sugar = parseFloat(sumsRow.sugar) || 0;
		nutrientSums.cholesterol = parseFloat(sumsRow.cholesterol) || 0;
		nutrientSums.sodium = parseFloat(sumsRow.sodium) || 0;
		nutrientSums.potassium = parseFloat(sumsRow.potassium) || 0;
		nutrientSums.calcium = parseFloat(sumsRow.calcium) || 0;
		nutrientSums.magnesium = parseFloat(sumsRow.magnesium) || 0;
		nutrientSums.zinc = parseFloat(sumsRow.zinc) || 0;
	}

	return {
		userName: user.name,
		caloriesGoal: user.calories_goal,
		mealCalories,
		nutrientSums,
		nutrientGoals: {
			protein: user.protein_goal,
			fat: user.fat_goal,
			carbohydrate: user.carb_goal,
			sugar: user.sugar_goal,
			cholesterol: user.cholesterol_goal,
			sodium: user.sodium_goal,
			potassium: user.potassium_goal,
			calcium: user.calcium_goal,
			magnesium: user.magnesium_goal,
			zinc: user.zinc_goal
		}
	};
};
