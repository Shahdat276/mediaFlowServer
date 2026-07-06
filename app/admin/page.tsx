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
} from "lucide-react";
import { toast } from "sonner";

interface DBUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const [dbUsers, setDbUsers] = useState<DBUser[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setDbUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (err) {
      toast.error("Error communicating with users API");
    } finally {
      setFetchingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Shield className="size-8 animate-pulse text-amber-500" />
          <span className="text-sm text-muted-foreground">Loading Admin Console...</span>
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
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border mb-6 sm:mb-8">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Admin Portal</h1>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 sm:px-2.5 py-0.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      System Console
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1 truncate">
                    Active Session: {session?.user?.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={fetchUsers}
                  disabled={fetchingUsers}
                  className="border-border bg-card text-foreground hover:bg-accent text-sm"
                >
                  {fetchingUsers ? <Loader2 className="size-4 animate-spin" /> : "Refresh Users"}
                </Button>
              </div>

              {/* Admin Stats Row */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6 sm:mb-8">
                <Card className="border-border bg-card text-card-foreground shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Users</span>
                    <Users className="size-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">{dbUsers.length || "Loading..."}</div>
                    <p className="text-muted-foreground text-xs mt-1">Registered in MongoDB database</p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card text-card-foreground shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Auth Engine</span>
                    <Zap className="size-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">Better Auth</div>
                    <p className="text-muted-foreground text-xs mt-1">v1.6.23 with Admin Plugin</p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card text-card-foreground shadow-sm sm:col-span-2 md:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Privileges</span>
                    <ShieldAlert className="size-4 text-amber-500 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">Root Admin</div>
                    <p className="text-muted-foreground text-xs mt-1">Full write and read access</p>
                  </CardContent>
                </Card>
              </div>

              {/* Database User Management Section */}
              <Card className="border-border bg-card text-card-foreground shadow-sm mb-6 sm:mb-8">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">Database Users</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    Direct list of user entries fetched from the MongoDB Atlas collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {fetchingUsers ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="size-6 animate-spin text-amber-500" />
                    </div>
                  ) : dbUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No users found. Try seeding the database first.
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-2">
                      <table className="w-full text-left text-sm min-w-[500px]">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground font-semibold">
                            <th className="pb-3 pl-2">Name</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3">User ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dbUsers.map((user) => (
                            <tr key={user.id} className="border-b border-border hover:bg-accent/50 text-foreground">
                              <td className="py-3.5 pl-2 font-medium text-foreground whitespace-nowrap">{user.name}</td>
                              <td className="py-3.5 whitespace-nowrap">{user.email}</td>
                              <td className="py-3.5">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    user.role === "admin"
                                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                                      : "bg-muted border border-border text-muted-foreground"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-3.5 font-mono text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[150px]">
                                {user.id}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Log Terminal */}
              <Card className="border-border bg-card text-card-foreground shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-amber-500" />
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground">System Security Log</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground text-xs">Realtime proxy interception trace</CardDescription>
                </CardHeader>
                <CardContent className="bg-muted rounded-lg border border-border p-3 sm:p-4 font-mono text-xs text-muted-foreground space-y-1.5 shadow-inner overflow-x-auto">
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
