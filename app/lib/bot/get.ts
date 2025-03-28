import { createServerFn } from "@tanstack/react-start";
import { ColorResolvable, PermissionResolvable } from "discord.js";

import { formatDistanceToNow } from "date-fns";

import { getBotInstance } from "~/lib/bot/discord-bot";
import { banSchema, createRoleSchema, kickSchema, roleIdSchema, roleSchema, serverIdSchema, timeoutSchema, updateRoleSchema } from "schema";

export const getServers = createServerFn({ method: "GET" })
  .handler(async () => {
    const client = await getBotInstance();
    
    const servers = client.guilds.cache.map((server) => ({
      id: server.id,
      name: server.name,
      icon: server.iconURL(),
      memberCount: server.memberCount,
    }));

    return {
      data: servers,
    };
  });

export const getMembers = createServerFn({ method: "GET" })
  .validator(serverIdSchema)
  .handler(async ({ data: { serverId } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { data: [] };
    
    const members = await server?.members.fetch();
    const memberList = members?.map((member) => ({
      id: member.id,
      username: member.user.username,
      discriminator: member.user.discriminator,
      avatar: member.user.avatarURL(),
      joined: formatDistanceToNow(member.joinedAt!, { addSuffix: true }),
      status: member.presence?.status === undefined ? "invisible": member.presence?.status,
      roles: member.roles.cache.map((role) => ({
        id: role.id,
        name: role.name,
        color: role.hexColor,
      })),
    }));

    return {
      data: memberList,
    };
  });

export const getRoles = createServerFn({ method: "GET" })
  .validator(serverIdSchema)
  .handler(async ({ data: { serverId } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { data: [] };

    const roles = await server?.roles.fetch();
    const rolesList = roles?.map((role) => ({
      id: role.id,
      name: role.name,
      color: role.hexColor,
      permissions: role.permissions.toArray(),
      members: role.members.map(m => ({
        id: m.id,
        name: m.user.username,
        discriminator: m.user.discriminator,
        avatar: m.user.avatarURL(),
        joined: formatDistanceToNow(m.joinedAt!, { addSuffix: true }),
      })),
    })).filter(r => r.name !== "@everyone");

    return {
      data: rolesList,
    };
  });

export const kickUser = createServerFn({ method: "GET" })
  .validator(kickSchema)
  .handler(async ({ data: { serverId, userId, reason } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { success: false, message: "Server not found" };

    const member = server.members.cache.get(userId);
    if (!member) return { success: false, message: "Member not found" };

    try {
      await member.kick(reason);
      return { success: true, message: `${member.user.username} has been kicked successfully` };
    } catch (error: any) {
      if (error.message === "Missing Permissions") return { success: false,  message: "Insufficient permissions" };
      return { success: false, message: `Failed to kick user: ${error.message}` };
    };
  });

export const banUser = createServerFn({ method: "GET" })
  .validator(banSchema)
  .handler(async ({ data: { serverId, userId, reason, duration } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { success: false, message: "Server not found" };

    const member = server.members.cache.get(userId);
    if (!member) return { success: false, message: "Member not found" };

    try {
      await member.ban({ deleteMessageSeconds: duration, reason });
      return { success: true, message: `${member.user.username} has been banned successfully` };
    } catch (error: any) {
      if (error.message === "Missing Permissions") return { success: false,  message: "Insufficient permissions" };
      return { success: false, message: `Failed to ban user: ${error.message}` };
    };
  });

export const timeoutUser = createServerFn({ method: "GET" })
  .validator(timeoutSchema)
  .handler(async ({ data: { serverId, userId, reason, duration } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { success: false, message: "Server not found" };

    const member = server.members.cache.get(userId);
    if (!member) return { success: false, message: "Member not found" };

    try {
      await member.edit({
        communicationDisabledUntil: new Date(Date.now() + duration! * 1000).toISOString(),
        reason,
      });
      return { success: true, message: `${member.user.username} has been timed out successfully` };
    } catch (error: any) {
      if (error.message === "Missing Permissions") return { success: false,  message: "Insufficient permissions" };
      return { success: false, message: `Failed to timeout user: ${error.message}` };
    };
  });

export const updateMemberRoles = createServerFn({ method: "GET" })
  .validator(roleSchema)
  .handler(async ({ data: { serverId, userId, assignRoles, removeRoles } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { success: false, message: "Server not found" };

    const member = server.members.cache.get(userId);
    if (!member) return { success: false, message: "Member not found" };

    try {
      // add new roles
      if (assignRoles && assignRoles.length > 0) {
        const roleIdsToAdd = assignRoles.map((role) => role.id);
        await member.roles.add(roleIdsToAdd);
      };

      // remove existing roles
      if (removeRoles && removeRoles.length > 0) {
        const roleIdsToRemove = removeRoles.map((role) => role.id);
        await member.roles.remove(roleIdsToRemove);
      };

      return { success: true, message: "Roles updated successfully" };
    } catch (error: any) {
      if (error.message === "Missing Permissions") return { success: false,  message: "Insufficient permissions" };
      return { success: false, message: `Failed to timeout user: ${error.message}` };
    };
  });

export const createRole = createServerFn({ method: "GET" })
  .validator(createRoleSchema)
  .handler(async ({ data: { serverId, roleName, color, permissions } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { success: false, message: "Server not found" };

    try {
      const role = await server.roles.create({
        name: roleName,
        color: color as ColorResolvable,
        permissions: permissions as PermissionResolvable[],
      });

      return { success: true, message: "Role created successfully" };
    } catch (error: any) {
      if (error.message === "Missing Permissions") return { success: false,  message: "Insufficient permissions" };
      return { success: false, message: `Failed to create role: ${error.message}` };
    };
  });

export const updateRole = createServerFn({ method: "GET" })
  .validator(updateRoleSchema)
  .handler(async ({ data: { serverId, roleId, roleName, color, permissions } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { success: false, message: "Server not found" };

    const role = server.roles.cache.get(roleId);
    if (!role) return { success: false, message: "Role not found" };

    try {
      const updatedRole = await role.edit({
        name: roleName,
        color: color as ColorResolvable,
        permissions: permissions as PermissionResolvable[],
      });

      return { success: true, message: "Role updated successfully" };
    } catch (error: any) {
      if (error.message === "Missing Permissions") return { success: false,  message: "Insufficient permissions" };
      return { success: false, message: `Failed to update role: ${error.message}` };
    };
  });

export const deleteRole = createServerFn({ method: "GET" })
  .validator(roleIdSchema)
  .handler(async ({ data: { roleId, serverId } }) => {
    const client = await getBotInstance();

    const server = client.guilds.cache.get(serverId);
    if (!server) return { success: false, message: "Server not found" };

    const role = server.roles.cache.get(roleId);
    if (!role) return { success: false, message: "Role not found" };

    try {
      await role.delete();

      return { success: true, message: "Role deleted successfully" };
    } catch (error: any) {
      if (error.message === "Missing Permissions") return { success: false,  message: "Insufficient permissions" };
      return { success: false, message: `Failed to delete role: ${error.message}` };
    };
  });
