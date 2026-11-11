"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Stepper, { Step } from "@/components/reactbits/Stepper";
import { BorderBeam } from "@/components/ui/border-beam";
import { CostBadge } from "@/components/site/CostBadge";
import { DEVICES, GOAL_LABEL, platformSummary, type DeviceId, type Goal } from "@/data/resources";
import { recommend, type FinderAnswers } from "@/lib/recommend";
import { cn } from "@/lib/utils";

const GOALS: { id: Goal; hint: string }[] = [
  { id: "focus", hint: "Stay on task during homework and revision" },
  { id: "block-sites", hint: "Stop YouTube, social media or games pulling you away" },
  { id: "screen-time", hint: "Know how long you spend and set daily limits" },
  { id: "notifications", hint: "Fewer pings while studying" },
  { id: "sleep", hint: "Put the phone down at night" },
  { id: "security", hint: "Strong passwords and breach alerts" },
  { id: "privacy", hint: "Less tracking while you browse" },
];

function Option({
  checked,
  onChange,
  type,
  name,
  title,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  type: "checkbox" | "radio";
  name: string;
  title: string;
  hint?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors",
        checked ? "border-lake bg-lake/10" : "border-border hover:bg-white/5"
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="mt-1 h-4 w-4 shrink-0 accent-[#8fd3c8]" />
      <span>
        <span className="block font-medium text-foreground">{title}</span>
        {hint && <span className="block text-sm text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

const INITIAL: FinderAnswers = {
  goals: [],
  devices: [],
  budget: "free-core-ok",
  strictness: "either",
  noAccount: false,
  openSourcePreferred: false,
};

export function ToolFinder() {
  const [step, setStep] = useState(1);
  const [a, setA] = useState<FinderAnswers>(INITIAL);
  const resultsRef = useRef<HTMLDivElement>(null);
  const done = step > 4;
  const results = useMemo(() => (done ? recommend(a) : []), [a, done]);

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const canContinue = (step === 1 && a.goals.length > 0) || (step === 2 && a.devices.length > 0) || step >= 3;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,560px)_1fr]">
      <div>
        <Stepper
          step={step}
          onStepChange={setStep}
          onFinalStepCompleted={() => {
            setStep(5);
            setTimeout(() => resultsRef.current?.focus(), 50);
          }}
          accentColor="#8fd3c8"
          width="100%"
          linear
          nextButtonText="Continue"
          completeButtonText="Show my matches"
          nextButtonProps={{ disabled: !canContinue }}
          completedContent={
            <div className="space-y-4 p-2 text-center">
              <p className="font-serif text-2xl">Your matches are ready.</p>
              <button
                type="button"
                onClick={() => {
                  setA(INITIAL);
                  setStep(1);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-white/5"
              >
                <RotateCcw aria-hidden className="h-4 w-4" /> Start again
              </button>
            </div>
          }
          style={{ ["--stepper-surface" as string]: "#112131" }}
        >
          <Step title="Goals">
            <fieldset className="space-y-2 p-1">
              <legend className="mb-3 font-serif text-xl">What do you want help with?</legend>
              <p className="mb-3 text-sm text-muted-foreground">Choose one or more.</p>
              {GOALS.map((g) => (
                <Option
                  key={g.id}
                  type="checkbox"
                  name="goals"
                  checked={a.goals.includes(g.id)}
                  onChange={() => setA({ ...a, goals: toggle(a.goals, g.id) })}
                  title={GOAL_LABEL[g.id]}
                  hint={g.hint}
                />
              ))}
            </fieldset>
          </Step>
          <Step title="Devices">
            <fieldset className="space-y-2 p-1">
              <legend className="mb-3 font-serif text-xl">Which devices do you use?</legend>
              <p className="mb-3 text-sm text-muted-foreground">Choose every device you want the tool to work on.</p>
              {DEVICES.map((d) => (
                <Option
                  key={d.id}
                  type="checkbox"
                  name="devices"
                  checked={a.devices.includes(d.id as DeviceId)}
                  onChange={() => setA({ ...a, devices: toggle(a.devices, d.id as DeviceId) })}
                  title={d.label}
                />
              ))}
            </fieldset>
          </Step>
          <Step title="Budget">
            <fieldset className="space-y-2 p-1">
              <legend className="mb-3 font-serif text-xl">How much can you spend?</legend>
              <Option type="radio" name="budget" checked={a.budget === "free-only"} onChange={() => setA({ ...a, budget: "free-only" })} title="Nothing — free only" hint="We hide tools whose key features need payment." />
              <Option type="radio" name="budget" checked={a.budget === "free-core-ok"} onChange={() => setA({ ...a, budget: "free-core-ok" })} title="Free is best, but optional extras are fine" />
              <Option type="radio" name="budget" checked={a.budget === "will-pay"} onChange={() => setA({ ...a, budget: "will-pay" })} title="I can pay if it's worth it" />
            </fieldset>
          </Step>
          <Step title="Style">
            <fieldset className="space-y-2 p-1">
              <legend className="mb-3 font-serif text-xl">How firm should it be?</legend>
              <Option type="radio" name="strict" checked={a.strictness === "gentle"} onChange={() => setA({ ...a, strictness: "gentle" })} title="Gentle reminders" hint="Easy to pause when you really need to." />
              <Option type="radio" name="strict" checked={a.strictness === "strict"} onChange={() => setA({ ...a, strictness: "strict" })} title="Strict — lock me out" hint="Research shows hard limits work better, but can be frustrating." />
              <Option type="radio" name="strict" checked={a.strictness === "either"} onChange={() => setA({ ...a, strictness: "either" })} title="Not sure" />
              <div className="mt-5 space-y-2 border-t border-border pt-5">
                <Option type="checkbox" name="prefs" checked={a.noAccount} onChange={() => setA({ ...a, noAccount: !a.noAccount })} title="I'd rather not create an account" />
                <Option type="checkbox" name="prefs" checked={a.openSourcePreferred} onChange={() => setA({ ...a, openSourcePreferred: !a.openSourcePreferred })} title="I prefer open-source tools" />
              </div>
            </fieldset>
          </Step>
        </Stepper>
        {!canContinue && step <= 2 && (
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            Choose at least one option to continue.
          </p>
        )}
      </div>

      <div ref={resultsRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {!done ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-muted-foreground">
            <h2 className="font-serif text-2xl text-foreground">How the finder decides</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>A tool must run on at least one of your devices and help with at least one of your goals.</li>
              <li>Free tools get a small boost. If you choose &ldquo;free only&rdquo;, tools whose key features cost money are left out.</li>
              <li>We show the reasons for every match and the main thing to watch out for, so you can decide yourself.</li>
            </ul>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-serif text-2xl">No exact match</h2>
            <p className="mt-2 text-muted-foreground">
              Nothing fits every answer. Try adding another device or allowing paid extras, or{" "}
              <Link href="/resources" className="inline-link">
                browse all tools
              </Link>
              .
            </p>
          </div>
        ) : (
          <div>
            <h2 className="font-serif text-3xl">Your best matches</h2>
            <p className="mt-2 text-muted-foreground">
              {results.length} tool{results.length > 1 ? "s" : ""} fit your answers. Start with the first one.
            </p>
            <ol className="mt-6 space-y-5">
              {results.slice(0, 4).map((m, i) => (
                <li key={m.resource.id} className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
                  {i === 0 && <BorderBeam size={120} duration={9} colorFrom="#8fd3c8" colorTo="#f1c9a5" />}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-dawn">{i === 0 ? "Top match" : `Match ${i + 1}`}</p>
                      <h3 className="mt-1 font-serif text-2xl">{m.resource.shortName}</h3>
                    </div>
                    <CostBadge tone={m.resource.costTone} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Works on {platformSummary(m.resource).join(", ")}</p>
                  <ul className="mt-4 space-y-1.5 text-[15px]">
                    {m.reasons.map((r) => (
                      <li key={r} className="flex gap-2">
                        <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-lake" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-2xl bg-[#3e2f24]/40 p-4 text-sm">
                    <p className="font-medium text-[#f6d3b3]">Watch out</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {m.cautions.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
                    <Link href={`/resources/${m.resource.id}`} className="inline-flex items-center gap-1.5 text-lake hover:text-dawn">
                      Compare {m.resource.shortName} in detail <ArrowRight aria-hidden className="h-4 w-4" />
                    </Link>
                    {m.resource.guide && (
                      <Link href={`/guides/${m.resource.guide}`} className="inline-flex items-center gap-1.5 text-lake hover:text-dawn">
                        Setup guide <ArrowRight aria-hidden className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
