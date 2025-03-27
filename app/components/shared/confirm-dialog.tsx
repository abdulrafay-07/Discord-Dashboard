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
  trigger: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  onCancel: () => void;
  children: React.ReactNode;
};

export const ConfirmDialog = ({
  trigger,
  title,
  description,
  buttonLabel,
  onClick,
  onCancel,
  children,
}: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

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

        {children}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
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
