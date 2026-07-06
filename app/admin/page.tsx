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
  Plus,
  X,
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "admin" });

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("All fields are required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setShowCreateDialog(false);
        setNewUser({ name: "", email: "", password: "", role: "admin" });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to create user");
      }
    } catch {
      toast.error("Error creating user");
    } finally {
      setCreating(false);
    }
  };

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
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar - desktop */}
        <AppSidebar />

        {/* Main area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header - fixed */}
          <AppHeader />

          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Admin Portal</h1>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      System Console
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] truncate">
                    Active Session: {session?.user?.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
                    disabled={fetchingUsers}
                    className="border-border bg-card text-foreground hover:bg-accent text-xs h-7"
                  >
                    {fetchingUsers ? <Loader2 className="size-3 animate-spin" /> : "Refresh"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-7"
                  >
                    <Plus className="size-3 mr-1" />
                    Create Admin
                  </Button>
                </div>
              </div>

              {/* Admin Stats Row */}
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-3 mb-3">
                <Card className="border-border bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 border border-amber-500/20">
                        <Users className="size-3 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Total Users</p>
                        <p className="text-sm font-bold text-foreground leading-tight">{dbUsers.length || "..."}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="border-border bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 border border-amber-500/20">
                        <Zap className="size-3 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Auth Engine</p>
                        <p className="text-sm font-bold text-foreground leading-tight">Better Auth</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="border-border bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 border border-amber-500/20">
                        <ShieldAlert className="size-3 text-amber-500 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Privileges</p>
                        <p className="text-sm font-bold text-foreground leading-tight">Root Admin</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Database User Management Section */}
              <Card className="border-border bg-card text-card-foreground shadow-sm mb-4">
                <CardHeader className="px-3 pt-3 pb-2">
                  <CardTitle className="text-sm font-bold text-foreground">Database Users</CardTitle>
                  <CardDescription className="text-muted-foreground text-[10px]">
                    Direct list of user entries fetched from the MongoDB Atlas collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  {fetchingUsers ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="size-5 animate-spin text-amber-500" />
                    </div>
                  ) : dbUsers.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-xs">
                      No users found. Try seeding the database first.
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-1">
                      <table className="w-full text-left text-xs min-w-[480px]">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground font-semibold">
                            <th className="pb-2 pl-1">Name</th>
                            <th className="pb-2">Email</th>
                            <th className="pb-2">Role</th>
                            <th className="pb-2">User ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dbUsers.map((user) => (
                            <tr key={user.id} className="border-b border-border hover:bg-accent/50 text-foreground">
                              <td className="py-2 pl-1 font-medium text-foreground whitespace-nowrap">{user.name}</td>
                              <td className="py-2 whitespace-nowrap">{user.email}</td>
                              <td className="py-2">
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                    user.role === "admin"
                                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400"
                                      : "bg-muted border border-border text-muted-foreground"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-2 font-mono text-[10px] text-muted-foreground truncate max-w-[120px] sm:max-w-[150px]">
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
                <CardHeader className="px-3 pt-3 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="size-3.5 text-amber-500" />
                    <CardTitle className="text-sm font-bold text-foreground">System Security Log</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground text-[10px]">Realtime proxy interception trace</CardDescription>
                </CardHeader>
                <CardContent className="bg-muted rounded-lg border border-border p-2.5 font-mono text-[10px] text-muted-foreground space-y-1 shadow-inner overflow-x-auto mx-3 mb-3">
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

      {/* Create Admin Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateDialog(false)} />
          <div className="relative w-full max-w-sm rounded-lg border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="text-sm font-bold text-foreground">Create New Admin</h2>
              <button onClick={() => setShowCreateDialog(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateDialog(false)}
                className="text-xs h-7 border-border"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateUser}
                disabled={creating}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-7"
              >
                {creating ? <Loader2 className="size-3 animate-spin mr-1" /> : null}
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MobileSidebarProvider>
  );
}
