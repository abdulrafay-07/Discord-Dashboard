import { z } from "zod";

export const serverIdSchema = z.object({
  serverId: z.string(),
});

export const serverMemberSchema = z.object({
  serverId: z.string(),
  userId: z.string(),
});
