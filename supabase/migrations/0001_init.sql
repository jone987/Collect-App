-- COLLECT: customers + follow_ups schema with per-user row-level security

create extension if not exists "pgcrypto";

do $$ begin
  create type customer_status as enum ('active', 'overdue', 'paid', 'closed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type follow_up_status as enum ('pending', 'done', 'skipped');
exception
  when duplicate_object then null;
end $$;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  name text not null,
  contact text,
  job text,
  amount_owed numeric(12, 2) not null default 0,
  status customer_status not null default 'active',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  customer_id uuid not null references customers (id) on delete cascade,
  reason text not null,
  due_date date,
  status follow_up_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists customers_user_id_idx on customers (user_id);
create index if not exists follow_ups_user_id_idx on follow_ups (user_id);
create index if not exists follow_ups_customer_id_idx on follow_ups (customer_id);

alter table customers enable row level security;
alter table follow_ups enable row level security;

drop policy if exists "Users can view their own customers" on customers;
create policy "Users can view their own customers"
  on customers for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own customers" on customers;
create policy "Users can insert their own customers"
  on customers for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own customers" on customers;
create policy "Users can update their own customers"
  on customers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own customers" on customers;
create policy "Users can delete their own customers"
  on customers for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can view their own follow ups" on follow_ups;
create policy "Users can view their own follow ups"
  on follow_ups for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own follow ups" on follow_ups;
create policy "Users can insert their own follow ups"
  on follow_ups for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own follow ups" on follow_ups;
create policy "Users can update their own follow ups"
  on follow_ups for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own follow ups" on follow_ups;
create policy "Users can delete their own follow ups"
  on follow_ups for delete
  using (auth.uid() = user_id);
