import * as pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: 'postgres://ulksarah:Ug7pmbcxHmBYxCPIZ4D9BPeWWysVW3gF@heffalump.db.elephantsql.com/ulksarah'
}); //pg library will retrieve the variables from the .env file

module.exports = {
  query: (text: string) => {
    console.log('executed query', text);
    return pool.query(text)
}
}
