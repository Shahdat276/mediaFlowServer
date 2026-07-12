"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";
import { Settings, Shield, Database, Gauge, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Shield className="size-8 animate-pulse text-amber-500" />
          <span className="text-lg text-muted-foreground">Loading...</span>
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
                    <Settings className="size-5 text-amber-500" />
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">System Settings</h1>
                  </div>
                  <p className="text-muted-foreground text-base">
                    Application configuration and system information
                  </p>
                </div>
              </div>

              {/* Settings Cards */}
              <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
                {/* Authentication */}
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                        <Shield className="size-4 text-amber-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">Authentication</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">Auth engine configuration</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-2 space-y-2">
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Engine</span>
                      <span className="text-base font-medium text-foreground">Better Auth v1.6.23</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Plugin</span>
                      <span className="text-base font-medium text-foreground">Admin Plugin</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Database</span>
                      <span className="text-base font-medium text-foreground">MongoDB Atlas</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Database */}
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                        <Database className="size-4 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">Database</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">MongoDB connection settings</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-2 space-y-2">
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Driver</span>
                      <span className="text-base font-medium text-foreground">mongodb (native)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Max Pool Size</span>
                      <span className="text-base font-medium text-foreground">10</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Min Pool Size</span>
                      <span className="text-base font-medium text-foreground">2</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance */}
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Gauge className="size-4 text-emerald-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">Performance</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">Optimization settings</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-2 space-y-2">
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Compression</span>
                      <span className="text-base font-medium text-emerald-500">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Package Optimization</span>
                      <span className="text-base font-medium text-foreground">lucide-react, recharts</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Static Cache</span>
                      <span className="text-base font-medium text-foreground">1 year (immutable)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Security */}
                <Card className="bg-card text-card-foreground">
                  <CardHeader className="px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
                        <Lock className="size-4 text-red-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">Security</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">Headers and access control</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-2 space-y-2">
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">X-Content-Type-Options</span>
                      <span className="text-base font-medium text-foreground">nosniff</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">X-Frame-Options</span>
                      <span className="text-base font-medium text-foreground">DENY</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-base text-muted-foreground">Middleware</span>
                      <span className="text-base font-medium text-foreground">Role-based access</span>
                    </div>
                  </CardContent>
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
