import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    console.log('=== STARTING FIXED SCHEMA IMPORT ===');

    // 1. Add missing columns
    console.log('Adding sub_category and micro_category columns to ai_tools...');
    await pool.query(`ALTER TABLE ai_tools ADD COLUMN IF NOT EXISTS sub_category VARCHAR(255);`);
    await pool.query(`ALTER TABLE ai_tools ADD COLUMN IF NOT EXISTS micro_category VARCHAR(255);`);
    console.log('Columns ensured.');

    // 2. Read the fixed JSON
    const jsonPath = "d:\\manmadhans-hub\\AI_Tools_Schema_Fixed.json";
    console.log(`Reading from ${jsonPath}...`);
    const toolsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${toolsData.length} tools.`);

    // 3. Extract unique categories
    const categoriesMap = new Map();
    for (const tool of toolsData) {
      if (tool.category_id && tool.category_name) {
        if (!categoriesMap.has(tool.category_id)) {
          categoriesMap.set(tool.category_id, {
            id: tool.category_id,
            name: tool.category_name
          });
        }
      }
    }
    const categoriesList = Array.from(categoriesMap.values());
    console.log(`Extracted ${categoriesList.length} unique categories.`);

    // 4. Truncate tables
    console.log('Truncating tables...');
    await pool.query('TRUNCATE TABLE ai_tools RESTART IDENTITY CASCADE;');
    await pool.query('TRUNCATE TABLE categories RESTART IDENTITY CASCADE;');

    // 5. Insert categories
    console.log('Inserting categories...');
    for (const cat of categoriesList) {
      await pool.query(
        `INSERT INTO categories (id, name, description, icon) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [cat.id, cat.name, cat.name, '📦']
      );
    }

    // 6. Insert tools in chunks
    console.log('Inserting tools...');
    const columns = [
      'name', 'slug', 'short_description', 'description', 'use_case',
      'key_features', 'search_keywords', 'url', 'logo_url',
      'category_id', 'category_name', 'category_icon', 
      'sub_category', 'micro_category',
      'pricing_model', 'pricing_details',
      'developer_name', 'model_version', 'platform_type', 'launch_date',
      'tool_status', 'is_featured', 'integrations', 'rating', 'tags', 'source'
    ];

    const chunkSize = 100;
    for (let index = 0; index < toolsData.length; index += chunkSize) {
      const chunk = toolsData.slice(index, index + chunkSize);
      const valueRows = [];
      const values = [];
      let paramIndex = 1;

      for (const tool of chunk) {
        const platformType = Array.isArray(tool.platform_support) 
          ? tool.platform_support.join(', ') 
          : (tool.platform_support || 'Web');

        const rowParams = [];
        const rowValues = [
          tool.name || 'Unnamed Tool',
          tool.slug || '',
          tool.short_description || '',
          tool.description || '',
          tool.use_case || '',
          JSON.stringify(tool.key_features || []),
          JSON.stringify(tool.search_keywords || []),
          tool.website_url || '',
          tool.logo_url || null,
          tool.category_id || '',
          tool.category_name || '',
          '📦', // category_icon
          tool.sub_category || '',
          tool.micro_category || '',
          tool.pricing_type || 'Free',
          tool.pricing_details || 'Free',
          tool.developer_name || '',
          tool.ai_model_used || '',
          platformType,
          tool.launch_date || '',
          tool.tool_status || 'active',
          tool.featured === true || tool.featured === 'true',
          JSON.stringify(tool.integrations || []),
          parseFloat(tool.rating) || 4.5,
          JSON.stringify(tool.tags || []),
          'fixed_schema'
        ];

        for (let i = 0; i < rowValues.length; i++) {
          rowParams.push(`$${paramIndex++}`);
          values.push(rowValues[i]);
        }
        
        valueRows.push(`(${rowParams.join(', ')})`);
      }

      const queryText = `INSERT INTO ai_tools (${columns.join(', ')}) VALUES ${valueRows.join(', ')}`;
      await pool.query(queryText, values);
      console.log(`Inserted tools ${index} to ${index + chunk.length - 1}`);
    }

    console.log('=== SEEDING COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('ERROR during import:', err);
  } finally {
    await pool.end();
  }
}

run();
