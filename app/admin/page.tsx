"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";
import {
  Users,
  ShieldAlert,
  Terminal,
  Shield,
  Zap,
  Loader2,
  CreditCard,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const [dbUsers, setDbUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [plans, setPlans] = useState([]);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setDbUsers(data.users);
    } catch { /* ignore */ }
    finally { setFetchingUsers(false); }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchUsers(); fetchPlans(); }, []);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Shield className="size-8 animate-pulse text-amber-500" />
          <span className="text-lg text-muted-foreground">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Admin Portal</h1>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-base text-amber-600 dark:text-amber-400 font-semibold">
                      System Console
                    </span>
                  </div>
                  <p className="text-muted-foreground text-base truncate">
                    Active Session: {session?.user?.email}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchUsers} disabled={fetchingUsers} className="bg-card text-foreground hover:bg-accent text-base h-7">
                  {fetchingUsers ? <Loader2 className="size-3 animate-spin" /> : "Refresh"}
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-3 mb-4">
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                        <Users className="size-3 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Total Users</p>
                        <p className="text-lg font-bold text-foreground leading-tight">{dbUsers.length || "..."}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                        <CreditCard className="size-3 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Active Plans</p>
                        <p className="text-lg font-bold text-foreground leading-tight">{plans.filter((p: any) => p.active).length || "..."}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                        <ShieldAlert className="size-3 text-amber-500 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Privileges</p>
                        <p className="text-lg font-bold text-foreground leading-tight">Root Admin</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Access Cards */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                <Link href="/admin/users">
                  <div className="group rounded-lg bg-card p-4 hover:bg-amber-500/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <Users className="size-4 text-amber-500" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">User Management</h3>
                    <p className="text-base text-muted-foreground mt-0.5">Create admins, manage roles, view all users</p>
                  </div>
                </Link>
                <Link href="/admin/plans">
                  <div className="group rounded-lg bg-card p-4 hover:bg-amber-500/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <CreditCard className="size-4 text-amber-500" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Subscription Plans</h3>
                    <p className="text-base text-muted-foreground mt-0.5">Create and manage pricing plans</p>
                  </div>
                </Link>
                <Link href="/admin/transactions">
                  <div className="group rounded-lg bg-card p-4 hover:bg-amber-500/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <CreditCard className="size-4 text-amber-500" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Payment Verifications</h3>
                    <p className="text-base text-muted-foreground mt-0.5">Approve bKash/Nagad manual TxnIDs</p>
                  </div>
                </Link>
                <Link href="/admin/settings">
                  <div className="group rounded-lg bg-card p-4 hover:bg-amber-500/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <Settings className="size-4 text-amber-500" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">System Settings</h3>
                    <p className="text-base text-muted-foreground mt-0.5">Auth, database, performance config</p>
                  </div>
                </Link>
              </div>

              {/* Security Log Terminal */}
              <Card className="bg-card text-card-foreground">
                <CardHeader className="px-3 pt-3 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="size-3.5 text-amber-500" />
                    <CardTitle className="text-lg font-bold text-foreground">System Security Log</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground text-base">Realtime proxy interception trace</CardDescription>
                </CardHeader>
                <CardContent className="bg-muted rounded-lg p-2.5 font-mono text-base text-muted-foreground space-y-1 overflow-x-auto mx-3 mb-3">
                  <p className="text-muted-foreground/60 whitespace-nowrap">[2026-07-06T10:55:00] PROXY: Intercepted route request to /admin</p>
                  <p className="text-emerald-500 whitespace-nowrap">[2026-07-06T10:55:00] PROXY: Session cookie identified</p>
                  <p className="text-emerald-500 whitespace-nowrap">[2026-07-06T10:55:01] PROXY: API response verified user role = admin</p>
                  <p className="text-amber-500 whitespace-nowrap">[2026-07-06T10:55:01] PROXY: Access authorized, rendering dashboard</p>
                </CardContent>
              </Card>
            </div>
          </main>
          <AppFooter />
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
