import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "~/components/shared/sidebar";

import { getServers } from "~/lib/bots/server";

export const Route = createFileRoute("/servers/$")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/",
      })
    };
  },
  component: Home,
  loader: async () => await getServers(),
});

function Home() {
  const state = Route.useLoaderData();

  return (
    <div className="flex">
      <Sidebar servers={state.data} />
      <main className="flex-1 lg:pl-12">
        <Outlet />
      </main>
    </div>
  )
};
