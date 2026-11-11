"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export function HelpfulVote({ target, label }: { target: string; label: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function vote(helpful: boolean) {
    setState("sending");
    try {
      const res = await fetch("/api/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, helpful }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
      <p className="text-sm">{label}</p>
      {state === "done" ? (
        <p role="status" className="text-sm text-lake">
          Thank you — your vote was saved anonymously.
        </p>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={state === "sending"}
            onClick={() => vote(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-white/5"
          >
            <ThumbsUp aria-hidden className="h-4 w-4" /> Yes
          </button>
          <button
            type="button"
            disabled={state === "sending"}
            onClick={() => vote(false)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-white/5"
          >
            <ThumbsDown aria-hidden className="h-4 w-4" /> No
          </button>
        </div>
      )}
      {state === "error" && (
        <p role="status" className="text-sm text-destructive">
          Sorry, that didn&apos;t save. Please try again later.
        </p>
      )}
    </div>
  );
}
