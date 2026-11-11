import { z } from "zod";

const shortText = (max: number) => z.string().trim().max(max).optional().default("");

export const feedbackSchema = z.object({
  kind: z.enum(["usability-test", "general"]),
  rating: z.number().int().min(1).max(5),
  foundResource: z.enum(["yes", "partly", "no"]).optional(),
  resourceId: shortText(60),
  guideSlug: shortText(60),
  guideCompleted: z.enum(["yes", "partly", "no", "not-tried"]).optional(),
  minutes: z.number().int().min(0).max(240).optional(),
  problems: shortText(1200),
  suggestions: shortText(1200),
  studentLevel: z.enum(["secondary", "undergraduate", "postgraduate", "other", "prefer-not"]).default("prefer-not"),
  device: shortText(40),
  consent: z.literal(true, { message: "Please tick the consent box so we can use your anonymous answers." }),
  website: z.string().max(0).optional().default(""), // honeypot: real people leave it empty
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export const SUBMISSION_KINDS = ["video", "animation", "app-screen", "tip"] as const;

export const submissionSchema = z
  .object({
    kind: z.enum(SUBMISSION_KINDS),
    title: z.string().trim().min(3).max(90),
    description: z.string().trim().max(600).optional().default(""),
    url: z
      .string()
      .trim()
      .max(300)
      .optional()
      .default("")
      .refine((v) => v === "" || /^https:\/\//.test(v), "Links must start with https://"),
    resourceId: shortText(60),
    altText: z.string().trim().max(240).optional().default(""),
    noPersonalInfo: z.literal(true, { message: "Please confirm your upload shows no personal information." }),
    consent: z.literal(true, { message: "Please agree to share your submission on the hub." }),
    website: z.string().max(0).optional().default(""),
  })
  .refine((v) => v.kind !== "video" || v.url !== "", {
    message: "Add a link to your video (YouTube, Vimeo or Google Drive).",
    path: ["url"],
  });

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const ALLOWED_UPLOADS = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // keeps requests under Vercel's 4.5 MB body limit
