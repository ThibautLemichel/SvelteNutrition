import xlsx from 'xlsx';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, 'FoodProducts.xlsx');

function parseValue(val: any): number {
	if (val === null || val === undefined) return 0;
	const s = String(val).trim();
	if (s === 'N' || s === '') return 0;
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

async function main() {
	// Read Excel file
	const wb = xlsx.readFile(excelPath);

	const proxSheet = wb.Sheets['1.3 Proximates'];
	const inorgSheet = wb.Sheets['1.4 Inorganics'];

	const proxAll = xlsx.utils.sheet_to_json(proxSheet, { defval: 0 });
	const inorgAll = xlsx.utils.sheet_to_json(inorgSheet, { defval: null });

	const proximates = proxAll.filter(
		(row) => typeof row['Food Name'] === 'string' && row['Food Name'].trim() !== ''
	);
	const inorganics = inorgAll.filter(
		(r) =>
			typeof (r as { [key: string]: any })['Food Name'] === 'string' &&
			(r as { [key: string]: any })['Food Name'].trim() !== ''
	);

	// Map products
	const mapProducts = new Map<string, any>();

	proximates.forEach((p) => {
		const key = p['Food Name'];
		mapProducts.set(key, {
			name: key,
			protein: parseValue(p['Protein (g)']),
			fat: parseValue(p['Fat (g)']),
			carbohydrate: parseValue(p['Carbohydrate (g)']),
			energy: parseValue(p['Energy (kcal) (kcal)']),
			sugars: parseValue(p['Total sugars (g)']),
			cholesterol: parseValue(p['Cholesterol (mg)'])
		});
	});

	inorganics.forEach((i) => {
		const entry = mapProducts.get(i['Food Name']);
		if (entry) {
			entry.sodium = parseValue(i['Sodium (mg)']);
			entry.potassium = parseValue(i['Potassium (mg)']);
			entry.calcium = parseValue(i['Calcium (mg)']);
			entry.magnesium = parseValue(i['Magnesium (mg)']);
			entry.zinc = parseValue(i['Zinc (mg)']);
		}
	});

	console.log('sample products:', Array.from(mapProducts.values()).slice(0, 5));

	// Insert into database
	for (const prod of mapProducts.values()) {
		const {
			name,
			protein,
			fat,
			carbohydrate,
			energy,
			sugars,
			cholesterol,
			sodium,
			potassium,
			calcium,
			magnesium,
			zinc
		} = prod;

		await pool.query(
			`INSERT INTO products
        (name, protein, fat, carbohydrate, energy, sugars, cholesterol,
         sodium, potassium, calcium, magnesium, zinc)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (name) DO UPDATE SET
         protein     = EXCLUDED.protein,
         fat         = EXCLUDED.fat,
         carbohydrate= EXCLUDED.carbohydrate,
         energy      = EXCLUDED.energy,
         sugars      = EXCLUDED.sugars,
         cholesterol = EXCLUDED.cholesterol,
         sodium      = EXCLUDED.sodium,
         potassium   = EXCLUDED.potassium,
         calcium     = EXCLUDED.calcium,
         magnesium   = EXCLUDED.magnesium,
         zinc        = EXCLUDED.zinc;`,
			[
				name,
				protein,
				fat,
				carbohydrate,
				energy,
				sugars,
				cholesterol,
				sodium,
				potassium,
				calcium,
				magnesium,
				zinc
			]
		);
		console.log(`Inserted/Updated: ${name}`);
	}

	await pool.end();
	console.log('Import terminé.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
