import { useState } from "react";

import { createFileRoute, redirect, useMatch } from "@tanstack/react-router";
import toast from "react-hot-toast";

import { Header } from "~/components/shared/header";
import { columns } from "~/components/roles/columns";
import { DataTable } from "~/components/shared/data-table";
import { ConfirmDialog } from "~/components/shared/confirm-dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Plus } from "lucide-react";

import { createRole, getRoles } from "~/lib/bot/get";

import { DiscordPermissions } from "../../../../constants";

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
  const [roleName, setRoleName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  
  const match = useMatch({ from: "/servers/$serverId/roles" });
  const serverId = match.id.split("/")[2];
  
  const filteredPermissions = Object.values(DiscordPermissions).filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleUpdate = (permission: string, val: boolean) => {
    const permKey = Object.keys(DiscordPermissions).find(k => DiscordPermissions[k as keyof typeof DiscordPermissions] === permission);
    if (!permKey) return;

    if (val === true) {
      setPermissions(prev => [...prev, permKey]);
    } else {
      setPermissions(permissions.filter(p => p !== permKey));
    };
  };

  const onCreate = async () => {
    if (roleName.length <= 0) {
      toast.error("Role name cannot be empty");
      return;
    };

    if (color.length <= 6) {
      toast.error("Color is required");
      return;
    };

    const response = await createRole({ data: { serverId, color, roleName, permissions } });
    if (!response.success) {
      toast.error(response.message);
      return;
    };
    toast.success(response.message);

    setColor("#5865F2");
    setRoleName("");
    setPermissions([]);
    setSearchTerm("");
  };

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
          onCancel={() => {
            setColor("#5865F2");
            setRoleName("");
            setSearchTerm("");
            setPermissions([]);
          }}
          onClick={onCreate}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="Enter role name..."
                onChange={(e) => setRoleName(e.target.value)}
              />
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
            <div className="space-y-5 flex flex-col">
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-8"
              />
              {filteredPermissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center justify-between"
                >
                  <span className="font-semibold">{permission}</span>
                  <Switch
                    onCheckedChange={(e) => handleUpdate(permission, e.valueOf())}
                  />
                </div>
              ))}
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
