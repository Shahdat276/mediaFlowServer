"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Layers, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.refresh();
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setSigningOut(false);
    }
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile brand + hamburger OR desktop breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Hamburger - mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          {/* Desktop page title */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {pathname === "/dashboard" ? "Dashboard" : pathname === "/admin" ? "Admin Portal" : "MediaFlow"}
            </span>
          </div>
        </div>

        {/* Right: User info + Theme + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User avatar - desktop only */}
          <div className="hidden sm:flex items-center gap-2">
            <Avatar className="size-7 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground leading-none">
                {session?.user?.name || "User"}
              </span>
              <span className="text-[10px] text-muted-foreground">
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

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="border-t border-border bg-background px-4 py-3 space-y-1 md:hidden">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
              pathname === "/dashboard"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Layers className="size-4" /> Dashboard
          </Link>
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                pathname === "/admin"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Shield className="size-4" /> Admin Portal
            </Link>
          )}
          <button
            onClick={() => { setMobileOpen(false); handleSignOut(); }}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="size-4" /> Log Out
          </button>
        </nav>
      )}
    </header>
  );
}
