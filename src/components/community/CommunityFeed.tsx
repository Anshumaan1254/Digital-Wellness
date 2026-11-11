"use client";

import { useEffect, useState } from "react";
import { YouTubeFacade } from "@/components/media/YouTubeFacade";
import { getResource } from "@/data/resources";
import { getGuide } from "@/data/content";

type Summary = {
  total: number;
  usabilityTests: number;
  averageRating: number;
  foundResource: Record<string, number>;
  guideCompleted: Record<string, number>;
  comments: {
    id: string;
    date: string;
    kind: string;
    rating: number;
    guideSlug?: string;
    resourceId?: string;
    problems?: string;
    suggestions?: string;
  }[];
};

type Submission = {
  _id: string;
  kind: string;
  title: string;
  description?: string;
  url?: string;
  altText?: string;
  fileId?: string | null;
  createdAt: string;
};

function youTubeId(url?: string) {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m?.[1];
}

export function FeedbackSummary() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const load = () =>
      fetch("/api/feedback", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(setData)
        .catch(() => setError(true));
    load();
    // refresh as soon as someone on this page sends feedback
    window.addEventListener("dw:feedback-sent", load);
    return () => window.removeEventListener("dw:feedback-sent", load);
  }, []);

  if (error) return <p className="text-muted-foreground">Feedback results are unavailable right now.</p>;
  if (!data) return <p className="text-muted-foreground">Loading feedback…</p>;
  if (data.total === 0)
    return (
      <p className="rounded-3xl border border-dashed border-border p-8 text-muted-foreground">
        No feedback yet — you could be the first. Results appear here as soon as people respond.
      </p>
    );

  return (
    <div className="space-y-6">
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6">
          <dt className="text-sm text-muted-foreground">Responses</dt>
          <dd className="font-serif text-4xl text-dawn">{data.total}</dd>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <dt className="text-sm text-muted-foreground">Usability tests</dt>
          <dd className="font-serif text-4xl text-dawn">{data.usabilityTests}</dd>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <dt className="text-sm text-muted-foreground">Average rating</dt>
          <dd className="font-serif text-4xl text-dawn">{data.averageRating} / 5</dd>
        </div>
      </dl>
      {data.comments.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {data.comments.map((c) => (
            <li key={c.id} className="rounded-3xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-dawn">
                {c.kind === "usability-test" ? "Usability test" : "Feedback"} · {c.date} · {c.rating}/5
              </p>
              {c.guideSlug && <p className="mt-1 text-sm text-mist">Guide: {getGuide(c.guideSlug)?.title ?? c.guideSlug}</p>}
              {c.resourceId && <p className="text-sm text-mist">Tool: {getResource(c.resourceId)?.shortName ?? c.resourceId}</p>}
              {c.problems && (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Stuck: </span>
                  {c.problems}
                </p>
              )}
              {c.suggestions && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Suggestion: </span>
                  {c.suggestions}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SubmissionGallery() {
  const [items, setItems] = useState<Submission[] | null>(null);
  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((j) => setItems(j.submissions ?? []))
      .catch(() => setItems([]));
  }, []);

  if (!items) return <p className="text-muted-foreground">Loading shared work…</p>;
  if (items.length === 0)
    return (
      <p className="rounded-3xl border border-dashed border-border p-8 text-muted-foreground">
        Nothing has been approved yet. Shared videos, animations, app screens and tips will appear here after moderation.
      </p>
    );

  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => {
        const yt = youTubeId(s.url);
        return (
          <li key={s._id} className="overflow-hidden rounded-3xl border border-border bg-card">
            {yt ? (
              <YouTubeFacade id={yt} title={s.title} />
            ) : s.fileId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/files/${s.fileId}`} alt={s.altText || ""} loading="lazy" className="max-h-80 w-full object-contain bg-[#0b1622]" />
            ) : null}
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-dawn">{s.kind.replace("-", " ")}</p>
              <h3 className="mt-1 font-serif text-xl">{s.title}</h3>
              {s.description && <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>}
              {s.url && !yt && (
                <a href={s.url} rel="noopener nofollow ugc" className="mt-3 inline-block text-sm text-lake underline underline-offset-4">
                  Open the shared link for &ldquo;{s.title}&rdquo;
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
