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

const BATCH_PORTIONS_SQL = `
-- Get category IDs
DO $$
DECLARE
    bbq_id UUID;
    mandhi_id UUID;
BEGIN
    SELECT id INTO bbq_id FROM categories WHERE LOWER(name) LIKE '%bbq%' LIMIT 1;
    SELECT id INTO mandhi_id FROM categories WHERE LOWER(name) LIKE '%mandhi%' LIMIT 1;

    -- Delete old single entries to avoid duplicate clutter
    DELETE FROM menu_items WHERE LOWER(name) LIKE '%al-faham%' AND name NOT LIKE '%(%';

    -- Insert Al-Faham BBQ Portions (Quarter / Half / Full)
    INSERT INTO menu_items (category_id, name, price, image_url, is_available) VALUES
    (bbq_id, 'Normal Al-Faham (Quarter)', 140, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500', true),
    (bbq_id, 'Normal Al-Faham (Half)', 260, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500', true),
    (bbq_id, 'Normal Al-Faham (Full)', 480, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500', true),

    (bbq_id, 'Peri Peri Al-Faham (Quarter)', 150, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', true),
    (bbq_id, 'Peri Peri Al-Faham (Half)', 270, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', true),
    (bbq_id, 'Peri Peri Al-Faham (Full)', 480, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', true),

    (bbq_id, 'BBQ Al-Faham (Quarter)', 180, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500', true),
    (bbq_id, 'BBQ Al-Faham (Half)', 340, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500', true),
    (bbq_id, 'BBQ Al-Faham (Full)', 640, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500', true),

    (bbq_id, 'Pepper Al-Faham (Quarter)', 150, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500', true),
    (bbq_id, 'Pepper Al-Faham (Half)', 270, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500', true),
    (bbq_id, 'Pepper Al-Faham (Full)', 640, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500', true),

    (bbq_id, 'Turkish Al-Faham (Quarter)', 180, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true),
    (bbq_id, 'Turkish Al-Faham (Half)', 340, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true),
    (bbq_id, 'Turkish Al-Faham (Full)', 640, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true),

    (bbq_id, 'Honey Al-Faham (Quarter)', 180, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500', true),
    (bbq_id, 'Honey Al-Faham (Half)', 340, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500', true),
    (bbq_id, 'Honey Al-Faham (Full)', 640, 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500', true),

    (bbq_id, 'Kandhari Al-Faham (Quarter)', 180, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500', true),
    (bbq_id, 'Kandhari Al-Faham (Half)', 340, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500', true),
    (bbq_id, 'Kandhari Al-Faham (Full)', 640, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500', true),

    -- Insert Al-Faham Mandhi Portions (Quarter / Half / Full)
    (mandhi_id, 'Normal Mandhi (Quarter)', 200, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Normal Mandhi (Half)', 400, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Normal Mandhi (Full)', 740, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),

    (mandhi_id, 'Peri Peri Mandhi (Quarter)', 220, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Peri Peri Mandhi (Half)', 420, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Peri Peri Mandhi (Full)', 760, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),

    (mandhi_id, 'BBQ Mandhi (Quarter)', 240, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'BBQ Mandhi (Half)', 440, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'BBQ Mandhi (Full)', 830, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),

    (mandhi_id, 'Pepper Mandhi (Quarter)', 220, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Pepper Mandhi (Half)', 420, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Pepper Mandhi (Full)', 760, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),

    (mandhi_id, 'Turkish Mandhi (Quarter)', 240, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Turkish Mandhi (Half)', 440, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Turkish Mandhi (Full)', 830, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),

    (mandhi_id, 'Kandhari Mandhi (Quarter)', 240, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Kandhari Mandhi (Half)', 440, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true),
    (mandhi_id, 'Kandhari Mandhi (Full)', 830, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true)
    ON CONFLICT (id) DO NOTHING;
END $$;
`;

async function fastPortions() {
  console.log('🚀 Executing fast portion insertion...');
  await client.connect();
  try {
    await client.query(BATCH_PORTIONS_SQL);
    console.log('🎉 SUCCESS! Batch inserted all Quarter, Half & Full portion choices for Al-Faham & Mandhi!');
  } catch (err) {
    console.error('✖ Error in portion insertion:', err.message);
  } finally {
    await client.end();
  }
}

fastPortions();
