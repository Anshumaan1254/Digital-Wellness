"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import PeekRating from "@/components/reactbits/PeekRating";
import { RESOURCES } from "@/data/resources";
import { GUIDES } from "@/data/content";
import { cn } from "@/lib/utils";

const field = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground";
const label = "mb-1.5 block text-sm font-medium";

function Choice({ name, value, current, onChange, children }: { name: string; value: string; current?: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className={cn("cursor-pointer rounded-full border px-4 py-2 text-sm has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-dawn", current === value ? "border-lake bg-lake/15" : "border-border hover:bg-white/5")}>
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} className="sr-only" />
      {children}
    </label>
  );
}

export function FeedbackForm() {
  const params = useSearchParams();
  const [kind, setKind] = useState<"usability-test" | "general">(params.get("guide") ? "usability-test" : "general");
  const [rating, setRating] = useState(0);
  const [found, setFound] = useState<string>();
  const [completed, setCompleted] = useState<string>();
  const [status, setStatus] = useState<{ type: "idle" | "sending" | "ok" | "error"; message?: string }>({ type: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (!rating) {
      setStatus({ type: "error", message: "Please choose a star rating." });
      return;
    }
    setStatus({ type: "sending" });
    const minutes = Number(f.get("minutes"));
    const body = {
      kind,
      rating,
      foundResource: kind === "usability-test" ? found : undefined,
      resourceId: f.get("resourceId") || "",
      guideSlug: f.get("guideSlug") || "",
      guideCompleted: kind === "usability-test" ? completed ?? "not-tried" : undefined,
      minutes: Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : undefined,
      problems: f.get("problems") || "",
      suggestions: f.get("suggestions") || "",
      studentLevel: f.get("studentLevel") || "prefer-not",
      device: f.get("device") || "",
      consent: f.get("consent") === "on",
      website: f.get("website") || "",
    };
    try {
      const res = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus({ type: "ok" });
      form.reset();
      setRating(0);
    } catch (err) {
      setStatus({ type: "error", message: (err as Error).message });
    }
  }

  if (status.type === "ok") {
    return (
      <div role="status" className="rounded-3xl border border-lake/40 bg-lake/10 p-8">
        <p className="font-serif text-2xl">Thank you — your feedback was saved anonymously.</p>
        <p className="mt-2 text-muted-foreground">We read every response and list the changes we make on the Revisions page.</p>
        <button type="button" onClick={() => setStatus({ type: "idle" })} className="mt-5 rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5">
          Send another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8" noValidate>
      <fieldset>
        <legend className={label}>What kind of feedback is this?</legend>
        <div className="flex flex-wrap gap-2">
          <Choice name="kind" value="usability-test" current={kind} onChange={(v) => setKind(v as typeof kind)}>
            I tested the hub (found a tool and followed a guide)
          </Choice>
          <Choice name="kind" value="general" current={kind} onChange={(v) => setKind(v as typeof kind)}>
            General feedback
          </Choice>
        </div>
      </fieldset>

      {kind === "usability-test" && (
        <div className="space-y-5 rounded-2xl bg-[#0f1e2d] p-5">
          <fieldset>
            <legend className={label}>Task 1 — Could you find a tool that suits you?</legend>
            <div className="flex flex-wrap gap-2">
              {["yes", "partly", "no"].map((v) => (
                <Choice key={v} name="found" value={v} current={found} onChange={setFound}>
                  {v[0].toUpperCase() + v.slice(1)}
                </Choice>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={label}>Task 2 — Did you finish the setup guide?</legend>
            <div className="flex flex-wrap gap-2">
              {[
                ["yes", "Yes"],
                ["partly", "Partly"],
                ["no", "No"],
                ["not-tried", "Didn't try"],
              ].map(([v, t]) => (
                <Choice key={v} name="completed" value={v} current={completed} onChange={setCompleted}>
                  {t}
                </Choice>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="fb-minutes" className={label}>
              Roughly how many minutes did it take? (optional)
            </label>
            <input id="fb-minutes" name="minutes" type="number" min={0} max={240} inputMode="numeric" className={cn(field, "max-w-[160px]")} />
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-resource" className={label}>
            Which tool did you look at?
          </label>
          <select id="fb-resource" name="resourceId" className={field} defaultValue="">
            <option value="">None / not sure</option>
            {RESOURCES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.shortName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fb-guide" className={label}>
            Which guide did you follow?
          </label>
          <select id="fb-guide" name="guideSlug" className={field} defaultValue={params.get("guide") ?? ""}>
            <option value="">None</option>
            {GUIDES.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p id="fb-rating-label" className={label}>
          Overall, how useful was the hub?
        </p>
        <PeekRating
          value={rating}
          onChange={setRating}
          labels={["Not useful", "A little useful", "Useful", "Very useful", "Extremely useful"]}
          activeColor="#f1c9a5"
          idleColor="#3a4a5c"
          tipColor="#f1c9a5"
          tipTextColor="#1b1410"
          size={30}
          ariaLabel="Overall usefulness rating, 1 to 5 stars"
        />
      </div>

      <div>
        <label htmlFor="fb-problems" className={label}>
          Where did you get stuck or confused?
        </label>
        <textarea id="fb-problems" name="problems" rows={3} maxLength={1200} className={field} placeholder="e.g. I couldn't find the Options button in step 2" />
      </div>
      <div>
        <label htmlFor="fb-suggestions" className={label}>
          What should we change or add?
        </label>
        <textarea id="fb-suggestions" name="suggestions" rows={3} maxLength={1200} className={field} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-level" className={label}>
            You are… (optional)
          </label>
          <select id="fb-level" name="studentLevel" className={field} defaultValue="prefer-not">
            <option value="prefer-not">Prefer not to say</option>
            <option value="secondary">A secondary / high-school student</option>
            <option value="undergraduate">An undergraduate</option>
            <option value="postgraduate">A postgraduate</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="fb-device" className={label}>
            Device you used (optional)
          </label>
          <input id="fb-device" name="device" maxLength={40} className={field} placeholder="e.g. Android phone, Windows laptop" />
        </div>
      </div>

      {/* Honeypot for spam bots — hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#8fd3c8]" />
        <span>
          I agree that my anonymous answers can be shown on this site and used in the project report. I have not included
          my name, email or anyone else&apos;s personal details.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.type === "sending"}
          className="rounded-full bg-dawn px-6 py-3 font-medium text-[#1b1410] hover:bg-[#f6d7b9] disabled:opacity-60"
        >
          {status.type === "sending" ? "Sending…" : "Send anonymous feedback"}
        </button>
        <p className="text-sm text-muted-foreground">We don&apos;t collect names, emails or IP addresses.</p>
      </div>
      {status.type === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {status.message}
        </p>
      )}
    </form>
  );
}
