import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { find, updateById } from "@/lib/store";

export const dynamic = "force-dynamic";

const COLLECTIONS = { submissions: ["approved", "rejected", "pending"], feedback: ["published", "pending", "hidden"] } as const;

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  const type = new URL(req.url).searchParams.get("type") === "feedback" ? "feedback" : "submissions";
  const rows = await find(type, {}, { sort: { createdAt: -1 }, limit: 200 });
  return NextResponse.json({ rows });
}

const patch = z.object({
  type: z.enum(["submissions", "feedback"]),
  id: z.string().min(1),
  status: z.string(),
});

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  const parsed = patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !(COLLECTIONS[parsed.data.type] as readonly string[]).includes(parsed.data.status)) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  const ok = await updateById(parsed.data.type, parsed.data.id, {
    status: parsed.data.status,
    reviewedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok });
}
