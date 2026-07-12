"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Calendar,
  Hash,
  Phone,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Zap
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

interface SubscriptionStatus {
  active: boolean;
  plan: string;
  expiresAt: string | null;
  daysRemaining: number;
  status: string;
}

interface Stats {
  totalTransactions: number;
  totalPaid: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function BillingPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [stats, setStats] = useState<Stats>({ totalTransactions: 0, totalPaid: 0, pending: 0, approved: 0, rejected: 0 });
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  const fetchData = useCallback(async (tab: FilterTab = activeTab, page: number = 1, showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const statusParam = tab === "all" ? "" : `&status=${tab}`;
      const res = await fetch(`/api/subscription/history?page=${page}&limit=10${statusParam}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription/status");
      const data = await res.json();
      if (data.success) {
        setSubscription({
          active: data.active,
          plan: data.plan,
          expiresAt: data.expiresAt,
          daysRemaining: data.daysRemaining,
          status: data.status,
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchData();
      fetchSubscription();
    }
  }, [session, fetchData, fetchSubscription]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setExpandedId(null);
    fetchData(tab, 1);
  };

  const handlePageChange = (newPage: number) => {
    fetchData(activeTab, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    fetchData(activeTab, pagination.page, true);
    fetchSubscription();
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading billing history...</span>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, label: "Pending", color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", dot: "bg-amber-500" },
    approved: { icon: CheckCircle2, label: "Approved", color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", dot: "bg-emerald-500" },
    rejected: { icon: XCircle, label: "Rejected", color: "text-red-600", bg: "bg-red-50", ring: "ring-red-200", dot: "bg-red-500" },
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.totalTransactions },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "approved", label: "Approved", count: stats.approved },
    { key: "rejected", label: "Rejected", count: stats.rejected },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Billing History</h1>
          <p className="text-muted-foreground text-base">All your payment transactions in one place</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 gap-1.5 text-base"
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Current Subscription Card */}
      {subscription && (
        <Card className="bg-card text-card-foreground overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* Left: Plan Info */}
              <div className="flex-1 p-4 flex items-center gap-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                  subscription.active
                    ? "bg-emerald-500/10"
                    : subscription.status === "pending_verification"
                      ? "bg-amber-500/10"
                      : "bg-slate-500/10"
                }`}>
                  {subscription.active ? (
                    <ShieldCheck className="size-5 text-emerald-500" />
                  ) : subscription.status === "pending_verification" ? (
                    <Clock className="size-5 text-amber-500" />
                  ) : (
                    <Zap className="size-5 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-foreground truncate">{subscription.plan}</p>
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-lg font-bold ${
                      subscription.active
                        ? "bg-emerald-50 text-emerald-600"
                        : subscription.status === "pending_verification"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-500"
                    }`}>
                      {subscription.active ? "Active" : subscription.status === "pending_verification" ? "Pending" : "Inactive"}
                    </span>
                  </div>
                  {subscription.active && subscription.expiresAt ? (
                    <p className="text-lg text-muted-foreground">
                      Expires {new Date(subscription.expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      {" · "}
                      <span className={subscription.daysRemaining <= 7 ? "text-amber-600 font-semibold" : ""}>
                        {subscription.daysRemaining} days remaining
                      </span>
                    </p>
                  ) : subscription.status === "pending_verification" ? (
                    <p className="text-lg text-amber-600">Awaiting admin verification</p>
                  ) : (
                    <p className="text-lg text-muted-foreground">No active subscription</p>
                  )}
                </div>
              </div>
              {/* Right: Action */}
              <div className="px-4 pb-3 sm:pb-0 sm:pr-4 flex items-center">
                <Link href="/checkout?plan=Pro&billing=monthly">
                  <Button
                    size="sm"
                    className={`text-base font-bold gap-1.5 ${
                      subscription.active
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                  >
                    <CreditCard className="size-3.5" />
                    {subscription.active ? "Renew / Upgrade" : "Subscribe Now"}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
        <Card className="bg-card text-card-foreground">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
              <Receipt className="size-3.5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Total</p>
              <p className="text-lg font-bold text-foreground">{stats.totalTransactions}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card text-card-foreground">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
              <TrendingUp className="size-3.5 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Total Paid</p>
              <p className="text-lg font-bold text-foreground">৳{stats.totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card text-card-foreground">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Approved</p>
              <p className="text-lg font-bold text-foreground">{stats.approved}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card text-card-foreground">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
              <Clock className="size-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Pending</p>
              <p className="text-lg font-bold text-foreground">{stats.pending}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-3 py-1.5 rounded-md text-base font-bold transition-all flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className={`text-lg px-1 rounded-full ${
              activeTab === tab.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <Card className="bg-card text-card-foreground">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="size-10 text-muted-foreground/40 mb-3" />
            <p className="text-lg font-medium text-foreground">
              {activeTab === "all" ? "No billing history yet" : `No ${activeTab} transactions`}
            </p>
            <p className="text-base text-muted-foreground mt-1">
              {activeTab === "all" ? "Your payment transactions will appear here" : "Try selecting a different filter"}
            </p>
            {activeTab === "all" && (
              <Link href="/checkout?plan=Pro&billing=monthly" className="mt-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold gap-1.5">
                  <CreditCard className="size-3.5" /> Make a Payment
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {transactions.map((tx) => {
              const cfg = statusConfig[tx.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              const isExpanded = expandedId === tx.id;

              return (
                <Card
                  key={tx.id}
                  className={`bg-card text-card-foreground cursor-pointer transition-all ${
                    isExpanded ? "bg-accent/30" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                >
                  <CardContent className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ring-1 ${cfg.ring}`}>
                          <StatusIcon className={`size-4 ${cfg.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-lg font-bold text-foreground truncate">{tx.plan}</p>
                            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-lg font-bold ${cfg.bg} ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            <span className="text-lg text-muted-foreground capitalize hidden sm:inline">
                              {tx.billing}
                            </span>
                          </div>
                          <p className="text-lg text-muted-foreground">
                            {tx.paymentMethod === "bkash" ? "bKash" : "Nagad"} · TxnID: <span className="font-mono">{tx.transactionId}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-black text-foreground">৳{tx.amount?.toLocaleString()}</p>
                        <p className="text-lg text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border space-y-3 text-base">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CreditCard className="size-3 shrink-0" />
                            <span>Method: <strong className="text-foreground">{tx.paymentMethod === "bkash" ? "bKash" : "Nagad"}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="size-3 shrink-0" />
                            <span>Sender: <strong className="text-foreground font-mono">{tx.senderNumber}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Hash className="size-3 shrink-0" />
                            <span>TxnID: <strong className="text-foreground font-mono">{tx.transactionId}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3 shrink-0" />
                            <span>Billing: <strong className="text-foreground capitalize">{tx.billing}</strong></span>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-lg text-muted-foreground">
                            <div className={`size-2 rounded-full ${cfg.dot}`} />
                            <span>Submitted {new Date(tx.createdAt).toLocaleString()}</span>
                          </div>
                          {tx.status === "approved" && tx.approvedAt && (
                            <div className="flex items-center gap-2 text-lg text-emerald-600">
                              <div className="size-2 rounded-full bg-emerald-500" />
                              <span>Approved {new Date(tx.approvedAt).toLocaleString()}</span>
                            </div>
                          )}
                          {tx.status === "rejected" && (
                            <>
                              {tx.rejectedAt && (
                                <div className="flex items-center gap-2 text-lg text-red-600">
                                  <div className="size-2 rounded-full bg-red-500" />
                                  <span>Rejected {new Date(tx.rejectedAt).toLocaleString()}</span>
                                </div>
                              )}
                              {tx.rejectReason && (
                                <div className="flex items-start gap-1.5 bg-red-50 rounded-md p-2 mt-1">
                                  <AlertTriangle className="size-3 text-red-500 shrink-0 mt-0.5" />
                                  <span className="text-red-600 text-lg">{tx.rejectReason}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Actions for rejected */}
                        {tx.status === "rejected" && (
                          <Link href="/checkout?plan=Pro&billing=monthly">
                            <Button size="sm" variant="outline" className="text-base gap-1.5 mt-1">
                              <RefreshCw className="size-3" /> Resubmit Payment
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-lg text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(p)}
                    className="h-7 w-7 p-0 text-base"
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
