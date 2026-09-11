-- Idempotent seed data insertion (Data safe)
insert into store_settings (restaurant_name, phone_number, address, tax_rate_percent, tax_number_gst, currency_symbol, thermal_printer_width)
select 'Delicious Bites Restaurant', '+91 98765 43210', '123 Foodie Street, Gourmet Hub', 5.00, '27AAACG1234F1Z5', '₹', '80mm'
where not exists (select 1 from store_settings);

-- Insert Default Categories if empty
insert into categories (id, name, display_order)
values 
  ('11111111-1111-1111-1111-111111111111', 'Starters & Appetizers', 1),
  ('22222222-2222-2222-2222-222222222222', 'Main Course', 2),
  ('33333333-3333-3333-3333-333333333333', 'Pizzas & Burgers', 3),
  ('44444444-4444-4444-4444-444444444444', 'Beverages & Shakes', 4),
  ('55555555-5555-5555-5555-555555555555', 'Desserts', 5)
on conflict (id) do nothing;

-- Insert Default Menu Items if empty
insert into menu_items (id, category_id, name, description, price, image_url, is_available)
values 
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Paneer Tikka Grill', 'Cottage cheese marinated in spices and charred.', 240, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500', true),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Crispy Veg Spring Rolls', 'Golden fried rolls stuffed with vegetables.', 180, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true),
  ('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Butter Chicken Gravy', 'Tender chicken cooked in rich tomato butter gravy.', 320, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500', true),
  ('a4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Dal Makhani Special', 'Slow-cooked black lentils with fresh cream.', 220, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', true),
  ('a5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Supreme Cheese Pizza', 'Loaded with mozzarella, peppers, and mushrooms.', 390, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', true)
on conflict (id) do nothing;
