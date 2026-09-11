-- Create bills / invoices table
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

-- Create bill_items line items table
create table if not exists bill_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid references bills(id) on delete cascade,
  item_id uuid references menu_items(id) on delete set null,
  item_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  total_price numeric(10,2) not null
);

-- Indexes for fast reporting and search
create index if not exists idx_bills_created_at on bills(created_at desc);
create index if not exists idx_bills_payment_status on bills(payment_status);
create index if not exists idx_bill_items_bill_id on bill_items(bill_id);

-- Enable RLS
alter table bills enable row level security;
alter table bill_items enable row level security;

-- Policies
drop policy if exists "Allow public all on bills" on bills;
create policy "Allow public all on bills" on bills for all using (true);

drop policy if exists "Allow public all on bill_items" on bill_items;
create policy "Allow public all on bill_items" on bill_items for all using (true);
