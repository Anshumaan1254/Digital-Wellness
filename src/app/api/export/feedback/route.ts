import { isAdmin } from "@/lib/admin";
import { find } from "@/lib/store";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "createdAt",
  "kind",
  "rating",
  "foundResource",
  "resourceId",
  "guideSlug",
  "guideCompleted",
  "minutes",
  "problems",
  "suggestions",
  "studentLevel",
  "device",
] as const;

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

/* Anonymous CSV export for the project's user-feedback evidence. Admin only. */
export async function GET(req: Request) {
  if (!isAdmin(req)) return new Response("Not allowed", { status: 401 });
  const rows = await find("feedback", {}, { sort: { createdAt: 1 }, limit: 5000 });
  const lines = [COLUMNS.join(","), ...rows.map((r, i) => [cell(`P${i + 1}`), ...COLUMNS.map((c) => cell(r[c]))].join(","))];
  lines[0] = "participant," + lines[0];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="anonymous-feedback.csv"',
    },
  });
}
