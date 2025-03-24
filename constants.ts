import { Command, Home, MessageSquare, Shield, Users } from "lucide-react";

export const getRoutes = (serverId: string) => [
  {
    href: `/servers/${serverId}`,
    icon: Home,
    title: "Dashboard",
  },
  {
    href: `/servers/${serverId}/members`,
    icon: Users,
    title: "Members",
  },
  {
    href: `/servers/${serverId}/roles`,
    icon: Shield,
    title: "Roles",
  },
  {
    href: `/servers/${serverId}/logs`,
    icon: Command,
    title: "Logs",
  },
  {
    href: `/servers/${serverId}/messaging`,
    icon: MessageSquare,
    title: "Messaging",
  },
];
