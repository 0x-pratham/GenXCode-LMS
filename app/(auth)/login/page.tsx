"use client"; 

import { use } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, AlertCircle, Loader2 } from "lucide-react";
import { loginUser } from "@/app/actions/authActions";

// Dedicated Submit Button Component to handle active loading states
function LoginButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Authenticating...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

// Next.js 15+ allows client components to read searchParams using the `use()` hook
export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = use(searchParams);
  const errorMessage = params.error;

  return (
    <div className="flex w-full min-h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-7xl mx-auto my-4 surface-glass-panel">
      
      {/* Left Side - Completely Glass Effect Form */}
      <div className="relative flex w-full flex-col justify-center px-6 sm:w-[500px] sm:px-12 md:px-16 py-12 border-r border-white/10 overflow-hidden">
        
        {/* Updated Background Image behind the Glass Form */}
        <Image 
          src="/assets/loginformbg.jpg" 
          alt="Login Background" 
          fill 
          className="object-cover z-0 opacity-40 mix-blend-luminosity" 
          priority 
        />
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-0" />

        {/* Completely Glass Effect Form Container */}
        <div className="relative z-10 mx-auto w-full max-w-sm space-y-8 surface-glass-01 p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-foreground font-heading font-bold text-3xl mb-4">
              <Code2 className="w-8 h-8 text-accent drop-shadow-md" />
              GenXCode
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-sm text-[#E2D1FE]/80">
              Enter your credentials to access the elite portal.
            </p>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg backdrop-blur-md animate-fade-in-down">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form mapped to Server Action */}
          <form action={loginUser} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@genxcode.com"
                required
                className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <a href="#" className="text-xs text-accent hover:text-white transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
              />
            </div>

            {/* Smart Loading Button */}
            <LoginButton />
          </form>

          <div className="text-center text-xs text-[#E2D1FE]/60 pt-4 border-t border-white/10">
            Platform access is strictly invite-only. <br />
            Contact your Admin for access.
          </div>
        </div>
      </div>

      {/* Right Side - Branding/Graphic with Animations */}
      <div className="hidden flex-1 lg:flex relative overflow-hidden bg-background flex-col items-center justify-center text-center p-12">
        {/* Right Side Image Background */}
        <Image
          src="/assets/hero.jpg"
          alt="GenXCode Elite Platform"
          fill
          className="object-cover opacity-50"
          priority
        />
        {/* Brand Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-[#22044B]/80 backdrop-blur-[2px] z-10" />
        
        {/* Core Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.25)_0%,_transparent_70%)] blur-3xl mix-blend-screen z-10" />

        <div className="relative z-20 flex flex-col items-center max-w-lg">
          
          {/* High Impact Pure White Heading */}
          <h2 className="animate-text-focus-in [animation-delay:100ms] opacity-0 fill-mode-forwards font-heading text-6xl md:text-7xl font-bold mb-6 text-foreground drop-shadow-2xl leading-tight">
            Code. Compete. <br/>
            Conquer.
          </h2>
          
          {/* High Impact Description Paragraph */}
          <p className="animate-text-focus-in [animation-delay:400ms] opacity-0 fill-mode-forwards text-lg text-[#E2D1FE]/90 max-w-md leading-relaxed drop-shadow-md font-sans">
            Join the elite community of developers. Build real-world projects, climb the leaderboard, and unlock your potential.
          </p>
        </div>
      </div>
    </div>
  );
}