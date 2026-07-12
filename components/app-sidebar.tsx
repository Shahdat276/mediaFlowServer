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
  X,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "@/components/mobile-sidebar-provider";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const { isOpen, close } = useMobileSidebar();
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

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

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Layers, active: pathname === "/dashboard" },
    { href: "/profile", label: "Profile", icon: User, active: pathname === "/profile" },
    { href: "/billing", label: "Billing", icon: CreditCard, active: pathname === "/billing" },
    ...(session?.user?.role === "admin"
      ? [
          { href: "/admin", label: "Overview", icon: Shield, active: pathname === "/admin" },
          { href: "/admin/users", label: "Users", icon: Users, active: pathname === "/admin/users" },
          { href: "/admin/plans", label: "Plans", icon: CreditCard, active: pathname === "/admin/plans" },
          { href: "/admin/settings", label: "Settings", icon: Settings, active: pathname === "/admin/settings" },
        ]
      : []),
  ];

  // Shared nav content for both desktop and mobile
  const navContent = (
    <>
      {/* Brand + Toggle */}
      <div className={cn(
        "flex items-center h-14 shrink-0",
        collapsed ? "justify-center px-2" : "gap-2 px-4 sm:px-6"
      )}>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-foreground truncate flex-1">MediaFlow</span>
        )}
        {/* Collapse toggle - desktop only */}
        <button
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:flex items-center justify-center size-7 shrink-0 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>

      {/* User info */}
      <div className={cn(
        "flex items-center shrink-0",
        collapsed ? "justify-center px-2 py-4" : "gap-3 px-4 sm:px-6 py-4"
      )}>
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {session?.user?.name || "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {session?.user?.email || ""}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 space-y-1 overflow-y-auto",
        collapsed ? "px-2" : "px-3"
      )}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const link = (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(
                "flex items-center font-medium rounded-lg transition-all",
                collapsed
                  ? "justify-center px-2 py-2.5 text-base"
                  : "gap-3 px-3 py-2.5 text-base",
                item.active
                  ? item.href === "/admin"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );

          // Add title attribute for tooltip when collapsed
          if (collapsed) {
            return (
              <div key={item.href} title={item.label}>
                {link}
              </div>
            );
          }

          return link;
        })}
      </nav>

      {/* Logout */}
      <div className={cn(
        "shrink-0",
        collapsed ? "p-2" : "p-3"
      )}>
        <Button
          variant="ghost"
          onClick={() => { close(); handleSignOut(); }}
          disabled={loading}
          className={cn(
            "text-muted-foreground hover:text-red-500 hover:bg-red-500/10 font-medium",
            collapsed ? "w-full justify-center px-2" : "w-full justify-start gap-3"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex shrink-0 flex-col bg-sidebar transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {navContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />
          {/* Drawer panel */}
          <aside className="relative flex w-72 max-w-[85vw] h-full flex-col bg-sidebar animate-in slide-in-from-left duration-200">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={close}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10"
            >
              <X className="size-4" />
            </Button>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
