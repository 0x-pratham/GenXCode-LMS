import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, AlertCircle } from "lucide-react";
import { loginUser } from "@/app/actions/authActions";

// Next.js 15+ allows async page components to read searchParams
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:w-[500px] sm:px-12 md:px-16 lg:px-24 border-r border-border bg-surface/30">
        <div className="mx-auto w-full max-w-sm space-y-8">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-heading font-bold text-2xl mb-6">
              <Code2 className="w-8 h-8 text-accent" />
              GenXCode
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-primary">
              Welcome back
            </h1>
            <p className="text-sm text-foreground/70">
              Enter your credentials to access the elite portal.
            </p>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-md">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          )}

          {/* Form mapped to Server Action */}
          <form action={loginUser} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@genxcode.com"
                required
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-accent hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-background"
              />
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Sign In
            </Button>
          </form>

          <div className="text-center text-xs text-foreground/50">
            Platform access is strictly invite-only. <br />
            Contact your Admin for access.
          </div>
        </div>
      </div>

      {/* Right Side - Branding/Graphic */}
      <div className="hidden flex-1 lg:block relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/20 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop"
          alt="Developer coding"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
          <h2 className="font-heading text-4xl font-bold mb-4">Code. Compete. Conquer.</h2>
          <p className="text-lg text-white/80 max-w-lg">
            Join the elite community of developers. Build real-world projects, climb the leaderboard, and unlock your potential.
          </p>
        </div>
      </div>
    </div>
  );
}