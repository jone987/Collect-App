/** `contact` is a single free-text field, so these are best-effort guesses at
 * whether it holds a phone number, an email, or something else entirely. */

export function extractPhone(contact: string | null): string | null {
  if (!contact) return null;
  const cleaned = contact.replace(/[^\d+]/g, "");
  const digitCount = cleaned.replace(/\D/g, "").length;
  return digitCount >= 7 ? cleaned : null;
}

export function extractEmail(contact: string | null): string | null {
  if (!contact) return null;
  const trimmed = contact.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : null;
}

/** Reads `navigator`, so only call this from an effect/handler on the client
 * — never during render, or the server-rendered markup (no `navigator`) will
 * mismatch the client's first paint. */
export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isAppleTouchDevice = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as "MacIntel" but, unlike a real Mac, has touch points.
  const isModerniPad =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isAppleTouchDevice || isModerniPad;
}

/** iOS wants `sms:<number>&body=`, Android (and everything else) wants
 * `sms:<number>?body=`. Both accept an empty number, which just opens the
 * compose screen with no recipient pre-filled. */
export function buildSmsLink(
  phone: string | null,
  body: string,
  isIOS: boolean
): string {
  const separator = isIOS ? "&" : "?";
  return `sms:${phone ?? ""}${separator}body=${encodeURIComponent(body)}`;
}

export function buildMailtoLink(
  email: string | null,
  subject: string,
  body: string
): string {
  return `mailto:${email ?? ""}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
