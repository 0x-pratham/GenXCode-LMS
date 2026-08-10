"use client";

import { brandConfig } from '@/config/brand';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { authLinks } from '@/config/navigation';
import { ArrowRight } from 'lucide-react';
import PurpleGlassCube from '@/components/PurpleGlassCube'; 

export function HeroSection() {
  return (
    <section className="relative z-10 w-full min-h-screen flex items-center pt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: Typography & CTAs */}
        <div className="flex flex-col items-start text-left mt-12 md:mt-0">
          
          {/* Headline: Cinematic Slow Reveal Blur */}
          <h1 className="animate-reveal-blur [animation-delay:200ms] opacity-0 fill-mode-forwards font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-[5rem] mb-6 drop-shadow-2xl leading-[1.1] bg-silver-gradient bg-clip-text text-transparent">
            Build Your Tech Legacy with{' '}
            <span className="relative inline-block text-foreground mt-2">
              {brandConfig.name}
              <span className="absolute -bottom-2 left-0 w-full h-[4px] rounded-full bg-brand-gradient opacity-80" />
            </span>
          </h1>
          
          {/* Description: Staggered Slow Reveal */}
          <p className="animate-reveal-blur [animation-delay:600ms] opacity-0 fill-mode-forwards max-w-xl text-lg md:text-xl text-[#E2D1FE]/90 mb-10 leading-relaxed font-sans shadow-black/50 drop-shadow-md">
            {brandConfig.description}. Join elite cohorts, participate in hackathons, and climb the leaderboard. 
            <strong className="block mt-4 text-foreground font-semibold text-xl">Invitation strictly required.</strong>
          </p>
          
          {/* CTAs: Final Elegant Entry */}
          <div className="animate-reveal-blur [animation-delay:1000ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-start">
            <Link href={authLinks.requestInvite} className="w-full sm:w-auto">
              <Button variant="premium" size="lg" className="w-full sm:w-auto rounded-full group">
                Request an Invite
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Link href="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Visual with Slow Zero-Gravity Float */}
        <div className="relative hidden lg:flex justify-center items-center h-full min-h-[500px]">
          <div className="absolute inset-0 bg-brand-gradient rounded-full opacity-30 blur-[100px] animate-pulse-slow pointer-events-none"></div>
          
          {/* Added animate-float-slow here to make the 3D cube gently levitate */}
          <div className="relative w-full h-[500px] max-w-[600px] flex justify-center items-center z-10 cursor-pointer animate-float-slow">
             <PurpleGlassCube />
          </div>
        </div>

      </div>
    </section>
  );
}