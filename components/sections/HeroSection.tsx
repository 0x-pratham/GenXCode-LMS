"use client";

import { useEffect, useRef, useState } from "react";
import { brandConfig } from '@/config/brand';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { authLinks } from '@/config/navigation';
import { ArrowRight } from 'lucide-react';
import PurpleGlassCube from '@/components/PurpleGlassCube'; 

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Smooth Intersection Observer to toggle animation on scroll in/out
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative z-10 w-full min-h-screen flex items-center pt-20 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: Typography & CTAs */}
        <div className="flex flex-col items-start text-left mt-12 md:mt-0">
          
          {/* Headline: Smooth Scroll Reveal */}
          <h1 
            className={`transition-all duration-1000 ease-out font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-[5rem] mb-6 drop-shadow-2xl leading-[1.1] bg-silver-gradient bg-clip-text text-transparent ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-98'
            }`}
          >
            Build Your Tech Legacy with{' '}
            <span className="relative inline-block text-foreground mt-2">
              {brandConfig.name}
              <span className="absolute -bottom-2 left-0 w-full h-[4px] rounded-full bg-brand-gradient opacity-80" />
            </span>
          </h1>
          
          {/* Description: Smooth Scroll Reveal with delay */}
          <p 
            className={`transition-all duration-1000 ease-out delay-200 max-w-xl text-lg md:text-xl text-[#E2D1FE]/90 mb-10 leading-relaxed font-sans shadow-black/50 drop-shadow-md ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {brandConfig.description}. Join elite cohorts, participate in hackathons, and climb the leaderboard. 
            <strong className="block mt-4 text-foreground font-semibold text-xl">Invitation strictly required.</strong>
          </p>
          
          {/* CTAs: Smooth Scroll Reveal with longer delay */}
          <div 
            className={`transition-all duration-1000 ease-out delay-400 flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-start ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
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
        <div 
          className={`relative hidden lg:flex justify-center items-center h-full min-h-[500px] transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
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