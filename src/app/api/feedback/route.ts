import { NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/schemas";
import { clientKey, rateLimited, redact } from "@/lib/privacy";
import { find, insertOne } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (rateLimited(clientKey(req))) {
    return NextResponse.json({ error: "Too many messages in a short time. Please try again later." }, { status: 429 });
  }
  const parsed = feedbackSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid feedback" }, { status: 400 });
  }
  const { website, consent, ...data } = parsed.data;
  void website;
  void consent;
  try {
    await insertOne("feedback", {
      ...data,
      problems: redact(data.problems),
      suggestions: redact(data.suggestions),
      // published comments are shown on the site once a moderator approves them
      status: "pending",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("feedback insert failed", err);
    return NextResponse.json({ error: "We couldn't save your feedback right now." }, { status: 503 });
  }
}

/* Aggregated, anonymous summary used by the Community and Evidence pages. */
export async function GET() {
  try {
    const rows = await find("feedback", {}, { sort: { createdAt: -1 }, limit: 500 });
    const n = rows.length;
    const avg = n ? rows.reduce((s, r) => s + Number(r.rating || 0), 0) / n : 0;
    const tally = (key: string) =>
      rows.reduce<Record<string, number>>((acc, r) => {
        const v = String(r[key] ?? "unanswered");
        acc[v] = (acc[v] ?? 0) + 1;
        return acc;
      }, {});
    const comments = rows
      .filter((r) => r.status === "published")
      .slice(0, 20)
      .map((r) => ({
        id: r._id,
        date: String(r.createdAt).slice(0, 10),
        kind: r.kind,
        rating: r.rating,
        guideSlug: r.guideSlug,
        resourceId: r.resourceId,
        problems: r.problems,
        suggestions: r.suggestions,
        studentLevel: r.studentLevel,
      }));
    return NextResponse.json({
      total: n,
      usabilityTests: rows.filter((r) => r.kind === "usability-test").length,
      averageRating: Math.round(avg * 10) / 10,
      foundResource: tally("foundResource"),
      guideCompleted: tally("guideCompleted"),
      comments,
    });
  } catch (err) {
    console.error("feedback read failed", err);
    return NextResponse.json({ error: "Feedback is unavailable right now." }, { status: 503 });
  }
}
