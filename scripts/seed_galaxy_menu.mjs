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

const GALAXY_STORE = {
  restaurant_name: 'Galaxy Bamboo Hut Restaurant',
  phone_number: '+91 9946238246, +91 7511104923',
  address: 'Ayyappankavu, Vandithavalam',
  tax_rate_percent: 5.0,
  tax_number_gst: '32AAACG1234F1Z5',
  currency_symbol: '₹',
  thermal_printer_width: '80mm',
};

const CATEGORIES_WITH_ITEMS = [
  {
    name: 'Poratta & Breads',
    display_order: 1,
    items: [
      { name: 'Poratta', price: 15, description: 'Classic Kerala layered flaky poratta' },
      { name: 'Chappathi', price: 15, description: 'Soft wheat chappathi' },
      { name: 'Wheat Poratta', price: 18, description: 'Healthy wheat layered poratta' },
      { name: 'Nool Poratta', price: 22, description: 'Stringed thread poratta' },
      { name: 'Egg Roast Single', price: 30, description: 'Spiced egg roast gravy single' },
      { name: 'Egg Roast Full', price: 50, description: 'Spiced egg roast gravy double egg' },
      { name: 'Chicken Curry', price: 100, description: 'Traditional Kerala style chicken curry' },
      { name: 'Beef Curry', price: 100, description: 'Spicy Kerala style beef curry' },
    ],
  },
  {
    name: 'Non Veg Curry',
    display_order: 2,
    items: [
      { name: 'Chicken Manchurian', price: 140, description: 'Indo-Chinese chicken manchurian' },
      { name: 'Chilly Chicken Gravy', price: 140, description: 'Spicy chilly chicken with thick gravy' },
      { name: 'Pepper Chicken', price: 150, description: 'Black pepper infused chicken fry' },
      { name: 'Garlic Chicken', price: 170, description: 'Garlic roasted chicken gravy' },
      { name: 'Chicken Kondattam', price: 170, description: 'Kerala style sun-dried chili spiced chicken' },
      { name: 'Butter Chicken', price: 180, description: 'Rich tomato butter cream chicken' },
      { name: 'Kadai Chicken', price: 180, description: 'Wok tossed chicken with bell peppers' },
      { name: 'Ginger Chicken', price: 170, description: 'Ginger infused chicken wok dish' },
      { name: 'Chicken Chilly (65) Q', price: 140, description: 'Crispy fried chicken 65 quarter' },
      { name: 'Chicken Chilly (65) 1/2', price: 220, description: 'Crispy fried chicken 65 half' },
      { name: 'Chicken Chilly (65) Full', price: 400, description: 'Crispy fried chicken 65 full' },
      { name: 'Beef Chilly Dry Fry', price: 150, description: 'Spicy dry fried beef chili' },
      { name: 'Beef Chilly Gravy', price: 170, description: 'Beef chili tossed in spicy gravy' },
      { name: 'Beef Roast', price: 130, description: 'Slow-roasted spicy Kerala beef' },
      { name: 'Beef Kondattam', price: 190, description: 'Special dry chili beef kondattam' },
      { name: 'Beef Fry', price: 110, description: 'Classic Kerala beef fry (BDF)' },
    ],
  },
  {
    name: 'Veg Curry',
    display_order: 3,
    items: [
      { name: 'Gobi Manchurian', price: 100, description: 'Crispy cauliflower manchurian' },
      { name: 'Mushroom Manchurian', price: 120, description: 'Button mushroom manchurian' },
      { name: 'Chilly Gobi Gravy', price: 100, description: 'Cauliflower chili gravy' },
      { name: 'Mushroom Masala', price: 130, description: 'Mushroom cooked in rich gravy' },
      { name: 'Chilly Gobi Dry', price: 120, description: 'Crispy dry chili cauliflower' },
      { name: 'Paneer Manchurian', price: 140, description: 'Cottage cheese manchurian' },
      { name: 'Paneer Butter Masala', price: 160, description: 'Creamy butter paneer gravy' },
      { name: 'Green Peas Curry', price: 80, description: 'Spiced green peas gravy' },
      { name: 'Channa Masala', price: 70, description: 'North Indian chickpea curry' },
    ],
  },
  {
    name: 'Al-Faham BBQ',
    display_order: 4,
    items: [
      { name: 'Normal Al-Faham (Quarter)', price: 140, description: 'Classic charcoal grilled chicken' },
      { name: 'Peri Peri Al-Faham (Quarter)', price: 150, description: 'Spicy peri peri marinated Al-Faham' },
      { name: 'BBQ Al-Faham (Quarter)', price: 180, description: 'Smoky BBQ sauce glazed Al-Faham' },
      { name: 'Pepper Al-Faham (Quarter)', price: 150, description: 'Crushed black pepper Al-Faham' },
      { name: 'Turkish Al-Faham (Quarter)', price: 180, description: 'Turkish spice blend Al-Faham' },
      { name: 'Honey Al-Faham (Quarter)', price: 180, description: 'Sweet & savory honey glazed Al-Faham' },
      { name: 'Honey Chilly Al-Faham (Quarter)', price: 180, description: 'Spicy honey chili Al-Faham' },
      { name: 'Kandhari Al-Faham (Quarter)', price: 180, description: 'Hot Kandhari bird eye chili Al-Faham' },
    ],
  },
  {
    name: 'Al-Faham Mandhi',
    display_order: 5,
    items: [
      { name: 'Normal Al-Faham Mandhi (Q)', price: 200, description: 'Fragrant mandhi rice with normal Al-Faham' },
      { name: 'Peri Peri Al-Faham Mandhi (Q)', price: 220, description: 'Mandhi rice with Peri Peri Al-Faham' },
      { name: 'BBQ Al-Faham Mandhi (Q)', price: 240, description: 'Mandhi rice with BBQ Al-Faham' },
      { name: 'Pepper Al-Faham Mandhi (Q)', price: 220, description: 'Mandhi rice with Pepper Al-Faham' },
      { name: 'Turkish Al-Faham Mandhi (Q)', price: 240, description: 'Mandhi rice with Turkish Al-Faham' },
      { name: 'Honey Al-Faham Mandhi (Q)', price: 240, description: 'Mandhi rice with Honey Al-Faham' },
      { name: 'Honey Chilly Mandhi (Q)', price: 240, description: 'Mandhi rice with Honey Chilly Al-Faham' },
      { name: 'Kandhari Al-Faham Mandhi (Q)', price: 240, description: 'Mandhi rice with Kandhari Al-Faham' },
      { name: 'Mandhi Rice (Quarter)', price: 100, description: 'Extra portion of flavorful mandhi rice' },
    ],
  },
  {
    name: 'Biriyani & Meals',
    display_order: 6,
    items: [
      { name: 'Rawther Chicken Biriyani', price: 150, description: 'Authentic Palakkad Rawther style chicken biriyani' },
      { name: 'Rawther Beef Biriyani', price: 150, description: 'Authentic Palakkad Rawther style beef biriyani' },
      { name: 'Thalasserry Chicken Biriyani', price: 160, description: 'Malabar Thalasserry dum chicken biriyani' },
      { name: 'Thalasserry Beef Biriyani', price: 160, description: 'Malabar Thalasserry dum beef biriyani' },
      { name: 'Chatti Choor', price: 200, description: 'Earthen pot traditional Kerala special meals' },
      { name: 'Kerala Meals', price: 60, description: 'Traditional Kerala rice meals with curries' },
    ],
  },
  {
    name: 'Chinese & Noodles',
    display_order: 7,
    items: [
      { name: 'Veg Fried Rice', price: 120, description: 'Garden vegetable fried rice' },
      { name: 'Egg Fried Rice', price: 130, description: 'Wok tossed egg fried rice' },
      { name: 'Chicken Fried Rice', price: 160, description: 'Classic chicken fried rice' },
      { name: 'Veg Noodles', price: 120, description: 'Stir fried vegetable noodles' },
      { name: 'Egg Noodles', price: 130, description: 'Stir fried egg noodles' },
      { name: 'Chicken Noodles', price: 160, description: 'Stir fried chicken noodles' },
      { name: 'Schezwan Veg Fried Rice', price: 130, description: 'Spicy Schezwan vegetable fried rice' },
      { name: 'Schezwan Egg Fried Rice', price: 150, description: 'Spicy Schezwan egg fried rice' },
      { name: 'Schezwan Chicken Fried Rice', price: 170, description: 'Spicy Schezwan chicken fried rice' },
      { name: 'Schezwan Veg Noodles', price: 140, description: 'Spicy Schezwan vegetable noodles' },
      { name: 'Schezwan Egg Noodles', price: 150, description: 'Spicy Schezwan egg noodles' },
      { name: 'Schezwan Chicken Noodles', price: 180, description: 'Spicy Schezwan chicken noodles' },
    ],
  },
  {
    name: 'Fresh Juice & Beverages',
    display_order: 8,
    items: [
      { name: 'Lime Juice', price: 25, description: 'Fresh squeezed lime juice' },
      { name: 'Mint Lime', price: 30, description: 'Refreshing mint infused lime' },
      { name: 'Watermelon Juice', price: 40, description: 'Chilled fresh watermelon juice' },
      { name: 'Papaya Juice', price: 40, description: 'Fresh papaya blend' },
      { name: 'Shamam Juice', price: 50, description: 'Fresh muskmelon / shamam juice' },
      { name: 'Pineapple Juice', price: 50, description: 'Fresh pineapple juice' },
      { name: 'Grape Juice', price: 50, description: 'Fresh black grape juice' },
      { name: 'Orange Juice', price: 60, description: 'Fresh squeezed orange juice' },
      { name: 'Mango Juice', price: 60, description: 'Chilled mango juice' },
      { name: 'Apple Juice', price: 60, description: 'Fresh apple juice' },
      { name: 'Musambi Juice', price: 60, description: 'Fresh sweet lime musambi juice' },
      { name: 'Anar Juice', price: 80, description: 'Fresh pomegranate juice' },
      { name: 'Pineapple Lime', price: 35, description: 'Pineapple with fresh lime twist' },
      { name: 'Grape Lime', price: 40, description: 'Grape juice with fresh lime twist' },
      { name: 'Lime Soda', price: 30, description: 'Sparkling fresh lime soda' },
      { name: 'Ginger Lime', price: 30, description: 'Ginger infused fresh lime' },
    ],
  },
  {
    name: 'Milk Shakes & Avil Milk',
    display_order: 9,
    items: [
      { name: 'Oreo Milkshake', price: 60, description: 'Rich Oreo cookie thick shake' },
      { name: 'Strawberry Milkshake', price: 60, description: 'Creamy strawberry shake' },
      { name: 'Sharja Milkshake', price: 60, description: 'Classic Kerala Sharja banana nut shake' },
      { name: 'Chikku Milkshake', price: 60, description: 'Fresh sapota chikku thick shake' },
      { name: 'Mango Milkshake', price: 70, description: 'Fresh mango thick shake' },
      { name: 'Blueberry Milkshake', price: 80, description: 'Blueberry thick shake' },
      { name: 'Butterscotch Milkshake', price: 80, description: 'Butterscotch crunch shake' },
      { name: 'Choco Crunch Shake', price: 80, description: 'Chocolate crunch milkshake' },
      { name: 'Dairy Milk Shake', price: 90, description: 'Cadbury Dairy Milk blended shake' },
      { name: 'Cashew Shake', price: 90, description: 'Rich cashew nut thick shake' },
      { name: 'Snickers Shake', price: 90, description: 'Snickers peanut chocolate shake' },
      { name: 'Kit-Kat Shake', price: 90, description: 'Kit-Kat wafer chocolate shake' },
      { name: 'French Vanilla Shake', price: 90, description: 'Classic French vanilla thick shake' },
      { name: 'Badam Shake', price: 100, description: 'Almond badam thick shake' },
      { name: 'Peanut Butter Shake', price: 100, description: 'Creamy peanut butter thick shake' },
      { name: 'Avil Milk Normal', price: 50, description: 'Kerala style banana avil milk' },
      { name: 'Avil Milk Special', price: 60, description: 'Special avil milk with dry fruits' },
      { name: 'Butterscotch Avil Milk', price: 80, description: 'Butterscotch flavored avil milk' },
    ],
  },
  {
    name: 'Mojitos, Ice Cream & Falooda',
    display_order: 10,
    items: [
      { name: 'Green Apple Mojito', price: 60, description: 'Crisp green apple mocktail' },
      { name: 'Strawberry Mojito', price: 60, description: 'Strawberry mint mocktail' },
      { name: 'Mint Lime Mojito', price: 60, description: 'Classic mint lime soda mojito' },
      { name: 'Blueberry Mojito', price: 70, description: 'Blueberry mint mocktail' },
      { name: 'Blue Caracco Mojito', price: 70, description: 'Tropical blue curaçao mocktail' },
      { name: 'Black Currant Mojito', price: 70, description: 'Black currant refresh mocktail' },
      { name: 'Red Chilly Mojito', price: 70, description: 'Spicy red chili infused mojito' },
      { name: 'Vanilla Ice Cream Scoop', price: 30, description: 'Single scoop vanilla ice cream' },
      { name: 'Strawberry Ice Cream Scoop', price: 30, description: 'Single scoop strawberry ice cream' },
      { name: 'Mango Ice Cream Scoop', price: 40, description: 'Single scoop mango ice cream' },
      { name: 'Chocolate Ice Cream Scoop', price: 40, description: 'Single scoop chocolate ice cream' },
      { name: 'Butterscotch Ice Cream Scoop', price: 40, description: 'Single scoop butterscotch ice cream' },
      { name: 'Mexican Falooda', price: 140, description: 'Loaded Mexican style falooda with ice cream' },
      { name: 'Galaxy Special Falooda', price: 150, description: 'Signature Galaxy special layered falooda' },
      { name: 'Fruit Magic Falooda', price: 100, description: 'Fresh fruit layered falooda' },
    ],
  },
];

