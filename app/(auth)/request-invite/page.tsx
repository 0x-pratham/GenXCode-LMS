import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, AlertCircle, CheckCircle2 } from "lucide-react";
import { submitInviteRequest } from "@/app/actions/authActions"; // Path adjust kar lena

// Next.js 15+ async searchParams
export default async function RequestInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error;
  const isSuccess = params.success === "true";

  return (
    <div className="flex w-full min-h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-7xl mx-auto my-4 surface-glass-panel">
      
      {/* Left Side - Completely Glass Effect Form */}
      <div className="relative flex w-full flex-col justify-center px-6 sm:w-[550px] sm:px-12 md:px-16 py-12 border-r border-white/10 overflow-hidden">
        
        <Image 
          src="/assets/loginformbg.jpg" 
          alt="Invite Background" 
          fill 
          className="object-cover z-0 opacity-40 mix-blend-luminosity" 
          priority 
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-0" />

        <div className="relative z-10 mx-auto w-full max-w-md space-y-6 surface-glass-01 p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-foreground font-heading font-bold text-3xl mb-2">
              <Code2 className="w-8 h-8 text-accent drop-shadow-md" />
              GenXCode
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Request an Invite
            </h1>
            <p className="text-sm text-[#E2D1FE]/80">
              Platform access is strictly curated. Submit your profile to join the elite cohort.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center animate-fade-in-up">
              <CheckCircle2 className="w-16 h-16 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Request Received</h3>
                <p className="text-sm text-[#E2D1FE]/80">
                  Your application has been submitted to the architects. We will review your profile and notify you via email if approved.
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
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg backdrop-blur-md">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Invite Request Form */}
              <form action={submitInviteRequest} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-foreground font-medium text-xs">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-11 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-foreground font-medium text-xs">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="developer@example.com"
                    required
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-11 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="portfolio_url" className="text-foreground font-medium text-xs">Portfolio / GitHub URL <span className="text-[#E2D1FE]/50 font-normal">(Optional)</span></Label>
                  <Input
                    id="portfolio_url"
                    name="portfolio_url"
                    type="url"
                    placeholder="https://github.com/username"
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-11 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="reason" className="text-foreground font-medium text-xs">Why do you want to join?</Label>
                  <textarea
                    id="reason"
                    name="reason"
                    required
                    rows={3}
                    placeholder="Tell us about your engineering goals..."
                    className="flex w-full bg-black/20 border border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl p-3 text-sm backdrop-blur-sm resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 mt-2 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
                >
                  Submit Request
                </Button>
              </form>

              <div className="text-center text-xs text-[#E2D1FE]/60 pt-4 border-t border-white/10">
                Already have an invite or account?{" "}
                <Link href="/login" className="text-accent hover:text-white transition-colors font-medium">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Branding/Graphic with Animations */}
      <div className="hidden flex-1 lg:flex relative overflow-hidden bg-background flex-col items-center justify-center text-center p-12">
        <Image
          src="/assets/hero.jpg"
          alt="GenXCode Elite Platform"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-[#22044B]/80 backdrop-blur-[2px] z-10" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.25)_0%,_transparent_70%)] blur-3xl mix-blend-screen z-10" />

        <div className="relative z-20 flex flex-col items-center max-w-lg">
          <h2 className="animate-text-focus-in [animation-delay:100ms] opacity-0 fill-mode-forwards font-heading text-6xl md:text-7xl font-bold mb-6 text-foreground drop-shadow-2xl leading-tight">
            Proof of Work <br/>
            Matters.
          </h2>
          <p className="animate-text-focus-in [animation-delay:400ms] opacity-0 fill-mode-forwards text-lg text-[#E2D1FE]/90 max-w-md leading-relaxed drop-shadow-md font-sans">
            We don't accept everyone. Show us what you've built, and earn your place among the top 1% of developers.
          </p>
        </div>
      </div>
    </div>
  );
}