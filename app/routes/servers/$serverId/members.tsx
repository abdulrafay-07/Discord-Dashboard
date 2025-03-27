import { createFileRoute, redirect, useMatch } from "@tanstack/react-router";

import { Header } from "~/components/shared/header";
import { columns } from "~/components/members/columns";
import { DataTable } from "~/components/shared/data-table";

import { getMembers } from "~/lib/bot/get";

export const Route = createFileRoute("/servers/$serverId/members")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/",
      });
    };
  },
  component: Members,
  loader: async ({ params }) => await getMembers({ data: { serverId: params.serverId } }),
});

function Members() {
  const { data } = Route.useLoaderData();
  const match = useMatch({ from: "/servers/$serverId/members" });

  const { serverId } = match.params;

  return (
    <div className="w-full lg:px-12 py-6 lg:py-10 flex flex-col gap-y-6">
      <Header
        title="Member Management"
        description="Manage your server members"
      />
      <DataTable
        columns={columns}
        data={data}
        showFilters={true}
      />
    </div>
  )
};
