"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, Database, KeyRound, Mail, User } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
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
        callbackURL: "/dashboard" // Will be intercepted by proxy.ts to check if admin/user
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
      } else {
        toast.success("Welcome back!");
        // Refresh & redirect
        router.refresh();
        router.push("/dashboard");
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
        callbackURL: "/dashboard"
      });

      if (error) {
        toast.error(error.message || "Failed to register");
      } else {
        toast.success("Registration successful!");
        router.refresh();
        router.push("/dashboard");
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-violet-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2 rounded-full bg-violet-950/40 border border-violet-800/30 px-3 py-1 text-sm text-violet-400 font-semibold tracking-wide shadow-inner">
            <ShieldCheck className="size-4" /> MediaFlow Secure Auth
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            Welcome Back
          </h1>
          <p className="text-zinc-500 text-sm">
            Sign in to your dashboard to manage your flows
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/90 text-zinc-100 backdrop-blur-md shadow-2xl">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="space-y-1 pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-950 border border-zinc-800/80 p-1">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-400 transition-all font-medium py-2 rounded-md"
                >
                  Log In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-400 transition-all font-medium py-2 rounded-md"
                >
                  Register
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-400 font-medium text-xs">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus-visible:ring-violet-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-zinc-400 font-medium text-xs">Password</Label>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus-visible:ring-violet-500"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg hover:shadow-violet-600/20 py-2.5 transition-all"
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
                    <Label htmlFor="reg-name" className="text-zinc-400 font-medium text-xs">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus-visible:ring-violet-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-zinc-400 font-medium text-xs">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus-visible:ring-violet-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-zinc-400 font-medium text-xs">Password</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus-visible:ring-violet-500"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg hover:shadow-violet-600/20 py-2.5 transition-all"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Developer Seeding Utility Card */}
        <Card className="border-dashed border-zinc-800 bg-zinc-950 text-zinc-300 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-amber-500 font-semibold tracking-wide">
              <Database className="size-3.5" /> Seeding Assistant
            </div>
            <p className="text-zinc-500 text-xs">
              Automatically populate MongoDB with default Admin & User accounts.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={triggerSeed}
            disabled={loading}
            className="border-zinc-800 bg-zinc-900 hover:bg-zinc-850 hover:text-white text-zinc-300 text-xs"
          >
            {loading ? <Loader2 className="size-3 animate-spin mr-1" /> : "Seed Test DB"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
