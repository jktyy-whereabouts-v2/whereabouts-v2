import * as pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.PG_URI
}); //pg library will retrieve the variables from the .env file

module.exports = {
  query: (text: string) => {
    console.log('executed query', text);
    return pool.query(text)
}
}
