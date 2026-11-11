import guides from "./guides.json";
import research from "./research.json";

export type GuideImage = {
  src?: string;
  illustration?: string;
  alt: string;
  caption: string;
  kind: "screenshot" | "illustration";
};

export type GuideStep = {
  title: string;
  body: string;
  platform?: string;
  image?: GuideImage;
  tip?: string;
};

export type Guide = {
  slug: string;
  title: string;
  tool: string;
  resources: string[];
  category: string;
  minutes: number;
  difficulty: string;
  devices: string;
  summary: string;
  why: string;
  screenshotNote: string;
  steps: GuideStep[];
  troubleshooting: { q: string; a: string }[];
  sources: { label: string; url: string }[];
};

export const GUIDES = guides as Guide[];
export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

export type Need = (typeof research.needs)[number];
export type FeedbackStudy = (typeof research.userFeedbackResearch)[number];
export type Video = (typeof research.videos)[number];

export const NEEDS: Need[] = research.needs;
export const FEEDBACK_STUDIES: FeedbackStudy[] = research.userFeedbackResearch;
export const VIDEOS: Video[] = research.videos;
