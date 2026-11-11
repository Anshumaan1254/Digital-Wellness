import { RESOURCES, supportsDevice, type DeviceId, type Goal, type Resource } from "@/data/resources";

export type FinderAnswers = {
  goals: Goal[];
  devices: DeviceId[];
  budget: "free-only" | "free-core-ok" | "will-pay";
  strictness: "gentle" | "strict" | "either";
  noAccount: boolean;
  openSourcePreferred: boolean;
};

export type Recommendation = {
  resource: Resource;
  score: number;
  reasons: string[];
  cautions: string[];
};

/*
 * Transparent scoring so students can see *why* a tool is suggested.
 * A tool is only recommended if it runs on at least one of the chosen
 * devices and matches at least one goal; everything else is a nudge.
 */
export function recommend(a: FinderAnswers): Recommendation[] {
  const out: Recommendation[] = [];

  for (const r of RESOURCES) {
    const goalHits = r.goals.filter((g) => a.goals.includes(g));
    const deviceHits = a.devices.filter((d) => supportsDevice(r, d));
    if (!goalHits.length || !deviceHits.length) continue;
    if (a.budget === "free-only" && r.costTone === "limited") continue;

    const reasons: string[] = [];
    const cautions: string[] = [];
    let score = goalHits.length * 3 + Math.min(deviceHits.length, 3);

    reasons.push(`Helps with ${goalHits.length === 1 ? "your goal" : `${goalHits.length} of your goals`}: ${r.bestFor}`);

    if (r.costTone === "free") {
      score += 2;
      reasons.push(r.costShort.startsWith("Built in") ? "Already on your device, so there is nothing to buy." : "Free to use.");
    } else if (r.costTone === "free-core") {
      score += a.budget === "free-only" ? 0 : 1;
      cautions.push(`Cost: ${r.costShort}.`);
    } else {
      score += a.budget === "will-pay" ? 1 : -2;
      cautions.push(`Key features cost money: ${r.costShort}.`);
    }

    if (a.strictness !== "either" && r.strictness) {
      if (r.strictness === a.strictness) {
        score += 2;
        reasons.push(a.strictness === "strict" ? "Its blocks are hard to undo, as you asked." : "Uses gentle nudges rather than hard locks.");
      } else if (r.strictness === "adjustable") {
        score += 1;
      } else {
        score -= 1;
        cautions.push(r.strictness === "strict" ? "Its blocks are very hard to undo." : "Its limits are easy to switch off.");
      }
    }

    if (a.noAccount) {
      if (r.account === "none") score += 1;
      if (r.account === "required") {
        score -= 2;
        cautions.push("Needs an account.");
      }
    }
    if (a.openSourcePreferred && r.openSource) {
      score += 1.5;
      reasons.push(`Open source (${r.licence}).`);
    }

    const missing = a.devices.filter((d) => !supportsDevice(r, d));
    if (missing.length && a.devices.length > 1) {
      cautions.push(`Doesn't cover every device you picked.`);
    }
    cautions.push(r.limitations[0]);

    out.push({ resource: r, score, reasons, cautions });
  }

  return out.sort((x, y) => y.score - x.score);
}
