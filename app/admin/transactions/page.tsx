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
  CreditCard, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  RefreshCw, 
  Search,
  User
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: string;
  billing: string;
  amount: number;
  paymentMethod: string;
  senderNumber: string;
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        toast.error(data.message || "Failed to load transactions.");
      }
    } catch {
      toast.error("Failed to connect to admin transactions endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this transaction?`)) return;
    
    setActionId(id);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || `Transaction ${action}d successfully.`);
        fetchTransactions();
      } else {
        toast.error(data.message || "Action execution failed.");
      }
    } catch {
      toast.error("Connection failed.");
    } finally {
      setActionId(null);
    }
  };

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login?callback=/admin/transactions");
      } else if (session.user.role !== "admin") {
        router.push("/unauthorized");
      } else {
        fetchTransactions();
      }
    }
  }, [session, isPending, router]);

  const filteredTransactions = transactions.filter((tx) => {
    const term = search.toLowerCase();
    return (
      tx.userEmail.toLowerCase().includes(term) ||
      tx.userName.toLowerCase().includes(term) ||
      tx.transactionId.toLowerCase().includes(term) ||
      tx.senderNumber.includes(term)
    );
  });

  if (isPending || !session || session.user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <ShieldAlert className="size-8 animate-pulse text-amber-500" />
          <span className="text-lg text-muted-foreground">Authenticating credentials...</span>
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
            <div className="p-3 sm:p-4 md:p-6 space-y-4">
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border/40">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CreditCard className="size-5 text-amber-500" />
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Payment Verifications</h1>
                  </div>
                  <p className="text-muted-foreground text-base truncate">
                    Review and approve local manual bKash/Nagad transactions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchTransactions}
                    disabled={loading}
                    className="bg-card text-foreground hover:bg-accent text-base h-7 gap-1"
                  >
                    {loading ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
                    <span>Refresh</span>
                  </Button>
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="flex items-center gap-2 bg-card rounded-lg px-2.5 py-1.5 border border-border/45 max-w-sm">
                <Search className="size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by Email, TxnID, Phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>

              {/* Transactions Card Grid */}
              <Card className="bg-card text-card-foreground">
                <CardHeader className="px-3 pt-3 pb-2">
                  <CardTitle className="text-lg font-bold">Transaction Verification Log</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Showing all bKash and Nagad payment logs in MongoDB
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="size-6 animate-spin text-amber-500" />
                    </div>
                  ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-base">
                      No matching transaction records found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-1">
                      <table className="w-full text-left text-base min-w-[700px]">
                        <thead>
                          <tr className="text-muted-foreground font-semibold border-b border-border/40 pb-2">
                            <th className="pb-2 pl-1">User Info</th>
                            <th className="pb-2">Plan Details</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2">Operator</th>
                            <th className="pb-2">Sender No.</th>
                            <th className="pb-2">Transaction ID</th>
                            <th className="pb-2">Status</th>
                            <th className="pb-2 text-right pr-1">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                          {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-accent/30 text-foreground transition-all">
                              <td className="py-2.5 pl-1">
                                <p className="font-semibold text-foreground leading-none mb-0.5">{tx.userName}</p>
                                <span className="text-base text-muted-foreground">{tx.userEmail}</span>
                              </td>
                              <td className="py-2.5">
                                <p className="font-medium text-foreground leading-none mb-0.5">{tx.plan}</p>
                                <span className="text-base text-muted-foreground capitalize">{tx.billing}</span>
                              </td>
                              <td className="py-2.5 font-bold text-foreground">৳{tx.amount}</td>
                              <td className="py-2.5">
                                <span className={`rounded-full px-1.5 py-0.5 text-lg font-black uppercase ${
                                  tx.paymentMethod === "bkash" 
                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" 
                                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                }`}>
                                  {tx.paymentMethod}
                                </span>
                              </td>
                              <td className="py-2.5 font-mono text-base text-foreground">{tx.senderNumber}</td>
                              <td className="py-2.5 font-mono text-base font-bold text-blue-500 dark:text-blue-400">{tx.transactionId}</td>
                              <td className="py-2.5">
                                <div className="flex items-center gap-1">
                                  {tx.status === "approved" && <CheckCircle className="size-3.5 text-emerald-500" />}
                                  {tx.status === "rejected" && <XCircle className="size-3.5 text-rose-500" />}
                                  {tx.status === "pending" && <Clock className="size-3.5 text-amber-500" />}
                                  <span className={`capitalize font-semibold text-base ${
                                    tx.status === "approved" 
                                      ? "text-emerald-500" 
                                      : tx.status === "rejected" 
                                        ? "text-rose-500" 
                                        : "text-amber-500"
                                  }`}>
                                    {tx.status}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 text-right pr-1">
                                {tx.status === "pending" ? (
                                  <div className="inline-flex gap-1.5">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAction(tx.id, "reject")}
                                      disabled={actionId !== null}
                                      className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-6 px-2 text-base rounded"
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleAction(tx.id, "approve")}
                                      disabled={actionId !== null}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-6 px-2 text-base rounded"
                                    >
                                      Approve
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-base text-muted-foreground italic">Reviewed</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
