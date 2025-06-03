import pg from 'pg';
import { env } from '$env/dynamic/private';
// import fs from 'fs';

// Option1 (DEV ONLY): désactive la validation TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Option2 (PROD): renseignez le certificat racine Aiven
// const caCert = fs.readFileSync('path/to/Aiven_class2_root.pem').toString();

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
		// ca: caCert
	}
});

export { pool };
