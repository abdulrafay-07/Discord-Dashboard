import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Check, ChevronDown, Server } from "lucide-react";

interface ServerSelectorProps {
  servers: {
    id: string;
    name: string;
    icon: string | null;
    memberCount: number;
  }[];
  serverId: string;
};

export const ServerSelector = ({
  servers,
  serverId,
}: ServerSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(servers.find((server) => server.id === serverId)!);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-56 justify-start gap-2 mb-10">
          <Avatar className="h-5 w-5">
            <AvatarImage src={selectedServer.icon!} alt={selectedServer.name} />
            <AvatarFallback>
              <Server className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{selectedServer.name}</span>
          <span className="ml-auto text-xs text-muted-foreground">{selectedServer.memberCount} members</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 px-2 mt-1">
        <Command>
          <CommandInput placeholder="Search servers..." />
          <CommandList>
            <CommandEmpty>No servers found.</CommandEmpty>
            <CommandGroup>
              {servers.map((server) => (
                <CommandItem
                  key={server.id}
                  onSelect={() => {
                    setSelectedServer(server);
                    setOpen(false);
                    window.history.pushState(null, "", `/servers/${server.id}`);
                  }}
                  className="flex items-center gap-2 mb-1 cursor-pointer"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={server.icon!} alt={server.name} />
                    <AvatarFallback>
                      <Server className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{server.name}</span>
                  {selectedServer.id === server.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
};
