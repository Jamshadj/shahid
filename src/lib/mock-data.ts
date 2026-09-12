import { StoreSettings, Category, MenuItem, BillWithItems } from '@/types/database';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 'store-1',
  restaurant_name: 'GALAXY RESTAURANT KARUNA MEDICAL COLLEGE',
  phone_number: '+91 99461 04923',
  address: 'Vilayodi, Chittur, Palakkad, Kerala',
  tax_rate_percent: 0.0,
  tax_number_gst: null,
  currency_symbol: '₹',
  thermal_printer_width: '80mm',
  updated_at: new Date().toISOString(),
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Poratta & Breads', display_order: 1, created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Non Veg Curry', display_order: 2, created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Veg Curry', display_order: 3, created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Al-Faham BBQ', display_order: 4, created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Al-Faham Mandhi', display_order: 5, created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Biriyani & Meals', display_order: 6, created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Chinese & Noodles', display_order: 7, created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Fresh Juice & Beverages', display_order: 8, created_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Milk Shakes & Avil Milk', display_order: 9, created_at: new Date().toISOString() },
  { id: 'cat-10', name: 'Mojitos, Ice Cream & Falooda', display_order: 10, created_at: new Date().toISOString() },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Poratta & Breads
  { id: 'item-101', category_id: 'cat-1', name: 'Poratta', description: 'Classic Kerala layered flaky poratta', price: 15, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-102', category_id: 'cat-1', name: 'Chappathi', description: 'Soft wheat chappathi', price: 15, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-103', category_id: 'cat-1', name: 'Wheat Poratta', description: 'Healthy wheat layered poratta', price: 18, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-104', category_id: 'cat-1', name: 'Nool Poratta', description: 'Stringed thread poratta', price: 22, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-105', category_id: 'cat-1', name: 'Egg Roast Single', description: 'Spiced egg roast gravy single', price: 30, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-106', category_id: 'cat-1', name: 'Egg Roast Full', description: 'Spiced egg roast gravy double egg', price: 50, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-107', category_id: 'cat-1', name: 'Chicken Curry', description: 'Traditional Kerala style chicken curry', price: 100, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-108', category_id: 'cat-1', name: 'Beef Curry', description: 'Spicy Kerala style beef curry', price: 100, image_url: null, is_available: true, created_at: new Date().toISOString() },

  // Non Veg Curry
  { id: 'item-201', category_id: 'cat-2', name: 'Chicken Manchurian', description: 'Indo-Chinese chicken manchurian', price: 140, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-202', category_id: 'cat-2', name: 'Chilly Chicken Gravy', description: 'Spicy chilly chicken with thick gravy', price: 140, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-203', category_id: 'cat-2', name: 'Pepper Chicken', description: 'Black pepper infused chicken fry', price: 150, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-204', category_id: 'cat-2', name: 'Garlic Chicken', description: 'Garlic roasted chicken gravy', price: 170, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-205', category_id: 'cat-2', name: 'Chicken Kondattam', description: 'Kerala style sun-dried chili spiced chicken', price: 170, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-206', category_id: 'cat-2', name: 'Butter Chicken', description: 'Rich tomato butter cream chicken', price: 180, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-207', category_id: 'cat-2', name: 'Kadai Chicken', description: 'Wok tossed chicken with bell peppers', price: 180, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-208', category_id: 'cat-2', name: 'Beef Roast', description: 'Slow-roasted spicy Kerala beef', price: 130, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-209', category_id: 'cat-2', name: 'Beef Fry', description: 'Classic Kerala beef fry (BDF)', price: 110, image_url: null, is_available: true, created_at: new Date().toISOString() },

  // Al-Faham BBQ & Mandhi
  { id: 'item-401', category_id: 'cat-4', name: 'Normal Al-Faham (Quarter)', description: 'Classic charcoal grilled chicken', price: 140, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-402', category_id: 'cat-4', name: 'Peri Peri Al-Faham (Quarter)', description: 'Spicy peri peri marinated Al-Faham', price: 150, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-403', category_id: 'cat-4', name: 'BBQ Al-Faham (Quarter)', description: 'Smoky BBQ sauce glazed Al-Faham', price: 180, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-501', category_id: 'cat-5', name: 'Normal Al-Faham Mandhi (Q)', description: 'Fragrant mandhi rice with normal Al-Faham', price: 200, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-502', category_id: 'cat-5', name: 'Peri Peri Al-Faham Mandhi (Q)', description: 'Mandhi rice with Peri Peri Al-Faham', price: 220, image_url: null, is_available: true, created_at: new Date().toISOString() },

  // Biriyani & Meals
  { id: 'item-601', category_id: 'cat-6', name: 'Rawther Chicken Biriyani', description: 'Authentic Palakkad Rawther style chicken biriyani', price: 150, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-602', category_id: 'cat-6', name: 'Rawther Beef Biriyani', description: 'Authentic Palakkad Rawther style beef biriyani', price: 150, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-603', category_id: 'cat-6', name: 'Thalasserry Chicken Biriyani', description: 'Malabar Thalasserry dum chicken biriyani', price: 160, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-604', category_id: 'cat-6', name: 'Chatti Choor', description: 'Earthen pot traditional Kerala special meals', price: 200, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-605', category_id: 'cat-6', name: 'Kerala Meals', description: 'Traditional Kerala rice meals with curries', price: 60, image_url: null, is_available: true, created_at: new Date().toISOString() },

  // Shakes & Beverages
  { id: 'item-801', category_id: 'cat-8', name: 'Lime Juice', description: 'Fresh squeezed lime juice', price: 25, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-802', category_id: 'cat-8', name: 'Mint Lime', description: 'Refreshing mint infused lime', price: 30, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-901', category_id: 'cat-9', name: 'Sharja Milkshake', description: 'Classic Kerala Sharja banana nut shake', price: 60, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-902', category_id: 'cat-9', name: 'Oreo Milkshake', description: 'Rich Oreo cookie thick shake', price: 60, image_url: null, is_available: true, created_at: new Date().toISOString() },
  { id: 'item-1001', category_id: 'cat-10', name: 'Galaxy Special Falooda', description: 'Signature Galaxy special layered falooda', price: 150, image_url: null, is_available: true, created_at: new Date().toISOString() },
];

export const INITIAL_BILLS: BillWithItems[] = [];
