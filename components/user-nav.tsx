"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  CalendarCheck2,
  CalendarClock,
  ChartLine,
  LogOut,
  Mail,
  User,
  UserCog,
  UserPen,
} from "lucide-react";
import { logout } from "@/actions/logout";
import Loader from "./loader";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const UserNav = ({ user }: { user: SupabaseUser }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
          <AvatarImage
            referrerPolicy="no-referrer"
            src={user.user_metadata.picture}
            alt={user.email}
          />
          <AvatarFallback className="rounded-lg flex items-center justify-center bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mr-2"
        side={"bottom"}
        align="center"
        sideOffset={4}
      >
        {/* <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
              <AvatarImage
                referrerPolicy="no-referrer"
                src={user.user_metadata.picture}
                alt={user.email}
              />
              <AvatarFallback className="rounded-lg flex items-center justify-center bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="flex items-center gap-1">
                Email
                <Mail strokeWidth={1} size={14} className="shrink-0" />
              </span>
              <span className="text-xs flex items-center gap-0.5 w-[95%]">
                <p className="truncate">{user.email}</p>
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={logoutLoading}
            asChild
            onSelect={(e) => e.preventDefault()}
          >
            {role === "superadmin" ? (
              <Link href="/superadmin">
                <UserCog /> Add Role
              </Link>
            ) : !role ? (
              <Link href="/participant/profile">
                <UserPen /> General Profile
              </Link>
            ) : null}
          </DropdownMenuItem>
          {!role && (
            <DropdownMenuItem
              disabled={logoutLoading}
              asChild
              onSelect={(e) => e.preventDefault()}
            >
              <Link href={"/participant"}>
                <CalendarCheck2 /> My Events
              </Link>
            </DropdownMenuItem>
          )}
          {role && role === "superadmin" && (
            <DropdownMenuItem
              disabled={logoutLoading}
              asChild
              onSelect={(e) => e.preventDefault()}
            >
              <Link href={"/superadmin/addevent"}>
                <CalendarClock /> Add Event
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          asChild
          variant="destructive"
          onSelect={(e) => e.preventDefault()}
        >
          <button
            onClick={async () => {
              setLogoutLoading(true);
              await logout();
              router.refresh();
              setLogoutLoading(false);
            }}
            disabled={logoutLoading}
            className="w-full disabled:opacity-50"
          >
            {logoutLoading ? (
              <>
                <Loader className="bg-destructive" />
                Logging Out...
              </>
            ) : (
              <>
                <LogOut />
                Log out
              </>
            )}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
