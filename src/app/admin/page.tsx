"use client";

import { useCallback, useEffect, useState } from "react";

type Row = Record<string, unknown> & { _id: string; status?: string; createdAt: string };

/* Pending uploads are only served with the admin key header, so fetch them as a blob. */
function AdminImage({ id, adminKey, alt }: { id: string; adminKey: string; alt: string }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    let url: string | undefined;
    fetch(`/api/files/${id}`, { headers: { "x-admin-key": adminKey } })
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => setSrc((url = URL.createObjectURL(b))))
      .catch(() => {});
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [id, adminKey]);
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={alt} className="mt-3 max-h-60 rounded-xl" /> : null;
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [type, setType] = useState<"submissions" | "feedback">("submissions");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setKey(sessionStorage.getItem("dw-admin") ?? "");
    } catch {}
  }, []);

  const load = useCallback(async () => {
    setError("");
    const res = await fetch(`/api/admin?type=${type}`, { headers: { "x-admin-key": key } });
    if (!res.ok) {
      setRows(null);
      setError(res.status === 401 ? "Wrong key, or ADMIN_KEY is not set on the server." : "Could not load.");
      return;
    }
    try {
      sessionStorage.setItem("dw-admin", key);
    } catch {}
    setRows((await res.json()).rows);
  }, [key, type]);

  async function setStatus(id: string, status: string) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ type, id, status }),
    });
    load();
  }

  async function exportCsv() {
    const res = await fetch("/api/export/feedback", { headers: { "x-admin-key": key } });
    if (!res.ok) return setError("Export failed.");
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = "anonymous-feedback.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const actions = type === "submissions" ? ["approved", "rejected"] : ["published", "hidden"];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="font-serif text-4xl">Moderation</h1>
      <p className="mt-2 text-muted-foreground">Check submissions and comments for personal information before publishing them.</p>
      <form
        className="mt-6 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <div>
          <label htmlFor="admin-key" className="mb-1 block text-sm">
            Admin key
          </label>
          <input id="admin-key" type="password" value={key} onChange={(e) => setKey(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-2" />
        </div>
        <div>
          <label htmlFor="admin-type" className="mb-1 block text-sm">
            Show
          </label>
          <select id="admin-type" value={type} onChange={(e) => setType(e.target.value as typeof type)} className="rounded-xl border border-input bg-background px-4 py-2">
            <option value="submissions">Submissions</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
        <button className="rounded-full bg-lake px-5 py-2 font-medium text-[#08202a]">Load</button>
        <button type="button" onClick={exportCsv} className="rounded-full border border-border px-5 py-2">
          Export feedback CSV
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-4 text-destructive">
          {error}
        </p>
      )}
      {rows && (
        <ul className="mt-8 space-y-4">
          {rows.length === 0 && <li className="text-muted-foreground">Nothing here yet.</li>}
          {rows.map((r) => (
            <li key={r._id} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-dawn">
                {String(r.status)} · {r.createdAt.slice(0, 16).replace("T", " ")}
              </p>
              <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                {JSON.stringify(Object.fromEntries(Object.entries(r).filter(([k]) => !["_id", "data", "status", "createdAt"].includes(k))), null, 2)}
              </pre>
              {typeof r.fileId === "string" && <AdminImage id={r.fileId} adminKey={key} alt={String(r.altText ?? "")} />}
              <div className="mt-3 flex gap-2">
                {actions.map((a) => (
                  <button key={a} type="button" onClick={() => setStatus(r._id, a)} className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-white/5">
                    Mark {a}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
