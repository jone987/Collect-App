# COLLECT

A small Next.js + Supabase SaaS for tracking who owes you money and following up.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + Postgres) via `@supabase/ssr`

## Setup

1. Create a Supabase project at https://supabase.com.
2. Run the SQL in `supabase/migrations/0001_init.sql` in the Supabase SQL editor
   (or via the Supabase CLI: `supabase db push`). This creates the `customers`
   and `follow_ups` tables with row-level security so each user only sees
   their own data.
3. In your Supabase project, under Authentication → Providers, make sure
   Email is enabled. For local dev you can disable "Confirm email" to skip
   the email step, or configure an SMTP provider to receive confirmation
   links.
4. Copy `.env.local.example` to `.env.local` and fill in your project's URL
   and anon key (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

5. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

6. Visit `http://localhost:3000`, sign up with an email/password, then
   confirm the account (if email confirmation is enabled) and sign in.

## Data model

- **customers**: `name`, `contact`, `job`, `amount_owed`, `status`
  (`active` / `overdue` / `paid` / `closed`), `notes`. Scoped to the
  authenticated user via `user_id`.
- **follow_ups**: linked to a `customer_id`, with `reason`, `due_date`,
  `status` (`pending` / `done` / `skipped`), `notes`.

Both tables have row-level security policies so a signed-in user can only
read, insert, update, or delete their own rows.

## Pages

- `/login` — email/password sign in and sign up.
- `/customers` — list of customers with a form to add new ones.
- `/customers/[id]` — customer detail, status editing, and follow-up
  management.
