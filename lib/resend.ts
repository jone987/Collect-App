import { Resend } from "resend";

let cachedClient: Resend | null = null;

/** Lazily constructed so importing this module doesn't blow up in
 * environments (like most of the app, and every test) that never send
 * email and so never need `RESEND_API_KEY` set. */
export function getResendClient(): Resend {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("getResendClient: RESEND_API_KEY is not set.");
  }

  cachedClient = new Resend(apiKey);
  return cachedClient;
}
