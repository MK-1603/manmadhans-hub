import { Router } from 'express';
import { query } from '../lib/db.js';
import { triggerRealTimeUpdate } from '../lib/realtime.js';
import { io } from '../lib/socket.js';
import { authorize } from '../middleware/auth.js';
import { globalCache } from '../lib/cache.js';

const router = Router();

// Fetch all user-contributed tools with advanced filtering and pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 30;
  const offset = (page - 1) * limit;
  const { category, platform, pricing, search, all } = req.query;

  const cacheKey = `user-tools-${page}-${category || ''}-${platform || ''}-${search || ''}-${all || ''}`;
  const cachedData = globalCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const selectCols = 'id, name, slug, short_description, description, url, logo_url, category_id, category_name, category_icon, pricing_model, pricing_details, developer_name, model_version, platform_type, launch_date, tool_status, is_featured, rating, source, is_active, is_archived, created_at, tags';
    let queryStr = `SELECT ${selectCols} FROM user_tools WHERE is_archived = false`;
    let countQueryStr = 'SELECT COUNT(*) FROM user_tools WHERE is_archived = false';
    const params: any[] = [];
    const countParams: any[] = [];

    if (category && category !== 'all') {
      params.push(category);
      countParams.push(category);
      const filter = ` AND (category_name = $${params.length} OR category_id = $${params.length})`;
      queryStr += filter;
      countQueryStr += ` AND (category_name = $${countParams.length} OR category_id = $${countParams.length})`;
    }

    if (platform && platform !== 'all') {
      params.push(`%${platform}%`);
      countParams.push(`%${platform}%`);
      const filter = ` AND platform_type ILIKE $${params.length}`;
      queryStr += filter;
      countQueryStr += ` AND platform_type ILIKE $${countParams.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      const filter = ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
      queryStr += filter;
      countQueryStr += ` AND (name ILIKE $${countParams.length} OR description ILIKE $${countParams.length})`;
    }

    if (all === 'true') {
      queryStr += ` ORDER BY name ASC`;
    } else {
      queryStr += ` ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
    }

    const result = await query(queryStr, params);
    const countResult = await query(countQueryStr, countParams);
    const total = parseInt(countResult.rows[0].count);

    const responsePayload = {
      tools: result.rows,
      pagination: {
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
        currentPage: page
      }
    };

    globalCache.set(cacheKey, responsePayload, 2000); // Cache for 2 seconds

    res.json(responsePayload);
  } catch (err) {
    console.error('Fetch User Tools Error:', err);
    res.status(500).json({ message: 'User neural catalog synchronization failure.' });
  }
});

// Add a new user intelligence asset
router.post('/', authorize(['owner', 'member']), async (req, res) => {
  const {
    name, slug, short_description, description, use_case,
    key_features, search_keywords, url, logo_url,
    category_id, category_name, category_icon,
    pricing_model, pricing_details,
    developer_name, model_version, platform_type, launch_date,
    tool_status, is_featured, integrations, rating, tags, source
  } = req.body;

  if (!name || !category_name) {
    return res.status(400).json({ message: 'Asset Name and Sector are required for registration.' });
  }

  try {
    // Resolve Category/Sector parameters dynamically
    let resolvedCategoryId = category_id;
    let resolvedCategoryName = category_name;
    let resolvedCategoryIcon = category_icon;

    const catRes = await query(
      'SELECT * FROM categories WHERE name = $1 OR id = $2',
      [category_name, category_id || '']
    );
    if (catRes.rows.length > 0) {
      resolvedCategoryId = catRes.rows[0].id;
      resolvedCategoryName = catRes.rows[0].name;
      resolvedCategoryIcon = catRes.rows[0].icon;
    }

    const isFeatured = is_featured === true || is_featured === 'true' || is_featured === 'Yes';
    const parsedRating = parseFloat(rating) || 0;

    const isOwner = (req.user as any)?.role === 'owner';
    const finalToolStatus = isOwner ? (tool_status || 'active') : 'pending';

    const insertRes = await query(
      `INSERT INTO user_tools (
        name, slug, short_description, description, use_case,
        key_features, search_keywords, url, logo_url,
        category_id, category_name, category_icon, 
        pricing_model, pricing_details,
        developer_name, model_version, platform_type, launch_date,
        tool_status, is_featured, integrations, rating, tags, source
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, 
        $13, $14, $15,
        $16, $17, $18, $19,
        $20, $21, $22, $23, $24
      ) RETURNING id`,
      [
        name, slug, short_description, description, use_case,
        JSON.stringify(key_features || []), JSON.stringify(search_keywords || []), url, logo_url,
        resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon,
        pricing_model, pricing_details,
        developer_name, model_version, platform_type, launch_date,
        finalToolStatus, isFeatured, JSON.stringify(integrations || []), parsedRating, JSON.stringify(tags || []), source || 'user'
      ]
    );

    const insertedId = insertRes.rows[0].id;

    if (isOwner) {
      // Intentionally left blank, user_tools does not sync to ai_tools
    } else {
      // If a member added it, trigger notification to Owners
      io.emit('tool_submitted_for_review', {
        id: insertedId,
        name: name,
        user: (req.user as any)?.username || 'Unknown Member'
      });
      // Also send the system notification
      io.emit('notification', {
        title: 'Tool Uploaded',
        desc: `${name} has been uploaded to the registry.`,
        type: 'zap',
        roles: ['owner', 'admin', 'member']
      });
    }

    await triggerRealTimeUpdate();
    res.json({ success: true, message: 'User intelligence asset integrated into separate user database.' });
  } catch (err) {
    console.error('Add User Tool Error:', err);
    res.status(500).json({ message: 'Failed to integrate user neural node.' });
  }
});

