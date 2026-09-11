-- Create store_settings table for restaurant configuration
create table if not exists store_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null default 'Delicious Bites Restaurant',
  phone_number text default '+91 98765 43210',
  address text default '123 Foodie Street, Gourmet Hub',
  tax_rate_percent numeric(5,2) default 5.00,
  tax_number_gst text default '27AAACG1234F1Z5',
  currency_symbol text default '₹',
  thermal_printer_width text check (thermal_printer_width in ('58mm', '80mm')) default '80mm',
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table store_settings enable row level security;

-- Policies
drop policy if exists "Allow public select on store_settings" on store_settings;
create policy "Allow public select on store_settings" on store_settings for select using (true);

drop policy if exists "Allow public all on store_settings" on store_settings;
create policy "Allow public all on store_settings" on store_settings for all using (true);
