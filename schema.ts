import { z } from "zod";

import { Role } from "types";

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
    .nullable(),
});

export const roleSchema = z.object({
  serverId: z.string(),
  userId: z.string(),
  assignRoles: z.array(z.custom<Role>()),
  removeRoles: z.array(z.custom<Role>()),
});

export const createRoleSchema = z.object({
  serverId: z.string(),
  roleName: z.string(),
  color: z.string(),
  permissions: z.array(z.string()),
});

export const updateRoleSchema = z.object({
  serverId: z.string(),
  roleId: z.string(),
  roleName: z.string(),
  color: z.string(),
  permissions: z.array(z.string().optional()),
});

export const roleIdSchema = z.object({
  serverId: z.string(),
  roleId: z.string(),
});
