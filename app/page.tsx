"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Sparkles,
  Flame,
  Camera,
  Laptop,
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Monitor,
  Download,
  Layers
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.plans) {
          setPlans(data.plans);
        }
      })
      .catch(err => console.error("Error loading plans:", err))
      .finally(() => setLoadingPlans(false));
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI Smart Compression",
      description: "Compress video files without losing visual clarity. Our AI engine analyzes complexity and recommends optimal bitrates.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Layers,
      title: "Smart Video Enhancements",
      description: "Unlock advanced filters: video stabilization, professional noise reduction, contrast adjustments, and smart sharpening.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Flame,
      title: "Hook Rate Analysis",
      description: "Predict viewer retention in the first 5 seconds. Get AI suggestions to hook your audience and maximize click-throughs.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Zap,
      title: "Video Analytics",
      description: "Analyze complexity scores, mobile load speeds, and SEO parameters to optimize your delivery pipelines.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Camera,
      title: "Auto Thumbnail Generator",
      description: "Extract the most engaging frames from your videos automatically using high-contrast, visually appealing presets.",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const faqs = [
    {
      question: "What is MediaFlow?",
      answer: "MediaFlow is a high-performance desktop application combined with cloud-based AI analytics, designed specifically for video editors, content creators, and agencies to compress and enhance media with premium quality.",
    },
    {
      question: "How does the subscription work?",
      answer: "We offer a Free Tier with a 7-day trial that restricts exports to 720p. By upgrading to the Pro Plan, you unlock 1080p, 4K, AI Video Analytics, Hook Rate Analysis, and all Smart Video Enhancements.",
    },
    {
      question: "Does the compression run locally or on the cloud?",
      answer: "All video and image processing runs directly on your computer using a highly optimized, bundled FFmpeg build. This means fast, private processing with no bandwidth limits.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can manage and cancel your subscription directly from your online dashboard. You will continue to have access to your plan until the end of the current billing cycle.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/20 relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Zap className="size-5 fill-white/20" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              MediaFlow
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#download" className="hover:text-slate-900 transition-colors">Download</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs sm:text-sm text-blue-600 font-semibold tracking-wide mb-8 animate-pulse">
          <ShieldCheck className="size-4 shrink-0" />
          Powered by SH Engine v1.0 — 100% Secure & Local
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-4xl mx-auto leading-[1.1] mb-6">
          Optimize Your Media.{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ignite Your Audience.
          </span>
        </h1>

        <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          A world-class media pipeline designed for creators. Compress high-resolution videos, analyze hook retention, generate stunning thumbnails, and unlock visual excellence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-bold text-white shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started Free <ArrowRight className="size-4" />
          </Link>
          <a
            href="#download"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-6 font-bold text-slate-700 hover:text-slate-900 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Download Desktop App <Download className="size-4" />
          </a>
        </div>

        {/* Product Mockup Representation */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 px-2">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-rose-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs font-mono text-slate-500">MediaFlow Desktop — Pro Active</span>
            <div className="w-12 h-1 bg-slate-200 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center aspect-video md:aspect-auto">
              <Sparkles className="size-8 text-blue-500 mb-2 animate-bounce" />
              <span className="text-sm font-bold text-slate-900">AI Smart Bitrate</span>
              <span className="text-xs text-slate-500 mt-1">৳499/mo Plan Unlocked</span>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center">
              <Flame className="size-8 text-rose-500 mb-2" />
              <span className="text-sm font-bold text-slate-900">Hook Rate Predictor</span>
              <span className="text-xs text-emerald-600 font-mono mt-1">94% Retention Score</span>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center">
              <Layers className="size-8 text-purple-500 mb-2 animate-pulse" />
              <span className="text-sm font-bold text-slate-900">4K Enhancer</span>
              <span className="text-xs text-slate-500 mt-1">Direct FFmpeg Pipeline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need for Video Dominance
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4">
            We built real-world optimization tools directly into a fast, desktop app backed by cloud analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="size-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4">
            Start completely free, and upgrade whenever you are ready to unleash full power.
          </p>

          {/* Monthly/Yearly Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-slate-900" : "text-slate-400"}`}>
              Monthly billing
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-blue-600 shadow ring-0 transition duration-200 ease-in-out ${billingPeriod === "yearly" ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-slate-900" : "text-slate-400"}`}>
              Yearly billing
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Save 33%
              </span>
            </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {(plans.length > 0 ? plans : [
            {
              id: "free",
              name: "Starter Pack",
              price: 0,
              period: "week",
              description: "Test the interface and standard features before subscribing. Perfect to explore the app.",
              features: [
                "Standard compression",
                "Max resolution: 720p",
                "AI Analytics (locked)",
                "Hook Rate Predictor (locked)"
              ]
            },
            {
              id: "pro",
              name: "Creator Pro",
              price: 499,
              period: "month",
              description: "Unlock the full suite. Unlimited video resolutions, AI-driven metrics, and smart visual enhancements.",
              features: [
                "Unrestricted exports (1080p, 4K)",
                "AI Video Analytics Unlocked",
                "Hook Rate retention helper",
                "All Video Enhancers (Stabilize, Denoise)"
              ]
            },
            {
              id: "enterprise",
              name: "Enterprise",
              price: 15000,
              period: "year",
              description: "For media production teams and agencies requiring dedicated cloud nodes and volume software licenses.",
              features: [
                "Volume license activation keys",
                "Custom branding & metadata templates",
                "Dedicated support line (24/7)",
                "SLA uptime agreements"
              ]
            }
          ]).map((plan) => {
            const isPro = plan.name.toLowerCase().includes("pro");
            const isEnterprise = plan.name.toLowerCase().includes("enterprise");
            const isFree = plan.price === 0;

            // Calculate billing period price
            let displayPrice = plan.price;
            let displayPeriod = plan.period === "week" ? "week" : plan.period || "month";
            
            if (isPro && billingPeriod === "yearly") {
              displayPrice = 333; // Mock discounted yearly monthly price
            }

            return (
              <div 
                key={plan.id || plan.name}
                className={`rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPro 
                    ? "border-2 border-blue-600 bg-white hover:shadow-2xl hover:shadow-blue-500/10 relative" 
                    : "border-slate-200 bg-white"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-[11px] text-white font-extrabold uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}
                <div>
                  <div className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${isPro ? "text-blue-600" : "text-slate-500"}`}>
                    {isFree ? "Free Trial" : isPro ? "Pro Access" : "Team Plan"}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {isEnterprise ? "Custom" : `৳${displayPrice}`}
                    </span>
                    {!isEnterprise && (
                      <span className="text-slate-500 text-xs font-semibold">/ {displayPeriod === "week" ? "7 days" : "month"}</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs mb-6 leading-relaxed">
                    {plan.description}
                  </p>
                  <ul className="space-y-3 mb-6 text-xs text-slate-700">
                    {(plan.features || []).map((feat: string, idx: number) => {
                      const isLocked = feat.toLowerCase().includes("(locked)") || feat.toLowerCase().includes("locked");
                      return (
                        <li key={idx} className={`flex items-center gap-2.5 ${isLocked ? "text-slate-400" : ""}`}>
                          {isLocked ? (
                            <span className="text-red-500 font-bold shrink-0 text-[10px] pl-0.5">✕</span>
                          ) : (
                            <Check className="size-3.5 text-blue-600 shrink-0" />
                          )}
                          <span>{feat}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {isFree ? (
                  <Link
                    href="/checkout?plan=Free&billing=monthly"
                    className="w-full inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all"
                  >
                    Start Free Trial
                  </Link>
                ) : isPro ? (
                  <Link
                    href={`/checkout?plan=Pro&billing=${billingPeriod}`}
                    className="w-full inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all"
                  >
                    Upgrade to Pro Now
                  </Link>
                ) : (
                  <a
                    href="mailto:shahdat.asg@gmail.com?subject=MediaFlow%20Enterprise%20Inquiry"
                    className="w-full inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all"
                  >
                    Contact Sales
                  </a>
                )}
              </div>
            );
          })}
        </div>    </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Get the MediaFlow Desktop App
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4">
            Download our ultra-fast Electron application. All conversions run locally using fully-integrated FFmpeg.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Windows Download */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 hover:border-slate-300 transition-all text-center shadow-sm">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm mb-6">
              <Monitor className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Windows (64-bit)</h3>
            <p className="text-slate-600 text-sm mb-6">
              Supports Windows 10 & 11 (64-bit systems). Self-contained, portable build.
            </p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); toast.info("Windows installation executable package placeholder"); }}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 text-sm font-semibold text-white transition-all shadow"
            >
              <Download className="size-4" /> Download .exe Setup
            </a>
          </div>

          {/* Mac Download */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 hover:border-slate-300 transition-all text-center shadow-sm">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shadow-sm mb-6">
              <Laptop className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">macOS (Intel & Apple Silicon)</h3>
            <p className="text-slate-600 text-sm mb-6">
              Compatible with macOS Big Sur, Monterey, Ventura, Sonoma, and Sequoia.
            </p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); toast.info("macOS installer package placeholder"); }}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 text-sm font-semibold text-white transition-all shadow"
            >
              <Download className="size-4" /> Download .dmg Installer
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-base font-bold text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`size-4 text-slate-500 transition-transform duration-200 ${activeFaq === idx ? "rotate-180 text-slate-900" : ""}`} />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${activeFaq === idx ? "max-h-48 border-t border-slate-100" : "max-h-0"}`}
                style={{ overflow: "hidden" }}
              >
                <div className="p-5 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2.5">
              <Zap className="size-5 text-blue-600 fill-blue-600/20" />
              <span className="font-extrabold text-lg text-slate-900">MediaFlow</span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Professional media optimizations. Made with love for creators.
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 text-sm mb-1.5">Developer Contact</p>
            <p>Developed by Shahdat Hossain — 6+ yrs industry experience</p>
            <p>Email: <a href="mailto:shahdat.asg@gmail.com" className="hover:text-slate-900 transition-colors">shahdat.asg@gmail.com</a></p>
            <p>Phone: +880-1850-993126</p>
          </div>

          <div className="text-xs text-slate-500 md:text-right">
            <p>© {new Date().getFullYear()} MediaFlow. All rights reserved.</p>
            <p className="mt-1">All processed media is kept 100% secure, private, and local.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
