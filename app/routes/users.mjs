import { Router } from 'express';
const router = Router();

export default (pool) => {
  // Create a user (POST)
  router.post('/', async (req, res) => {
    try {
      const { username, email } = req.body;
      const result = await pool.query(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
        [username, email]
      );
      res.status(201).json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Read all users (GET)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users');
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Read a user by ID (GET)
  router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Update a user (PUT)
  router.put('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email } = req.body;
      const result = await pool.query(
        'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
        [username, email, userId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Delete a user (DELETE)
  router.delete('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  return router;
};
