import { createFileRoute, redirect } from "@tanstack/react-router";

import { Header } from "~/components/shared/header";
import { columns } from "~/components/members/columns";
import { DataTable } from "~/components/shared/data-table";
import { Badge } from "~/components/ui/badge";

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

  return (
    <div className="w-full lg:px-12 py-6 lg:py-10 flex flex-col gap-y-6">
      <Header
        title="Member Management"
        description="Manage members in your server"
      >
        <Badge variant="outline" className="flex items-center gap-1.5 text-sm">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          Bot Online
        </Badge>
      </Header>
      <DataTable
        columns={columns}
        data={data}
        showFilters={true}
      />
    </div>
  )
};
