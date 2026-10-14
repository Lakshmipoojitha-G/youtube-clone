import { z } from "zod";
import { CATEGORIES } from "@/types/studio";

export const createVideoSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().max(5000).default(""),
  category: z.enum(CATEGORIES).default("Entertainment"),
  tags: z.array(z.string().trim().min(1).max(30)).max(15).default([]),
  visibility: z.enum(["public", "private", "unlisted"]).default("private"),
});

export const updateVideoSchema = createVideoSchema.partial();   