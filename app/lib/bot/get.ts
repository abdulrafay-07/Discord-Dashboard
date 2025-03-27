import { createServerFn } from "@tanstack/react-start";

import { formatDistanceToNow } from "date-fns";

import { getBotInstance } from "~/lib/bot/discord-bot";
import { banSchema, kickSchema, roleSchema, serverIdSchema, timeoutSchema } from "schema";

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
      status: member.presence?.status,
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

export const updateRoles = createServerFn({ method: "GET" })
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
