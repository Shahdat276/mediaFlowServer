"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Layers,
  LogOut,
  Settings,
  Shield,
  User,
  Zap,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

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
          <Zap className="size-8 animate-spin text-violet-500" />
          <span className="text-sm text-zinc-400">Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar navigation */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800/80 bg-zinc-900/50 p-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-violet-600 p-1.5 text-white">
            <Zap className="size-6" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">MediaFlow</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-violet-950/40 text-violet-400 border border-violet-850/30"
          >
            <Layers className="size-4" /> Dashboard
          </a>
          <a
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-all"
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
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Welcome back, {session?.user?.name || "User"}
            </p>
          </div>
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {session?.user?.role === "admin" && (
              <a
                href="/admin"
                className={buttonVariants({
                  variant: "default",
                  className: "bg-amber-600 hover:bg-amber-500 text-white font-medium gap-1.5 py-2 px-3 rounded-lg"
                })}
              >
                <Shield className="size-4" /> Admin Console
              </a>
            )}
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

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Account Role</span>
              <User className="size-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize text-white">{session?.user?.role || "user"}</div>
              <p className="text-zinc-500 text-xs mt-1">Standard application privilege</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Tasks</span>
              <Activity className="size-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-zinc-500 text-xs mt-1">+4 created in last 24h</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">System Status</span>
              <Settings className="size-4 text-emerald-400 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">Online</div>
              <p className="text-zinc-500 text-xs mt-1">All services operating normally</p>
            </CardContent>
          </Card>
        </div>

        {/* Details & Admin Verification Card */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Profile Details</CardTitle>
              <CardDescription className="text-zinc-500 text-xs">Better Auth Session payload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-800/40">
                <span className="text-zinc-400">Name</span>
                <span className="text-white font-medium">{session?.user?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/40">
                <span className="text-zinc-400">Email</span>
                <span className="text-white font-medium">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/40">
                <span className="text-zinc-400">User ID</span>
                <span className="text-zinc-500 font-mono text-xs truncate max-w-[200px]">{session?.user?.id}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Session Created</span>
                <span className="text-zinc-500 text-xs">{new Date(session?.session?.createdAt || "").toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/80 bg-zinc-900/40 text-zinc-100 shadow-xl backdrop-blur-sm flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2 rounded-full w-fit bg-amber-950/30 border border-amber-900/30 px-2 py-0.5 text-xs text-amber-400 font-medium">
                <Shield className="size-3.5" /> Security Testing
              </div>
              <CardTitle className="text-lg font-bold text-white mt-3">Admin Access Verification</CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                Test your role restrictions by attempting to navigate to the restricted administrative page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-zinc-400 text-sm">
              Standard users will be automatically blocked by the routing proxy middleware and redirected to a forbidden page, while accounts with the `admin` role are permitted access.
            </CardContent>
            <div className="p-6 pt-0">
              <a
                href="/admin"
                className={buttonVariants({
                  variant: "default",
                  className: "w-full bg-violet-600 hover:bg-violet-500 text-white font-medium gap-1.5 group py-2.5 rounded-lg flex items-center justify-center"
                })}
              >
                Try Accessing Admin Page <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
