import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PresenceStatus } from "discord.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export const formatStatus = (status: PresenceStatus): string => {
  return status ? status.toUpperCase() : "INVISIBLE";
};
