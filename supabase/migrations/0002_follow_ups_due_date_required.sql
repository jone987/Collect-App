-- Close the gap that let a follow-up be saved with no due date at all,
-- which then broke downstream logic (message-tone selection) that assumed
-- every follow-up had one. See lib/validation/follow-up.ts and
-- app/(app)/customers/[id]/new-follow-up-form.tsx for the matching
-- application-level fix (due_date is now required end to end, not just
-- guarded against here).

-- Backfill any existing rows saved before this constraint existed. Falls
-- back to the day the follow-up was created — the closest honest "we don't
-- actually know" default, and always present since created_at is not null.
update follow_ups
set due_date = created_at::date
where due_date is null;

alter table follow_ups
  alter column due_date set not null;
