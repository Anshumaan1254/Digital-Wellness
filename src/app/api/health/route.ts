import { NextResponse } from "next/server";
import { backend, count } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feedback = await count("feedback");
    return NextResponse.json({ ok: true, backend: backend(), feedback });
  } catch (err) {
    return NextResponse.json({ ok: false, backend: backend(), error: String(err) }, { status: 503 });
  }
}
