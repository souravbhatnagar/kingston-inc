import express from 'express';
import jpkg from 'body-parser';
const { json } = jpkg;
import cors from 'cors';
import morgan from 'morgan';
import pgpkg from 'pg-promise';
import fs from 'fs';

export const app = express();
const port = process.env.PORT || 3002;
const host = process.env.DB_HOST || 'localhost';

const pool = pgpkg()({
  user: process.env.DB_USER,
  host: host,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(cors());
app.use(json());
app.use(morgan('dev'));

import usersRouterFactory from './routes/users.mjs';
import productsRouterFactory from './routes/products.mjs';

const usersRouter = usersRouterFactory(pool);
const productsRouter = productsRouterFactory(pool);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

// Function to check if tables exist
async function tablesExist() {
  const result = await pool.query(
    'SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2)',
    ['public', 'products']
  );

  return result[0].exists;
}

// Function to restore tables from SQL file
async function restoreTables() {
  const sql = fs.readFileSync('./db/kingstonincdb', 'utf8');

  await pool.query(sql);
}

// Check if tables exist, if not, restore tables
tablesExist().then(async (exists) => {
  if (!exists) {
    console.log('Tables do not exist. Restoring from SQL file...');
    await restoreTables();
    console.log('Tables restored successfully.');
  } else {
    console.log('Tables already exist.');
  }

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
