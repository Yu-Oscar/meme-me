'use client';
import { LucideUser,LucideBookmark } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/features/auth/actions/sign-out";
import { AuthUser } from "@/features/auth/queries/get-auth";
import { accountProfilePath, accountBookmarksPath } from "@/utils/path";
import { SubmitButton } from "@/components/form/SubmitButton";

type AccountDropdownProps = {
  user: AuthUser;
};

export default function AccountDropdown({ user }: AccountDropdownProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open account menu"
        >
          <Avatar className="w-9 h-9">
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" collisionPadding={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm font-medium text-foreground p-2">
            #{user.id.toString()} {user.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-2">
            <LucideUser />
            <Link href={accountProfilePath(user.id)}>個人頁面</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2">
            <LucideBookmark />
            <Link href={accountBookmarksPath()}>收藏</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-2">
            <form action={signOut}>
              <SubmitButton label="Sign Out" />
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}