async function seedGalaxyMenu() {
  console.log('🚀 Connecting to Supabase database to populate Galaxy Bamboo Hut Menu...');
  await client.connect();

  try {
    await client.query('BEGIN');

    // 1. Update store settings
    await client.query(`
      UPDATE store_settings
      SET restaurant_name = $1,
          phone_number = $2,
          address = $3,
          updated_at = NOW()
      WHERE id IS NOT NULL;
    `, [GALAXY_STORE.restaurant_name, GALAXY_STORE.phone_number, GALAXY_STORE.address]);

    // 2. Clear old categories and menu items cleanly
    await client.query('DELETE FROM menu_items;');
    await client.query('DELETE FROM categories;');

    // 3. Insert categories and menu items
    let catCount = 0;
    let itemCount = 0;

    for (const catData of CATEGORIES_WITH_ITEMS) {
      const { rows: catRows } = await client.query(
        'INSERT INTO categories (name, display_order) VALUES ($1, $2) RETURNING id',
        [catData.name, catData.display_order]
      );
      const categoryId = catRows[0].id;
      catCount++;

      for (const item of catData.items) {
        await client.query(
          `INSERT INTO menu_items (category_id, name, description, price, is_available)
           VALUES ($1, $2, $3, $4, true)`,
          [categoryId, item.name, item.description, item.price]
        );
        itemCount++;
      }
    }

    await client.query('COMMIT');
    console.log(`🎉 SUCCESS! Updated store details to "${GALAXY_STORE.restaurant_name}".`);
    console.log(`✅ Created ${catCount} categories and ${itemCount} food items from your menu photos!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('✖ Error seeding menu:', err.message);
  } finally {
    await client.end();
  }
}

seedGalaxyMenu();
