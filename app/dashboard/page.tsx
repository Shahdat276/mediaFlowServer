"use client";

import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";
import {
  Activity,
  Settings,
  Shield,
  User,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function UserDashboard() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Zap className="size-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar - desktop */}
        <AppSidebar />

        {/* Main area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header - fixed */}
          <AppHeader />

          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border mb-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground text-[11px] truncate">
                    Welcome back, {session?.user?.name || "User"}
                  </p>
                </div>
                {session?.user?.role === "admin" && (
                  <a
                    href="/admin"
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "bg-amber-600 hover:bg-amber-500 text-primary-foreground font-medium gap-1 py-1.5 px-2.5 rounded-lg text-xs h-7"
                    })}
                  >
                    <Shield className="size-3.5" /> Admin Console
                  </a>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-3 mb-3">
                <Card className="border-border bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                        <User className="size-3 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Account Role</p>
                        <p className="text-sm font-bold capitalize text-foreground leading-tight">{session?.user?.role || "user"}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="border-border bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                        <Activity className="size-3 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Active Tasks</p>
                        <p className="text-sm font-bold text-foreground leading-tight">12</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="border-border bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <Settings className="size-3 text-emerald-500 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">System Status</p>
                        <p className="text-sm font-bold text-emerald-500 leading-tight">Online</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Details & Admin Verification Card */}
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                <Card className="border-border bg-card text-card-foreground shadow-sm">
                  <CardHeader className="px-3 pt-3 pb-2">
                    <CardTitle className="text-sm font-bold text-foreground">Profile Details</CardTitle>
                    <CardDescription className="text-muted-foreground text-[10px]">Better Auth Session payload</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs px-3 pb-3 pt-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5 border-b border-border">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{session?.user?.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5 border-b border-border">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground font-medium break-all">{session?.user?.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5 border-b border-border">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="text-muted-foreground font-mono text-[10px] break-all">{session?.user?.id}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5">
                      <span className="text-muted-foreground">Session Created</span>
                      <span className="text-muted-foreground text-[10px]">{new Date(session?.session?.createdAt || "").toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card text-card-foreground shadow-sm flex flex-col justify-between">
                  <CardHeader className="px-3 pt-3 pb-2">
                    <div className="flex items-center gap-1.5 rounded-full w-fit bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      <Shield className="size-3" /> Security Testing
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground mt-2">Admin Access Verification</CardTitle>
                    <CardDescription className="text-muted-foreground text-[10px]">
                      Test your role restrictions by attempting to navigate to the restricted administrative page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-xs px-3 pb-2 pt-0">
                    Standard users will be automatically blocked by the routing proxy middleware and redirected to a forbidden page, while accounts with the `admin` role are permitted access.
                  </CardContent>
                  <div className="px-3 pb-3 pt-0">
                    <a
                      href="/admin"
                      className={buttonVariants({
                        variant: "default",
                        className: "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 group py-2 rounded-lg flex items-center justify-center text-xs"
                      })}
                    >
                      Try Accessing Admin Page <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </main>

          <AppFooter />
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