// Fetch a single user tool by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM user_tools WHERE id = $1 AND is_archived = false', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User intelligence asset not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch User Tool ID Error:', err);
    res.status(500).json({ message: 'User intelligence node mapping failed.' });
  }
});

// Update user asset details and status
router.patch('/:id', authorize(['owner', 'member']), async (req, res) => {
  const { id } = req.params;
  const {
    name, slug, short_description, description, use_case,
    key_features, search_keywords, url, logo_url,
    category_id, category_name, category_icon,
    pricing_model, pricing_details,
    developer_name, model_version, platform_type, launch_date,
    tool_status, is_featured, integrations, rating, tags,
    is_archived, is_active
  } = req.body;

  try {
    const oldToolRes = await query('SELECT name, slug FROM user_tools WHERE id = $1', [id]);
    const oldName = oldToolRes.rows[0]?.name;
    const oldSlug = oldToolRes.rows[0]?.slug;

    let resolvedCategoryId = category_id;
    let resolvedCategoryName = category_name;
    let resolvedCategoryIcon = category_icon;

    if (category_name || category_id) {
      const catRes = await query(
        'SELECT * FROM categories WHERE name = $1 OR id = $2',
        [category_name || '', category_id || '']
      );
      if (catRes.rows.length > 0) {
        resolvedCategoryId = catRes.rows[0].id;
        resolvedCategoryName = catRes.rows[0].name;
        resolvedCategoryIcon = catRes.rows[0].icon;
      }
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    const addField = (col: string, val: any) => {
      if (val !== undefined) {
        params.push(val);
        updateFields.push(`${col} = $${params.length}`);
      }
    };

    addField('name', name);
    addField('slug', slug);
    addField('short_description', short_description);
    addField('description', description);
    addField('use_case', use_case);
    addField('url', url);
    addField('logo_url', logo_url);
    addField('category_id', resolvedCategoryId);
    addField('category_name', resolvedCategoryName);
    addField('category_icon', resolvedCategoryIcon);

    addField('pricing_model', pricing_model);
    addField('pricing_details', pricing_details);
    addField('developer_name', developer_name);
    addField('model_version', model_version);
    addField('platform_type', platform_type);
    addField('launch_date', launch_date);
    addField('tool_status', tool_status);
    addField('is_archived', is_archived);
    addField('is_active', is_active);

    if (is_featured !== undefined) {
      addField('is_featured', is_featured === true || is_featured === 'true' || is_featured === 'Yes');
    }

    if (key_features !== undefined) {
      addField('key_features', Array.isArray(key_features) ? JSON.stringify(key_features) : JSON.stringify(key_features.split(',').map((s: string) => s.trim()).filter(Boolean)));
    }
    if (search_keywords !== undefined) {
      addField('search_keywords', Array.isArray(search_keywords) ? JSON.stringify(search_keywords) : JSON.stringify(search_keywords.split(',').map((s: string) => s.trim()).filter(Boolean)));
    }
    if (integrations !== undefined) {
      addField('integrations', Array.isArray(integrations) ? JSON.stringify(integrations) : JSON.stringify(integrations.split(',').map((s: string) => s.trim()).filter(Boolean)));
    }
    if (tags !== undefined) {
      addField('tags', Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify(tags.split(',').map((s: string) => s.trim()).filter(Boolean)));
    }
    if (rating !== undefined) {
      addField('rating', parseFloat(rating) || 0);
    }

    if (updateFields.length > 0) {
      params.push(id);
      const queryStr = `UPDATE user_tools SET ${updateFields.join(', ')} WHERE id = $${params.length}`;
      await query(queryStr, params);

      // Sync update to ai_tools removed to maintain database separation
    }

    await triggerRealTimeUpdate();
    res.json({ success: true, message: 'User asset protocols updated.' });
  } catch (err) {
    console.error('PATCH User Asset Error:', err);
    res.status(500).json({ message: 'User protocol update failed.' });
  }
});

// Delete a user asset permanently
router.delete('/:id', authorize(['owner', 'member']), async (req, res) => {
  const { id } = req.params;
  try {
    const oldToolRes = await query('SELECT name, slug FROM user_tools WHERE id = $1', [id]);
    const oldName = oldToolRes.rows[0]?.name;
    const oldSlug = oldToolRes.rows[0]?.slug;

    await query('DELETE FROM user_tools WHERE id = $1', [id]);

    // Deletion from ai_tools removed to maintain database separation

    await triggerRealTimeUpdate();
    res.json({ success: true, message: 'User asset permanently terminated from registry.' });
  } catch (err) {
    res.status(500).json({ message: 'Termination protocol failed.' });
  }
});

export default router;
