import { Router } from 'express';
const router = Router();

export default (pool) => {
  // Create a product (POST)
  router.post('/', async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const result = await pool.query(
        'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
        [name, description, price]
      );
      res.status(201).json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Read all products (GET)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Read a product by ID (GET)
  router.get('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Update a product (PUT)
  router.put('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, description, price } = req.body;
      const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
        [name, description, price, productId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Delete a product (DELETE)
  router.delete('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  return router;
};
