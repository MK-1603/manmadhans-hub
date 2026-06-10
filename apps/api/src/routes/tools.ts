import { Router } from 'express';
import { query } from '../lib/db.js';
import { triggerRealTimeUpdate } from '../lib/realtime.js';
import { io } from '../lib/socket.js';
import { authorize } from '../middleware/auth.js';
import { globalCache } from '../lib/cache.js';

const router = Router();

// Fetch all tools with advanced filtering and pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 30;
  const offset = (page - 1) * limit;
  const { category, platform, pricing, search, all } = req.query;

  const cacheKey = `tools-${page}-${category || ''}-${platform || ''}-${search || ''}-${all || ''}`;
  const cachedData = globalCache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const selectCols = 'id, name, slug, short_description, description, url, logo_url, category_id, category_name, category_icon, sub_category, micro_category, pricing_model, pricing_details, developer_name, model_version, platform_type, launch_date, tool_status, is_featured, rating, source, is_active, is_archived, created_at, tags';
    let queryStr = `SELECT ${selectCols} FROM ai_tools WHERE is_archived = false`;
    let countQueryStr = 'SELECT COUNT(*) FROM ai_tools WHERE is_archived = false';
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
    console.error('Fetch Tools Error:', err);
    res.status(500).json({ message: 'Neural catalog synchronization failure.' });
  }
});


// Bulk integrate intelligence assets
router.post('/bulk', authorize(['owner']), async (req, res) => {
  const { tools } = req.body;
  if (!Array.isArray(tools)) {
    return res.status(400).json({ message: 'Payload must contain a tools array.' });
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const tool of tools) {
    const { 
      name, slug, short_description, description, use_case,
      key_features, search_keywords, url, logo_url,
      category_id, category_name, category_icon, sub_category, micro_category,
      pricing_model, pricing_details,
      developer_name, model_version, platform_type, launch_date,
      tool_status, is_featured, integrations, rating, tags, source 
    } = tool;

    if (!name || !category_name) {
      results.failed++;
      results.errors.push(`Tool "${name || 'Unnamed'}" missing Name or Sector (category_name).`);
      continue;
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

      // Check if tool already exists by name or slug in ai_tools
      const checkRes = await query(
        'SELECT id FROM ai_tools WHERE name = $1 OR (slug IS NOT NULL AND slug = $2)',
        [name, slug || '']
      );

      if (checkRes.rows.length > 0) {
        const existingId = checkRes.rows[0].id;
        await query(
          `UPDATE ai_tools SET
            name = $1, slug = $2, short_description = $3, description = $4, use_case = $5,
            key_features = $6, search_keywords = $7, url = $8, logo_url = $9,
            category_id = $10, category_name = $11, category_icon = $12, sub_category = $13, micro_category = $14,
            pricing_model = $15, pricing_details = $16,
            developer_name = $17, model_version = $18, platform_type = $19, launch_date = $20,
            tool_status = $21, is_featured = $22, integrations = $23, rating = $24, tags = $25, source = $26
          WHERE id = $27`,
          [
            name, slug, short_description, description, use_case,
            JSON.stringify(key_features || []), JSON.stringify(search_keywords || []), url, logo_url,
            resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,
            pricing_model, pricing_details,
            developer_name, model_version, platform_type, launch_date,
            tool_status, isFeatured, JSON.stringify(integrations || []), parsedRating, JSON.stringify(tags || []), source || 'manual',
            existingId
          ]
        );
      } else {
        await query(
          `INSERT INTO ai_tools (
            name, slug, short_description, description, use_case,
            key_features, search_keywords, url, logo_url,
            category_id, category_name, category_icon, sub_category, micro_category,
            pricing_model, pricing_details,
            developer_name, model_version, platform_type, launch_date,
            tool_status, is_featured, integrations, rating, tags, source
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9,
            $10, $11, $12, $13, $14,
            $15, $16,
            $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26
          )`,
          [
            name, slug, short_description, description, use_case,
            JSON.stringify(key_features || []), JSON.stringify(search_keywords || []), url, logo_url,
            resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,
            pricing_model, pricing_details,
            developer_name, model_version, platform_type, launch_date,
            tool_status, isFeatured, JSON.stringify(integrations || []), parsedRating, JSON.stringify(tags || []), source || 'manual'
          ]
        );
      }

      // Check if tool already exists by name or slug in user_tools
      const userCheckRes = await query(
        'SELECT id FROM user_tools WHERE name = $1 OR (slug IS NOT NULL AND slug = $2)',
        [name, slug || '']
      );

      if (userCheckRes.rows.length > 0) {
        const userExistingId = userCheckRes.rows[0].id;
        await query(
          `UPDATE user_tools SET
            name = $1, slug = $2, short_description = $3, description = $4, use_case = $5,
            key_features = $6, search_keywords = $7, url = $8, logo_url = $9,
            category_id = $10, category_name = $11, category_icon = $12, sub_category = $13, micro_category = $14,
            pricing_model = $15, pricing_details = $16,
            developer_name = $17, model_version = $18, platform_type = $19, launch_date = $20,
            tool_status = $21, is_featured = $22, integrations = $23, rating = $24, tags = $25, source = $26
          WHERE id = $27`,
          [
            name, slug, short_description, description, use_case,
            JSON.stringify(key_features || []), JSON.stringify(search_keywords || []), url, logo_url,
            resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,
            pricing_model, pricing_details,
            developer_name, model_version, platform_type, launch_date,
            tool_status, isFeatured, JSON.stringify(integrations || []), parsedRating, JSON.stringify(tags || []), source || 'manual',
            userExistingId
          ]
        );
      } else {
        await query(
          `INSERT INTO user_tools (
            name, slug, short_description, description, use_case,
            key_features, search_keywords, url, logo_url,
            category_id, category_name, category_icon, sub_category, micro_category,
            pricing_model, pricing_details,
            developer_name, model_version, platform_type, launch_date,
            tool_status, is_featured, integrations, rating, tags, source
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9,
            $10, $11, $12, $13, $14,
            $15, $16, $17,
            $18, $19, $20, $21,
            $22, $23, $24, $25, $26
          )`,
          [
            name, slug, short_description, description, use_case,
            JSON.stringify(key_features || []), JSON.stringify(search_keywords || []), url, logo_url,
            resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,
            pricing_model, pricing_details,
            developer_name, model_version, platform_type, launch_date,
            tool_status, isFeatured, JSON.stringify(integrations || []), parsedRating, JSON.stringify(tags || []), source || 'manual'
          ]
        );
      }
      results.success++;
    } catch (err: any) {
      results.failed++;
      results.errors.push(`Tool "${name}": ${err.message}`);
    }
  }

  await triggerRealTimeUpdate();

  if (io && results.success > 0) {
    io.emit('notification', {
      title: 'Bulk Import Completed',
      desc: `Successfully integrated ${results.success} new assets.`,
      type: 'database',
      roles: ['owner']
    });
  }

  res.json({
    success: true,
    message: `Processed bulk upload: ${results.success} integrated, ${results.failed} failed.`,
    results
  });
});

