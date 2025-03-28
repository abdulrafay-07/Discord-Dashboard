import { useState } from "react";

import { createFileRoute, redirect } from "@tanstack/react-router";

import { Header } from "~/components/shared/header";
import { ConfirmDialog } from "~/components/shared/confirm-dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

import { getRoles } from "~/lib/bot/get";
import { DataTable } from "~/components/shared/data-table";
import { columns } from "~/components/roles/columns";

export const Route = createFileRoute("/servers/$serverId/roles")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/",
      });
    };
  },
  component: Roles,
  loader: async ({ params }) => await getRoles({ data: { serverId: params.serverId } }),
});

function Roles() {
  const { data } = Route.useLoaderData();
  const [color, setColor] = useState("#5865F2");

  return (
    <div className="w-full lg:px-12 py-6 lg:py-10 flex flex-col gap-y-6">
      <Header
        title="Role Management"
        description="Manage roles and permissions"
      >
        <ConfirmDialog
          trigger={
            <Button className="cursor-pointer">
              <Plus /> Create Role
            </Button>
          }
          buttonLabel="Create Role"
          title="Create New Role"
          description="Add a new role to your server with custom permissions."
          onCancel={() => {}}
          onClick={() => {}}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="Enter role name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-color">Role Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="role-color"
                  value={color}
                  className="w-12 h-10 p-1"
                  onChange={(e) => setColor(e.target.value)}
                />
                <Input
                  value={color}
                  className="flex-1"
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        </ConfirmDialog>
      </Header>
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  )
};
