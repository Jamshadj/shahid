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

// Image Mapping by Keyword / Category
function getImageUrlForItem(itemName, categoryName) {
  const name = itemName.toLowerCase();
  const cat = categoryName.toLowerCase();

  // Breads / Poratta
  if (name.includes('poratta') || name.includes('chappathi')) {
    return 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=60';
  }
  
  // Egg
  if (name.includes('egg')) {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60';
  }

  // Al-Faham / BBQ / Grilled
  if (cat.includes('faham') || name.includes('faham') || name.includes('bbq')) {
    if (cat.includes('mandhi') || name.includes('mandhi')) {
      return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60';
    }
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60';
  }

  // Mandhi
  if (cat.includes('mandhi') || name.includes('mandhi')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60';
  }

  // Biriyani
  if (name.includes('biriyani') || cat.includes('biriyani')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60';
  }

  // Meals / Chatti Choor
  if (name.includes('meals') || name.includes('chatti')) {
    return 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=60';
  }

  // Beef
  if (name.includes('beef')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60';
  }

  // Chicken Gravy / Butter Chicken / Kadai
  if (name.includes('butter chicken')) {
    return 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=60';
  }
  if (name.includes('manchurian') || name.includes('chilly') || name.includes('65')) {
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60';
  }
  if (name.includes('chicken') || cat.includes('non veg')) {
    return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60';
  }

  // Veg Curry / Paneer / Gobi
  if (name.includes('paneer') || name.includes('gobi') || cat.includes('veg curry')) {
    return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60';
  }

  // Fried Rice / Noodles
  if (name.includes('rice') || name.includes('noodles') || cat.includes('chinese')) {
    return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60';
  }

  // Shakes / Avil Milk
  if (cat.includes('shake') || name.includes('shake') || name.includes('avil')) {
    return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60';
  }

  // Mojitos
  if (cat.includes('mojito') || name.includes('mojito')) {
    return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60';
  }

  // Juice
  if (cat.includes('juice') || name.includes('juice') || name.includes('lime')) {
    return 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60';
  }

  // Falooda & Ice Cream
  if (cat.includes('falooda') || name.includes('falooda') || name.includes('ice cream')) {
    return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60';
  }

  // Default Food fallback
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60';
}

async function updateFoodImages() {
  console.log('🚀 Connecting to database to populate dish thumbnail photos...');
  await client.connect();

  try {
    const { rows: items } = await client.query(`
      SELECT m.id, m.name, c.name as category_name 
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
    `);

    console.log(`Found ${items.length} food items. Updating image URLs...`);

    let updatedCount = 0;
    for (const item of items) {
      const imageUrl = getImageUrlForItem(item.name, item.category_name || '');
      await client.query(
        'UPDATE menu_items SET image_url = $1 WHERE id = $2',
        [imageUrl, item.id]
      );
      updatedCount++;
    }

    console.log(`🎉 SUCCESS! Updated ${updatedCount} food item image URLs with vibrant food photos!`);
  } catch (err) {
    console.error('✖ Error updating food images:', err.message);
  } finally {
    await client.end();
  }
}

updateFoodImages();
