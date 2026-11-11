import { NextResponse } from "next/server";
import { ALLOWED_UPLOADS, MAX_UPLOAD_BYTES, submissionSchema } from "@/lib/schemas";
import { clientKey, rateLimited, redact } from "@/lib/privacy";
import { find, insertOne } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (rateLimited(clientKey(req) + ":submission", 4)) {
    return NextResponse.json({ error: "Too many uploads in a short time. Please try again later." }, { status: 429 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form" }, { status: 400 });

  const parsed = submissionSchema.safeParse({
    kind: form.get("kind"),
    title: form.get("title"),
    description: form.get("description") ?? "",
    url: form.get("url") ?? "",
    resourceId: form.get("resourceId") ?? "",
    altText: form.get("altText") ?? "",
    noPersonalInfo: form.get("noPersonalInfo") === "true",
    consent: form.get("consent") === "true",
    website: form.get("website") ?? "",
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }

  const file = form.get("file");
  let fileId: string | null = null;
  try {
    if (file instanceof File && file.size > 0) {
      if (!ALLOWED_UPLOADS.includes(file.type as (typeof ALLOWED_UPLOADS)[number])) {
        return NextResponse.json({ error: "Upload a PNG, JPEG, WebP or GIF image." }, { status: 400 });
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json({ error: "Images must be 3 MB or smaller." }, { status: 400 });
      }
      if (!parsed.data.altText) {
        return NextResponse.json({ error: "Please describe your image for people using screen readers." }, { status: 400 });
      }
      const bytes = Buffer.from(await file.arrayBuffer());
      const saved = await insertOne("files", { type: file.type, size: file.size, data: bytes.toString("base64") });
      fileId = saved._id;
    }
    if (parsed.data.kind !== "video" && parsed.data.kind !== "tip" && !fileId && !parsed.data.url) {
      return NextResponse.json({ error: "Attach an image or add a link." }, { status: 400 });
    }

    const { website, consent, noPersonalInfo, ...data } = parsed.data;
    void website;
    void consent;
    void noPersonalInfo;
    await insertOne("submissions", {
      ...data,
      title: redact(data.title),
      description: redact(data.description),
      fileId,
      status: "pending",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submission failed", err);
    return NextResponse.json({ error: "We couldn't save your submission right now." }, { status: 503 });
  }
}

export async function GET() {
  try {
    const rows = await find(
      "submissions",
      { status: "approved" },
      {
        sort: { createdAt: -1 },
        limit: 60,
        fields: ["kind", "title", "description", "url", "resourceId", "altText", "fileId", "createdAt"],
      }
    );
    return NextResponse.json({ submissions: rows });
  } catch (err) {
    console.error("submissions read failed", err);
    return NextResponse.json({ submissions: [], error: "Submissions are unavailable right now." }, { status: 503 });
  }
}
