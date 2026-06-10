import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seedAll() {
  try {
    console.log('=== GLOBAL SEEDING PROTOCOL INITIATED ===');

    // 1. Load sectors, categories, and tools JSON files from local seed-data directory

    const categoriesPath = path.resolve(__dirname, './seed-data/ai_tools_categories.json');
    const toolsPath = path.resolve(__dirname, './seed-data/ai_tools_all_1271.json');

    console.log(`Loading categories from ${categoriesPath}...`);
    if (!fs.existsSync(categoriesPath)) throw new Error('Categories file not found.');
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8')).categories;

    console.log(`Loading tools from ${toolsPath}...`);
    if (!fs.existsSync(toolsPath)) throw new Error('Tools file not found.');
    const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8')).tools;

    console.log(`Loaded ${categoriesData.length} categories, and ${toolsData.length} tools.`);

    // 2. Clear current records to avoid conflicts
    console.log('Purging existing taxonomy and catalog tables...');
    await pool.query('TRUNCATE TABLE ai_tools RESTART IDENTITY CASCADE;');
    await pool.query('TRUNCATE TABLE categories RESTART IDENTITY CASCADE;');


    console.log('Seeding categories table...');
    for (const cat of categoriesData) {
      await pool.query(
        `INSERT INTO categories (id, name, description, icon) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon`,
        [cat.category_id, cat.category_name, cat.category_name, cat.category_icon || '📦']
      );
    }
    console.log('Categories table successfully seeded.');

    // 5. Seed Tools
    console.log('Seeding ai_tools table in chunks...');
    const columns = [
      'name', 'slug', 'short_description', 'description', 'use_case',
      'key_features', 'search_keywords', 'url', 'logo_url',
      'category_id', 'category_name', 'category_icon', 
      'pricing_model', 'pricing_details',
      'developer_name', 'model_version', 'platform_type', 'launch_date',
      'tool_status', 'is_featured', 'integrations', 'rating', 'tags', 'source'
    ];

    // Bulk insert chunking logic to stay within parameter limits (max 65535 parameters in pg)
    const chunkSize = 100;
    for (let index = 0; index < toolsData.length; index += chunkSize) {
      const chunk = toolsData.slice(index, index + chunkSize);
      const valueRows: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      for (const tool of chunk) {
        const {
          name, slug, short_description, description, use_case,
          key_features, search_keywords, website_url, logo_url,
          category_id, category_name, category_icon, 
          pricing_type, pricing_details,
          developer_name, ai_model_used, platform_support, launch_date,
          tool_status, is_featured, integrations, rating, tags
        } = tool;

        const isFeatured = is_featured === true || is_featured === 'true' || is_featured === 'Yes';
        const parsedRating = parseFloat(rating) || 4.5;
        const platformType = Array.isArray(platform_support) ? platform_support.join(', ') : (platform_support || 'Web');

        const rowParams: string[] = [];
        const rowValues = [
          name || 'Unnamed Tool',
          slug || '',
          short_description || '',
          description || '',
          use_case || '',
          JSON.stringify(key_features || []),
          JSON.stringify(search_keywords || []),
          website_url || '',
          logo_url || null,
          category_id || '',
          category_name || '',
          category_icon || '📦',
          pricing_type || 'Free',
          pricing_details || 'Free',
          developer_name || '',
          ai_model_used || '',
          platformType,
          launch_date || '',
          tool_status || 'active',
          isFeatured,
          JSON.stringify(integrations || []),
          parsedRating,
          JSON.stringify(tags || []),
          'seeded'
        ];

        for (let i = 0; i < rowValues.length; i++) {
          rowParams.push(`$${paramIndex++}`);
          values.push(rowValues[i]);
        }
        
        valueRows.push(`(${rowParams.join(', ')})`);
      }

      const queryText = `INSERT INTO ai_tools (${columns.join(', ')}) VALUES ${valueRows.join(', ')}`;
      await pool.query(queryText, values);
      console.log(`Seeded tools index range: ${index} to ${index + chunk.length - 1}`);
    }

    console.log('\n======================================================');
    console.log('DATABASE SEEDING COMPLETE: GLOBAL TAXONOMY INITIALIZED');
    console.log(`Seeded: ${categoriesData.length} Categories, ${toolsData.length} Tools.`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('Database seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seedAll();
