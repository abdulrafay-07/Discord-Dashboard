import { z } from "zod";

export const serverIdSchema = z.object({
  serverId: z.string(),
});
