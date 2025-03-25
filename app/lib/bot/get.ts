import { createServerFn } from "@tanstack/react-start";

import { formatDistanceToNow } from "date-fns";

import { getBotInstance } from "~/lib/bot/discord-bot";
import { serverIdSchema } from "schema";

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
      })),
    }));

    return {
      data: memberList,
    };
  });
