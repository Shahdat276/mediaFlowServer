"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AppFooter } from "@/components/app-footer";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-provider";
import { CreditCard, Shield, Loader2, Plus, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id?: string;
  name: string;
  price: number;
  period: string;
  description: string;
  active: boolean;
}

const emptyPlan: Plan = {
  name: "",
  price: 0,
  period: "month",
  description: "",
  active: true,
};

export default function AdminPlansPage() {
  const { data: session, isPending } = authClient.useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState<Plan>(emptyPlan);
  const [savingPlan, setSavingPlan] = useState(false);

  const fetchPlans = async () => {
    setFetchingPlans(true);
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch {
      toast.error("Error fetching plans");
    } finally {
      setFetchingPlans(false);
    }
  };

  const openCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm(emptyPlan);
    setShowPlanDialog(true);
  };

  const openEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({ ...plan });
    setShowPlanDialog(true);
  };

  const handleSavePlan = async () => {
    if (!planForm.name) { toast.error("Plan name is required"); return; }
    setSavingPlan(true);
    try {
      if (editingPlan?.id) {
        const res = await fetch("/api/admin/plans", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPlan.id, ...planForm }),
        });
        const data = await res.json();
        if (data.success) toast.success("Plan updated");
        else toast.error(data.message);
      } else {
        const res = await fetch("/api/admin/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planForm),
        });
        const data = await res.json();
        if (data.success) toast.success("Plan created");
        else toast.error(data.message);
      }
      setShowPlanDialog(false);
      fetchPlans();
    } catch {
      toast.error("Error saving plan");
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    try {
      const res = await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Plan deleted"); fetchPlans(); }
      else toast.error(data.message);
    } catch {
      toast.error("Error deleting plan");
    }
  };

  useEffect(() => { fetchPlans(); }, []);

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
                    <CreditCard className="size-5 text-amber-500" />
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Subscription Plans</h1>
                  </div>
                  <p className="text-muted-foreground text-base">
                    Create and manage pricing plans for your users
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={fetchPlans} disabled={fetchingPlans} className="bg-card text-foreground hover:bg-accent text-base h-7">
                    {fetchingPlans ? <Loader2 className="size-3 animate-spin" /> : "Refresh"}
                  </Button>
                  <Button size="sm" onClick={openCreatePlan} className="bg-amber-500 hover:bg-amber-600 text-white text-base h-7">
                    <Plus className="size-3 mr-1" /> Add Plan
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 mb-4">
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                        <CreditCard className="size-3 text-amber-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Total Plans</p>
                        <p className="text-lg font-bold text-foreground leading-tight">{plans.length}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-card text-card-foreground">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
                        <CreditCard className="size-3 text-emerald-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg text-muted-foreground uppercase tracking-wider font-semibold">Active</p>
                        <p className="text-lg font-bold text-foreground leading-tight">{plans.filter(p => p.active).length}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Plans Grid */}
              <Card className="bg-card text-card-foreground">
                <CardHeader className="px-3 pt-3 pb-2">
                  <CardTitle className="text-lg font-bold text-foreground">All Plans</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Manage your subscription pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  {fetchingPlans ? (
                    <div className="flex justify-center py-6"><Loader2 className="size-5 animate-spin text-amber-500" /></div>
                  ) : plans.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-base">
                      No plans yet. Click "Add Plan" to create your first subscription plan.
                    </div>
                  ) : (
                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {plans.map((plan) => (
                        <div key={plan.id} className={`rounded-lg p-3 ${!plan.active ? "opacity-50" : ""}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                              {plan.description && <p className="text-base text-muted-foreground mt-0.5">{plan.description}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEditPlan(plan)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">
                                <Pencil className="size-3" />
                              </button>
                              <button onClick={() => plan.id && handleDeletePlan(plan.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-lg font-extrabold text-foreground">৳{plan.price}</span>
                            <span className="text-base text-muted-foreground">/{plan.period}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <span className={`rounded-full px-1.5 py-0.5 text-lg font-semibold ${plan.active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                              {plan.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
          <AppFooter />
        </div>
      </div>

      {/* Plan Dialog */}
      {showPlanDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPlanDialog(false)} />
          <div className="relative w-full max-w-md rounded-lg bg-card max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2.5 sticky top-0 bg-card z-10">
              <h2 className="text-lg font-bold text-foreground">{editingPlan ? "Edit Plan" : "Create Plan"}</h2>
              <button onClick={() => setShowPlanDialog(false)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Plan Name</label>
                  <input type="text" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} placeholder="e.g. Pro, Enterprise" className="mt-1 w-full rounded-md bg-background px-2.5 py-1.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Price (৳)</label>
                  <input type="number" min="0" step="0.01" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })} className="mt-1 w-full rounded-md bg-background px-2.5 py-1.5 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Period</label>
                  <select value={planForm.period} onChange={(e) => setPlanForm({ ...planForm, period: e.target.value })} className="mt-1 w-full rounded-md bg-background px-2.5 py-1.5 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500">
                    <option value="month">/month</option>
                    <option value="year">/year</option>
                    <option value="week">/week</option>
                    <option value="lifetime">lifetime</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                <input type="text" value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} placeholder="Short description of the plan" className="mt-1 w-full rounded-md bg-background px-2.5 py-1.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={planForm.active} onChange={(e) => setPlanForm({ ...planForm, active: e.target.checked })} className="rounded accent-emerald-500" />
                  <span className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Active</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-2.5 sticky bottom-0 bg-card">
              <Button variant="outline" size="sm" onClick={() => setShowPlanDialog(false)} className="text-base h-7">Cancel</Button>
              <Button size="sm" onClick={handleSavePlan} disabled={savingPlan} className="bg-amber-500 hover:bg-amber-600 text-white text-base h-7">
                {savingPlan ? <Loader2 className="size-3 animate-spin mr-1" /> : null}
                {savingPlan ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MobileSidebarProvider>
  );
}
