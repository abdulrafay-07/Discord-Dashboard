import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "~/components/ui/badge";
import { Users } from "lucide-react";

import { Role } from "types";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        <div
          className="size-4 rounded-full"
          style={{
            backgroundColor: row.original.color === "#000000" ? "white" : row.original.color,
          }}
        />
        <span className="font-medium">
          {row.original.name}
        </span>
      </div>
    )
  },
  {
    accessorKey: "membersLength",
    header: "Members",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <Users className="size-4" />
        {row.original.membersLength}
      </div>
    )
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
      >
        {row.original.permissions.includes("Administrator") ? "Administrator" : `${row.original.permissions.length} permissions`}
      </Badge>
    )
  }
];
