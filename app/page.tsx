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
  Layers,
  Play,
  Star,
  Globe,
  Lock,
  Cpu,
  BarChart3,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ─────────────────────────────────────────────
   Keyframe style injector
───────────────────────────────────────────── */
const inlineStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', 'Geist', system-ui, sans-serif; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-14px) rotate(1deg); }
    66% { transform: translateY(-7px) rotate(-1deg); }
  }
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.15); }
    50% { box-shadow: 0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.3); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
  .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }

  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }

  .gradient-text {
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 40%, #fb7185 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-text-blue {
    background: linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-card {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
  }

  .glass-card:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(99,102,241,0.4);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(99,102,241,0.1);
  }

  .glow-button {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    transition: all 0.3s ease;
  }

  .glow-button:hover {
    box-shadow: 0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2);
    transform: translateY(-2px);
  }

  .grid-bg {
    background-image:
      linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .nav-link {
    position: relative;
    color: rgba(255,255,255,0.6);
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.2s;
    text-decoration: none;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #818cf8, #c084fc);
    transition: width 0.3s ease;
  }

  .nav-link:hover { color: rgba(255,255,255,1); }
  .nav-link:hover::after { width: 100%; }

  .badge-glow {
    box-shadow: 0 0 20px rgba(99,102,241,0.4);
  }

  .hero-blob-1 {
    position: absolute;
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }
  .hero-blob-2 {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }
  .hero-blob-3 {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(251,113,133,0.1) 0%, transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }

  .faq-content {
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
  }

  .testimonial-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.3s ease;
  }
  .testimonial-card:hover {
    background: rgba(255,255,255,0.055);
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-3px);
  }

  .pricing-popular-glow {
    box-shadow: 0 0 0 1px rgba(99,102,241,0.6), 0 20px 80px rgba(99,102,241,0.25), 0 0 40px rgba(99,102,241,0.1);
  }

  .stat-number {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }
