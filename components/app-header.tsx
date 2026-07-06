"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMobileSidebar } from "@/components/mobile-sidebar-provider";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);
  const { toggle } = useMobileSidebar();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.refresh();
      router.push("/login");
    } catch {
      // silent
    } finally {
      setSigningOut(false);
    }
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
      <div className="flex h-11 items-center justify-between px-3 sm:px-4">
        {/* Left: Hamburger + page title */}
        <div className="flex items-center gap-2">
          {/* Hamburger - mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="text-muted-foreground hover:text-foreground md:hidden size-8"
          >
            <Menu className="size-4" />
          </Button>

          {/* Page title */}
          <span className="text-sm font-medium text-foreground">
            {pathname === "/dashboard" ? "Dashboard" : pathname === "/admin" ? "Admin Portal" : "MediaFlow"}
          </span>
        </div>

        {/* Right: User info + Theme + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User avatar + name - desktop only */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Avatar className="size-6">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-foreground leading-none">
                {session?.user?.name || "User"}
              </span>
              <span className="text-[9px] text-muted-foreground">
                {session?.user?.role || "user"}
              </span>
            </div>
          </div>

          <ThemeToggle />

          {/* Logout - desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            disabled={signingOut}
            className="hidden md:flex text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            title="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
