import { createFileRoute, redirect, useMatch } from "@tanstack/react-router";

import { Sidebar } from "~/components/shared/sidebar";

import { getServers } from "~/lib/bot/get";

export const Route = createFileRoute("/servers/$serverId/")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/",
      });
    };
  },
  component: Home,
  loader: async () => await getServers(),
});

function Home() {
  const state = Route.useLoaderData();
  const match = useMatch("/servers/$serverId");

  const { serverId } = match.params;

  return (
    <div className="flex">
      <Sidebar servers={state.data} />
      <main className="flex-1 lg:px-12 py-6 lg:py-10">
        Homepage
      </main>
    </div>
  )
};
