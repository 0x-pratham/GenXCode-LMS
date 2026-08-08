"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestInviteSchema, type RequestInviteInput } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code2, CheckCircle } from "lucide-react";
// Import the server action we will create
import { submitInviteRequest } from "@/app/actions/authActions";

export default function RequestInvitePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestInviteInput>({
    resolver: zodResolver(requestInviteSchema),
  });

  const onSubmit = async (data: RequestInviteInput) => {
    setIsLoading(true);
    setServerError("");
    
    try {
      // Call the server action instead of mock API
      const result = await submitInviteRequest(data);
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setServerError(result.error || "Failed to submit request.");
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex w-full min-h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-7xl mx-auto my-4 surface-glass-panel relative items-center justify-center p-6">
        <Image 
          src="/assets/invitebg.jpg" 
          alt="Success Background" 
          fill 
          className="object-cover z-0 opacity-30 mix-blend-luminosity" 
          priority 
        />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-md z-0" />
        
        <div className="relative z-10 w-full max-w-lg text-center space-y-6 surface-glass-01 p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-4 animate-pulse">
            <CheckCircle className="w-10 h-10 text-accent drop-shadow-md" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground drop-shadow-lg">Request Sent</h1>
          <p className="text-[#E2D1FE]/90 leading-relaxed text-lg">
            Thank you for your interest. Our team will review your application and send an invitation link if selected.
          </p>
          <Link href="/" className="inline-block mt-6 w-full">
            <Button className="w-full h-12 rounded-full surface-glass-01 border-white/20 text-foreground hover:surface-glass-02 transition-all shadow-lg backdrop-blur-md">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-6rem)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-7xl mx-auto my-4 surface-glass-panel">
      
      {/* Left Side - Branding/Graphic with Animations */}
      <div className="hidden flex-1 lg:flex relative overflow-hidden bg-background flex-col items-center justify-center text-center p-8 border-r border-white/10">
        <Image
          src="/assets/invitebg.jpg"
          alt="GenXCode Exclusive Access"
          fill
          className="object-cover opacity-50"
          priority
        />
        {/* Brand Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-[#22044B]/80 backdrop-blur-[2px] z-10" />
        
        {/* Core Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(134,56,205,0.25)_0%,_transparent_70%)] blur-3xl mix-blend-screen z-10" />

        <div className="relative z-20 flex flex-col items-center max-w-lg mt-8">
          
          {/* High Impact Pure White Heading */}
          <h2 className="animate-reveal-blur [animation-delay:100ms] opacity-0 fill-mode-forwards font-heading text-6xl md:text-7xl font-bold mb-4 text-foreground drop-shadow-2xl leading-tight">
            Exclusive <br/>
            Access.
          </h2>
          
          {/* High Impact Description Paragraph - Increased Delay to 500ms for slower load feel */}
          <p className="animate-reveal-blur [animation-delay:500ms] opacity-0 fill-mode-forwards text-lg text-[#E2D1FE]/90 max-w-sm leading-relaxed drop-shadow-md font-sans">
            GenXCode is strictly invite-only. Apply to join our private cohorts and build your legacy.
          </p>
        </div>
      </div>

      {/* Right Side - Organized & Compact Glass Form */}
      <div className="relative flex w-full flex-col justify-center px-6 sm:w-[500px] sm:px-10 md:px-14 py-8 overflow-hidden">
        
        {/* Background Image behind the Glass Form */}
        <Image 
          src="/assets/loginformbg.jpg" 
          alt="Form Background" 
          fill 
          className="object-cover z-0 opacity-40 mix-blend-luminosity" 
          priority 
        />
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-0" />

        {/* Compact Glass Effect Form Container */}
        <div className="relative z-10 mx-auto w-full max-w-md space-y-6 surface-glass-01 p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          
          <div className="space-y-1 text-center mb-2">
            <div className="flex items-center justify-center gap-2 text-foreground font-heading font-bold text-2xl mb-2">
              <Code2 className="w-6 h-6 text-accent drop-shadow-md" />
              GenXCode
            </div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Request an Invite
            </h1>
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
              {serverError}
            </div>
          )}

          {/* Form with Reduced Spacing */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-foreground font-medium text-sm">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register("fullName")}
                disabled={isLoading}
                className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-10 backdrop-blur-sm"
              />
              {errors.fullName && <p className="text-[10px] text-red-400 font-medium">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground font-medium text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                disabled={isLoading}
                className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-10 backdrop-blur-sm"
              />
              {errors.email && <p className="text-[10px] text-red-400 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="portfolioUrl" className="text-foreground font-medium text-sm">Portfolio / GitHub (Optional)</Label>
              <Input
                id="portfolioUrl"
                type="url"
                placeholder="https://github.com/username"
                {...register("portfolioUrl")}
                disabled={isLoading}
                className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-10 backdrop-blur-sm"
              />
              {errors.portfolioUrl && <p className="text-[10px] text-red-400 font-medium">{errors.portfolioUrl.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-foreground font-medium text-sm">Why do you want to join?</Label>
              <Textarea
                id="reason"
                placeholder="Tell us about your tech stack and goals..."
                {...register("reason")}
                disabled={isLoading}
                className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[80px] backdrop-blur-sm resize-none text-sm"
              />
              {errors.reason && <p className="text-[10px] text-red-400 font-medium">{errors.reason.message}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg mt-2 disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Request Invite"}
            </Button>
          </form>

          <div className="text-center text-xs text-[#E2D1FE]/60 pt-3 border-t border-white/10 mt-2">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground hover:text-accent transition-colors">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}