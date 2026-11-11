import { find, findById } from "@/lib/store";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

/* Serves an uploaded image, but only once its submission has been approved. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const owner = await find("submissions", { fileId: id }, { limit: 1, fields: ["status"] });
    if (!owner[0] || (owner[0].status !== "approved" && !isAdmin(req))) {
      return new Response("Not found", { status: 404 });
    }
    const file = await findById("files", id);
    if (!file) return new Response("Not found", { status: 404 });
    return new Response(Buffer.from(String(file.data), "base64"), {
      headers: {
        "Content-Type": String(file.type),
        "Cache-Control": owner[0].status === "approved" ? "public, max-age=86400" : "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Unavailable", { status: 503 });
  }
}
