import { useState } from "react";

import { ConfirmDialog } from "~/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";

import { banUser, kickUser } from "~/lib/bot/get";
import { useMatch } from "@tanstack/react-router";

interface MemberActionsProps {
  id: string;
  name: string;
  avatar: string | null;
};

export const MemberActions = ({
  id,
  name,
  avatar,
}: MemberActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const match = useMatch({ from: "/servers/$serverId/members" });
  const serverId = match.id.split("/")[2];

  const onKick = async () => {
    await kickUser({ data: { serverId, userId: id } });
    setIsOpen(false);
  };

  const onBan = async () => {
    await banUser({ data: { serverId, userId: id } });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-0">
        {/* Kick Dialog */}
        <ConfirmDialog
          id={id}
          name={name}
          trigger="Kick"
          buttonLabel={`Kick ${name}`}
          title={`Are you sure you want to kick ${name}?`}
          description={`This action cannot be undone. This will kick ${name} from the server.`}
          onClick={onKick}
        />
        
        {/* Ban Dialog */}
        <ConfirmDialog
          id={id}
          name={name}
          trigger="Ban"
          buttonLabel={`Ban ${name}`}
          title={`Are you sure you want to ban ${name}?`}
          description={`This action cannot be undone. This will ban ${name} from the server.`}
          onClick={onBan}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
};
