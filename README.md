# COLLECT

A small Next.js + Supabase SaaS for tracking who owes you money and following up.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + Postgres) via `@supabase/ssr`
- Zod for form validation

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
- `/dashboard` — money outstanding, follow-ups due today, overdue
  follow-ups, and a "needs attention" list linking straight to the
  relevant customers.
- `/customers` — searchable, filterable customer list with an "Add
  customer" dialog.
- `/customers/[id]` — customer detail, status editing, and follow-up
  management.
- `/follow-ups` — every follow-up across all customers, filterable by
  overdue / due today / pending / done / skipped.

## Code layout

- `lib/data/*` — server-only data-access functions (one file per
  resource: `customers`, `follow-ups`, plus `dashboard` which combines
  both). Pages call these instead of touching Supabase directly.
- `lib/validation/*` — Zod schemas shared between client-side error
  display and server-side enforcement in the matching `actions.ts`.
- `lib/format.ts` — currency/date formatting and due-date helpers
  (`isOverdue`, `isDueToday`) shared by the dashboard, customer detail,
  and follow-ups pages.
- `components/ui/*` — presentational primitives (`Button`, `Field`
  wrappers, `Badge`, `Card`/`StatCard`, `Dialog`, `ConfirmDialog`,
  `EmptyState`, `Skeleton`, `Alert`, `RouteError`) used across all
  screens for a consistent look.
- `app/(app)/*` — the authenticated screens, sharing one layout (`nav`
  + page chrome). Each route has a `loading.tsx` skeleton and an
  `error.tsx` boundary alongside its `page.tsx`.
- Forms use React's `useActionState` + `useFormStatus`: server actions
  return a typed `FormState` (`lib/form-state.ts`) with field-level
  Zod errors, and `SubmitButton` shows a pending state automatically.
- Deletes go through `components/ui/confirm-dialog.tsx`, a reusable
  confirmation modal — no bare `window.confirm()`.
