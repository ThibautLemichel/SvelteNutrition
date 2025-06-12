export interface NutritionalGoals {
	caloriesGoal: number;
	proteinGoal: number;
	fatGoal: number;
	carbGoal: number;
	sugarGoal: number;
	cholesterolGoal: number;
	sodiumGoal: number;
	potassiumGoal: number;
	calciumGoal: number;
	magnesiumGoal: number;
	zincGoal: number;
}

/**
 * Default daily nutritional goals for an average adult male (19–50 years)
 */
export const defaultNutritionalGoals: NutritionalGoals = {
	caloriesGoal: 2600,
	proteinGoal: 56,
	fatGoal: 80,
	carbGoal: 325,
	sugarGoal: 65,
	cholesterolGoal: 300,
	sodiumGoal: 2300,
	potassiumGoal: 3400,
	calciumGoal: 1000,
	magnesiumGoal: 420,
	zincGoal: 11
};
