"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Zap, 
  Check 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  
  const plan = searchParams.get("plan") || "Pro";
  const billing = searchParams.get("billing") || "monthly";
  
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [stage, setStage] = useState<"form" | "processing" | "success">("form");
  const [processStatus, setProcessStatus] = useState("Initializing payment verification...");

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to proceed to checkout.");
      router.push(`/login?callback=/checkout?plan=${plan}&billing=${billing}`);
    }
  }, [session, isPending, router, plan, billing]);

  const price = billing === "yearly" ? 4990 : 499;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("01850993126");
    setCopied(true);
    toast.success("Payment number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber || !transactionId) {
      toast.error("Please fill in all transaction verification details.");
      return;
    }

    setStage("processing");
    
    // Simulate payment submission details review
    setTimeout(() => {
      setProcessStatus("Connecting to payment network gateway...");
      setTimeout(() => {
        setProcessStatus("Submitting Transaction ID: " + transactionId + "...");
        setTimeout(async () => {
          try {
            // Call submit-payment API route
            const res = await fetch("/api/subscription/submit-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan: plan === "Free" ? "Free Trial" : "Creator Pro",
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
              toast.error(data.message || "Verification submission failed.");
              setStage("form");
            }
          } catch {
            toast.error("Failed to connect to verification backend.");
            setStage("form");
          }
        }, 1500);
      }, 1500);
    }, 1500);
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-blue-500" />
          <span className="text-sm text-slate-400">Loading secure checkout environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {stage === "form" && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Plan Summary Section */}
          <div className="md:col-span-5 flex flex-col justify-between gap-6">
            <div>
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="size-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">Secure Checkout</h1>
              <p className="text-xs text-slate-400">Send money manually to complete your order and submit the TxnID below.</p>
            </div>

            <Card className="bg-[#111827]/80 border-slate-800 text-white backdrop-blur">
              <CardHeader className="p-4 border-b border-slate-800/60">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="size-4 animate-pulse" /> Selected Tier
                </div>
                <CardTitle className="text-lg font-black mt-1">Creator Pro</CardTitle>
                <CardDescription className="text-xs text-slate-400">Includes all advanced video & image tools</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center bg-blue-950/20 border border-blue-900/30 rounded-lg p-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-300 capitalize">{billing} Subscription</p>
                    <p className="text-[10px] text-slate-400">Pending admin approval</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-blue-400">৳{price}</p>
                    <p className="text-[9px] text-slate-400">{billing === "yearly" ? "৳415 / month equivalent" : "billed monthly"}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Unlimited HD/4K High-Resolution exports</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Deep Media Analytics & Hook Rate scoring</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>AI Smart quality prediction compression</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Smart Video Enhancements filters</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 border border-slate-800/40 rounded-lg p-2.5 bg-slate-900/10">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>Payments are processed manually. Admin reviews transaction reports regularly to confirm licenses.</span>
            </div>
          </div>

          {/* bKash/Nagad Payment Submission Section */}
          <Card className="md:col-span-7 bg-[#111827]/80 border-slate-800 text-white backdrop-blur">
            <CardHeader className="p-5 border-b border-slate-800/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="size-4 text-blue-400" /> Manual Payment Instructions
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Send money manually to the bKash/Nagad number below</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {/* Payment Info Callout */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Personal Number (Send Money)</p>
                <div className="flex items-center justify-between bg-black/40 rounded-lg p-2.5 border border-slate-800/80">
                  <span className="font-mono text-base font-extrabold text-blue-400 tracking-wider">01850993126</span>
                  <Button 
                    type="button" 
                    onClick={handleCopyNumber}
                    className="h-7 text-[10px] font-bold px-3 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/20"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Send **৳{price}** to the number above using Send Money. Copy the Transaction ID (TxnID) once payment is completed, and submit the details below.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {/* Method selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select Payment Operator</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPaymentMethod("bkash")}
                      className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center transition-all ${
                        paymentMethod === "bkash" 
                          ? "border-rose-600 bg-rose-950/20 shadow-md shadow-rose-950/20" 
                          : "border-slate-800 bg-[#0d111d] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span className="text-xs font-black text-rose-500 uppercase tracking-wider">bKash</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Send Money</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod("nagad")}
                      className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center transition-all ${
                        paymentMethod === "nagad" 
                          ? "border-orange-600 bg-orange-950/20 shadow-md shadow-orange-950/20" 
                          : "border-slate-800 bg-[#0d111d] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span className="text-xs font-black text-orange-500 uppercase tracking-wider">Nagad</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Send Money</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sender Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="017XXXXXXXX"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, "").substring(0, 11))}
                    className="p-2.5 rounded-lg border border-slate-800 bg-[#0d111d] text-white text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Transaction ID (TxnID)</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., A8X9K2PL"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase().trim())}
                    className="p-2.5 rounded-lg border border-slate-800 bg-[#0d111d] text-white text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono tracking-widest"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 mt-4 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 text-xs"
                >
                  <Zap className="size-3.5 fill-current" /> Submit Verification Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {stage === "processing" && (
        <div className="w-full max-w-md bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur relative z-10 shadow-2xl">
          <Loader2 className="size-12 animate-spin text-blue-500 mb-6" />
          <h2 className="text-xl font-bold mb-2">Submitting Details</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{processStatus}</p>
        </div>
      )}

      {stage === "success" && (
        <div className="w-full max-w-md bg-[#111827]/90 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur relative z-10 shadow-2xl">
          <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 mb-6 border border-amber-500/30">
            <CheckCircle2 className="size-8 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-white mb-2">Verification Submitted!</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-6">
            Your transaction verification request has been logged. Admin will check the Transaction ID **{transactionId}** and activate your account once confirmed.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-2 rounded-lg text-xs"
          >
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#070B14]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-blue-500" />
          <span className="text-sm text-slate-400">Loading secure checkout environment...</span>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
