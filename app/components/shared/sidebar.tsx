import { Link, useMatch, useRouterState } from "@tanstack/react-router";

import { ServerSelector } from "~/components/server-selector";
import { Button } from "~/components/ui/button";

import { getRoutes } from "../../../constants";

interface SidebarProps {
  servers: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
  }[];
};

export const Sidebar = ({
  servers,
}: SidebarProps) => {
  const match = useMatch("/servers/$serverId");
  const pathname = useRouterState().location.pathname;

  const { serverId } = match.params;
  
  const Id = serverId ?? servers[0]?.id;

  const routes = getRoutes(Id);

  return (
    <aside className="h-screen w-64 border-r border-primary/20 py-6 px-4 bg-background flex flex-col">
      <ServerSelector servers={servers} serverId={Id} />
      <nav className="grid gap-1">
        {routes.map((route) => (
          <Button
            key={route.href}
            asChild
            variant={pathname === route.href ? "active" : "ghost"}
            className="justify-start"
          >
            <Link to={route.href}>
              <route.icon className="mr-2 size-5" />
              {route.title}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
};