`;

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const features = [
  {
    icon: Sparkles,
    title: "AI Smart Compression",
    description: "Our neural engine analyzes scene complexity frame-by-frame to apply optimal bitrates — shrink files by up to 80% with zero perceptible quality loss.",
    color: "#818cf8",
    bg: "rgba(99,102,241,0.1)",
    border: "rgba(99,102,241,0.25)",
    badge: "Core Engine",
  },
  {
    icon: Layers,
    title: "Smart Video Enhancements",
    description: "Professional-grade stabilization, adaptive noise reduction, HDR tone mapping, and AI-powered sharpening — applied in one click.",
    color: "#c084fc",
    bg: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.25)",
    badge: "Pro Feature",
  },
  {
    icon: Flame,
    title: "Hook Rate Analysis",
    description: "Predict viewer drop-off in the first 5 seconds using engagement prediction models trained on millions of creator uploads.",
    color: "#fb7185",
    bg: "rgba(251,113,133,0.1)",
    border: "rgba(251,113,133,0.25)",
    badge: "AI Analytics",
  },
  {
    icon: BarChart3,
    title: "Video Intelligence",
    description: "Real-time dashboards for complexity scores, mobile load predictions, and delivery pipeline SEO scoring — all in one view.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
    badge: "Analytics",
  },
  {
    icon: Camera,
    title: "Auto Thumbnail Generator",
    description: "Extract high-contrast, click-worthy frames automatically. A/B test variants before publishing to maximize CTR.",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
    badge: "Creator Tools",
  },
  {
    icon: Cpu,
    title: "Local FFmpeg Pipeline",
    description: "All processing runs on your machine using a bundled, optimised FFmpeg build. No upload caps, no bandwidth throttles, zero cloud dependency.",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.25)",
    badge: "Privacy-First",
  },
];

const stats = [
  { value: "2M+", label: "Videos Processed", icon: Play },
  { value: "80%", label: "Avg. File Reduction", icon: Zap },
  { value: "50K+", label: "Active Creators", icon: Globe },
  { value: "99.9%", label: "Uptime SLA", icon: ShieldCheck },
];

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "YouTube Creator · 2.1M subscribers",
    text: "MediaFlow cut my upload workflow from 2 hours to 15 minutes. The AI compression is shockingly good — my audience can't tell the difference.",
    stars: 5,
    avatar: "AM",
    color: "#818cf8",
  },
  {
    name: "Sarah Chen",
    role: "Video Producer · Adobe Partner",
    text: "We switched our entire studio pipeline to MediaFlow. The Hook Rate Predictor alone increased our average watch time by 34%.",
    stars: 5,
    avatar: "SC",
    color: "#c084fc",
  },
  {
    name: "Dawit Tesfaye",
    role: "Agency Director · 15-person team",
    text: "The enterprise tier pays for itself in the first week. Local processing, bulk licensing, and 24/7 support — exactly what large teams need.",
    stars: 5,
    avatar: "DT",
    color: "#34d399",
  },
];

const faqs = [
  {
    question: "What is MediaFlow?",
    answer: "MediaFlow is a high-performance desktop application combined with cloud-based AI analytics, built specifically for video editors, content creators, and agencies. It compresses and enhances media with premium quality using a local FFmpeg pipeline.",
  },
  {
    question: "How does subscription billing work?",
    answer: "We offer a 7-day Free Trial at 720p export limits to explore the interface. Upgrading to Creator Pro unlocks 1080p, 4K, AI Analytics, Hook Rate Analysis, and all Smart Enhancements. You can cancel anytime from your dashboard.",
  },
  {
    question: "Does processing run locally or on the cloud?",
    answer: "All video and image processing runs directly on your computer via an optimised bundled FFmpeg build. This means ultra-fast, completely private processing — no upload caps, no bandwidth throttles, no data leaves your machine.",
  },
  {
    question: "Which platforms does MediaFlow support?",
    answer: "MediaFlow ships native desktop applications for Windows 10/11 (64-bit) and macOS (Big Sur through Sequoia, supporting both Intel and Apple Silicon Macs).",
  },
  {
    question: "Can I use MediaFlow for commercial projects?",
    answer: "Absolutely. All plans including Creator Pro are licensed for commercial use. Enterprise customers receive volume activation keys and custom branding options for their production pipelines.",
  },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans) setPlans(data.plans);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index);

  const displayPlans = plans.length > 0 ? plans : [
    {
      id: "free",
      name: "Starter",
      tier: "Free Trial",
      price: 0,
      period: "week",
      description: "Explore the interface and standard compression tools with a 7-day no-commitment trial.",
      features: [
        { text: "Standard compression engine", ok: true },
        { text: "Max export resolution: 720p", ok: true },
        { text: "5 exports per day", ok: true },
        { text: "AI Video Analytics", ok: false },
        { text: "Hook Rate Predictor", ok: false },
        { text: "4K / 1080p exports", ok: false },
      ],
      cta: "Start Free Trial",
      ctaHref: "/checkout?plan=Free&billing=monthly",
    },
    {
      id: "pro",
      name: "Creator Pro",
      tier: "Most Popular",
      price: 499,
      period: "month",
      popular: true,
      description: "The full professional suite for creators who are serious about video quality and audience growth.",
      features: [
        { text: "Unrestricted exports (1080p + 4K)", ok: true },
        { text: "AI Smart Compression engine", ok: true },
        { text: "Hook Rate retention predictor", ok: true },
        { text: "AI Video Analytics dashboard", ok: true },
        { text: "Video Stabilization + Denoise", ok: true },
        { text: "Auto Thumbnail Generator", ok: true },
      ],
      cta: "Upgrade to Pro",
      ctaHref: "/checkout?plan=Pro&billing=monthly",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tier: "Teams & Agencies",
      price: null,
      period: "year",
      description: "Tailored solutions for media production teams that need volume licensing, SLAs, and dedicated infrastructure.",
      features: [
        { text: "Volume license activation keys", ok: true },
        { text: "Custom branding & metadata templates", ok: true },
        { text: "Dedicated support line (24/7)", ok: true },
        { text: "SLA uptime guarantees", ok: true },
        { text: "Dedicated cloud processing nodes", ok: true },
        { text: "Onboarding & training sessions", ok: true },
      ],
      cta: "Contact Sales",
      ctaHref: "mailto:shahdat.asg@gmail.com?subject=MediaFlow%20Enterprise%20Inquiry",
    },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />

      <div style={{ minHeight: "100vh", background: "#050508", color: "#f1f5f9", fontFamily: "'Inter', system-ui, sans-serif", position: "relative", overflowX: "hidden" }}>

        {/* ── HEADER ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100, width: "100%",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          background: scrolled ? "rgba(5,5,8,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          transition: "all 0.4s ease",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
                <Zap size={18} color="#fff" fill="rgba(255,255,255,0.3)" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.03em", color: "#fff" }}>MediaFlow</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex" style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {["features", "pricing", "download", "faq"].map((item) => (
                <a key={item} href={`#${item}`} className="nav-link">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link href="/login" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }} className="hidden md:inline">
                Sign In
              </Link>
              <Link href="/login" className="glow-button" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 10, fontSize: "0.875rem", fontWeight: 600, color: "#fff", textDecoration: "none" }}>
                Get Started <ArrowRight size={15} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", color: "#fff", cursor: "pointer" }}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div style={{ background: "rgba(5,5,8,0.98)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px" }}>
              {["features", "pricing", "download", "faq"].map((item) => (
                <a key={item} href={`#${item}`} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "12px 0", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* ── HERO ── */}
        <section style={{ position: "relative", paddingTop: "120px", paddingBottom: "100px", textAlign: "center", overflow: "hidden" }} className="grid-bg">
          <div className="hero-blob-1" style={{ top: -100, left: "10%", opacity: 0.8 }} />
          <div className="hero-blob-2" style={{ top: 100, right: "5%", opacity: 0.7 }} />
          <div className="hero-blob-3" style={{ bottom: 0, left: "40%", opacity: 0.6 }} />

          <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>


            {/* Headline */}
            <h1 className="animate-slide-up delay-100" style={{ fontSize: "clamp(2.8rem, 7vw, 5.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24, color: "#fff" }}>
              Professional Media<br />
              <span className="gradient-text">Optimization Suite</span>
            </h1>

            <p className="animate-slide-up delay-200" style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: 620, margin: "0 auto 40px" }}>
              Compress, enhance, and analyze your video content with AI-driven precision. Built for creators who refuse to compromise on quality.
            </p>

            {/* Buttons */}
            <div className="animate-slide-up delay-300" style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 64 }}>
              <Link href="/login" className="glow-button" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: "1rem", color: "#fff", textDecoration: "none" }}>
                Start for Free <ArrowRight size={18} />
              </Link>
              <a href="#download" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: "1rem", color: "rgba(255,255,255,0.8)", textDecoration: "none", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}>
                <Download size={18} /> Download Desktop App
              </a>
            </div>

            {/* App Mockup */}
            <div className="animate-slide-up delay-400 animate-float-slow" style={{ borderRadius: 20, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.09)", padding: 16, backdropFilter: "blur(20px)", boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(99,102,241,0.1)", maxWidth: 880, margin: "0 auto" }}>
              {/* Window bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16, paddingLeft: 4, paddingRight: 4 }}>
                <div style={{ display: "flex", gap: 7 }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.9, display: "inline-block" }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>MediaFlow Pro — Active License</span>
                <div style={{ width: 40, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Mock UI grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { icon: Sparkles, label: "AI Bitrate Engine", value: "8.2 → 1.6 Mbps", sub: "80.5% reduction", color: "#818cf8", glow: "rgba(99,102,241,0.25)", badge: "Active", badgeColor: "#22c55e" },
                  { icon: Flame, label: "Hook Rate Predictor", value: "94%", sub: "Retention Score", color: "#fb7185", glow: "rgba(251,113,133,0.25)", badge: "High", badgeColor: "#fb7185" },
                  { icon: Layers, label: "4K Enhancer", value: "3840×2160", sub: "AI upscale + denoise", color: "#c084fc", glow: "rgba(168,85,247,0.25)", badge: "Pro", badgeColor: "#c084fc" },
                ].map(({ icon: Icon, label, value, sub, color, glow, badge, badgeColor }) => (
                  <div key={label} style={{ borderRadius: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${glow}`, padding: "20px 18px", textAlign: "left", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: glow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={color} />
                      </div>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: badgeColor, background: `${badgeColor}22`, border: `1px solid ${badgeColor}44`, borderRadius: 99, padding: "2px 8px", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{badge}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: 4, fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</div>
                      <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{value}</div>
                      <div style={{ fontSize: "0.72rem", color, fontWeight: 600, marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ textAlign: "center", padding: "8px 0" }}>
                <div className="stat-number gradient-text-blue" style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1, marginBottom: 6 }}>{value}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <Icon size={12} />{label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 99, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Capabilities</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 16, lineHeight: 1.1 }}>
              Everything You Need for<br /><span className="gradient-text">Video Dominance</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
              A fully integrated professional toolkit — from AI compression to audience intelligence — built into one fast, local desktop app.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card" style={{ borderRadius: 18, padding: "28px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, border: `1px solid ${f.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={22} color={f.color} />
                    </div>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: f.color, background: f.bg, border: `1px solid ${f.border}`, borderRadius: 99, padding: "3px 10px", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{f.badge}</span>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>{f.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" style={{ padding: "100px 24px", background: "rgba(99,102,241,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 99, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Pricing</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 14 }}>Simple, Transparent Pricing</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: 32 }}>Start completely free. Upgrade when you're ready to unlock the full power.</p>

              {/* Billing toggle */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 16px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: billingPeriod === "monthly" ? "#fff" : "rgba(255,255,255,0.4)", transition: "color 0.2s" }}>Monthly</span>
                <button onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")} style={{ width: 44, height: 24, borderRadius: 99, background: billingPeriod === "yearly" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                  <span style={{ position: "absolute", top: 3, left: billingPeriod === "yearly" ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", display: "block" }} />
                </button>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: billingPeriod === "yearly" ? "#fff" : "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 7, transition: "color 0.2s" }}>
                  Yearly
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#34d399", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 99, padding: "2px 8px" }}>SAVE 33%</span>
                </span>
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "stretch" }}>
              {displayPlans.map((plan: any) => {
                const isPro = plan.id === "pro" || plan.popular;
                const isEnterprise = plan.id === "enterprise" || plan.price === null;
                let displayPrice = plan.price;
                if (isPro && billingPeriod === "yearly" && plan.price) displayPrice = Math.round(plan.price * 0.67);
                const planFeatures: any[] = Array.isArray(plan.features) ? plan.features : [];

                return (
                  <div key={plan.id || plan.name} className={isPro ? "pricing-popular-glow" : ""} style={{ borderRadius: 22, background: isPro ? "linear-gradient(145deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))" : "rgba(255,255,255,0.03)", border: isPro ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)", padding: "36px 32px", display: "flex", flexDirection: "column", position: "relative", transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => { if (!isPro) (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>

                    {isPro && (
                      <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 99, padding: "5px 16px", fontSize: "0.7rem", fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
                        ★ Most Popular
                      </div>
                    )}

                    <div style={{ marginBottom: 28 }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: isPro ? "#a5b4fc" : "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                        {plan.tier || (isEnterprise ? "Teams & Agencies" : isPro ? "Most Popular" : "Free Trial")}
                      </div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>{plan.name}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
                        {isEnterprise ? (
                          <span style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>Custom</span>
                        ) : (
                          <>
                            <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>{displayPrice === 0 ? "Free" : `৳${displayPrice}`}</span>
                            {displayPrice > 0 && <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>/ {plan.period === "week" ? "7 days" : "month"}</span>}
                          </>
                        )}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{plan.description}</p>
                    </div>

                    <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                      {planFeatures.map((feat: any, idx: number) => {
                        const featText = typeof feat === "string" ? feat : feat.text;
                        const isOk = typeof feat === "object" ? feat.ok : !featText.toLowerCase().includes("(locked)");
                        const cleanText = featText.replace(" (locked)", "");
                        return (
                          <li key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: isOk ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)" }}>
                            <span style={{ width: 20, height: 20, borderRadius: "50%", background: isOk ? (isPro ? "rgba(99,102,241,0.3)" : "rgba(52,211,153,0.15)") : "rgba(255,255,255,0.05)", border: `1px solid ${isOk ? (isPro ? "rgba(99,102,241,0.6)" : "rgba(52,211,153,0.3)") : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {isOk ? <Check size={11} color={isPro ? "#a5b4fc" : "#34d399"} strokeWidth={3} /> : <X size={10} color="rgba(255,255,255,0.2)" strokeWidth={3} />}
                            </span>
                            {cleanText}
                          </li>
                        );
                      })}
                    </ul>

                    {isEnterprise ? (
                      <a href={plan.ctaHref || "mailto:shahdat.asg@gmail.com"} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", textDecoration: "none", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.2s" }}>
                        Contact Sales <ArrowRight size={16} />
                      </a>
                    ) : isPro ? (
                      <Link href={plan.ctaHref || `/checkout?plan=Pro&billing=${billingPeriod}`} className="glow-button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem", color: "#fff", textDecoration: "none" }}>
                        {plan.cta || "Upgrade to Pro"} <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <Link href={plan.ctaHref || "/checkout?plan=Free&billing=monthly"} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", transition: "all 0.2s" }}>
                        {plan.cta || "Start Free Trial"} <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 36 }}>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Lock size={12} /> Secure payment · Cancel anytime · No hidden fees <ShieldCheck size={12} />
              </p>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: "100px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 99, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, color: "#fcd34d", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Social Proof</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 14 }}>Trusted by Creators Worldwide</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem" }}>Thousands of video professionals have transformed their workflows.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {testimonials.map((t) => (
                <div key={t.name} className="testimonial-card" style={{ borderRadius: 18, padding: "28px" }}>
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}44, ${t.color}22)`, border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: t.color }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{t.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOWNLOAD ── */}
        <section id="download" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 99, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, color: "#7dd3fc", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Desktop App</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 14 }}>Download MediaFlow</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>Native desktop app with bundled FFmpeg. All conversions run entirely on your machine — fast, private, unlimited.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div className="glass-card" style={{ borderRadius: 20, padding: "36px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Monitor size={26} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>Windows</h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.6 }}>Windows 10 & 11 (64-bit)<br />Self-contained portable build</p>
                <button onClick={() => toast.info("Windows installer coming soon!")} className="glow-button" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem", color: "#fff", border: "none", cursor: "pointer", width: "100%", justifyContent: "center" }}>
                  <Download size={16} /> Download .exe Setup
                </button>
              </div>

              <div className="glass-card" style={{ borderRadius: 20, padding: "36px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Laptop size={26} color="#c084fc" />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>macOS</h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", marginBottom: 24, lineHeight: 1.6 }}>Intel & Apple Silicon<br />Big Sur through Sequoia</p>
                <button onClick={() => toast.info("macOS installer coming soon!")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem", color: "#fff", border: "1px solid rgba(168,85,247,0.5)", background: "rgba(168,85,247,0.15)", cursor: "pointer", width: "100%", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.25)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.15)"; }}>
                  <Download size={16} /> Download .dmg Installer
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ padding: "100px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-block", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 99, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, color: "#6ee7b7", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff" }}>Frequently Asked Questions</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ borderRadius: 16, background: activeFaq === idx ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.03)", border: activeFaq === idx ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.07)", overflow: "hidden", transition: "all 0.3s ease" }}>
                  <button onClick={() => toggleFaq(idx)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "0.95rem", fontWeight: 600, textAlign: "left" as const, gap: 16, letterSpacing: "-0.01em" }}>
                    <span>{faq.question}</span>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: activeFaq === idx ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)", border: activeFaq === idx ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s ease", transform: activeFaq === idx ? "rotate(180deg)" : "rotate(0deg)" }}>
                      <ChevronDown size={14} color={activeFaq === idx ? "#a5b4fc" : "rgba(255,255,255,0.5)"} />
                    </span>
                  </button>
                  <div className="faq-content" style={{ maxHeight: activeFaq === idx ? "300px" : "0px", opacity: activeFaq === idx ? 1 : 0 }}>
                    <div style={{ padding: "0 24px 20px", fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 18, lineHeight: 1.1 }}>
              Ready to Transform<br /><span className="gradient-text">Your Media Workflow?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", marginBottom: 36 }}>Join 50,000+ creators who ship better content, faster.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/login" className="glow-button" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", borderRadius: 12, fontWeight: 700, fontSize: "1rem", color: "#fff", textDecoration: "none" }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <a href="#pricing" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", borderRadius: 12, fontWeight: 600, fontSize: "1rem", color: "rgba(255,255,255,0.7)", textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.2s" }}>
                View Pricing
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "48px 24px", background: "rgba(0,0,0,0.3)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={14} color="#fff" />
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff" }}>MediaFlow</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, maxWidth: 220 }}>Professional media optimizations for the world's most ambitious creators.</p>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Product</div>
              {["Features", "Pricing", "Download", "Changelog"].map((link) => (
                <div key={link} style={{ marginBottom: 10 }}>
                  <a href={`#${link.toLowerCase()}`} style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}>{link}</a>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Contact</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
                <div style={{ marginBottom: 4 }}>Shahdat Hossain</div>
                <a href="mailto:shahdat.asg@gmail.com" style={{ color: "#a5b4fc", textDecoration: "none", display: "block", marginBottom: 4 }}>shahdat.asg@gmail.com</a>
                <div>+880-1850-993126</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 16 }}>Legal</div>
              {["Privacy Policy", "Terms of Service", "Refund Policy"].map((l) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}>{l}</a>
                </div>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: 1200, margin: "40px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} MediaFlow. All rights reserved. All processed media is 100% private & local.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>All systems operational</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
