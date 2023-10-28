import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: 'your_username',
  host: 'postgres-db', // This matches the service name in docker-compose.yml
  database: 'yourdatabase',
  password: 'your_password',
  port: 5432,
});

app.use(cors());
app.use(json());
app.use(morgan('dev'));

const usersRouter = require('./routes/users')(pool);
const productsRouter = require('./routes/products')(pool);

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
