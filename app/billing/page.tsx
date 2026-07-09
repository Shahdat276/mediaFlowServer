"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";
import {
  Receipt,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  ArrowLeft,
  Calendar,
  Hash,
  Phone
} from "lucide-react";
import Link from "next/link";

interface Transaction {
  id: string;
  plan: string;
  billing: string;
  amount: number;
  paymentMethod: "bkash" | "nagad";
  senderNumber: string;
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
}

export default function BillingPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/subscription/history")
        .then(res => res.json())
        .then(data => {
          if (data.success) setTransactions(data.transactions);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading billing history...</span>
        </div>
      </div>
    );
  }

  const totalSpent = transactions
    .filter(t => t.status === "approved")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const statusConfig = {
    pending: { icon: Clock, label: "Pending", color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200" },
    approved: { icon: CheckCircle2, label: "Approved", color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200" },
    rejected: { icon: XCircle, label: "Rejected", color: "text-red-600", bg: "bg-red-50", ring: "ring-red-200" },
  };

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6 w-full">
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 mb-4">
                
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Billing History</h1>
                  <p className="text-muted-foreground text-[11px]">All your payment transactions in one place</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-3 mb-4">
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                      <Receipt className="size-3.5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Total Transactions</p>
                      <p className="text-sm font-bold text-foreground">{transactions.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
                      <CreditCard className="size-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Total Paid</p>
                      <p className="text-sm font-bold text-foreground">৳{totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                      <Clock className="size-3.5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Pending</p>
                      <p className="text-sm font-bold text-foreground">{transactions.filter(t => t.status === "pending").length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Transactions List */}
              {transactions.length === 0 ? (
                <Card className="bg-card text-card-foreground">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Receipt className="size-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-medium text-foreground">No billing history yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Your payment transactions will appear here</p>
                    <Link href="/checkout?plan=Pro&billing=monthly" className="mt-4">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold gap-1.5">
                        <CreditCard className="size-3.5" /> Make a Payment
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => {
                    const cfg = statusConfig[tx.status] || statusConfig.pending;
                    const StatusIcon = cfg.icon;
                    const isExpanded = expandedId === tx.id;

                    return (
                      <Card
                        key={tx.id}
                        className="bg-card text-card-foreground cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                      >
                        <CardContent className="px-4 py-3">
                          {/* Main Row */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ring-1 ${cfg.ring}`}>
                                <StatusIcon className={`size-4 ${cfg.color}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-foreground truncate">{tx.plan}</p>
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${cfg.bg} ${cfg.color}`}>
                                    {cfg.label}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  {tx.paymentMethod === "bkash" ? "bKash" : "Nagad"} · TxnID: {tx.transactionId}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-foreground">৳{tx.amount?.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 space-y-2 text-xs">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <CreditCard className="size-3" />
                                  <span>Method: <strong className="text-foreground">{tx.paymentMethod === "bkash" ? "bKash" : "Nagad"}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Phone className="size-3" />
                                  <span>Sender: <strong className="text-foreground">{tx.senderNumber}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Hash className="size-3" />
                                  <span>TxnID: <strong className="text-foreground font-mono">{tx.transactionId}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Calendar className="size-3" />
                                  <span>Billing: <strong className="text-foreground capitalize">{tx.billing}</strong></span>
                                </div>
                              </div>
                              {tx.status === "approved" && tx.approvedAt && (
                                <p className="text-emerald-600 text-[10px]">
                                  Approved on {new Date(tx.approvedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                              )}
                              {tx.status === "rejected" && (
                                <div className="bg-red-50 rounded-md p-2">
                                  <p className="text-red-600 text-[10px] font-medium">Rejected</p>
                                  {tx.rejectReason && <p className="text-red-500 text-[10px]">{tx.rejectReason}</p>}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
          <AppFooter />
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
