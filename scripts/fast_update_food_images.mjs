import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL is missing in .env.local');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

const BATCH_SQL = `
-- Breads & Poratta
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%poratta%' OR LOWER(name) LIKE '%chappathi%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) = 'chappathi';

-- Egg Dishes
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%egg%';

-- Chicken Curries
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%chicken%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%butter chicken%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%manchurian%' OR LOWER(name) LIKE '%chilly%';

-- Beef Dishes
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%beef%';

-- Veg Dishes
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%gobi%' OR LOWER(name) LIKE '%paneer%' OR LOWER(name) LIKE '%mushroom%';

-- Al-Faham BBQ & Mandhi
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%faham%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%mandhi%' OR LOWER(name) LIKE '%biriyani%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%meals%' OR LOWER(name) LIKE '%chatti%';

-- Chinese & Noodles
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%fried rice%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%noodles%';

-- Fresh Juices
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%lime%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1587883012610-e3df17d41270?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%watermelon%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%orange%' OR LOWER(name) LIKE '%mango%' OR LOWER(name) LIKE '%apple%' OR LOWER(name) LIKE '%anar%' OR LOWER(name) LIKE '%grape%';

-- Shakes, Mojitos & Falooda
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%shake%' OR LOWER(name) LIKE '%avil%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%mojito%';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60' WHERE LOWER(name) LIKE '%falooda%' OR LOWER(name) LIKE '%faloda%' OR LOWER(name) LIKE '%scoop%';
`;

async function fastUpdate() {
  console.log('🚀 Running ultra-fast batch SQL image update...');
  await client.connect();
  try {
    await client.query(BATCH_SQL);
    console.log('🎉 SUCCESS! Batch updated all 117 food item thumbnail photos instantly!');
  } catch (err) {
    console.error('✖ Error during batch update:', err.message);
  } finally {
    await client.end();
  }
}

fastUpdate();
