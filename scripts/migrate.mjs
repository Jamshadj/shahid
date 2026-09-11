import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

// Load .env.local first, fallback to .env
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl.includes('[YOUR-PASSWORD]') || dbUrl.includes('your-project')) {
  console.log('\x1b[33m%s\x1b[0m', '------------------------------------------------------------');
  console.log('\x1b[33m%s\x1b[0m', '⚠️  DATABASE_URL is not configured yet in .env.local');
  console.log('\x1b[33m%s\x1b[0m', 'Please set your Supabase DATABASE_URL in .env.local to run migrations.');
  console.log('\x1b[33m%s\x1b[0m', 'Example: DATABASE_URL=postgresql://postgres:Password@db.ref.supabase.co:5432/postgres');
  console.log('\x1b[33m%s\x1b[0m', '------------------------------------------------------------');
  process.exit(0);
}

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }, // Necessary for Supabase SSL connections
});

async function runMigrations() {
  console.log('🚀 Connecting to database for migrations...');
  await client.connect();

  try {
    // 1. Create _schema_migrations tracking table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS _schema_migrations (
        version TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Fetch already applied migrations
    const { rows } = await client.query('SELECT version FROM _schema_migrations');
    const appliedVersions = new Set(rows.map((r) => r.version));

    // 3. Read migration files directory
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('No supabase/migrations directory found.');
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${files.length} migration file(s).`);

    let pendingCount = 0;

    for (const file of files) {
      const version = file.split('_')[0];

      if (appliedVersions.has(version)) {
        console.log(`  \x1b[32m✓\x1b[0m ${file} (already applied)`);
        continue;
      }

      console.log(`  \x1b[36m⏳ Applying:\x1b[0m ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute migration safely inside a transaction
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO _schema_migrations (version, name) VALUES ($1, $2)',
          [version, file]
        );
        await client.query('COMMIT');
        console.log(`  \x1b[32m✔ Applied successfully:\x1b[0m ${file}`);
        pendingCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  \x1b[31m✖ Migration failed on ${file}:\x1b[0m`, err.message);
        throw err;
      }
    }

    if (pendingCount === 0) {
      console.log('\n✨ Database is up to date! No new migrations to apply.');
    } else {
      console.log(`\n🎉 Successfully applied ${pendingCount} new migration(s)! Data is safe and schema updated.`);
    }
  } finally {
    await client.end();
  }
}

runMigrations().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
