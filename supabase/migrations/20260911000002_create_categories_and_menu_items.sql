-- Create categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- Create menu_items table
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean default true,
  created_at timestamp with time zone default now()
);

-- Create Indexes for performance
create index if not exists idx_menu_items_category on menu_items(category_id);
create index if not exists idx_menu_items_available on menu_items(is_available);

-- Enable RLS
alter table categories enable row level security;
alter table menu_items enable row level security;

-- Policies
drop policy if exists "Allow public all on categories" on categories;
create policy "Allow public all on categories" on categories for all using (true);

drop policy if exists "Allow public all on menu_items" on menu_items;
create policy "Allow public all on menu_items" on menu_items for all using (true);
