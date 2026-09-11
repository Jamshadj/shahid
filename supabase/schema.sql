-- 1. Store & Restaurant Configuration (Single Record)
create table if not exists store_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null default 'Delicious Bites Restaurant',
  phone_number text default '+91 98765 43210',
  address text default '123 Foodie Street, Gourmet Hub, City',
  tax_rate_percent numeric(5,2) default 5.00,
  tax_number_gst text default '27AAACG1234F1Z5',
  currency_symbol text default '₹',
  thermal_printer_width text check (thermal_printer_width in ('58mm', '80mm')) default '80mm',
  updated_at timestamp with time zone default now()
);

-- 2. Food Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- 3. Food Items
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text, -- Storage URL (Used in Billing/POS only)
  is_available boolean default true,
  created_at timestamp with time zone default now()
);

-- 4. Bills / Invoices
create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  bill_number serial,
  customer_name text,
  customer_phone text,
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) default 0.00,
  tax_amount numeric(10,2) default 0.00,
  grand_total numeric(10,2) not null,
  payment_mode text check (payment_mode in ('cash', 'upi', 'card', 'due')) default 'cash',
  payment_status text check (payment_status in ('paid', 'unpaid')) default 'paid',
  created_at timestamp with time zone default now()
);

-- 5. Bill Line Items
create table if not exists bill_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid references bills(id) on delete cascade,
  item_id uuid references menu_items(id) on delete set null,
  item_name text not null,       -- Snapshot of item name at time of sale
  unit_price numeric(10,2) not null,    -- Snapshot of price
  quantity int not null check (quantity > 0),
  total_price numeric(10,2) not null
);

-- Enable Row Level Security (RLS)
alter table store_settings enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table bills enable row level security;
alter table bill_items enable row level security;

-- Public policies (for single-tenant / public POS access)
create policy "Allow public read access on store_settings" on store_settings for select using (true);
create policy "Allow public update access on store_settings" on store_settings for all using (true);

create policy "Allow public read on categories" on categories for select using (true);
create policy "Allow public write on categories" on categories for all using (true);

create policy "Allow public read on menu_items" on menu_items for select using (true);
create policy "Allow public write on menu_items" on menu_items for all using (true);

create policy "Allow public read on bills" on bills for select using (true);
create policy "Allow public write on bills" on bills for all using (true);

create policy "Allow public read on bill_items" on bill_items for select using (true);
create policy "Allow public write on bill_items" on bill_items for all using (true);

-- Seed initial Store Settings if empty
insert into store_settings (restaurant_name, phone_number, address, tax_rate_percent, tax_number_gst, currency_symbol, thermal_printer_width)
select 'Delicious Bites Restaurant', '+91 98765 43210', '123 Foodie Street, Gourmet Hub', 5.00, '27AAACG1234F1Z5', '₹', '80mm'
where not exists (select 1 from store_settings);

-- Storage bucket creation instruction:
-- Go to Supabase Storage -> New Bucket -> Name: 'menu-images' -> Make Public: YES
