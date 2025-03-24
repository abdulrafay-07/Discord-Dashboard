import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

import { getServers } from "~/lib/bots/server";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/sign-in/$",
      })
    };
  },
  component: Home,
  loader: async () => await getServers(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  router.navigate({ to: `/servers/${state.data[0].id}`, replace: true });

  return null;
};
