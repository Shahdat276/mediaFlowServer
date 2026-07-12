"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  KeyRound,
  Shield,
  Calendar,
  Loader2,
  Save,
  Eye,
  EyeOff,
  BadgeCheck,
  CreditCard,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [subData, setSubData] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // Populate name from session
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // Fetch subscription status
  useEffect(() => {
    if (session?.user) {
      fetch("/api/subscription/status")
        .then(res => res.json())
        .then(data => { if (data.success) setSubData(data); })
        .catch(() => {})
        .finally(() => setLoadingSub(false));
    }
  }, [session]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (name.trim() === session?.user?.name) {
      toast.error("No changes detected");
      return;
    }

    setSavingName(true);
    try {
      const { error } = await authClient.updateUser({ name: name.trim() });
      if (error) {
        toast.error(error.message || "Failed to update name");
      } else {
        toast.success("Name updated successfully");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (error) {
        toast.error(error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const userInitials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const memberSince = session.user.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />

          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6 w-full">
              {/* Page Title */}
              <div className="pb-3 mb-4">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">My Profile</h1>
                <p className="text-muted-foreground text-lg">Manage your account settings and preferences</p>
              </div>

              {/* Profile Header Card */}
              <Card className="bg-card text-card-foreground mb-4">
                <CardContent className="px-4 py-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Avatar className="size-16 sm:size-20">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl sm:text-3xl font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">{session.user.name}</h2>
                      <p className="text-lg text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                        <Mail className="size-3.5" />
                        {session.user.email}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-lg font-semibold text-primary">
                          <Shield className="size-3" />
                          {session.user.role === "admin" ? "Administrator" : "Member"}
                        </span>
                        {subData?.active && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-lg font-semibold text-emerald-500">
                            <BadgeCheck className="size-3" />
                            {subData.plan} Plan
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-muted-foreground text-lg">
                          <Calendar className="size-3" />
                          Joined {memberSince}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {/* Update Name */}
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-1.5">
                      <User className="size-4 text-primary" />
                      Display Name
                    </CardTitle>
                    <CardDescription className="text-lg">Update your public display name</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <form onSubmit={handleUpdateName} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="profile-name" className="text-base text-muted-foreground">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                          <Input
                            id="profile-name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-9 bg-background text-foreground text-lg"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={savingName}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base gap-1.5 py-2"
                      >
                        {savingName ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                        {savingName ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Account Info */}
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-1.5">
                      <Shield className="size-4 text-primary" />
                      Account Details
                    </CardTitle>
                    <CardDescription className="text-lg">Your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 space-y-2.5">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-base text-muted-foreground">Email</span>
                      <span className="text-base font-medium text-foreground">{session.user.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-base text-muted-foreground">Role</span>
                      <span className="text-base font-medium text-foreground capitalize">{session.user.role || "user"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-base text-muted-foreground">User ID</span>
                      <span className="text-lg font-mono text-muted-foreground">{session.user.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-base text-muted-foreground">Member Since</span>
                      <span className="text-base font-medium text-foreground">{memberSince}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-base text-muted-foreground">Subscription</span>
                      <span className="text-base font-medium">
                        {loadingSub ? (
                          <Loader2 className="size-3 animate-spin text-muted-foreground inline" />
                        ) : subData?.active ? (
                          <span className="text-emerald-500">{subData.plan} Active</span>
                        ) : (
                          <span className="text-muted-foreground">Free Trial</span>
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Change Password */}
              <Card className="bg-card text-card-foreground mt-4">
                <CardHeader className="px-4 pt-4 pb-2">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-1.5">
                    <KeyRound className="size-4 text-primary" />
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-lg">Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="current-pw" className="text-base text-muted-foreground">Current Password</Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                          <Input
                            id="current-pw"
                            type={showCurrentPw ? "text" : "password"}
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pl-9 pr-9 bg-background text-foreground text-lg"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="new-pw" className="text-base text-muted-foreground">New Password</Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                          <Input
                            id="new-pw"
                            type={showNewPw ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-9 pr-9 bg-background text-foreground text-lg"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw(!showNewPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="confirm-pw" className="text-base text-muted-foreground">Confirm New Password</Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-3.5" />
                          <Input
                            id="confirm-pw"
                            type={showConfirmPw ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-9 pr-9 bg-background text-foreground text-lg"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw(!showConfirmPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={changingPassword}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base gap-1.5 py-2 px-4"
                    >
                      {changingPassword ? <Loader2 className="size-3.5 animate-spin" /> : <KeyRound className="size-3.5" />}
                      {changingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
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
