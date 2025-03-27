import { useState } from "react";
import { useMatch } from "@tanstack/react-router";

import toast from "react-hot-toast";

import { ConfirmDialog } from "~/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";

import { banUser, kickUser } from "~/lib/bot/get";

interface MemberActionsProps {
  id: string;
  name: string;
};

export const MemberActions = ({
  id,
  name,
}: MemberActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [banDays, setBanDays] = useState<number | "all">(0);

  const match = useMatch({ from: "/servers/$serverId/members" });
  const serverId = match.id.split("/")[2];

  const handleChange = (value: number[]) => {
    const selected = value[0];
    setBanDays(selected === 8 ? "all" : selected);
  };

  const deleteMessageSeconds = banDays === "all" ? 604800 : banDays * 86400;

  const onKick = async () => {
    setIsOpen(false);

    const response = await kickUser({ data: { serverId, userId: id, reason } });
    if (!response.success) {
      toast.error(response.message);
      return;
    };
    toast.success(response.message);

    setReason("");
  };

  const onBan = async () => {
    setIsOpen(false);

    const response = await banUser({ data: { serverId, userId: id, reason, duration: deleteMessageSeconds } });
    if (!response.success) {
      toast.error(response.message);
      return;
    };
    toast.success(response.message);

    setReason("");
    setBanDays(0);
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
        {/* Timeout Dialog */}
        <ConfirmDialog
          trigger="Timeout"
          buttonLabel={`Timeout ${name}`}
          title={`Are you sure you want to timeout ${name}?`}
          description={`This action cannot be undone. This will timeout ${name} from the server.`}
          onCancel={() => {
            setReason(undefined);
          }}
          onClick={() => {}}
        >
          timeout
        </ConfirmDialog>

        {/* Kick Dialog */}
        <ConfirmDialog
          trigger="Kick"
          buttonLabel={`Kick ${name}`}
          title={`Are you sure you want to kick ${name}?`}
          description={`This action cannot be undone. This will kick ${name} from the server.`}
          onCancel={() => setReason(undefined)}
          onClick={onKick}
        >
          <div className="space-y-2">
            <Label htmlFor="kick-reason">Reason</Label>
            <Input
              id="kick-reason"
              placeholder="Reason for kicking"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </ConfirmDialog>
        
        {/* Ban Dialog */}
        <ConfirmDialog
          trigger="Ban"
          buttonLabel={`Ban ${name}`}
          title={`Are you sure you want to ban ${name}?`}
          description={`This action cannot be undone. This will ban ${name} from the server.`}
          onCancel={() => {
            setReason(undefined);
            setBanDays(0);
          }}
          onClick={onBan}
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="delete-message-duration">
                Delete messages from the last:{" "}
                <strong>{banDays === "all" ? "All messages (7 days max)" : `${banDays} day(s)`}</strong>
              </Label>
              <Slider
                id="delete-message-duration"
                min={0}
                max={8}
                step={1}
                value={[typeof banDays === "number" ? banDays : 8]}
                onValueChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason</Label>
              <Input
                id="ban-reason"
                placeholder="Reason for banning"
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};
