import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * A Supabase client authenticated with the service-role key, which bypasses
 * row-level security entirely and can read/write every user's data.
 *
 * DANGER: never import this outside of trusted, server-only, non-user-facing
 * code (e.g. the cron route). Never expose `SUPABASE_SERVICE_ROLE_KEY` to
 * the client — it must not be prefixed with `NEXT_PUBLIC_`, and this file
 * must never be imported from a Client Component, a normal page/action that
 * runs on behalf of a signed-in user, or anywhere reachable by user input
 * without its own independent authorization check. Regular app code should
 * keep using `utils/supabase/server.ts`, which is scoped to the signed-in
 * user via RLS.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "createAdminClient: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
