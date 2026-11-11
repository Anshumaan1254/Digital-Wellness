"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, LayoutGrid, Table2 } from "lucide-react";
import {
  CATEGORIES,
  COST_LABEL,
  DEVICES,
  RESOURCES,
  STRICTNESS_LABEL,
  platformSummary,
  supportsDevice,
  type CategoryId,
  type CostTone,
  type DeviceId,
} from "@/data/resources";
import { CostBadge } from "@/components/site/CostBadge";
import { CalmCard } from "@/components/site/CalmCard";
import { cn } from "@/lib/utils";

type View = "cards" | "table";

const chip =
  "rounded-full border px-3.5 py-1.5 text-sm transition-colors aria-pressed:border-lake aria-pressed:bg-lake/15 aria-pressed:text-foreground border-border text-muted-foreground hover:text-foreground";

export function ResourceExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const category = (params.get("category") as CategoryId | null) ?? null;
  const device = (params.get("device") as DeviceId | null) ?? null;
  const cost = (params.get("cost") as CostTone | null) ?? null;
  const openOnly = params.get("open") === "1";
  const view: View = params.get("view") === "table" ? "table" : "cards";

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    router.replace(`/resources${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter(
      (r) =>
        (!category || r.category === category) &&
        (!device || supportsDevice(r, device)) &&
        (!cost || r.costTone === cost) &&
        (!openOnly || r.openSource) &&
        (!q || [r.name, r.shortName, r.purpose, r.bestFor, ...r.keyFeatures].join(" ").toLowerCase().includes(q))
    );
  }, [category, device, cost, openOnly, query]);

  return (
    <div>
      <form role="search" aria-label="Filter tools" className="space-y-5 rounded-3xl border border-border bg-card/60 p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="tool-search" className="mb-2 block text-sm font-medium">
            Search
          </label>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. YouTube, passwords, bedtime"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Category</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={chip} aria-pressed={!category} onClick={() => set("category", null)}>
              All
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className={chip} aria-pressed={category === c.id} onClick={() => set("category", c.id)}>
                {c.short}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Works on</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={chip} aria-pressed={!device} onClick={() => set("device", null)}>
              Any device
            </button>
            {DEVICES.map((d) => (
              <button key={d.id} type="button" className={chip} aria-pressed={device === d.id} onClick={() => set("device", d.id)}>
                {d.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-end gap-6">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Cost</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={chip} aria-pressed={!cost} onClick={() => set("cost", null)}>
                Any
              </button>
              {(Object.keys(COST_LABEL) as CostTone[]).map((t) => (
                <button key={t} type="button" className={chip} aria-pressed={cost === t} onClick={() => set("cost", t)}>
                  {COST_LABEL[t].label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex items-center gap-2 pb-1.5 text-sm">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => set("open", e.target.checked ? "1" : null)}
              className="h-4 w-4 accent-[#8fd3c8]"
            />
            Open source only
          </label>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-muted-foreground">
          Showing <strong className="text-foreground">{results.length}</strong> of {RESOURCES.length} tools
        </p>
        <div className="inline-flex rounded-full border border-border p-1" role="group" aria-label="Layout">
          <button type="button" aria-pressed={view === "cards"} onClick={() => set("view", null)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground aria-pressed:bg-white/10 aria-pressed:text-foreground">
            <LayoutGrid aria-hidden className="h-4 w-4" /> Cards
          </button>
          <button type="button" aria-pressed={view === "table"} onClick={() => set("view", "table")} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground aria-pressed:bg-white/10 aria-pressed:text-foreground">
            <Table2 aria-hidden className="h-4 w-4" /> Comparison table
          </button>
        </div>
      </div>

      {results.length === 0 && (
        <p className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No tool matches all of those filters. Try removing one, or use the{" "}
          <Link href="/find" className="inline-link">
            tool finder
          </Link>
          .
        </p>
      )}

      {view === "cards" ? (
        <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((r) => (
            <li key={r.id}>
              <CalmCard className="h-full">
                <article className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-2xl leading-tight">{r.shortName}</h3>
                    <CostBadge tone={r.costTone} />
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-dawn">{CATEGORIES.find((c) => c.id === r.category)?.short}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground">{r.purpose}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="inline text-muted-foreground">Works on: </dt>
                      <dd className="inline">{platformSummary(r).join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="inline text-muted-foreground">Cost: </dt>
                      <dd className="inline">{r.costShort}</dd>
                    </div>
                    <div>
                      <dt className="inline text-muted-foreground">Account: </dt>
                      <dd className="inline">{r.account === "none" ? "Not needed" : r.account === "optional" ? "Optional" : "Required"}</dd>
                    </div>
                    {r.strictness && (
                      <div>
                        <dt className="inline text-muted-foreground">Style: </dt>
                        <dd className="inline">{STRICTNESS_LABEL[r.strictness]}</dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-4 flex-1 text-sm text-muted-foreground">
                    <span className="font-medium text-[#f6d3b3]">Watch out: </span>
                    {r.limitations[0]}
                  </p>
                  <Link
                    href={`/resources/${r.id}`}
                    className="relative z-[2] mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-lake hover:text-dawn"
                  >
                    Full comparison and sources for {r.shortName} <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                </article>
              </CalmCard>
            </li>
          ))}
        </ul>
      ) : (
        results.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-3xl border border-border" tabIndex={0} role="region" aria-label="Comparison table, scrolls sideways">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of digital wellness tools by purpose, devices, cost, privacy, accessibility and limitations</caption>
              <thead className="bg-[#13273a] text-xs uppercase tracking-wider text-mist">
                <tr>
                  {["Tool", "Purpose", "Devices", "Cost", "Privacy", "Accessibility", "Main limitation", "Checked"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.id} className={cn("align-top", i % 2 ? "bg-[#0f1e2d]" : "bg-card")}>
                    <th scope="row" className="px-4 py-4 font-medium">
                      <Link href={`/resources/${r.id}`} className="text-lake underline-offset-4 hover:underline">
                        {r.shortName}
                      </Link>
                      <div className="mt-2">
                        <CostBadge tone={r.costTone} />
                      </div>
                    </th>
                    <td className="px-4 py-4 text-muted-foreground">{r.purpose}</td>
                    <td className="px-4 py-4">{r.platforms.join(", ")}</td>
                    <td className="px-4 py-4">{r.costShort}</td>
                    <td className="px-4 py-4 text-muted-foreground">{r.privacyShort}</td>
                    <td className="px-4 py-4 text-muted-foreground">{r.accessibilityShort}</td>
                    <td className="px-4 py-4 text-muted-foreground">{r.limitations[0]}</td>
                    <td className="whitespace-nowrap px-4 py-4">{r.dateChecked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
