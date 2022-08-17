const { Pool } = require('pg');
// require('dotenv').config();

const devConfig = {
  user: 'agwenchez',
  host: 'localhost',
  database: 'zetech',
  password: 'Agwera#15',
  port: 5432,
}

// const isProduction = process.env.NODE_ENV === 'production'
// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// })

const pool = new Pool(devConfig)

module.exports = pool;