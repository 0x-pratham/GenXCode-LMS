"use client"; // Added to handle the First+Last name merge logic seamlessly

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Code2 } from "lucide-react";
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
    <div className="flex w-full min-h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-7xl mx-auto my-4 surface-glass-panel">
      
      {/* ---------------- LEFT SIDE: COMPLETELY GLASS EFFECT FORM ---------------- */}
      <div className="relative flex w-full flex-col justify-center px-4 sm:w-[550px] lg:w-[600px] sm:px-12 md:px-16 py-12 border-r border-white/10 overflow-hidden">
        
        {/* Background Image behind the Glass Form */}
        <Image 
          src="/assets/invitebg.jpg" 
          alt="Invite Background" 
          fill 
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover z-0 opacity-40 mix-blend-luminosity animate-zoom-fade-in fill-mode-forwards" 
          priority 
        />
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-0" />

        {/* Form Container (Glass panel matching Login page) */}
        <div className="animate-fade-in-right [animation-delay:200ms] opacity-0 fill-mode-forwards relative z-10 mx-auto w-full max-w-md space-y-6 surface-glass-01 p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          
          <div className="space-y-2 text-center animate-fade-in-down [animation-delay:300ms] opacity-0 fill-mode-forwards">
            <div className="flex items-center justify-center gap-2 text-foreground font-heading font-bold text-3xl mb-4">
              <Code2 className="w-8 h-8 text-accent drop-shadow-md" />
              GenXCode
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight bg-silver-gradient bg-clip-text text-transparent">
              Request an Invite
            </h1>
            <p className="text-sm text-[#E2D1FE]/80">
              Submit your profile to join the elite engineering cohort.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 py-6 text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Request Received</h3>
                <p className="text-sm text-[#E2D1FE]/70">
                  Your application is securely logged. We will review your profile and notify you via email if approved.
                </p>
              </div>
              <Link href="/login" className="mt-4 w-full">
                <Button variant="premium" className="w-full rounded-xl font-bold transition-all duration-300">
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

              {/* Invite Request Form */}
              <form action={handleCustomSubmit} className="space-y-4">
                
                {/* 2 Fields side by side for First & Last Name */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-left [animation-delay:400ms] opacity-0 fill-mode-forwards">
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="first_name" className="text-foreground font-medium text-xs tracking-wide uppercase">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="John"
                      required
                      className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="last_name" className="text-foreground font-medium text-xs tracking-wide uppercase">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Doe"
                      required
                      className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 animate-fade-in-left [animation-delay:500ms] opacity-0 fill-mode-forwards">
                  <Label htmlFor="email" className="text-foreground font-medium text-xs tracking-wide uppercase">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="developer@example.com"
                    required
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                  />
                </div>

                <div className="space-y-1.5 animate-fade-in-left [animation-delay:600ms] opacity-0 fill-mode-forwards">
                  <Label htmlFor="portfolio_url" className="text-foreground font-medium text-xs tracking-wide uppercase">Portfolio / GitHub URL</Label>
                  <Input
                    id="portfolio_url"
                    name="portfolio_url"
                    type="url"
                    required
                    placeholder="https://github.com/username"
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                  />
                </div>
                
                <div className="space-y-1.5 animate-fade-in-left [animation-delay:700ms] opacity-0 fill-mode-forwards">
                  <Label htmlFor="reason" className="text-foreground font-medium text-xs tracking-wide uppercase">Why do you want to join?</Label>
                  <textarea
                    id="reason"
                    name="reason"
                    required
                    rows={2}
                    placeholder="Briefly share your tech stack..."
                    className="flex w-full bg-black/20 border border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent rounded-xl p-3 text-sm resize-none backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                  />
                </div>

                <div className="animate-fade-in-up [animation-delay:900ms] opacity-0 fill-mode-forwards pt-2">
                  <Button 
                    type="submit" 
                    variant="premium"
                    className="w-full h-12 rounded-xl font-bold tracking-wide transition-all duration-300 hover:-translate-y-[1px]"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>

              <div className="text-center text-xs text-[#E2D1FE]/60 pt-4 border-t border-white/10 animate-fade-in-up [animation-delay:1000ms] opacity-0 fill-mode-forwards">
                Already hold an invite?{" "}
                <Link href="/login" className="text-accent hover:text-white transition-colors font-medium ml-1">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------------- RIGHT SIDE: BRANDING/GRAPHIC ---------------- */}
      <div className="hidden flex-1 lg:flex relative overflow-hidden bg-background flex-col items-center justify-center text-center p-12">
        
        {/* Right Side Image Background */}
        <Image
          src="/assets/invitebg.jpg"
          alt="Elite Platform Visual"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-30 animate-zoom-fade-in"
          priority
        />
        {/* Brand Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-[#22044B]/80 backdrop-blur-[2px] z-10" />
        
        {/* Core Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.25)_0%,_transparent_70%)] blur-3xl mix-blend-screen z-10" />

        <div className="relative z-20 flex flex-col items-center max-w-lg w-full">
          
          {/* 
            FIX: Square Box Approach with 4-sided dissolve 
            Using combined linear gradients to fade Top, Bottom, Left, and Right edges perfectly into the purple background.
          */}
          {/* REMOVED mb-8 to bring the image closer to the text below it */}
          <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards">
            <div 
              className="relative w-[350px] h-[350px] xl:w-[450px] xl:h-[450px]"
              style={{
                /* Square Mask to smoothly dissolve/fade out all 4 edges */
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            >
              <Image
                src="/assets/Invite.png" 
                alt="Elite Developer Invite"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* High Impact Pure White Heading */}
          {/* ADDED -mt-6 to pull the heading up towards the masked image */}
          <h2 className="-mt-6 animate-text-focus-in [animation-delay:500ms] opacity-0 fill-mode-forwards font-heading text-5xl xl:text-6xl font-bold mb-4 bg-silver-gradient bg-clip-text text-transparent drop-shadow-2xl leading-tight">
            Proof of Work <br/>
            Matters.
          </h2>
          
          {/* High Impact Description Paragraph */}
          <p className="animate-text-focus-in [animation-delay:700ms] opacity-0 fill-mode-forwards text-base text-[#E2D1FE]/90 max-w-md leading-relaxed drop-shadow-md font-sans border-l-2 border-accent pl-4 text-left mx-auto">
            We don't accept everyone. Show us what you've built, and earn your place among the top 1% of developers.
          </p>
        </div>
      </div>

    </div>
  );
}