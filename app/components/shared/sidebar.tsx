import { Link, useRouterState } from "@tanstack/react-router";

import { ServerSelector } from "~/components/server-selector";
import { Button } from "~/components/ui/button";

import { routes } from "constants";

export const Sidebar = () => {
  const pathname = useRouterState().location.pathname;

  return (
    <div className="h-screen w-64 border-r border-primary/20 py-6 px-4 bg-background flex flex-col">
      <h1 className="text-2xl font-semibold mb-10">
        Discordly
      </h1>
      <ServerSelector />
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
    </div>
  )
};
