// import * as pg from 'pg';
const { Pool } = require('pg');

const PG_URI = process.env.PG_URI;

const pool = new Pool({
    connectionString: PG_URI,
}); //pg library will retrieve the variables from the .env file

module.exports = {
  query: (text: string, params: any, callback: any) => {
    return pool.query(text, params, callback)
}
}
