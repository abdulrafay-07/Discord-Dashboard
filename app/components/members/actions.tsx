import { useEffect, useState } from "react";
import { useMatch } from "@tanstack/react-router";

import toast from "react-hot-toast";

import { ConfirmDialog } from "~/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { Ban, Clock, Edit, MoreHorizontal, SquareMinus } from "lucide-react";

import {
  banUser,
  getRoles,
  kickUser,
  timeoutUser,
  updateMemberRoles,
} from "~/lib/bot/get";

import { Role } from "types";

interface MemberActionsProps {
  id: string;
  name: string;
  roles: Role[];
};

export const MemberActions = ({
  id,
  name,
  roles,
}: MemberActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [banDays, setBanDays] = useState<number | "all">(0);
  const [timeoutDays, setTimeoutDays] = useState(1);
  const [serverRoles, setServerRoles] = useState<Role[]>([]);
  const [assignRoles, setAssignRoles] = useState<Role[]>([]);
  const [removeRoles, setRemoveRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");  

  const timeoutDurations = [1, 5, 10, 60, 1440, 10080]; // in minutes

  const match = useMatch({ from: "/servers/$serverId/members" });
  const serverId = match.id.split("/")[2];

  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getRoles({ data: { serverId } });
      setServerRoles(roles.data);
    };

    fetchRoles();
  }, []);

  const filteredRoles = serverRoles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBanDaysChange = (value: number[]) => {
    const selected = value[0];
    setBanDays(selected === 8 ? "all" : selected);
  };

  const deleteMessageSeconds = banDays === "all" ? 604800 : banDays * 86400;

  const handleTimeoutChange = (value: number[]) => {
    setTimeoutDays(timeoutDurations[value[0]]);
  };

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

  const onTimeout = async () => {
    setIsOpen(false);

    const response = await timeoutUser({ data: { serverId, userId: id, reason, duration: timeoutDays * 60 } });
    if (!response.success) {
      toast.error(response.message);
      return;
    };
    toast.success(response.message);

    setReason("");
    setTimeoutDays(1);
  };

  const onRolesUpdate = async () => {
    setIsOpen(false);

    const response = await updateMemberRoles({ data: { serverId, userId: id, assignRoles, removeRoles } });
    if (!response.success) {
      toast.error(response.message);
      return;
    };
    toast.success(response.message);

    setAssignRoles([]);
    setRemoveRoles([]);
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
        {/* Timeout Dialog */}
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              className="w-full px-3 py-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Clock /> Timeout
            </DropdownMenuItem>
          }
          buttonLabel={`Timeout ${name}`}
          title={`Are you sure you want to timeout ${name}?`}
          description={`This action cannot be undone. This will timeout ${name} from the server.`}
          onCancel={() => {
            setIsOpen(false);
            setReason(undefined);
            setTimeoutDays(1)
          }}
          onClick={onTimeout}
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="timeout-duration">
                Timeout duration: <strong>{timeoutDays < 60 ? `${timeoutDays} min` : timeoutDays === 10080 ? "1 week" : `${timeoutDays / 60} hour`}</strong>
              </Label>
              <Slider
                id="timeout-duration"
                min={0}
                max={timeoutDurations.length - 1}
                step={1}
                value={[timeoutDurations.indexOf(timeoutDays)]}
                onValueChange={handleTimeoutChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout-reason">Reason</Label>
              <Input
                id="timeout-reason"
                placeholder="Reason for timeout"
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        </ConfirmDialog>

        {/* Role Dialog */}
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              className="w-full px-3 py-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Edit /> Edit Roles
            </DropdownMenuItem>
          }
          buttonLabel={`Update Roles`}
          title={`Update roles for ${name}`}
          description={`Select/Unselect the roles you want to assign to this user.`}
          onCancel={() => {
            setIsOpen(false);
            setAssignRoles([]);
            setRemoveRoles([]);
          }}
          onClick={onRolesUpdate}
        >
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredRoles.map((role) => (
            <div key={role.id} className="flex items-center gap-2">
              <Checkbox
                id={`role-${role.id}`}
                defaultChecked={roles.some(r => r.id === role.id)}
                onCheckedChange={(e) => {
                  if (e.valueOf() === true) {
                    setAssignRoles((prev) => [...prev, role]);
                    console.log(assignRoles);
                  } else {
                    setRemoveRoles((prev) => [...prev, role]);
                    console.log(removeRoles);
                  };
                }}
              />
              <Label
                htmlFor={`role-${role.id}`}
                className="flex items-center gap-2"
              >
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: role.color }}
                />
                {role.name}
              </Label>
            </div>
          ))}
        </ConfirmDialog>

        <Separator />

        {/* Kick Dialog */}
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              className="w-full px-3 py-2 text-red-400"
              onSelect={(e) => e.preventDefault()}
            >
              <SquareMinus className="text-red-400" /> Kick
            </DropdownMenuItem>
          }
          buttonLabel={`Kick ${name}`}
          title={`Are you sure you want to kick ${name}?`}
          description={`This action cannot be undone. This will kick ${name} from the server.`}
          onCancel={() => {
            setIsOpen(false);
            setReason(undefined);
            setTimeoutDays(1);
          }}
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
          trigger={
            <DropdownMenuItem
              className="w-full px-3 py-2 text-red-400"
              onSelect={(e) => e.preventDefault()}
            >
              <Ban className="text-red-400" /> Ban
            </DropdownMenuItem>
          }
          buttonLabel={`Ban ${name}`}
          title={`Are you sure you want to ban ${name}?`}
          description={`This action cannot be undone. This will ban ${name} from the server.`}
          onCancel={() => {
            setIsOpen(false);
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
                onValueChange={handleBanDaysChange}
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
