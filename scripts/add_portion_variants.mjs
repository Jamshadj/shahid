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

const AL_FAHAM_VARIANTS = [
  // Normal
  { name: 'Normal Al-Faham (Quarter)', price: 140, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60' },
  { name: 'Normal Al-Faham (Half)', price: 260, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60' },
  { name: 'Normal Al-Faham (Full)', price: 480, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60' },

  // Peri Peri
  { name: 'Peri Peri Al-Faham (Quarter)', price: 150, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=60' },
  { name: 'Peri Peri Al-Faham (Half)', price: 270, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=60' },
  { name: 'Peri Peri Al-Faham (Full)', price: 480, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=60' },

  // BBQ
  { name: 'BBQ Al-Faham (Quarter)', price: 180, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&auto=format&fit=crop&q=60' },
  { name: 'BBQ Al-Faham (Half)', price: 340, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&auto=format&fit=crop&q=60' },
  { name: 'BBQ Al-Faham (Full)', price: 640, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&auto=format&fit=crop&q=60' },

  // Pepper
  { name: 'Pepper Al-Faham (Quarter)', price: 150, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=60' },
  { name: 'Pepper Al-Faham (Half)', price: 270, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=60' },
  { name: 'Pepper Al-Faham (Full)', price: 640, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=60' },

  // Turkish
  { name: 'Turkish Al-Faham (Quarter)', price: 180, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' },
  { name: 'Turkish Al-Faham (Half)', price: 340, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' },
  { name: 'Turkish Al-Faham (Full)', price: 640, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60' },

  // Honey
  { name: 'Honey Al-Faham (Quarter)', price: 180, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60' },
  { name: 'Honey Al-Faham (Half)', price: 340, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60' },
  { name: 'Honey Al-Faham (Full)', price: 640, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60' },

  // Honey Chilly
  { name: 'Honey Chilly Al-Faham (Quarter)', price: 180, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60' },
  { name: 'Honey Chilly Al-Faham (Half)', price: 340, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60' },
  { name: 'Honey Chilly Al-Faham (Full)', price: 640, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60' },

  // Kandhari
  { name: 'Kandhari Al-Faham (Quarter)', price: 180, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60' },
  { name: 'Kandhari Al-Faham (Half)', price: 340, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60' },
  { name: 'Kandhari Al-Faham (Full)', price: 640, cat: 'Al-Faham BBQ', img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60' },

  // Mandhi Variants
  { name: 'Normal Mandhi (Quarter)', price: 200, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Normal Mandhi (Half)', price: 400, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Normal Mandhi (Full)', price: 740, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },

  { name: 'Peri Peri Mandhi (Quarter)', price: 220, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Peri Peri Mandhi (Half)', price: 420, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Peri Peri Mandhi (Full)', price: 760, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },

  { name: 'BBQ Mandhi (Quarter)', price: 240, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'BBQ Mandhi (Half)', price: 440, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'BBQ Mandhi (Full)', price: 830, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },

  { name: 'Pepper Mandhi (Quarter)', price: 220, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Pepper Mandhi (Half)', price: 420, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Pepper Mandhi (Full)', price: 760, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },

  { name: 'Turkish Mandhi (Quarter)', price: 240, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Turkish Mandhi (Half)', price: 440, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Turkish Mandhi (Full)', price: 830, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },

  { name: 'Honey Mandhi (Quarter)', price: 240, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Honey Mandhi (Half)', price: 440, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Honey Mandhi (Full)', price: 830, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },

  { name: 'Kandhari Mandhi (Quarter)', price: 240, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Kandhari Mandhi (Half)', price: 440, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
  { name: 'Kandhari Mandhi (Full)', price: 830, cat: 'Al-Faham Mandhi', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
];

async function addPortions() {
  console.log('🚀 Adding Quarter, Half & Full portion variants to Supabase...');
  await client.connect();

  try {
    const { rows: categories } = await client.query('SELECT id, name FROM categories;');
    const bBqCat = categories.find((c) => c.name.toLowerCase().includes('bbq'))?.id;
    const mandhiCat = categories.find((c) => c.name.toLowerCase().includes('mandhi'))?.id;

    let addedCount = 0;
    for (const v of AL_FAHAM_VARIANTS) {
      const categoryId = v.cat === 'Al-Faham BBQ' ? bBqCat : mandhiCat;
      if (!categoryId) continue;

      // Check if exists
      const { rows: existing } = await client.query(
        'SELECT id FROM menu_items WHERE name = $1',
        [v.name]
      );

      if (existing.length === 0) {
        await client.query(
          `INSERT INTO menu_items (category_id, name, price, image_url, is_available)
           VALUES ($1, $2, $3, $4, true)`,
          [categoryId, v.name, v.price, v.img]
        );
        addedCount++;
      } else {
        await client.query(
          `UPDATE menu_items SET price = $1, image_url = $2 WHERE name = $3`,
          [v.price, v.img, v.name]
        );
      }
    }

    console.log(`🎉 SUCCESS! Updated/Added ${addedCount} portion variants (Quarter, Half, Full) for Al-Faham & Mandhi!`);
  } catch (err) {
    console.error('✖ Error adding portions:', err.message);
  } finally {
    await client.end();
  }
}

addPortions();