// Add a new neural catalog asset manually
router.post('/', authorize(['owner']), async (req, res) => {
  const { 
    name, slug, short_description, description, use_case,
    key_features, search_keywords, url, logo_url,
    category_id, category_name, category_icon, sector_id, sub_category, micro_category,
    sector_name, sector_icon, pricing_model, pricing_details,
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

    await query(
      `INSERT INTO ai_tools (
        name, slug, short_description, description, use_case,
        key_features, search_keywords, url, logo_url,
        category_id, category_name, category_icon, sub_category, micro_category,
        pricing_model, pricing_details,
        developer_name, model_version, platform_type, launch_date,
        tool_status, is_featured, integrations, rating, tags, source
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        $15, $16,
        $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26
      )`,
      [
        name, slug, short_description, description, use_case,
        JSON.stringify(key_features || []), JSON.stringify(search_keywords || []), url, logo_url,
        resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,
            pricing_model, pricing_details,
        developer_name, model_version, platform_type, launch_date,
        tool_status, isFeatured, JSON.stringify(integrations || []), parsedRating, JSON.stringify(tags || []), source || 'manual'
      ]
    );

    // DUAL-INSERT: Also add to user_tools so it shows in My Registry
    await query(
      `INSERT INTO user_tools (
        name, slug, short_description, description, use_case,
        key_features, search_keywords, url, logo_url,
        category_id, category_name, category_icon, sub_category, micro_category,
        pricing_model, pricing_details,
        developer_name, model_version, platform_type, launch_date,
        tool_status, is_featured, integrations, rating, tags, source
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        $15, $16,
        $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26
      )`,
      [
        name, slug, short_description, description, use_case,
        JSON.stringify(key_features || []), JSON.stringify(search_keywords || []), url, logo_url,
        resolvedCategoryId, resolvedCategoryName, resolvedCategoryIcon, sub_category, micro_category,
            pricing_model, pricing_details,
        developer_name, model_version, platform_type, launch_date,
        tool_status, isFeatured, JSON.stringify(integrations || []), parsedRating, JSON.stringify(tags || []), source || 'manual'
      ]
    );

    await triggerRealTimeUpdate();

    if (io) {
      io.emit('notification', {
        title: 'New Tool Added',
        desc: `Asset "${name}" integrated successfully.`,
        type: 'zap',
        roles: ['owner', 'member']
      });
    }

    res.json({ success: true, message: 'Intelligence asset integrated into matrix.' });
  } catch (err) {
    console.error('Add Tool Error:', err);
    res.status(500).json({ message: 'Failed to integrate neural node.' });
  }
});

