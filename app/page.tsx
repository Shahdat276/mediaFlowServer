"use client";

import { useState } from "react";
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
  Play,
  Monitor,
  Download,
  Info,
  Layers
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/20 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Zap className="size-5 fill-white/20" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              MediaFlow
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
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
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm text-blue-400 font-semibold tracking-wide mb-8 animate-pulse">
          <ShieldCheck className="size-4 shrink-0" />
          Powered by SH Engine v1.0 — 100% Secure & Local
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-[1.1] mb-6">
          Optimize Your Media.{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Ignite Your Audience.
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
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
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 px-6 font-bold text-slate-300 hover:text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Download Desktop App <Download className="size-4" />
          </a>
        </div>

        {/* Product Mockup Representation */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-2xl shadow-blue-500/5 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 px-2">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-rose-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-500">MediaFlow Desktop — Pro Active</span>
            <div className="w-12 h-1 bg-slate-800 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 rounded-xl p-6 border border-slate-900 flex flex-col items-center justify-center aspect-video md:aspect-auto">
              <Sparkles className="size-8 text-blue-400 mb-2 animate-bounce" />
              <span className="text-sm font-bold">AI Smart Bitrate</span>
              <span className="text-xs text-slate-500 mt-1">৳499/mo Plan Unlocked</span>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-6 border border-slate-900 flex flex-col items-center justify-center">
              <Flame className="size-8 text-rose-400 mb-2" />
              <span className="text-sm font-bold">Hook Rate Predictor</span>
              <span className="text-xs text-emerald-500 font-mono mt-1">94% Retention Score</span>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-6 border border-slate-900 flex flex-col items-center justify-center">
              <Layers className="size-8 text-purple-400 mb-2 animate-pulse" />
              <span className="text-sm font-bold">4K Enhancer</span>
              <span className="text-xs text-slate-500 mt-1">Direct FFmpeg Pipeline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Everything You Need for Video Dominance
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            We built real-world optimization tools directly into a fast, desktop app backed by cloud analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-900 bg-slate-950 p-6 sm:p-8 hover:border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                <div className={`inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="size-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Start completely free, and upgrade whenever you are ready to unleash full power.
          </p>

          {/* Monthly/Yearly Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-white" : "text-slate-500"}`}>
              Monthly billing
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-blue-500 shadow ring-0 transition duration-200 ease-in-out ${billingPeriod === "yearly" ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-white" : "text-slate-500"}`}>
              Yearly billing
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Save 33%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-8 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <div className="text-slate-400 text-xs font-extrabold uppercase tracking-widest mb-2">Free Trial</div>
              <h3 className="text-xl font-bold text-white mb-4">Starter Pack</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">৳0</span>
                <span className="text-slate-500 text-sm">/ 7 days</span>
              </div>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Test the interface and standard features before subscribing. Perfect to explore the app.
              </p>
              <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>Standard compression</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <XIcon className="size-4 shrink-0" />
                  <span>Max resolution: 720p</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <XIcon className="size-4 shrink-0" />
                  <span>AI Analytics (locked)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-500">
                  <XIcon className="size-4 shrink-0" />
                  <span>Hook Rate Predictor (locked)</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full inline-flex h-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold transition-all"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border-2 border-blue-600 bg-gradient-to-b from-slate-950 to-slate-950/80 p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/5 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-[11px] text-white font-extrabold uppercase tracking-widest">
              Most Popular
            </div>
            <div>
              <div className="text-blue-400 text-xs font-extrabold uppercase tracking-widest mb-2">Pro Access</div>
              <h3 className="text-xl font-bold text-white mb-4">Creator Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">
                  ৳{billingPeriod === "monthly" ? "499" : "333"}
                </span>
                <span className="text-slate-500 text-sm">/ month</span>
              </div>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Unlock the full suite. Unlimited video resolutions, AI-driven metrics, and smart visual enhancements.
              </p>
              <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>Unrestricted exports (1080p, 4K)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>AI Video Analytics Unlocked</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>Hook Rate retention helper</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>All Video Enhancers (Stabilize, Denoise)</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all"
            >
              Get Creator Pro Now
            </Link>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-8 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <div className="text-slate-400 text-xs font-extrabold uppercase tracking-widest mb-2">Team Plan</div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                For media production teams and agencies requiring dedicated cloud nodes and volume software licenses.
              </p>
              <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>Volume license activation keys</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>Custom branding & metadata templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>Dedicated support line (24/7)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 text-blue-500 shrink-0" />
                  <span>SLA uptime agreements</span>
                </li>
              </ul>
            </div>
            <a
              href="mailto:shahdat.asg@gmail.com?subject=MediaFlow%20Enterprise%20Inquiry"
              className="w-full inline-flex h-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white text-sm font-semibold transition-all"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Get the MediaFlow Desktop App
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4">
            Download our ultra-fast Electron application. All conversions run locally using fully-integrated FFmpeg.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Windows Download */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-8 hover:border-slate-800 transition-all text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 shadow-md mb-6">
              <Monitor className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Windows (64-bit)</h3>
            <p className="text-slate-400 text-sm mb-6">
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
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-8 hover:border-slate-800 transition-all text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shadow-md mb-6">
              <Laptop className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">macOS (Intel & Apple Silicon)</h3>
            <p className="text-slate-400 text-sm mb-6">
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
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-900 bg-slate-950 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-base font-bold text-white hover:bg-slate-900/40 transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${activeFaq === idx ? "rotate-180 text-white" : ""}`} />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${activeFaq === idx ? "max-h-48 border-t border-slate-900/50" : "max-h-0"}`}
                style={{ overflow: "hidden" }}
              >
                <div className="p-5 text-sm text-slate-400 leading-relaxed bg-slate-950/40">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2.5">
              <Zap className="size-5 text-blue-500 fill-blue-500/20" />
              <span className="font-extrabold text-lg text-white">MediaFlow</span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Professional media optimizations. Made with love for creators.
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-400 text-sm mb-1.5">Developer Contact</p>
            <p>Developed by Shahdat Hossain — 6+ yrs industry experience</p>
            <p>Email: <a href="mailto:shahdat.asg@gmail.com" className="hover:text-slate-300 transition-colors">shahdat.asg@gmail.com</a></p>
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

// Inline fallback XIcon since Lucide might not have it in older packages
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-600"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
