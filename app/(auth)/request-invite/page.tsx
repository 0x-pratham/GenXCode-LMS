"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestInviteSchema, type RequestInviteInput } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RequestInvitePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestInviteInput>({
    resolver: zodResolver(requestInviteSchema),
  });

  const onSubmit = async (data: RequestInviteInput) => {
    setIsLoading(true);
    // TODO: Phase 3.2 - Save request to Supabase DB
    console.log("Invite Request Data:", data);
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-heading text-3xl font-bold text-primary">Request Sent</h1>
        <p className="text-foreground/80 leading-relaxed">
          Thank you for your interest in GenXCode. Our team will review your application and send an invitation link if you are selected.
        </p>
        <Link href="/" className="inline-block mt-4">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary">Join the Elite</h1>
        <p className="text-foreground/70 mt-2 text-sm">
          GenXCode is strictly invite-only. Apply below to get access to our exclusive cohorts and hackathons.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...register("fullName")}
            disabled={isLoading}
          />
          {errors.fullName && <p className="text-sm text-red-500 font-medium">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio / GitHub URL (Optional)</Label>
          <Input
            id="portfolioUrl"
            type="url"
            placeholder="https://github.com/username"
            {...register("portfolioUrl")}
            disabled={isLoading}
          />
          {errors.portfolioUrl && <p className="text-sm text-red-500 font-medium">{errors.portfolioUrl.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Why do you want to join GenXCode?</Label>
          <Textarea
            id="reason"
            placeholder="Tell us about your tech stack, goals, and what you want to build..."
            {...register("reason")}
            disabled={isLoading}
          />
          {errors.reason && <p className="text-sm text-red-500 font-medium">{errors.reason.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Request Invite"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-foreground/70">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-accent transition-colors">
          Sign in here
        </Link>
      </div>
    </div>
  );
}