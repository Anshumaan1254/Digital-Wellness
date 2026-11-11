import verified from "./resources.verified.json";
import meta from "./resource-meta.json";

export type Source = { url: string; what: string; quote: string };
export type CostTone = "free" | "free-core" | "limited";
export type Goal = "screen-time" | "notifications" | "sleep" | "focus" | "block-sites" | "privacy" | "security";
export type Strictness = "gentle" | "adjustable" | "strict" | null;
export type CategoryId = "phone-bedtime" | "focus" | "browser" | "privacy";

export type Resource = (typeof verified)[number] & {
  shortName: string;
  category: CategoryId;
  goals: Goal[];
  strictness: Strictness;
  costTone: CostTone;
  costShort: string;
  account: "none" | "optional" | "required";
  bestFor: string;
  privacyShort: string;
  accessibilityShort: string;
  install: { label: string; url: string }[];
  guide: string | null;
};

export type Category = { id: CategoryId; name: string; short: string; description: string };

export const CATEGORIES = meta.categories as Category[];

export const RESOURCES: Resource[] = verified.map((r) => {
  const extra = (meta.resources as Record<string, unknown>)[r.id];
  if (!extra) throw new Error(`No hub metadata for ${r.id}`);
  return { ...r, ...(extra as object) } as Resource;
});

export function getResource(id: string) {
  return RESOURCES.find((r) => r.id === id);
}

export const COST_LABEL: Record<CostTone, { label: string; hint: string }> = {
  free: { label: "Free", hint: "Everything you need costs nothing." },
  "free-core": { label: "Free core · paid extras", hint: "The essential features are free; some extras are paid." },
  limited: { label: "Limited free · key features paid", hint: "Important features such as scheduling or locking need payment." },
};

export const GOAL_LABEL: Record<Goal, string> = {
  "screen-time": "See and limit screen time",
  notifications: "Fewer notifications",
  sleep: "Better bedtime routine",
  focus: "Focus while studying",
  "block-sites": "Block distracting sites",
  privacy: "Stop trackers",
  security: "Protect my accounts",
};

export const STRICTNESS_LABEL: Record<Exclude<Strictness, null>, string> = {
  gentle: "Gentle nudges",
  adjustable: "Can be made strict",
  strict: "Strict locks",
};

/* Devices a student picks in the finder, mapped to the platform names used in the data. */
export const DEVICES = [
  { id: "iphone", label: "iPhone or iPad", platforms: ["iOS", "iPadOS"] },
  { id: "android", label: "Android phone", platforms: ["Android"] },
  { id: "windows", label: "Windows laptop", platforms: ["Windows", "Chrome", "Firefox", "Edge", "Web"] },
  { id: "mac", label: "Mac", platforms: ["macOS", "Chrome", "Firefox", "Safari", "Edge", "Web"] },
  { id: "chromebook", label: "Chromebook", platforms: ["ChromeOS", "Chrome", "Web"] },
  { id: "linux", label: "Linux", platforms: ["Linux", "Chrome", "Firefox", "Web"] },
] as const;

export type DeviceId = (typeof DEVICES)[number]["id"];

export function supportsDevice(r: Resource, device: DeviceId) {
  const d = DEVICES.find((x) => x.id === device)!;
  return r.platforms.some((p) => (d.platforms as readonly string[]).includes(p));
}

export const PLATFORM_GROUPS: { label: string; match: string[] }[] = [
  { label: "iPhone/iPad", match: ["iOS", "iPadOS"] },
  { label: "Android", match: ["Android"] },
  { label: "Windows", match: ["Windows"] },
  { label: "Mac", match: ["macOS"] },
  { label: "Linux", match: ["Linux"] },
  { label: "ChromeOS", match: ["ChromeOS"] },
  { label: "Browser", match: ["Chrome", "Firefox", "Edge", "Safari", "Opera", "Brave", "Vivaldi", "Web"] },
];

export function platformSummary(r: Resource) {
  return PLATFORM_GROUPS.filter((g) => r.platforms.some((p) => g.match.includes(p))).map((g) => g.label);
}
