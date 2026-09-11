-- Migration Tracking Table
create table if not exists _schema_migrations (
  version text primary key,
  name text not null,
  applied_at timestamp with time zone default now()
);
