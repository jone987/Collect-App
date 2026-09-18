import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Excludes /api/* too: API routes (e.g. the cron endpoint) authorize
    // themselves independently and must never be redirected to /login for
    // lacking a browser session — a server-to-server request like Vercel
    // Cron has no session at all, only its own bearer secret.
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
