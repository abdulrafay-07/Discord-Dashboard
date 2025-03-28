import { PermissionsString } from "discord.js";

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: PermissionsString[];
  membersLength: number;
};
