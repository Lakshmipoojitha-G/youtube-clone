import { z } from "zod";

export const createCommentSchema = z.object({
  videoId: z.string().min(1),
  parentId: z.string().nullable().optional(),
  text: z.string().trim().min(1, "Comment cannot be empty").max(1000),
});

export const reactionSchema = z.object({
  reaction: z.enum(["like", "dislike", "none"]),
});

export const progressSchema = z.object({
  seconds: z.number().min(0),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
