import { createHash } from "crypto";

/*
 * Feedback must stay anonymous: the forms never ask for a name or email,
 * and anything that looks like contact details typed into free text is
 * replaced before it is stored.
 */
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /(?:\+?\d[\s().-]?){8,}\d/g;
const HANDLE = /(^|\s)@[A-Za-z0-9_.]{3,}/g;

export function redact(text: string): string {
  return text
    .replace(EMAIL, "[email removed]")
    .replace(PHONE, "[number removed]")
    .replace(HANDLE, "$1[handle removed]")
    .trim();
}

/* Short-lived, salted hash of the client address, used only for rate limiting in memory. */
const salt = Math.random().toString(36).slice(2);
export function fingerprint(ip: string) {
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 16);
}

const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export function clientKey(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return fingerprint(ip);
}
