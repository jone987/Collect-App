-- Tracks which contractor already got their daily digest email for a given
-- date, so a duplicate cron run (a manual retrigger, a Vercel retry, two
-- overlapping invocations) can't send the same person two copies of the
-- same email. Only ever written by the cron route's service-role client —
-- no user-facing policies are needed.
create table if not exists digest_sends (
  user_id uuid not null references auth.users (id) on delete cascade,
  digest_date date not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, digest_date)
);

alter table digest_sends enable row level security;
