import { z } from "zod";

export const serverIdSchema = z.object({
  serverId: z.string(),
});

export const kickSchema = z.object({
  serverId: z.string(),
  userId: z.string(),
  reason: z.string().optional(),
});

export const banSchema = z.object({
  serverId: z.string(),
  userId: z.string(),
  reason: z.string().optional(),
  duration: z
    .number()
    .int()
    .min(0)
    .max(604800)
    .default(0)
    .optional(),
});

export const timeoutSchema = z.object({
  serverId: z.string(),
  userId: z.string(),
  reason: z.string().optional(),
  duration: z
    .number()
    .int()
    .min(60)
    .max(604800)
    .default(60)
    .optional(),
})
