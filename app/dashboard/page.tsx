"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Zap,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
  BarChart3,
  Download,
  Settings,
  LogOut,
  ChevronRight,
  Calendar,
  Mail,
  BadgeCheck,
  TrendingUp,
  Play,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [subData, setSubData] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [managing, setManaging] = useState(false);

  const fetchSubscriptionStatus = async () => {
    setLoadingSub(true);
    try {
      const res = await fetch("/api/subscription/status");
      const data = await res.json();
      if (data.success) setSubData(data);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    if (session?.user) fetchSubscriptionStatus();
  }, [session]);

  const handleCancelAutoRenew = async () => {
    setManaging(true);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Auto-renewal cancelled successfully.");
        fetchSubscriptionStatus();
      } else {
        toast.error(data.message || "Failed to cancel renewal.");
      }
    } catch {
      toast.error("Failed to connect to subscription cancel endpoint.");
    } finally {
      setManaging(false);
    }
  };

  const handleReactivateAutoRenew = async () => {
    setManaging(true);
    try {
      const res = await fetch("/api/subscription/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Auto-renewal reactivated successfully.");
        fetchSubscriptionStatus();
      } else {
        toast.error(data.message || "Failed to reactivate renewal.");
      }
    } catch {
      toast.error("Failed to connect to subscription reactivation endpoint.");
    } finally {
      setManaging(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Zap className="size-10 animate-spin text-primary" />
          <span className="text-base text-muted-foreground">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role || "user";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = session?.session?.createdAt
    ? new Date(session.session.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const isActive = subData?.active;
  const isPending2 = subData?.status === "pending_verification";
  const isExpiring = subData?.cancelAtPeriodEnd;

  const quickActions = [
    { label: "My Profile", icon: User, href: "/profile", color: "bg-primary/10 text-primary" },
    { label: "Billing History", icon: CreditCard, href: "/billing", color: "bg-emerald-500/10 text-emerald-500" },
    { label: "Download App", icon: Download, href: "/#download", color: "bg-blue-500/10 text-blue-500", external: true },
    ...(userRole === "admin"
      ? [{ label: "Admin Panel", icon: Shield, href: "/admin", color: "bg-amber-500/10 text-amber-500" }]
      : []),
  ];

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 w-full">

              {/* ── Welcome Banner ── */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-6 sm:p-8 mb-6">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14 sm:size-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/15 text-primary text-xl sm:text-2xl font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                        Welcome back, {userName.split(" ")[0]}!
                      </h1>
                      <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {userEmail}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <Shield className="size-3" />
                          {userRole === "admin" ? "Administrator" : "Member"}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                            <BadgeCheck className="size-3" />
                            {subData.plan} Plan
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                          <Calendar className="size-3" />
                          Joined {memberSince}
                        </span>
                      </div>
                    </div>
                  </div>
                  {userRole === "admin" && (
                    <a
                      href="/admin"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                    >
                      <Shield className="size-4" /> Admin Console
                    </a>
                  )}
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-12 -right-12 size-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
              </div>

              {/* ── Quick Actions ── */}
              <div className="mb-6">
                <h2 className="text-base font-bold text-foreground mb-3">Quick Actions</h2>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => action.external ? window.open(action.href, "_blank") : router.push(action.href)}
                        className="group flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-card p-4 hover:bg-accent/50 hover:border-primary/20 transition-all cursor-pointer text-center"
                      >
                        <div className={`flex size-10 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-110`}>
                          <Icon className="size-5" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Main Grid ── */}
              <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">

                {/* ── Subscription Status (spans 2 cols) ── */}
                <Card className="lg:col-span-2 bg-card text-card-foreground border-border/60 overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                          <Zap className="size-4 text-primary" />
                        </div>
                        <h2 className="text-base font-bold text-foreground">Subscription</h2>
                      </div>
                      {!loadingSub && isActive && (
                        <a
                          href="/billing"
                          className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors"
                        >
                          View History <ChevronRight className="size-3.5" />
                        </a>
                      )}
                    </div>

                    {loadingSub ? (
                      <div className="flex items-center gap-3 py-8 justify-center text-muted-foreground">
                        <Loader2 className="size-5 animate-spin text-primary" />
                        <span className="text-sm">Loading subscription data...</span>
                      </div>
                    ) : isActive ? (
                      <div className="space-y-4">
                        {/* Status Banner */}
                        <div className={`flex items-center gap-3 rounded-xl p-4 ${
                          isExpiring
                            ? "bg-amber-500/8 border border-amber-500/15"
                            : "bg-emerald-500/8 border border-emerald-500/15"
                        }`}>
                          {isExpiring ? (
                            <AlertCircle className="size-5 text-amber-500 shrink-0" />
                          ) : (
                            <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${isExpiring ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                              {isExpiring ? "Subscription Ending Soon" : "Active Subscription"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {isExpiring
                                ? "Auto-renewal is disabled. Your access will end after the current period."
                                : "Auto-renewal is active. You won't lose access."}
                            </p>
                          </div>
                        </div>

                        {/* Plan Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="rounded-lg bg-muted/40 p-3">
                            <p className="text-xs text-muted-foreground mb-0.5">Plan</p>
                            <p className="text-sm font-bold text-foreground">{subData.plan}</p>
                          </div>
                          <div className="rounded-lg bg-muted/40 p-3">
                            <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                            <p className={`text-sm font-bold ${isExpiring ? "text-amber-500" : "text-emerald-500"}`}>
                              {isExpiring ? "Expiring" : "Active"}
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/40 p-3">
                            <p className="text-xs text-muted-foreground mb-0.5">Expires</p>
                            <p className="text-sm font-bold text-foreground">
                              {new Date(subData.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/40 p-3">
                            <p className="text-xs text-muted-foreground mb-0.5">Days Left</p>
                            <p className={`text-sm font-bold ${subData.daysRemaining <= 7 ? "text-amber-500" : "text-foreground"}`}>
                              {subData.daysRemaining} days
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          {isExpiring ? (
                            <Button
                              onClick={handleReactivateAutoRenew}
                              disabled={managing}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5 text-sm"
                            >
                              {managing ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                              Reactivate Auto-Renewal
                            </Button>
                          ) : (
                            <Button
                              onClick={handleCancelAutoRenew}
                              disabled={managing}
                              variant="outline"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold gap-1.5 text-sm border-destructive/20"
                            >
                              {managing ? <Loader2 className="size-4 animate-spin" /> : "Cancel Auto-Renewal"}
                            </Button>
                          )}
                          <Button
                            onClick={() => router.push("/checkout?plan=Pro&billing=yearly")}
                            variant="outline"
                            className="font-semibold gap-1.5 text-sm"
                          >
                            <CreditCard className="size-4" /> Upgrade Plan
                          </Button>
                        </div>
                      </div>
                    ) : isPending2 ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-xl bg-amber-500/8 border border-amber-500/15 p-4">
                          <Clock className="size-5 text-amber-500 shrink-0 animate-pulse" />
                          <div>
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Payment Under Review</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Your bKash/Nagad payment is being verified by our admin team.
                            </p>
                          </div>
                        </div>
                        <Button
                          disabled
                          className="w-full bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed"
                        >
                          <Clock className="size-4" /> Verification in Progress
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/10 p-4">
                          <Sparkles className="size-5 text-primary shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-foreground">No Active Subscription</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              You're currently on the Free Trial. Upgrade to unlock 1080p, 4K exports, AI analytics, and more.
                            </p>
                          </div>
                        </div>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { icon: Play, text: "1080p & 4K Exports" },
                            { icon: BarChart3, text: "AI Video Analytics" },
                            { icon: Star, text: "Smart Enhancements" },
                          ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-2 rounded-lg bg-muted/30 p-2.5">
                              <Icon className="size-3.5 text-primary shrink-0" />
                              <span className="text-xs font-medium text-foreground">{text}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => router.push("/checkout?plan=Pro&billing=yearly")}
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold gap-2 text-sm shadow-lg shadow-primary/15"
                        >
                          <Sparkles className="size-4" /> Upgrade to Creator Pro
                        </Button>
                      </div>
                    )}

                    {isActive && (
                      <p className="text-xs text-muted-foreground text-center mt-3 pt-3 border-t border-border/40">
                        Use your registered credentials in the desktop app sidebar to sync your Pro license.
                      </p>
                    )}
                  </div>
                </Card>

                {/* ── Right Column ── */}
                <div className="space-y-5">

                  {/* Account Info */}
                  <Card className="bg-card text-card-foreground border-border/60">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                          <User className="size-4 text-blue-500" />
                        </div>
                        <h2 className="text-base font-bold text-foreground">Account Info</h2>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "Full Name", value: userName },
                          { label: "Email", value: userEmail },
                          { label: "Role", value: userRole, capitalize: true },
                          { label: "Member Since", value: memberSince },
                        ].map(({ label, value, capitalize }) => (
                          <div key={label} className="flex items-center justify-between py-1">
                            <span className="text-xs text-muted-foreground">{label}</span>
                            <span className={`text-sm font-medium text-foreground ${capitalize ? "capitalize" : ""}`}>{value}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between py-1">
                          <span className="text-xs text-muted-foreground">User ID</span>
                          <span className="text-xs font-mono text-muted-foreground max-w-[140px] truncate" title={session?.user?.id}>
                            {session?.user?.id}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 text-sm font-semibold gap-1.5"
                        onClick={() => router.push("/profile")}
                      >
                        <Settings className="size-3.5" /> Manage Profile
                      </Button>
                    </div>
                  </Card>

                  {/* System Status */}
                  <Card className="bg-card text-card-foreground border-border/60">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                          <TrendingUp className="size-4 text-emerald-500" />
                        </div>
                        <h2 className="text-base font-bold text-foreground">System</h2>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 p-3">
                        <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {[
                          { label: "Auth Engine", value: "Better Auth v1.6" },
                          { label: "Database", value: "MongoDB Atlas" },
                          { label: "API Status", value: "Healthy" },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between py-0.5">
                            <span className="text-xs text-muted-foreground">{label}</span>
                            <span className="text-xs font-medium text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>

          <AppFooter />
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
