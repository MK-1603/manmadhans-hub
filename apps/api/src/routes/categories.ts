import { Router } from 'express';
import { query } from '../lib/db.js';
import { authorize } from '../middleware/auth.js';
import { globalCache } from '../lib/cache.js';

const router = Router();

// Fetch all categories with dynamic tool counts
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'categories-all';
    const cachedData = globalCache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const result = await query(`
      SELECT DISTINCT ON (c.name) c.*, 
      (SELECT CAST(COUNT(*) AS INT) FROM ai_tools t WHERE t.category_id = c.id OR t.category_name = c.name) as "toolsCount"
      FROM categories c
      ORDER BY c.name ASC
    `);

    globalCache.set(cacheKey, result.rows, 2000); // 2 second cache
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch Categories Error:', err);
    res.status(500).json({ message: 'Neural taxonomy synchronization failure.' });
  }
});

// Register a new category
router.post('/', authorize(['owner']), async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) return res.status(400).json({ message: 'Category Name is required.' });

  try {
    // Generate a slug-like ID if not provided
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    await query(
      'INSERT INTO categories (id, name, description, icon) VALUES ($1, $2, $3, $4)',
      [id, name, description || '', icon || '📦']
    );
    res.json({ success: true, message: 'New category integrated into matrix.' });
  } catch (err) {
    console.error('Add Category Error:', err);
    res.status(500).json({ message: 'Failed to integrate new category.' });
  }
});

// Update category protocols
router.patch('/:id', authorize(['owner']), async (req, res) => {
  const { id } = req.params;
  const { name, description, icon } = req.body;

  try {
    await query(
      `UPDATE categories SET 
       name = COALESCE($1, name),
       description = COALESCE($2, description),
       icon = COALESCE($3, icon)
       WHERE id = $4`,
      [name, description, icon, id]
    );
    res.json({ success: true, message: 'Category protocols updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Protocol update failed.' });
  }
});

// Delete category
router.delete('/:id', authorize(['owner']), async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM categories WHERE id = $1', [id]);
    res.json({ success: true, message: 'Category permanently terminated.' });
  } catch (err) {
    res.status(500).json({ message: 'Termination protocol failed.' });
  }
});

export default router;
