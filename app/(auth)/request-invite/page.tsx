"use client"; // Added to handle the First+Last name merge logic seamlessly

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { submitInviteRequest } from "@/app/actions/authActions"; 

export default function RequestInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  // Next.js 15+ way to unwrap searchParams in a Client Component
  const params = use(searchParams);
  const errorMessage = params.error;
  const isSuccess = params.success === "true";

  // MAGIC TRICK: We take first and last name from the UI, merge them, 
  // and send "full_name" to the backend so your schema doesn't break!
  const handleCustomSubmit = async (formData: FormData) => {
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    formData.set("full_name", `${firstName} ${lastName}`.trim());
    await submitInviteRequest(formData);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-7xl mx-auto my-4">
      
      {/* ---------------- LEFT SIDE: 3D LAYERED VISUALS ---------------- */}
      <div className="hidden flex-1 lg:flex relative overflow-hidden bg-[#0C0224] border-r border-white/10">
        
        {/* [LAYER 0]: Base Background Image with Rich Purple Gradient Wrap */}
        <div className="absolute inset-0 w-full h-full animate-zoom-fade-in opacity-0 fill-mode-forwards z-0">
          <Image
            src="/assets/invitebg.jpg" 
            alt="Background"
            fill
            className="object-cover opacity-60" 
            priority
          />
          {/* A beautiful dark purple gradient wrap that blends the background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0C0224]/90 via-[#3B156B]/60 to-[#0C0224]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[4px]" />
        </div>

        {/* [LAYER 10]: Heading (Shifted Higher with Slow Drop-Down Animation) */}
        <div className="absolute top-[8%] left-0 right-0 px-12 z-30 flex flex-col items-center text-center pointer-events-none">
          <h2 className="animate-fade-in-down [animation-delay:200ms] opacity-0 fill-mode-forwards font-heading text-6xl md:text-7xl font-bold text-foreground drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] leading-tight">
            Proof of Work <br/>
            Matters.
          </h2>
        </div>

        {/* [LAYER 20]: Foreground PNG Image - Shifted Up, Made Larger, Dissolving into Purple BG */}
        <div className="absolute top-[18%] bottom-[12%] -left-16 -right-16 z-20 flex items-center justify-center pointer-events-none animate-zoom-fade-in [animation-delay:500ms] opacity-0 fill-mode-forwards">
          {/* 
            LINEAR & RADIAL COMBINED MASK: 
            This ensures the image dissolves perfectly into the background without harsh lines.
          */}
          <div 
            className="relative w-full h-full max-w-[900px]"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
            }}
          >
            <Image
              src="/assets/invite.png" 
              alt="Invite Illustration"
              fill
              className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] scale-110"
            />
          </div>
        </div>

        {/* [LAYER 30]: Body Paragraph (Shifted totally to the bottom) */}
        <div className="absolute bottom-[3%] left-0 right-0 px-12 z-40 flex flex-col items-center text-center">
          <p className="animate-fade-in-up [animation-delay:700ms] opacity-0 fill-mode-forwards text-lg text-[#E2D1FE]/80 max-w-md leading-relaxed drop-shadow-[0_5px_20px_rgba(0,0,0,1)] font-sans">
            We don't accept everyone. Show us what you've built, and earn your place among the top 1% of developers.
          </p>
        </div>

      </div>

      {/* ---------------- RIGHT SIDE: INPUT FORM (FULLY TRANSPARENT) ---------------- */}
      <div className="relative flex w-full flex-col justify-center px-6 sm:w-[550px] lg:w-[600px] sm:px-12 md:px-16 py-8 overflow-hidden bg-transparent">
        
        {/* Deep Dark Transparent Effect for the entire right panel */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl z-0" />

        {/* Form Container (Removed borders, purely transparent glass) */}
        <div className="animate-fade-in-right [animation-delay:300ms] opacity-0 fill-mode-forwards relative z-10 mx-auto w-full max-w-md space-y-6 bg-transparent">
          
          <div className="space-y-1 text-center mb-6 animate-fade-in-down [animation-delay:400ms] opacity-0 fill-mode-forwards">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-transparent bg-silver-gradient bg-clip-text drop-shadow-md">
              Request an Invite
            </h1>
            <p className="text-sm text-[#E2D1FE]/60 mt-2">
              Platform access is strictly curated. Submit your profile to join the elite cohort.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center animate-fade-in-up">
              <CheckCircle2 className="w-16 h-16 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Request Received</h3>
                <p className="text-sm text-[#E2D1FE]/70">
                  Your application has been submitted. We will review your profile and notify you via email if approved.
                </p>
              </div>
              <Link href="/login" className="mt-4">
                <Button variant="premium" className="rounded-full px-8 accent-glow">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Error Message Display */}
              {errorMessage && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg backdrop-blur-md animate-fade-in-down">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Invite Request Form with Staggered Animations */}
              <form action={handleCustomSubmit} className="space-y-4">
                
                {/* 2 Fields side by side for First & Last Name */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-right [animation-delay:500ms] opacity-0 fill-mode-forwards">
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="first_name" className="text-foreground font-medium text-xs tracking-wide">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="John"
                      required
                      className="bg-white/[0.03] border-white/10 text-foreground placeholder:text-[#E2D1FE]/20 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-md transition-all hover:bg-white/[0.06]"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="last_name" className="text-foreground font-medium text-xs tracking-wide">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Doe"
                      required
                      className="bg-white/[0.03] border-white/10 text-foreground placeholder:text-[#E2D1FE]/20 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-md transition-all hover:bg-white/[0.06]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 animate-fade-in-right [animation-delay:600ms] opacity-0 fill-mode-forwards">
                  <Label htmlFor="email" className="text-foreground font-medium text-xs tracking-wide">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="developer@example.com"
                    required
                    className="bg-white/[0.03] border-white/10 text-foreground placeholder:text-[#E2D1FE]/20 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-md transition-all hover:bg-white/[0.06]"
                  />
                </div>

                <div className="space-y-1.5 animate-fade-in-right [animation-delay:700ms] opacity-0 fill-mode-forwards">
                  <Label htmlFor="portfolio_url" className="text-foreground font-medium text-xs tracking-wide">Portfolio / GitHub URL</Label>
                  <Input
                    id="portfolio_url"
                    name="portfolio_url"
                    type="url"
                    required
                    placeholder="https://github.com/username"
                    className="bg-white/[0.03] border-white/10 text-foreground placeholder:text-[#E2D1FE]/20 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-md transition-all hover:bg-white/[0.06]"
                  />
                </div>
                
                <div className="space-y-1.5 animate-fade-in-right [animation-delay:800ms] opacity-0 fill-mode-forwards">
                  <Label htmlFor="reason" className="text-foreground font-medium text-xs tracking-wide">Why do you want to join?</Label>
                  <textarea
                    id="reason"
                    name="reason"
                    required
                    rows={2}
                    placeholder="Briefly share your engineering goals..."
                    className="flex w-full bg-white/[0.03] border border-white/10 text-foreground placeholder:text-[#E2D1FE]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl p-4 text-sm backdrop-blur-md resize-none transition-all hover:bg-white/[0.06]"
                  />
                </div>

                <div className="animate-fade-in-up [animation-delay:900ms] opacity-0 fill-mode-forwards pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold text-sm tracking-wide accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[2px] shadow-lg"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>

              <div className="text-center text-xs text-[#E2D1FE]/50 pt-6 animate-fade-in-up [animation-delay:1000ms] opacity-0 fill-mode-forwards">
                Already have an invite or account?{" "}
                <Link href="/login" className="text-accent hover:text-white transition-colors font-medium ml-1">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}