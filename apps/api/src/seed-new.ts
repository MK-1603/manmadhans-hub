import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const ownersToSeed = [
  {
    "id": 13,
    "display_id": "OID-003",
    "username": "SS0778",
    "email": "shriramss0778@gmail.com",
    "role": "owner",
    "status": "Pending"
  },
  {
    "id": 12,
    "display_id": "OID-002",
    "username": "MK1603",
    "email": "saikrishnanmk1603@gmail.com",
    "role": "owner",
    "status": "Active"
  },
  {
    "id": 3,
    "display_id": "OID-001",
    "username": "MM1107",
    "email": "hemanthmm1107@gmail.com",
    "role": "owner",
    "status": "Active"
  }
];

async function seedData() {
  try {
    console.log('=== SEEDING NEW DATA PROTOCOL ===');

    // 1. Seed Owners
    console.log('Seeding owners...');
    const defaultPassword = 'Welcome@123';
    const hashedPass = await bcrypt.hash(defaultPassword, 10);
    
    for (const owner of ownersToSeed) {
      await pool.query(
        `INSERT INTO users (id, email, username, passkey, role, must_change_password) 
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (id) DO UPDATE SET 
         email = EXCLUDED.email, 
         username = EXCLUDED.username, 
         role = EXCLUDED.role;`,
        [owner.id, owner.email, owner.username, hashedPass, owner.role]
      );
    }
    console.log(`Seeded ${ownersToSeed.length} owners.`);

    // 2. Load Tools
    const toolsPath = path.resolve("d:\\manmadhans-hub\\AI_Tools_Schema_Fixed.json");
    console.log(`Loading tools from ${toolsPath}...`);
    
    const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    console.log(`Loaded ${toolsData.length} tools from JSON.`);

    // Purge existing tools if needed? The user said "now load all the ai tools...".
    // I will truncate ai_tools first just in case? Or just insert.
    // They already truncated everything in the previous step. So it's fresh.
    console.log('Seeding ai_tools table in chunks...');
    
    const columns = [
      'name', 'slug', 'short_description', 'description', 'use_case',
      'key_features', 'search_keywords', 'url', 'logo_url',
      'category_id', 'category_name', 'category_icon', 
      'pricing_model', 'pricing_details',
      'developer_name', 'model_version', 'platform_type', 'launch_date',
      'tool_status', 'is_featured', 'integrations', 'rating', 'tags', 'source'
    ];

    const chunkSize = 100;
    for (let index = 0; index < toolsData.length; index += chunkSize) {
      const chunk = toolsData.slice(index, index + chunkSize);
      const valueRows: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      for (const tool of chunk) {
        const {
          name, slug, short_description, description, use_case,
          key_features, search_keywords, website_url, url, logo_url,
          category_id, category_name, category_icon, 
          pricing_type, pricing_model, pricing_details,
          developer_name, ai_model_used, model_version, platform_support, platform_type, launch_date,
          tool_status, is_featured, integrations, rating, tags, source
        } = tool;

        const finalUrl = url || website_url || '';
        const finalPricingModel = pricing_model || pricing_type || 'Free';
        const finalModelVersion = model_version || ai_model_used || '';
        
        let pType = platform_type || platform_support || 'Web';
        const finalPlatformType = Array.isArray(pType) ? pType.join(', ') : pType;

        const isFeaturedBool = is_featured === true || is_featured === 'true' || is_featured === 'Yes';
        const parsedRating = parseFloat(rating) || 4.5;

        const rowParams: string[] = [];
        const rowValues = [
          name || 'Unnamed Tool',
          slug || '',
          short_description || '',
          description || '',
          use_case || '',
          JSON.stringify(key_features || []),
          JSON.stringify(search_keywords || []),
          finalUrl,
          logo_url || null,
          category_id || '',
          category_name || '',
          category_icon || '📦',
          finalPricingModel,
          pricing_details || 'Free',
          developer_name || '',
          finalModelVersion,
          finalPlatformType,
          launch_date || '',
          tool_status || 'active',
          isFeaturedBool,
          JSON.stringify(integrations || []),
          parsedRating,
          JSON.stringify(tags || []),
          source || 'seeded'
        ];

        for (let i = 0; i < rowValues.length; i++) {
          rowParams.push(`$${paramIndex++}`);
          values.push(rowValues[i]);
        }
        
        valueRows.push(`(${rowParams.join(', ')})`);
      }

      const queryText = `INSERT INTO ai_tools (${columns.join(', ')}) VALUES ${valueRows.join(', ')}`;
      await pool.query(queryText, values);
      console.log(`Seeded tools index range: ${index} to ${Math.min(index + chunk.length - 1, toolsData.length - 1)}`);
    }

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seedData();
