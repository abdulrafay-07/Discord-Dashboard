import { PermissionsString } from "discord.js";

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: PermissionsString[];
  members: {
    id: string;
    name: string;
    discriminator: string;
    avatar: string | null;
    joined: string;
  }[];
};
