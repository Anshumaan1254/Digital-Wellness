import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimited } from "@/lib/privacy";
import { find, insertOne } from "@/lib/store";

export const dynamic = "force-dynamic";

const vote = z.object({ target: z.string().min(1).max(80), helpful: z.boolean() });

export async function POST(req: Request) {
  if (rateLimited(clientKey(req) + ":vote", 30)) {
    return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  }
  const parsed = vote.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  try {
    await insertOne("helpful", parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Votes are unavailable right now." }, { status: 503 });
  }
}

export async function GET(req: Request) {
  const target = new URL(req.url).searchParams.get("target");
  try {
    const rows = await find("helpful", target ? { target } : {}, { fields: ["target", "helpful"], limit: 5000 });
    const counts: Record<string, { yes: number; no: number }> = {};
    for (const r of rows) {
      const c = (counts[String(r.target)] ??= { yes: 0, no: 0 });
      if (r.helpful) c.yes++;
      else c.no++;
    }
    return NextResponse.json({ counts });
  } catch {
    return NextResponse.json({ counts: {} }, { status: 503 });
  }
}
