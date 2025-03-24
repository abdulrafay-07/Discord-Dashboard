import { Command, Home, MessageSquare, Shield, Users } from "lucide-react";

export const routes = [
  {
    href: "/",
    icon: Home,
    title: "Dashboard",
  },
  {
    href: "/members",
    icon: Users,
    title: "Members",
  },
  {
    href: "/roles",
    icon: Shield,
    title: "Roles",
  },
  {
    href: "/logs",
    icon: Command,
    title: "Logs",
  },
  {
    href: "/messaging",
    icon: MessageSquare,
    title: "Messaging",
  },
];

export const servers = [
  { 
    id: "1",
    name: "Gaming Community",
    icon: "/placeholder.svg?height=40&width=40",
    memberCount: 1245,
  },
  {
    id: "2",
    name: "Developer Hub",
    icon: "/placeholder.svg?height=40&width=40",
    memberCount: 873,
  },
  {
    id: "3",
    name: "Study Group",
    icon: "/placeholder.svg?height=40&width=40",
    memberCount: 421,
  },
];
