"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ShieldAlert,
  Terminal,
  LogOut,
  Layers,
  Shield,
  Zap,
  Loader2,
  Trash2,
  Lock,
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
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
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

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.refresh();
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-2">
          <Shield className="size-8 animate-pulse text-amber-500" />
          <span className="text-sm text-zinc-400">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar navigation */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800/80 bg-zinc-900/50 p-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-600 p-1.5 text-white">
            <Shield className="size-6" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">MediaFlow</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-all"
          >
            <Layers className="size-4" /> Dashboard
          </a>
          <a
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-amber-950/40 text-amber-400 border border-amber-850/30"
          >
            <Shield className="size-4" /> Admin Portal
          </a>
        </nav>

        <div className="pt-6 border-t border-zinc-800/80">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            disabled={loading}
            className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-950/10 gap-3"
          >
            <LogOut className="size-4" /> Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/60 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Portal</h1>
              <span className="rounded-full bg-amber-950/40 border border-amber-800/30 px-2.5 py-0.5 text-xs text-amber-400 font-semibold shadow-inner">
                System Console
              </span>
            </div>
            <p className="text-zinc-500 text-sm mt-1">
              Active Session: {session?.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <Button
              variant="outline"
              onClick={fetchUsers}
              disabled={fetchingUsers}
              className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              {fetchingUsers ? <Loader2 className="size-4 animate-spin" /> : "Refresh Users"}
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={loading}
              className="border-zinc-850 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white md:hidden"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        {/* Admin Stats Row */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Users</span>
              <Users className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dbUsers.length || "Loading..."}</div>
              <p className="text-zinc-500 text-xs mt-1">Registered in MongoDB database</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Auth Engine</span>
              <Zap className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Better Auth</div>
              <p className="text-zinc-500 text-xs mt-1">v1.6.23 with Admin Plugin</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">System Privileges</span>
              <ShieldAlert className="size-4 text-amber-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Root Admin</div>
              <p className="text-zinc-500 text-xs mt-1">Full write and read access</p>
            </CardContent>
          </Card>
        </div>

        {/* Database User Management Section */}
        <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Database Users</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Direct list of user entries fetched from the MongoDB Atlas collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fetchingUsers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-6 animate-spin text-amber-500" />
              </div>
            ) : dbUsers.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No users found. Try seeding the database first.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                      <th className="pb-3 pl-2">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbUsers.map((user) => (
                      <tr key={user.id} className="border-b border-zinc-850 hover:bg-zinc-800/20 text-zinc-300">
                        <td className="py-3.5 pl-2 font-medium text-white">{user.name}</td>
                        <td className="py-3.5">{user.email}</td>
                        <td className="py-3.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-amber-950/50 border border-amber-900/30 text-amber-400"
                                : "bg-zinc-950 border border-zinc-800 text-zinc-400"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-xs text-zinc-500 truncate max-w-[150px]">
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
        <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-amber-500" />
              <CardTitle className="text-lg font-bold text-white">System Security Log</CardTitle>
            </div>
            <CardDescription className="text-zinc-500 text-xs">Realtime proxy interception trace</CardDescription>
          </CardHeader>
          <CardContent className="bg-zinc-950 rounded-lg border border-zinc-850 p-4 font-mono text-xs text-zinc-400 space-y-1.5 shadow-inner">
            <p className="text-zinc-600">[2026-07-06T10:55:00] PROXY: Intercepted route request to /admin</p>
            <p className="text-emerald-500">[2026-07-06T10:55:00] PROXY: Session cookie identified</p>
            <p className="text-emerald-500">[2026-07-06T10:55:01] PROXY: API response verified user role = admin</p>
            <p className="text-amber-500">[2026-07-06T10:55:01] PROXY: Access authorized, rendering dashboard</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
