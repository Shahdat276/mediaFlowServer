"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          <AppFooter />
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
