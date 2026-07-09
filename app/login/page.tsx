"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, Database, KeyRound, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
      } else {
        toast.success("Welcome back!");
        router.refresh();
        // Role-based redirect or callback redirect
        const redirectUrl = callback || (data?.user?.role === "admin" ? "/admin" : "/dashboard");
        router.push(redirectUrl);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || "Failed to register");
      } else {
        toast.success("Registration successful!");
        router.refresh();
        router.push(callback || "/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const triggerSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/seed");
      const data = await res.json();
      if (data.success) {
        toast.success("Test accounts seeded successfully!");
        setEmail("admin@mediaflow.com");
        setPassword("Password123");
      } else {
        toast.error(data.message || "Failed to seed accounts");
      }
    } catch (err) {
      toast.error("Error communicating with seed endpoint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 font-sans selection:bg-violet-500/20">
      {/* Theme toggle */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        {/* Hero text */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-2.5 sm:px-3 py-1 text-xs sm:text-sm text-primary font-semibold tracking-wide">
            <ShieldCheck className="size-3.5 sm:size-4" /> MediaFlow Secure Auth
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Sign in to your dashboard to manage your flows
          </p>
        </div>

        {/* Auth Card */}
        <Card className="bg-card text-card-foreground backdrop-blur-md">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="space-y-1 pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground transition-all font-medium py-2 rounded-md"
                >
                  Log In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground transition-all font-medium py-2 rounded-md"
                >
                  Register
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground font-medium text-xs">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-muted-foreground font-medium text-xs">Password</Label>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 transition-all"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-muted-foreground font-medium text-xs">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-muted-foreground font-medium text-xs">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-muted-foreground font-medium text-xs">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 transition-all"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#070B14]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-blue-500" />
          <span className="text-sm text-slate-400">Loading secure sign-in...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
