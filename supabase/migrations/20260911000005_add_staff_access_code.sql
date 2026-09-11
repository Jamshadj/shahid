-- Add staff_access_code column to store_settings table
alter table store_settings add column if not exists staff_access_code text default '086421';

-- Update existing store settings record to set code '086421'
update store_settings set staff_access_code = '086421' where staff_access_code is null or staff_access_code = '102938';
