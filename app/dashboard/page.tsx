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
      <div className="flex min-h-screen bg-background">
        {/* Sidebar - desktop */}
        <AppSidebar />

        {/* Main area */}
        <div className="flex flex-1 flex-col min-h-screen">
          {/* Header */}
          <AppHeader />

          <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
            <div className="mx-auto max-w-7xl">
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border mb-6 sm:mb-8">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1 truncate">
                    Welcome back, {session?.user?.name || "User"}
                  </p>
                </div>
                {session?.user?.role === "admin" && (
                  <a
                    href="/admin"
                    className={buttonVariants({
                      variant: "default",
                      className: "bg-amber-600 hover:bg-amber-500 text-primary-foreground font-medium gap-1.5 py-2 px-3 rounded-lg text-sm"
                    })}
                  >
                    <Shield className="size-4" /> Admin Console
                  </a>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6 sm:mb-8">
                <Card className="border-border bg-card text-card-foreground shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Role</span>
                    <User className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold capitalize text-foreground">{session?.user?.role || "user"}</div>
                    <p className="text-muted-foreground text-xs mt-1">Standard application privilege</p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card text-card-foreground shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Tasks</span>
                    <Activity className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">12</div>
                    <p className="text-muted-foreground text-xs mt-1">+4 created in last 24h</p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card text-card-foreground shadow-sm sm:col-span-2 md:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Status</span>
                    <Settings className="size-4 text-emerald-500 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-500">Online</div>
                    <p className="text-muted-foreground text-xs mt-1">All services operating normally</p>
                  </CardContent>
                </Card>
              </div>

              {/* Details & Admin Verification Card */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                <Card className="border-border bg-card text-card-foreground shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground">Profile Details</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">Better Auth Session payload</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3.5 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1 border-b border-border">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{session?.user?.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1 border-b border-border">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground font-medium break-all">{session?.user?.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1 border-b border-border">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="text-muted-foreground font-mono text-xs break-all">{session?.user?.id}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1">
                      <span className="text-muted-foreground">Session Created</span>
                      <span className="text-muted-foreground text-xs">{new Date(session?.session?.createdAt || "").toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card text-card-foreground shadow-sm flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center gap-2 rounded-full w-fit bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                      <Shield className="size-3.5" /> Security Testing
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-3">Admin Access Verification</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">
                      Test your role restrictions by attempting to navigate to the restricted administrative page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    Standard users will be automatically blocked by the routing proxy middleware and redirected to a forbidden page, while accounts with the `admin` role are permitted access.
                  </CardContent>
                  <div className="p-6 pt-0">
                    <a
                      href="/admin"
                      className={buttonVariants({
                        variant: "default",
                        className: "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 group py-2.5 rounded-lg flex items-center justify-center"
                      })}
                    >
                      Try Accessing Admin Page <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
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
