import { useState } from "react";
import { useMatch } from "@tanstack/react-router";

import toast from "react-hot-toast";

import { ConfirmDialog } from "~/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Edit, List, MinusSquare, MoreHorizontal } from "lucide-react";

import { Role } from "types";
import { DiscordPermissions } from "../../../constants";

import {
  deleteRole,
  updateRole,
} from "~/lib/bot/get";

interface RoleActionsProps {
  role: Role;
};

export const RoleActions = ({
  role,
}: RoleActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(role.color);
  const [roleName, setRoleName] = useState(role.name);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissions, setPermissions] = useState<string[]>(
    role.permissions.map(p => DiscordPermissions[p as keyof typeof DiscordPermissions])
  );

  const match = useMatch({ from: "/servers/$serverId/roles" });
  const serverId = match.id.split("/")[2];
  
  const filteredPermissions = Object.values(DiscordPermissions).filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleUpdate = (permission: string, val: boolean) => {
    if (val === true) {
      setPermissions(prev => [...prev, permission]);
    } else {
      setPermissions(permissions.filter(p => p !== permission));
    };
  };

  const onRoleEdit = async () => {
    setIsOpen(false);

    const permKeys = permissions.map((p) => Object.keys(DiscordPermissions).find(k => DiscordPermissions[k as keyof typeof DiscordPermissions] === p));

    const response = await updateRole({ data: { serverId, roleName, roleId: role.id, color: color, permissions: permKeys } });
    if (!response.success) {
      toast.error(response.message);
      return;
    };
    toast.success(response.message);

    setColor(role.color);
    setRoleName(role.name);
    setSearchTerm("");
    setPermissions(role.permissions.map(p => DiscordPermissions[p as keyof typeof DiscordPermissions]));
  };

  const onDeleteRole = async () => {
    setIsOpen(false);

    const response = await deleteRole({ data: { serverId, roleId: role.id } });
    if (!response.success) {
      toast.error(response.message);
      return;
    };
    toast.success(response.message);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-0">
        {/* Edit Role Dialog */}
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              className="w-full px-3 py-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Edit /> Edit Role
            </DropdownMenuItem>
          }
          buttonLabel="Save Changes"
          title={`Edit Role: ${role.name}?`}
          description="Modify this role's settings and permissions."
          onCancel={() => {
            setColor(role.color);
            setRoleName(role.name);
            setSearchTerm("");
            setPermissions(role.permissions.map(p => DiscordPermissions[p as keyof typeof DiscordPermissions]));
            setIsOpen(false);
          }}
          onClick={onRoleEdit}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="Enter role name..."
                value={roleName}
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
                    defaultChecked={permissions.includes(permission)}
                    onCheckedChange={(e) => handleUpdate(permission, e.valueOf())}
                  />
                </div>
              ))}
            </div>
          </div>
        </ConfirmDialog>

        {/* View Members Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="w-full px-3 py-2"
              onSelect={(e) => e.preventDefault()}
            >
              <List /> View Members
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>Members with {role.name} Role</DialogTitle>
              <DialogDescription>{role.members.length} members have the {role.name} role</DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              {role.members.length > 0 ? (
                role.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-md border p-2"
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar!} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{member.name}</span>
                      <span>{member.discriminator.length > 1 && `#${member.discriminator}`}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-20 items-center justify-center text-muted-foreground">
                  No members have this role
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Separator />

        {/* Delete Dialog */}
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              className="w-full px-3 py-2 text-red-400"
              onSelect={(e) => e.preventDefault()}
            >
              <MinusSquare className="text-red-400" /> Delete
            </DropdownMenuItem>
          }
          buttonLabel={`Delete ${role.name}`}
          title={`Are you sure you want to delete the role ${role.name}?`}
          description={`This action cannot be undone. This will permanently delete the role.`}
          onCancel={() => {}}
          onClick={onDeleteRole}
        >
          <></>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};
