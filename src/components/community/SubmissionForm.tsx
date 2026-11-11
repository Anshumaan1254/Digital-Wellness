"use client";

import { useState } from "react";
import { ImageUp } from "lucide-react";
import { RESOURCES } from "@/data/resources";
import { cn } from "@/lib/utils";

const field = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground";
const label = "mb-1.5 block text-sm font-medium";

const KINDS = [
  { id: "video", title: "Video", hint: "A link to your how-to or story on YouTube, Vimeo or Google Drive" },
  { id: "animation", title: "Animation", hint: "A GIF you made, or a link to it" },
  { id: "app-screen", title: "App screen", hint: "A screenshot of a setting that helped you" },
  { id: "tip", title: "Tip", hint: "A short habit or trick, in words" },
] as const;

const MAX = 3 * 1024 * 1024;

/*
 * Photos and screenshots can carry hidden metadata (including GPS location).
 * Re-drawing PNG/JPEG/WebP images onto a canvas strips it before upload.
 * GIFs are sent unchanged so their animation survives.
 */
async function stripMetadata(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.88));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, type === "image/png" ? ".png" : ".jpg"), { type });
}

export function SubmissionForm() {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("video");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "sending" | "ok" | "error"; message?: string }>({ type: "idle" });
  const wantsFile = kind === "animation" || kind === "app-screen";

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(f.type)) {
      setStatus({ type: "error", message: "Please choose a PNG, JPEG, WebP or GIF image." });
      return;
    }
    const clean = await stripMetadata(f).catch(() => f);
    if (clean.size > MAX) {
      setStatus({ type: "error", message: "That image is larger than 3 MB. Try a smaller screenshot or a shorter GIF." });
      return;
    }
    setStatus({ type: "idle" });
    setFile(clean);
    setPreview(URL.createObjectURL(clean));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const body = new FormData();
    body.set("kind", kind);
    for (const k of ["title", "description", "url", "resourceId", "altText", "website"]) body.set(k, String(f.get(k) ?? ""));
    body.set("noPersonalInfo", String(f.get("noPersonalInfo") === "on"));
    body.set("consent", String(f.get("consent") === "on"));
    if (wantsFile && file) body.set("file", file);
    setStatus({ type: "sending" });
    try {
      const res = await fetch("/api/submissions", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus({ type: "ok" });
      form.reset();
      setFile(null);
      setPreview(null);
    } catch (err) {
      setStatus({ type: "error", message: (err as Error).message });
    }
  }

  if (status.type === "ok") {
    return (
      <div role="status" className="rounded-3xl border border-lake/40 bg-lake/10 p-8">
        <p className="font-serif text-2xl">Thanks for sharing!</p>
        <p className="mt-2 text-muted-foreground">
          A moderator checks every submission for personal information before it appears in the gallery.
        </p>
        <button type="button" onClick={() => setStatus({ type: "idle" })} className="mt-5 rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5">
          Share something else
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8" noValidate>
      <fieldset>
        <legend className={label}>What are you sharing?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {KINDS.map((k) => (
            <label
              key={k.id}
              className={cn("cursor-pointer rounded-2xl border px-4 py-3", kind === k.id ? "border-lake bg-lake/10" : "border-border hover:bg-white/5")}
            >
              <input type="radio" name="kind" value={k.id} checked={kind === k.id} onChange={() => setKind(k.id)} className="sr-only" />
              <span className="block font-medium">{k.title}</span>
              <span className="block text-sm text-muted-foreground">{k.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="sub-title" className={label}>
          Title
        </label>
        <input id="sub-title" name="title" required minLength={3} maxLength={90} className={field} placeholder="e.g. My bedtime mode setup on a Pixel" />
      </div>
      <div>
        <label htmlFor="sub-desc" className={label}>
          {kind === "tip" ? "Your tip" : "Short description (optional)"}
        </label>
        <textarea id="sub-desc" name="description" rows={3} maxLength={600} className={field} />
      </div>
      {kind !== "tip" && (
        <div>
          <label htmlFor="sub-url" className={label}>
            Link {kind === "video" ? "(required)" : "(optional)"}
          </label>
          <input id="sub-url" name="url" type="url" maxLength={300} placeholder="https://" className={field} />
        </div>
      )}
      {wantsFile && (
        <div className="space-y-4">
          <div>
            <label htmlFor="sub-file" className={label}>
              Image or GIF (max 3 MB)
            </label>
            <label
              htmlFor="sub-file"
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground hover:bg-white/5"
            >
              <ImageUp aria-hidden className="h-5 w-5 text-lake" />
              {file ? `${file.name} (${Math.round(file.size / 1024)} KB, location data removed)` : "Choose a PNG, JPEG, WebP or GIF"}
            </label>
            <input id="sub-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} className="sr-only" />
          </div>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview of your upload" className="max-h-64 rounded-2xl border border-border" />
          )}
          <div>
            <label htmlFor="sub-alt" className={label}>
              Describe the image for people who can&apos;t see it
            </label>
            <input id="sub-alt" name="altText" maxLength={240} className={field} placeholder="e.g. Android Bedtime mode screen with Grayscale switched on" />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="sub-resource" className={label}>
          Related tool (optional)
        </label>
        <select id="sub-resource" name="resourceId" className={field} defaultValue="">
          <option value="">None</option>
          {RESOURCES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.shortName}
            </option>
          ))}
        </select>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-3 rounded-2xl bg-dawn/10 p-5 text-sm">
        <label className="flex items-start gap-3">
          <input name="noPersonalInfo" type="checkbox" className="mt-0.5 h-4 w-4 accent-[#f1c9a5]" />
          <span>
            My upload shows <strong>no personal information</strong> — no names, faces, phone numbers, emails, messages,
            notifications or account details.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input name="consent" type="checkbox" className="mt-0.5 h-4 w-4 accent-[#f1c9a5]" />
          <span>I made this (or have permission to share it) and agree it can be shown on this hub after moderation.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status.type === "sending"}
        className="rounded-full bg-lake px-6 py-3 font-medium text-[#08202a] hover:bg-[#a9e2d9] disabled:opacity-60"
      >
        {status.type === "sending" ? "Sending…" : "Submit for review"}
      </button>
      {status.type === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {status.message}
        </p>
      )}
    </form>
  );
}
