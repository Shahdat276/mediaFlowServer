"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
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
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function UserDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const [subData, setSubData] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchSubscriptionStatus = async () => {
    setLoadingSub(true);
    try {
      const res = await fetch("/api/subscription/status");
      const data = await res.json();
      if (data.success) {
        setSubData(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchSubscriptionStatus();
    }
  }, [session]);

  const handleSimulateCheckout = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/subscription/simulate-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan: "Pro" })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Simulation Checkout Successful! Unlocked Creator Pro.");
        fetchSubscriptionStatus();
      } else {
        toast.error(data.message || "Failed to update subscription.");
      }
    } catch {
      toast.error("Error communicating with checkout simulation endpoint.");
    } finally {
      setUpgrading(false);
    }
  };

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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-4">
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
                      className: "bg-amber-600 hover:bg-amber-500 text-primary-foreground font-medium gap-1.5 py-1.5 px-2.5 rounded-lg text-xs h-7"
                    })}
                  >
                    <Shield className="size-3.5" /> Admin Console
                  </a>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-3 mb-3">
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <User className="size-3 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Account Role</p>
                        <p className="text-sm font-bold capitalize text-foreground leading-tight">{session?.user?.role || "user"}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <CreditCard className="size-3 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">License Tier</p>
                        <p className="text-sm font-bold text-foreground leading-tight">
                          {loadingSub ? "Loading..." : subData?.active ? `${subData?.plan} Tier` : "Free Trial"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
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

              {/* Details & Subscription Card */}
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="px-3 pt-3 pb-2">
                    <CardTitle className="text-sm font-bold text-foreground">Profile Details</CardTitle>
                    <CardDescription className="text-muted-foreground text-[10px]">Better Auth Session payload</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs px-3 pb-3 pt-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{session?.user?.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground font-medium break-all">{session?.user?.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="text-muted-foreground font-mono text-[10px] break-all">{session?.user?.id}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 py-0.5">
                      <span className="text-muted-foreground">Session Created</span>
                      <span className="text-muted-foreground text-[10px]">{new Date(session?.session?.createdAt || "").toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Card */}
                <Card className="bg-card text-card-foreground flex flex-col justify-between">
                  <CardHeader className="px-3 pt-3 pb-2">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="size-3.5 text-primary" />
                      <CardTitle className="text-sm font-bold text-foreground">Subscription Management</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground text-[10px]">
                      Manage and verify your desktop app licenses.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs px-3 pb-2 pt-0 space-y-2">
                    {loadingSub ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-3 animate-spin text-primary" />
                        <span>Fetching subscription state...</span>
                      </div>
                    ) : subData?.active ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-500 font-semibold bg-emerald-500/10 rounded-md p-2">
                          <CheckCircle2 className="size-4 shrink-0" />
                          <span>Active Subscription Plan ({subData?.plan})</span>
                        </div>
                        <div className="text-muted-foreground text-[11px] space-y-1 pl-1">
                          <p>Status: <span className="font-bold text-foreground">Active</span></p>
                          <p>Expires: <span className="font-bold text-foreground">{new Date(subData?.expiresAt).toLocaleDateString()}</span> ({subData?.daysRemaining} days left)</p>
                          <p className="text-[10px] text-emerald-400 mt-1">✓ Unlimited exports (1080p, 4K) unlocked in the desktop app.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-amber-500 font-semibold bg-amber-500/10 rounded-md p-2">
                          <AlertCircle className="size-4 shrink-0" />
                          <span>No Active Subscription (Free Trial)</span>
                        </div>
                        <p className="text-muted-foreground text-[11px] pl-1">
                          Upgrade to Pro to unlock unlimited resolution exports (1080p, 4K), deep video analytics, and smart filters in your MediaFlow desktop app.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <div className="px-3 pb-3 pt-1">
                    {!loadingSub && !subData?.active && (
                      <Button
                        onClick={handleSimulateCheckout}
                        disabled={upgrading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold gap-1.5 py-2 rounded-lg flex items-center justify-center text-xs shadow-lg shadow-blue-500/15"
                      >
                        {upgrading ? <Loader2 className="size-3.5 animate-spin" /> : "💎 Upgrade to Pro (Simulate Checkout)"}
                      </Button>
                    )}
                    {subData?.active && (
                      <div className="text-[10px] text-muted-foreground text-center py-1">
                        Use your registered credentials inside the desktop app sidebar to synchronize your Pro license.
                      </div>
                    )}
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
