"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Layers,
  Shield,
  LogOut,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.refresh();
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 h-14 border-b border-border">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4" />
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">MediaFlow</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            {session?.user?.name || "User"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {session?.user?.email || ""}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
            pathname === "/dashboard"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Layers className="size-4" /> Dashboard
        </Link>
        {session?.user?.role === "admin" && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
              pathname === "/admin"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Shield className="size-4" /> Admin Portal
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          disabled={loading}
          className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10 gap-3 font-medium"
        >
          <LogOut className="size-4" /> Log Out
        </Button>
      </div>
    </aside>
  );
}