// Quantum Gateway Proxy to bypass X-Frame-Options frame restriction
router.get('/gateway/proxy', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Target URL parameter is required.');
  }

  try {
    const urlObj = new URL(targetUrl);
    const hostname = urlObj.hostname;
    const isInternal = /^(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+)$/.test(hostname) || hostname.endsWith('.local');
    if (isInternal) {
      return res.status(403).send('Gateway Proxy Refused: Target destination is restricted.');
    }
  } catch (err) {
    return res.status(400).send('Invalid Target URL.');
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    let html = await response.text();

    // Inject base tag so all relative assets (images, css, scripts) resolve against target host
    const baseTag = `<base href="${targetUrl}">`;
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}`);
    } else if (html.includes('<HEAD>')) {
      html = html.replace('<HEAD>', `<HEAD>${baseTag}`);
    } else {
      html = baseTag + html;
    }

    // We only remove X-Frame-Options to allow framing. 
    // Do NOT strip CSP or other headers blindly to prevent XSS.
    res.removeHeader('X-Frame-Options');

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.send(html);
  } catch (err: any) {
    console.error('Gateway Iframe Proxy Error:', err);
    res.status(500).send(`Quantum Proxy Link Refused: ${err.message}`);
  }
});

// Fetch a single tool by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM ai_tools WHERE id = $1 AND is_archived = false', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Intelligence asset not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch Tool ID Error:', err);
    res.status(500).json({ message: 'Intelligence node mapping failed.' });
  }
});

// Update asset protocols
router.patch('/:id', authorize(['owner']), async (req, res) => {
  const { id } = req.params;
  const { 
    name, slug, short_description, description, use_case,
    key_features, search_keywords, url, logo_url,
    category_id, category_name, category_icon, sub_category, micro_category,
    pricing_model, pricing_details,
    developer_name, model_version, platform_type, launch_date,
    tool_status, is_featured, integrations, rating, tags,
    is_archived, is_active
  } = req.body;

  try {
    const oldToolRes = await query('SELECT name, slug FROM ai_tools WHERE id = $1', [id]);
    const oldName = oldToolRes.rows[0]?.name;
    const oldSlug = oldToolRes.rows[0]?.slug;

    // Resolve Category dependencies if category name or ID is supplied
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

    // Build highly robust dynamic UPDATE query
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
    addField('sub_category', sub_category);
    addField('micro_category', micro_category);

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
      const queryStr = `UPDATE ai_tools SET ${updateFields.join(', ')} WHERE id = $${params.length}`;
      await query(queryStr, params);

      // Sync update to user_tools
      let targetId = null;
      if (oldSlug) {
        const targetRes = await query('SELECT id FROM user_tools WHERE slug = $1', [oldSlug]);
        if (targetRes.rows.length > 0) {
          targetId = targetRes.rows[0].id;
        }
      }
      if (!targetId && oldName) {
        const targetRes = await query('SELECT id FROM user_tools WHERE name = $1', [oldName]);
        if (targetRes.rows.length > 0) {
          targetId = targetRes.rows[0].id;
        }
      }

      if (targetId) {
        const targetParams = [...params];
        targetParams[targetParams.length - 1] = targetId;
        const targetQueryStr = `UPDATE user_tools SET ${updateFields.join(', ')} WHERE id = $${targetParams.length}`;
        await query(targetQueryStr, targetParams);
      }
    }
    
    await triggerRealTimeUpdate();
    res.json({ success: true, message: 'Asset protocols updated.' });
  } catch (err) {
    console.error('PATCH Asset Error:', err);
    res.status(500).json({ message: 'Protocol update failed.' });
  }
});

// Delete an asset permanently
router.delete('/:id', authorize(['owner']), async (req, res) => {
  const { id } = req.params;
  try {
    const oldToolRes = await query('SELECT name, slug FROM ai_tools WHERE id = $1', [id]);
    const oldName = oldToolRes.rows[0]?.name;
    const oldSlug = oldToolRes.rows[0]?.slug;

    await query('DELETE FROM ai_tools WHERE id = $1', [id]);

    if (oldSlug) {
      await query('DELETE FROM user_tools WHERE slug = $1', [oldSlug]);
    } else if (oldName) {
      await query('DELETE FROM user_tools WHERE name = $1', [oldName]);
    }

    await triggerRealTimeUpdate();
    res.json({ success: true, message: 'Asset permanently terminated from registry.' });
  } catch (err) {
    res.status(500).json({ message: 'Termination protocol failed.' });
  }
});

export default router;
