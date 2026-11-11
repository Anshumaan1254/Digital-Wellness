import { timingSafeEqual } from "crypto";

/* Moderation is switched off unless ADMIN_KEY is set in the environment. */
export function isAdmin(req: Request) {
  const expected = process.env.ADMIN_KEY;
  const given = req.headers.get("x-admin-key") ?? "";
  if (!expected || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
