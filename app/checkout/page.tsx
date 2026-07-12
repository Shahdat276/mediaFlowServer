"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Check,
  Copy,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: "free",
    name: "Starter Pack",
    price: 0,
    period: "week",
    description: "Test the interface and standard features.",
    features: ["Standard compression", "Max resolution: 720p", "AI Analytics (locked)", "Hook Rate Predictor (locked)"]
  },
  {
    id: "pro",
    name: "Creator Pro",
    price: 499,
    period: "month",
    description: "Full suite for creators. Unlimited resolutions & AI tools.",
    features: ["Unrestricted exports (1080p, 4K)", "AI Video Analytics Unlocked", "Hook Rate retention helper", "All Video Enhancers (Stabilize, Denoise)"]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 15000,
    period: "year",
    description: "For teams and agencies with volume licensing needs.",
    features: ["Volume license activation keys", "Custom branding & metadata", "Dedicated support (24/7)", "SLA uptime agreements"]
  }
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  
  const initialPlan = searchParams.get("plan") || "Pro";
  const initialBilling = searchParams.get("billing") || "monthly";
  
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    initialPlan.toLowerCase() === "enterprise" ? "enterprise" : initialPlan.toLowerCase() === "free" ? "free" : "pro"
  );
  const [billing, setBilling] = useState<"monthly" | "yearly">(initialBilling as "monthly" | "yearly");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [stage, setStage] = useState<"form" | "processing" | "success">("form");
  const [processStatus, setProcessStatus] = useState("Initializing payment verification...");

  const DISPLAY_NUMBER = "+880 1850-993126";

  // Fetch plans from DB
  useEffect(() => {
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.plans?.length > 0) {
          setPlans(data.plans);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to proceed to checkout.");
      router.push(`/login?callback=/checkout?plan=${initialPlan}&billing=${initialBilling}`);
    }
  }, [session, isPending, router, initialPlan, initialBilling]);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans.find(p => p.id === "pro") || plans[0];
  
  // Calculate price based on plan + billing
  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return 0;
    if (billing === "yearly") {
      // Yearly = monthly price * 10 (save ~2 months)
      return plan.price * 10;
    }
    return plan.price;
  };

  const price = getPrice(selectedPlan);
  const displayPeriod = billing === "yearly" ? "year" : selectedPlan.period === "week" ? "week" : "month";

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("01850993126");
    setCopied(true);
    toast.success("Payment number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber || !transactionId) {
      toast.error("Please fill in all transaction details.");
      return;
    }

    setStage("processing");
    
    setTimeout(() => {
      setProcessStatus("Connecting to payment gateway...");
      setTimeout(() => {
        setProcessStatus("Verifying Transaction ID: " + transactionId + "...");
        setTimeout(async () => {
          try {
            const res = await fetch("/api/subscription/submit-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan: selectedPlan.name,
                billing,
                paymentMethod,
                senderNumber,
                transactionId
              }),
            });
            const data = await res.json();
            if (data.success) {
              setStage("success");
            } else {
              toast.error(data.message || "Submission failed.");
              setStage("form");
            }
          } catch {
            toast.error("Failed to connect to payment backend.");
            setStage("form");
          }
        }, 1500);
      }, 1500);
    }, 1500);
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <span className="text-lg text-slate-500">Loading checkout...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {stage === "form" && (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Back + Plan Summary */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-base text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to Dashboard
            </Link>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">Secure Checkout</h1>
              <p className="text-base text-slate-500">Send money via bKash or Nagad, then submit your Transaction ID below.</p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center gap-3 bg-white rounded-lg p-2">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`flex-1 py-2 rounded-md text-base font-bold transition-all ${
                  billing === "monthly" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`flex-1 py-2 rounded-md text-base font-bold transition-all relative ${
                  billing === "yearly" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-1 bg-emerald-500 text-white text-lg font-bold px-1 rounded-full">Save 33%</span>
              </button>
            </div>

            {/* Package Selector */}
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wide">Choose Your Package</label>
              {plans.map((p) => {
                const isSelected = p.id === selectedPlanId;
                const pPrice = getPrice(p);
                const isFree = p.price === 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`w-full text-left rounded-xl p-3 transition-all ${
                      isSelected
                        ? "bg-blue-50 ring-2 ring-blue-500"
                        : "bg-white ring-1 ring-slate-200 hover:ring-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-lg font-bold ${isSelected ? "text-blue-700" : "text-slate-900"}`}>{p.name}</span>
                      <span className={`text-lg font-black ${isSelected ? "text-blue-600" : "text-slate-700"}`}>
                        {isFree ? "Free" : `৳${pPrice}`}
                      </span>
                    </div>
                    <p className="text-base text-slate-500 mb-1.5">{p.description}</p>
                    <div className="grid grid-cols-1 gap-1">
                      {p.features.slice(0, 3).map((feat, i) => (
                        <p key={i} className="flex items-center gap-1.5 text-base text-slate-500">
                          <Check className="size-3 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </p>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Plan Summary */}
            <Card className="bg-white text-slate-900">
              <CardContent className="px-4 py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{selectedPlan.name}</p>
                    <p className="text-base text-slate-500 capitalize">{displayPeriod} billing · Pending verification</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-blue-600">৳{price}</p>
                    <p className="text-lg text-slate-500">per {displayPeriod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-base text-slate-500 bg-white rounded-lg p-3">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>Payments are manually verified. Admin reviews transactions regularly to activate licenses.</span>
            </div>
          </div>

          {/* Right: Payment Form */}
          <Card className="md:col-span-7 bg-white text-slate-900">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Payment Instructions</CardTitle>
              <CardDescription className="text-base text-slate-500">Follow the steps below to complete your payment</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-5">
              {/* Step 1: Choose method */}
              <div className="space-y-2">
                <label className="text-base font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">1</span>
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`cursor-pointer rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === "bkash" 
                        ? "bg-rose-50 ring-2 ring-rose-500" 
                        : "bg-slate-50 hover:bg-slate-100 ring-1 ring-slate-200"
                    }`}
                  >
                    <Image src="/bkash-logo.png" alt="bKash" width={48} height={48} className="object-contain" />
                    <span className={`text-base font-bold uppercase tracking-wider ${paymentMethod === "bkash" ? "text-rose-600" : "text-slate-500"}`}>
                      bKash
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`cursor-pointer rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === "nagad" 
                        ? "bg-orange-50 ring-2 ring-orange-500" 
                        : "bg-slate-50 hover:bg-slate-100 ring-1 ring-slate-200"
                    }`}
                  >
                    <Image src="/nagad-logo.png" alt="Nagad" width={48} height={48} className="object-contain" />
                    <span className={`text-base font-bold uppercase tracking-wider ${paymentMethod === "nagad" ? "text-orange-600" : "text-slate-500"}`}>
                      Nagad
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 2: Send money */}
              <div className="space-y-2">
                <label className="text-base font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">2</span>
                  Send Money to this Number
                </label>
                <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 ring-1 ring-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-slate-400" />
                    <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">{DISPLAY_NUMBER}</span>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleCopyNumber}
                    variant="outline"
                    className="h-7 text-base font-bold px-3 gap-1"
                  >
                    <Copy className="size-3" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-base text-slate-500 leading-relaxed">
                  Open your {paymentMethod === "bkash" ? "bKash" : "Nagad"} app, select <strong>Send Money</strong>, enter the number above, and send <strong>৳{price}</strong>.
                </p>
              </div>

              {/* Step 3: Submit details */}
              <form onSubmit={handlePaymentSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-base font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">3</span>
                    Submit Verification Details
                  </label>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sender" className="text-base text-slate-500">Your Sender Number</Label>
                  <Input
                    id="sender"
                    type="text"
                    required
                    placeholder="017XXXXXXXX"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, "").substring(0, 11))}
                    className="bg-slate-50 text-slate-900 text-lg font-mono placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="txn" className="text-base text-slate-500">Transaction ID (TxnID)</Label>
                  <Input
                    id="txn"
                    type="text"
                    required
                    placeholder="E.g., A8X9K2PL"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase().trim())}
                    className="bg-slate-50 text-slate-900 text-lg font-mono tracking-widest placeholder:text-slate-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 mt-2 text-base gap-1.5"
                >
                  <ShieldCheck className="size-3.5" /> Submit Verification Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {stage === "processing" && (
        <div className="w-full max-w-md bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center mt-20">
          <Loader2 className="size-12 animate-spin text-blue-600 mb-6" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Submitting Details</h2>
          <p className="text-base text-slate-500 leading-relaxed max-w-xs">{processStatus}</p>
        </div>
      )}

      {stage === "success" && (
        <div className="w-full max-w-md bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center mt-20">
          <div className="flex size-14 items-center justify-center rounded-full bg-amber-100 mb-6">
            <CheckCircle2 className="size-8 text-amber-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Verification Submitted!</h2>
          <p className="text-base text-slate-500 leading-relaxed max-w-xs mb-6">
            Your transaction <strong className="text-slate-700">{transactionId}</strong> has been logged. Admin will verify it and activate your account shortly.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 text-base"
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <span className="text-lg text-slate-500">Loading checkout...</span>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
