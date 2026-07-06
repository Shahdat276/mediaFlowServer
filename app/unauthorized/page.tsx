import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <div className="rounded-full bg-red-950/50 p-4 text-red-500 border border-red-900/30 mb-4 animate-bounce">
            <ShieldAlert size={48} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-red-500">Access Denied</CardTitle>
          <CardDescription className="text-zinc-400 mt-2">
            You do not have the required permissions to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-zinc-500 py-4 border-y border-zinc-800/50">
          This area is restricted to administrators only. If you believe this is an error, please log out and sign in with an authorized account.
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <Link
            href="/login"
            className={buttonVariants({
              variant: "default",
              className: "w-full bg-red-600 hover:bg-red-700 text-white font-medium text-center py-2 rounded-lg"
            })}
          >
            Return to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
