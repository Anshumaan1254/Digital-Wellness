import { Bot, Check, Minus } from "lucide-react";
import data from "@/data/usability-tests.json";
import { cn } from "@/lib/utils";

const OUTCOME: Record<string, string> = { yes: "Yes", partly: "Partly", no: "No" };
const SEV: Record<string, string> = {
  high: "bg-[#4a2326] text-[#f2a7a0]",
  medium: "bg-[#3e2f24] text-[#f6d3b3]",
  low: "bg-white/10 text-muted-foreground",
};

export function SimulatedTest() {
  const p = data.participants;
  const found = p.filter((x) => x.foundSuitableTool === "yes").length;
  const avg = Math.round((p.reduce((s, x) => s + x.rating, 0) / p.length) * 10) / 10;
  const reported = p.reduce((s, x) => s + x.problemsReported, 0);
  const fixed = data.fixes.filter((f) => f.status === "fixed").length;

  return (
    <div className="space-y-12">
      <div className="flex gap-4 rounded-3xl border border-heather/30 bg-heather/5 p-6">
        <Bot aria-hidden className="mt-1 h-6 w-6 shrink-0 text-heather" />
        <div>
          <p className="font-medium text-heather">{data.label}</p>
          <p className="mt-2 leading-relaxed">{data.method}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong className="text-foreground">Limits:</strong> {data.limits} Run on {data.runOn}.
          </p>
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [`${found} of ${p.length}`, "found a suitable tool"],
          [`${avg} / 5`, "average rating"],
          [String(reported), "problems reported"],
          [`${fixed} of ${data.fixes.length}`, "grouped problems fixed"],
        ].map(([v, k]) => (
          <div key={k} className="rounded-3xl border border-border bg-card p-5">
            <dd className="font-serif text-4xl text-dawn">{v}</dd>
            <dt className="mt-1 text-sm text-muted-foreground">{k}</dt>
          </div>
        ))}
      </dl>

      <div>
        <h3 className="font-serif text-2xl">Who took part, and how it went</h3>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-border" role="region" aria-label="Simulated participants table, scrolls sideways" tabIndex={0}>
          <table className="w-full min-w-[980px] text-left text-sm">
            <caption className="sr-only">Simulated test participants, the tool each chose, and their outcomes</caption>
            <thead className="bg-[#13273a] text-xs uppercase tracking-wider text-mist">
              <tr>
                {["Agent", "Persona", "Set-up", "Tool chosen", "Found a tool?", "Guide followed", "Rating", "In their words"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.map((x) => (
                <tr key={x.id} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-3 font-serif text-lg text-lake">
                    {x.id}
                  </th>
                  <td className="px-4 py-3 text-muted-foreground">{x.persona}</td>
                  <td className="px-4 py-3">{x.device}</td>
                  <td className="px-4 py-3">{x.toolChosen}</td>
                  <td className="px-4 py-3">
                    {OUTCOME[x.foundSuitableTool]} ({x.confidence} confidence)
                  </td>
                  <td className="px-4 py-3">
                    {x.guide} — {OUTCOME[x.guideCompleted]}
                  </td>
                  <td className="px-4 py-3">{x.rating}/5</td>
                  <td className="px-4 py-3 italic text-[#cfdbe5]">&ldquo;{x.quote}&rdquo;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          &ldquo;Partly&rdquo; for guides means each agent read every step, checked the pictures and opened every link, but could
          not install software or change real phone settings.
        </p>
      </div>

      <div>
        <h3 className="font-serif text-2xl">What they found, and what we changed</h3>
        <ul className="mt-4 space-y-3">
          {data.fixes.map((f) => (
            <li key={f.problem} className="grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", SEV[f.severity])}>{f.severity}</span>
                  <span className="text-xs text-mist">{f.participants.join(", ")}</span>
                </p>
                <p className="mt-2 font-medium">{f.problem}</p>
              </div>
              <p className="flex gap-2 text-sm text-muted-foreground">
                {f.status === "fixed" ? (
                  <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lake" />
                ) : (
                  <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-dawn" />
                )}
                <span>
                  <span className="sr-only">{f.status === "fixed" ? "Fixed: " : "Not changed: "}</span>
                  {f.change}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
