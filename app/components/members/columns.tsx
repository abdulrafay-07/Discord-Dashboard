import { ColumnDef } from "@tanstack/react-table";
import { PresenceStatus } from "discord.js";

import { formatStatus } from "~/lib/utils";

import { MemberActions } from "~/components/members/actions";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ArrowUpDown } from "lucide-react";

export type Member = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  joined: string;
  status: PresenceStatus;
  roles: { id: string; name: string }[];
};

const statusColors: Record<PresenceStatus, string> = {
  online: "green",
  idle: "yellow",
  dnd: "red",
  offline: "gray",
  invisible: "gray",
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="table"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Avatar className="size-8">
          <AvatarImage src={row.original.avatar!} alt={row.original.username} />
          <AvatarFallback>
            {row.original.username[0]}
          </AvatarFallback>
        </Avatar>
        <span>
          {row.original.username}{row.original.discriminator.length > 1 && `#${row.original.discriminator}`}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: `${statusColors[row.original.status] ? statusColors[row.original.status] : "gray"}`,
          }}
        />
        <span>
          {formatStatus(row.original.status)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles;
      const maxVisibleRoles = 2;
      const visibleRoles = roles.slice(0, maxVisibleRoles);
      const remainingRolesCount = roles.length - maxVisibleRoles;
  
      return (
        <div className="flex items-center gap-x-2">
          {visibleRoles.map((role) => (
            <Badge key={role.id} variant="secondary">
              {role.name}
            </Badge>
          ))}
          {remainingRolesCount > 0 && (
            <Badge variant="secondary">+{remainingRolesCount} more</Badge>
          )}
        </div>
      );
    },
    filterFn: (row, columnId, value) => {
      return row.original.roles.some((role) => role.name.toLowerCase().includes(value.toLowerCase()));
    },
  },
  {
    accessorKey: "joined",
    header: "Joined",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <MemberActions
        id={row.original.id}
        name={row.original.username}
      />
    )
  }
];
