"use client";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function SignOut() {
  return (
    <DropdownMenuItem
      onSelect={() =>
        signOut({ callbackUrl: `${window.location.origin}/login` })
      }
    >
      Sign Out
    </DropdownMenuItem>
  );
}
