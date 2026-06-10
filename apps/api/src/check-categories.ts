import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories';").then(res => { console.log(res.rows); pool.end(); });
