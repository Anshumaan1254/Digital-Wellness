import { Check, Star } from "lucide-react";
import data from "@/data/usability-tests.json";
import { Reveal } from "@/components/site/Reveal";

/* Feedback from the prototype's student testers, shown the way visitor feedback appears on the hub. */
export function StudentTesterQuotes() {
  return (
    <div>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.participants.map((p, i) => {
          const age = p.persona.match(/\d+/)?.[0];
          // each tester's own biggest problem (all of them were fixed after the test)
          const found = p.topProblems[0];
          return (
            <li key={p.id}>
              <Reveal delay={(i % 3) * 0.08} className="flex h-full flex-col rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-lake/50 bg-lake/10 font-medium text-lake">
                    {p.id}
                  </span>
                  <div>
                    <p className="font-medium">Student tester{age ? `, ${age}` : ""}</p>
                    <p className="text-sm text-muted-foreground">{p.device}</p>
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-1" role="img" aria-label={`Rated ${p.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} aria-hidden className={`h-4 w-4 ${n <= p.rating ? "fill-dawn text-dawn" : "text-white/20"}`} />
                  ))}
                </p>
                <blockquote className="mt-4 flex-1 font-serif text-lg leading-snug text-[#dbe5ee]">&ldquo;{p.quote}&rdquo;</blockquote>
                <p className="mt-5 text-sm text-muted-foreground">
                  Chose <span className="text-foreground">{p.toolChosen}</span> · rated it {p.rating}/5
                </p>
                {found && (
                  <p className="mt-3 flex gap-2 rounded-2xl bg-lake/10 p-3 text-sm">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lake" />
                    <span>
                      <span className="text-muted-foreground">They found: </span>
                      {found.charAt(0).toLowerCase() + found.slice(1)} — <span className="text-lake">now fixed</span>
                    </span>
                  </p>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-xs text-muted-foreground">
        Responses from simulated student personas used to test this prototype. Feedback from real visitors appears in the
        live results below as it arrives.
      </p>
    </div>
  );
}
