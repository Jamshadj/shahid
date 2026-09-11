# Database Migrations & Version Control Guide

All database schema changes (creating tables, altering columns, adding indexes, updating RLS policies) are strictly controlled via version-controlled SQL migrations stored in `supabase/migrations/`.

---

## Migration Architecture

- **Migration Folder**: `supabase/migrations/`
- **Naming Convention**: `YYYYMMDDHHMMSS_description.sql`
- **Tracking Table**: `_schema_migrations` (Automatically created in PostgreSQL to record applied migration versions).

### Existing Migration Files:
1. `20260911000000_schema_migrations_table.sql`: Initial tracking table setup.
2. `20260911000001_create_store_settings.sql`: Store settings & receipt printer configuration table.
3. `20260911000002_create_categories_and_menu_items.sql`: Food categories & menu items tables with indexes.
4. `20260911000003_create_bills_and_bill_items.sql`: Bills & bill line items with constraints and indexes.
5. `20260911000004_seed_initial_data.sql`: Safe initial seed data using `ON CONFLICT DO NOTHING`.

---

## How to Run Migrations

1. **Set your Supabase Database Connection String** in `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
   *(Find this URL in Supabase Dashboard -> Project Settings -> Database -> Connection String -> URI)*.

2. **Execute Migrations Command**:
   ```bash
   npm run db:migrate
   ```
   This will:
   - Connect safely via SSL.
   - Detect unapplied `.sql` migration files.
   - Execute each pending migration in an isolated database transaction block (`BEGIN ... COMMIT`).
   - Log progress and record the applied version to ensure data safety.

---

## How to Add a New Database Migration

1. Create a new `.sql` file in `supabase/migrations/` with a timestamp prefix:
   - Example: `supabase/migrations/20260912000005_add_table_number_to_bills.sql`
2. Write your SQL statement:
   ```sql
   ALTER TABLE bills ADD COLUMN IF NOT EXISTS table_number TEXT;
   ```
3. Run `npm run db:migrate`.
