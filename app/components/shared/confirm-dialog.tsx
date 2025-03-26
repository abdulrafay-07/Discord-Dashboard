import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

interface ConfirmDialogProps {
  id: string;
  name: string;
  trigger: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
};

export const ConfirmDialog = ({
  id,
  name,
  trigger,
  title,
  description,
  buttonLabel,
  onClick,
}: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="w-full px-3 py-2"
          onSelect={(e) => e.preventDefault()}
        >
          {trigger}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>
            {buttonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};
