import { createFileRoute, redirect, useMatch } from "@tanstack/react-router";

import { Header } from "~/components/shared/header";
import { Sidebar } from "~/components/shared/sidebar";
import { columns } from "~/components/members/columns";
import { DataTable } from "~/components/shared/data-table";

import { getMembers, getServers } from "~/lib/bot/get";

export const Route = createFileRoute("/servers/$serverId/members")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/",
      });
    };
  },
  component: Members,
  loader: async ({ params }) => {
    const servers = await getServers();
    let members = await getMembers({ data: { serverId: params.serverId } });

    return {
      servers,
      members
    };
  },
});

function Members() {
  const state = Route.useLoaderData();
  const match = useMatch("/servers/$serverId/members");

  const { serverId } = match.params;

  console.log(state.members.data)

  return (
    <div className="flex">
      <Sidebar servers={state.servers.data} />
      <main className="w-full lg:px-12 py-6 lg:py-10 flex flex-col gap-y-6">
        <Header
          title="Member Management"
          description="Manage your server members"
        />
        <DataTable
          columns={columns}
          data={state.members.data}
          showFilters={true}
        />
      </main>
    </div>
  )
};
